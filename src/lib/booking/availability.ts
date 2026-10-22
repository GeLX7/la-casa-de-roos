import { isKnownRoomSlug } from "@/lib/booking/config";
import {
  enumerateBlockedDates,
  filterBlocksInRange,
  isValidStayRange,
  normalizeDateBlocks,
} from "@/lib/booking/dates";
import { syncAirbnbCalendar } from "@/lib/booking/ical";
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

  const sync = await syncAirbnbCalendar(roomSlug);
  if (sync.state === "ok") blocks.push(...sync.blocks);
  else verified = false;

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
