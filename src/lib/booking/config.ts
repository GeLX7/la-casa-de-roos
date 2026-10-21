import { listings } from "@/data/listings";

export const AIRBNB_ICAL_ENV_BY_ROOM: Record<string, string> = {
  "roos-corazon": "AIRBNB_ICAL_ROOS_CORAZON",
  "roos-centro": "AIRBNB_ICAL_ROOS_CENTRO",
  "roos-vista": "AIRBNB_ICAL_ROOS_VISTA",
  "roos-familiar": "AIRBNB_ICAL_ROOS_FAMILIAR",
};

export function getBookingRuntimeConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const icalSecret = process.env.BOOKING_ICAL_SECRET ?? "";

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
    icalSecret,
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
