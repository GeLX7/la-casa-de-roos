import { getAirbnbIcalUrl, hasAnyAirbnbIcalUrl, isKnownRoomSlug } from "@/lib/booking/config";
import {
  enumerateBlockedDates,
  filterBlocksInRange,
  isValidStayRange,
  normalizeDateBlocks,
} from "@/lib/booking/dates";
import { importAirbnbCalendar } from "@/lib/booking/ical";
import { getStoredUnavailableBlocks, isBookingDatabaseConfigured } from "@/lib/booking/repository";
import type { AvailabilityResult, DateBlock } from "@/lib/booking/types";

const DISABLED_MESSAGE =
  "Calendario en preparación. Escríbenos para confirmar disponibilidad.";

export async function getRoomAvailability(
  roomSlug: string,
  startDate: string,
  endDate: string,
): Promise<AvailabilityResult> {
  const checkedAt = new Date().toISOString();

  if (!isKnownRoomSlug(roomSlug) || !isValidStayRange(startDate, endDate)) {
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

  const hasRuntimeSource =
    isBookingDatabaseConfigured() || hasAnyAirbnbIcalUrl() || Boolean(getAirbnbIcalUrl(roomSlug));

  if (!hasRuntimeSource) {
    return {
      room: roomSlug,
      startDate,
      endDate,
      live: false,
      status: "configuration_needed",
      unavailableRanges: [],
      unavailableDates: [],
      checkedAt,
      message: DISABLED_MESSAGE,
    };
  }

  const blocks: DateBlock[] = [];
  const storedBlocks = await getStoredUnavailableBlocks(roomSlug, startDate, endDate);
  if (storedBlocks.ok) blocks.push(...storedBlocks.data);

  try {
    blocks.push(...(await importAirbnbCalendar(roomSlug)));
  } catch {
    // API response stays conservative: if sync fails, owner confirmation remains required.
  }

  const unavailableRanges = filterBlocksInRange(
    normalizeDateBlocks(blocks),
    startDate,
    endDate,
  );

  return {
    room: roomSlug,
    startDate,
    endDate,
    live: true,
    status: unavailableRanges.length > 0 ? "unavailable" : "available",
    unavailableRanges,
    unavailableDates: enumerateBlockedDates(unavailableRanges),
    checkedAt,
    message:
      unavailableRanges.length > 0
        ? "Estas fechas tienen bloqueos conocidos. Escríbenos para buscar alternativas."
        : "No hay bloqueos conocidos para estas fechas. La disponibilidad se confirma antes de la reserva.",
  };
}

export { DISABLED_MESSAGE };
