import { listings } from "@/data/listings";

export const AIRBNB_ICAL_ENV_BY_ROOM: Record<string, string> = {
  "suite-queen-con-sala": "AIRBNB_ICAL_SUITE_QUEEN_CON_SALA",
  "suite-queen-centro-historico": "AIRBNB_ICAL_SUITE_QUEEN_CENTRO_HISTORICO",
  "suite-queen-con-vista": "AIRBNB_ICAL_SUITE_QUEEN_CON_VISTA",
  "mini-apartamento-familiar": "AIRBNB_ICAL_MINI_APARTAMENTO_FAMILIAR",
};

export function getBookingRuntimeConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const icalSecret = process.env.BOOKING_ICAL_SECRET ?? "";

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
    icalSecret,
    adminEmail: process.env.BOOKING_ADMIN_EMAIL ?? "",
    hasDatabase: Boolean(supabaseUrl && supabaseServiceRoleKey),
    hasIcalSecret: Boolean(icalSecret),
  };
}

export function isKnownRoomSlug(roomSlug: string): boolean {
  return listings.some((room) => room.slug === roomSlug);
}

export function getAirbnbIcalEnvKey(roomSlug: string): string | undefined {
  return AIRBNB_ICAL_ENV_BY_ROOM[roomSlug];
}

export function getAirbnbIcalUrl(roomSlug: string): string | undefined {
  const envKey = getAirbnbIcalEnvKey(roomSlug);
  if (!envKey) return undefined;
  return process.env[envKey] || undefined;
}

export function hasAnyAirbnbIcalUrl(): boolean {
  return Object.keys(AIRBNB_ICAL_ENV_BY_ROOM).some((slug) => Boolean(getAirbnbIcalUrl(slug)));
}
