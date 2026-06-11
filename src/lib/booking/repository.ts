import { getBookingRuntimeConfig } from "@/lib/booking/config";
import type { DateBlock, RepositoryResult, ReservationRequestInput } from "@/lib/booking/types";

type RoomRecord = { id: string; slug: string; name: string };

async function supabaseRest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const config = getBookingRuntimeConfig();
  if (!config.hasDatabase) {
    throw new Error("Supabase booking environment is not configured.");
  }
  const headers = new Headers(init.headers);
  headers.set("apikey", config.supabaseServiceRoleKey);
  headers.set("authorization", `Bearer ${config.supabaseServiceRoleKey}`);
  headers.set("content-type", "application/json");
  headers.set("prefer", "return=representation");

  const response = await fetch(`${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase REST ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
}

export function isBookingDatabaseConfigured(): boolean {
  return getBookingRuntimeConfig().hasDatabase;
}

export async function getRoomRecordBySlug(
  roomSlug: string,
): Promise<RepositoryResult<RoomRecord>> {
  if (!isBookingDatabaseConfigured()) {
    return {
      ok: false,
      reason: "configuration_needed",
      message: "Supabase booking environment is not configured.",
    };
  }

  try {
    const rows = await supabaseRest<RoomRecord[]>(
      `rooms?slug=eq.${encodeURIComponent(roomSlug)}&select=id,slug,name&limit=1`,
    );
    const room = rows[0];
    if (!room) {
      return { ok: false, reason: "upstream_error", message: "Room not found in database." };
    }
    return { ok: true, data: room };
  } catch (error) {
    return {
      ok: false,
      reason: "upstream_error",
      message: error instanceof Error ? error.message : "Unknown Supabase error.",
    };
  }
}

export async function getStoredUnavailableBlocks(
  roomSlug: string,
  startDate: string,
  endDate: string,
): Promise<RepositoryResult<DateBlock[]>> {
  const roomResult = await getRoomRecordBySlug(roomSlug);
  if (!roomResult.ok) return roomResult;

  try {
    const roomId = roomResult.data.id;
    const externalRows = await supabaseRest<
      { external_uid: string; start_date: string; end_date: string; summary: string | null }[]
    >(
      `external_blocks?room_id=eq.${roomId}&start_date=lt.${endDate}&end_date=gt.${startDate}&select=external_uid,start_date,end_date,summary`,
    );
    const reservationRows = await supabaseRest<
      { id: string; start_date: string; end_date: string }[]
    >(
      `reservation_requests?room_id=eq.${roomId}&status=in.(pending_payment,confirmed)&start_date=lt.${endDate}&end_date=gt.${startDate}&select=id,start_date,end_date`,
    );
    const manualRows = await supabaseRest<
      { id: string; start_date: string; end_date: string; reason: string | null }[]
    >(
      `manual_blocks?room_id=eq.${roomId}&start_date=lt.${endDate}&end_date=gt.${startDate}&select=id,start_date,end_date,reason`,
    );

    return {
      ok: true,
      data: [
        ...externalRows.map((row) => ({
          roomSlug,
          startDate: row.start_date,
          endDate: row.end_date,
          source: "airbnb" as const,
          uid: row.external_uid,
          summary: row.summary ?? "Airbnb block",
        })),
        ...reservationRows.map((row) => ({
          roomSlug,
          startDate: row.start_date,
          endDate: row.end_date,
          source: "website" as const,
          uid: row.id,
          summary: "Website reservation",
        })),
        ...manualRows.map((row) => ({
          roomSlug,
          startDate: row.start_date,
          endDate: row.end_date,
          source: "manual" as const,
          uid: row.id,
          summary: row.reason ?? "Manual block",
        })),
      ],
    };
  } catch (error) {
    return {
      ok: false,
      reason: "upstream_error",
      message: error instanceof Error ? error.message : "Unknown Supabase error.",
    };
  }
}

export async function createReservationRequest(
  input: ReservationRequestInput,
): Promise<RepositoryResult<{ id: string }>> {
  const roomResult = await getRoomRecordBySlug(input.roomSlug);
  if (!roomResult.ok) return roomResult;

  try {
    const rows = await supabaseRest<{ id: string }[]>("reservation_requests", {
      method: "POST",
      body: JSON.stringify({
        room_id: roomResult.data.id,
        guest_name: input.guestName,
        guest_email: input.guestEmail || null,
        guest_phone: input.guestPhone || null,
        start_date: input.startDate,
        end_date: input.endDate,
        guests: input.guests,
        message: input.message || null,
        status: "requested",
        source: "website",
        payment_status: "none",
      }),
    });

    return { ok: true, data: { id: rows[0]?.id ?? "" } };
  } catch (error) {
    return {
      ok: false,
      reason: "upstream_error",
      message: error instanceof Error ? error.message : "Unknown Supabase error.",
    };
  }
}

export async function getIcalExportBlocks(
  roomSlug: string,
): Promise<RepositoryResult<DateBlock[]>> {
  const roomResult = await getRoomRecordBySlug(roomSlug);
  if (!roomResult.ok) return roomResult;

  try {
    const roomId = roomResult.data.id;
    const reservationRows = await supabaseRest<
      { id: string; start_date: string; end_date: string }[]
    >(
      `reservation_requests?room_id=eq.${roomId}&status=eq.confirmed&select=id,start_date,end_date`,
    );
    const manualRows = await supabaseRest<
      { id: string; start_date: string; end_date: string }[]
    >(`manual_blocks?room_id=eq.${roomId}&select=id,start_date,end_date`);

    return {
      ok: true,
      data: [
        ...reservationRows.map((row) => ({
          roomSlug,
          startDate: row.start_date,
          endDate: row.end_date,
          source: "website" as const,
          uid: `website-${row.id}`,
          summary: "Blocked - La Casa de Roos",
        })),
        ...manualRows.map((row) => ({
          roomSlug,
          startDate: row.start_date,
          endDate: row.end_date,
          source: "manual" as const,
          uid: `manual-${row.id}`,
          summary: "Blocked - La Casa de Roos",
        })),
      ],
    };
  } catch (error) {
    return {
      ok: false,
      reason: "upstream_error",
      message: error instanceof Error ? error.message : "Unknown Supabase error.",
    };
  }
}
