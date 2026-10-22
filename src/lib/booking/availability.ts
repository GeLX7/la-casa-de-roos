import { isKnownRoomSlug } from "@/lib/booking/config";
import {
  enumerateBlockedDates,
  filterBlocksInRange,
  isValidStayRange,
  normalizeDateBlocks,
} from "@/lib/booking/dates";
import { getCachedCalendar } from "@/lib/booking/calendar-cache";
import { getStoredUnavailableBlocks } from "@/lib/booking/repository";
import type { AvailabilityResult, DateBlock } from "@/lib/booking/types";

const UNVERIFIED_MESSAGE = "Disponibilidad sujeta a confirmación.";
const DISABLED_MESSAGE = UNVERIFIED_MESSAGE;

/* Three outcomes:
   - "unavailable": at least one known block overlaps the dates.
   - "available":   the Airbnb calendar AND the stored blocks were read
                    successfully right now and nothing overlaps.
   - "unverified":  anything else (no calendar link, failed or invalid feed,
                    database error). A missing or failing source never means
                    free dates. The final confirmation is always manual. */
export async function getRoomAvailability(
  roomSlug: string,
  startDate: string,
  endDate: string,
): Promise<AvailabilityResult> {
  const checkedAt = new Date().toISOString();

  if (!(await isKnownRoomSlug(roomSlug)) || !isValidStayRange(startDate, endDate)) {
    return {
      room: roomSlug,
      startDate,
      endDate,
      live: false,
      status: "configuration_needed",
      unavailableRanges: [],
      unavailableDates: [],
      checkedAt,
      message: "Fechas o suite inválidas.",
    };
  }

  const blocks: DateBlock[] = [];
  let verified = true;

  const storedBlocks = await getStoredUnavailableBlocks(roomSlug, startDate, endDate);
  if (storedBlocks.ok) blocks.push(...storedBlocks.data);
  else verified = false;

  // The Airbnb feed is cached for ~5 minutes. Only a fresh read can support "available";
  // an expired entry that could not be refreshed ("stale") can only add blocks.
  const calendar = await getCachedCalendar(roomSlug);
  let dataTime = Date.now();
  if (calendar.state === "ok") {
    blocks.push(...calendar.blocks);
    dataTime = calendar.fetchedAt;
  } else if (calendar.state === "stale") {
    blocks.push(...calendar.blocks);
    dataTime = calendar.fetchedAt;
    verified = false;
  } else {
    verified = false;
  }

  // checkedAt = when the calendar data was actually read (never newer than the data).
  return buildAvailability({
    roomSlug,
    startDate,
    endDate,
    checkedAt: new Date(dataTime).toISOString(),
    blocks,
    verified,
  });
}

/** Pure decision logic (unit-tested): turns the blocks read so far into a result. */
export function buildAvailability(input: {
  roomSlug: string;
  startDate: string;
  endDate: string;
  checkedAt: string;
  blocks: DateBlock[];
  /** true ONLY if every source (Airbnb feed AND database) was read successfully. */
  verified: boolean;
}): AvailabilityResult {
  const { roomSlug, startDate, endDate, checkedAt, blocks, verified } = input;
  const unavailableRanges = filterBlocksInRange(
    normalizeDateBlocks(blocks),
    startDate,
    endDate,
  );

  if (unavailableRanges.length > 0) {
    return {
      room: roomSlug,
      startDate,
      endDate,
      live: verified,
      status: "unavailable",
      unavailableRanges,
      unavailableDates: enumerateBlockedDates(unavailableRanges),
      checkedAt,
      message: "Estas fechas tienen bloqueos conocidos. Escríbenos para buscar alternativas.",
    };
  }

  if (!verified) {
    return {
      room: roomSlug,
      startDate,
      endDate,
      live: false,
      status: "unverified",
      unavailableRanges: [],
      unavailableDates: [],
      checkedAt,
      message: UNVERIFIED_MESSAGE,
    };
  }

  return {
    room: roomSlug,
    startDate,
    endDate,
    live: true,
    status: "available",
    unavailableRanges: [],
    unavailableDates: [],
    checkedAt,
    message:
      "Sin bloqueos conocidos en el calendario sincronizado. La disponibilidad se confirma antes de la reserva.",
  };
}

export { DISABLED_MESSAGE, UNVERIFIED_MESSAGE };
