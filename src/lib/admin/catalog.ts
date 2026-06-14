/**
 * Admin-side catalog reads and dashboard stats. Server-side only; callers are
 * authenticated admin pages (requireAdmin() runs before any of this).
 */

import { adminCount, adminRest } from "@/lib/admin/supabase-admin";
import { getAdminRuntimeConfig } from "@/lib/admin/config";
import { aggregate, listings } from "@/data/listings";

export type AdminListItem = {
  id: string;
  icon?: string;
  label: string;
  enabled: boolean;
  sort_order: number;
};

export type AdminImage = {
  id: string;
  src: string;
  alt: string;
  category: string;
  is_cover: boolean;
  active: boolean;
  sort_order: number;
  storage_path: string | null;
  /** 'local' (seeded /images path), 'supabase_storage' (uploaded), 'airbnb_seed'. */
  source_type: string;
};

export type AdminRatings = {
  rating: number;
  review_count: number;
  cleanliness: number;
  accuracy: number;
  checkin: number;
  communication: number;
  location: number;
  value: number;
  checked_at: string | null;
};

export type AdminRoomSummary = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  active: boolean;
  capacity: number;
  sort_order: number;
  deleted_at: string | null;
  updated_at: string;
};

export type AdminRoom = AdminRoomSummary & {
  airbnb_url: string;
  airbnb_listing_id: string | null;
  beds: string;
  bath: string;
  checkin: string;
  checkout: string;
  quiet_hours: string;
  description_title: string;
  short_description: string;
  long_description: string[];
  price_label: string;
  guest_favorite: boolean;
  seo_title: string | null;
  seo_description: string | null;
  room_features: AdminListItem[];
  room_not_included: AdminListItem[];
  room_rules: AdminListItem[];
  room_images: AdminImage[];
  room_ratings: AdminRatings | null;
};

type CalendarSourceRow = {
  room_id: string;
  ical_url_encrypted_or_env_key: string;
  active: boolean;
  last_synced_at: string | null;
  last_status: string | null;
  last_error: string | null;
};

const byOrder = <T extends { sort_order: number }>(rows: T[]) =>
  [...rows].sort((a, b) => a.sort_order - b.sort_order);

export async function getAdminRooms(): Promise<AdminRoomSummary[]> {
  return adminRest<AdminRoomSummary[]>(
    "rooms?select=id,slug,name,subtitle,active,capacity,sort_order,deleted_at,updated_at&deleted_at=is.null&order=sort_order.asc,created_at.asc",
  );
}

export type AdminRoomCounts = { features: number; images: number; rules: number };

/**
 * Per-room child-row counts for the catalog list (features / images / rules),
 * including disabled ones so the owner sees the full picture. Best-effort: a
 * failure here must not take down the room list, so callers degrade to "no
 * counts shown" rather than the whole catalog falling back (see the list page).
 */
export async function getAdminRoomCounts(): Promise<Record<string, AdminRoomCounts>> {
  type CountRow = {
    id: string;
    room_features: { count: number }[];
    room_images: { count: number }[];
    room_rules: { count: number }[];
  };
  const rows = await adminRest<CountRow[]>(
    "rooms?select=id,room_features(count),room_images(count),room_rules(count)&deleted_at=is.null",
  );
  const first = (rows: { count: number }[]) => rows[0]?.count ?? 0;
  return Object.fromEntries(
    rows.map((row) => [
      row.id,
      {
        features: first(row.room_features),
        images: first(row.room_images),
        rules: first(row.room_rules),
      },
    ]),
  );
}

export async function getAdminRoom(slug: string): Promise<AdminRoom | null> {
  const rows = await adminRest<
    (Omit<AdminRoom, "room_ratings"> & { room_ratings: AdminRatings[] | AdminRatings | null })[]
  >(
    `rooms?slug=eq.${encodeURIComponent(slug)}&select=*,room_features(*),room_not_included(*),room_rules(*),room_images(*),room_ratings(*)&limit=1`,
  );
  const row = rows[0];
  if (!row) return null;

  // room_ratings is one-to-one; PostgREST may embed it as a single-item array.
  const ratings = Array.isArray(row.room_ratings)
    ? (row.room_ratings[0] ?? null)
    : row.room_ratings;

  return {
    ...row,
    room_features: byOrder(row.room_features),
    room_not_included: byOrder(row.room_not_included),
    room_rules: byOrder(row.room_rules),
    room_images: byOrder(row.room_images),
    room_ratings: ratings,
  };
}

export async function getCalendarSource(roomId: string): Promise<CalendarSourceRow | null> {
  const rows = await adminRest<CalendarSourceRow[]>(
    `calendar_sources?room_id=eq.${encodeURIComponent(roomId)}&provider=eq.airbnb&select=room_id,ical_url_encrypted_or_env_key,active,last_synced_at,last_status,last_error&limit=1`,
  );
  return rows[0] ?? null;
}

export type AdminStats = {
  /** False when Supabase is not configured: every DB-backed value is null. */
  live: boolean;
  totalRooms: number;
  activeRooms: number;
  totalRequests: number | null;
  pendingRequests: number | null;
  confirmedReservations: number | null;
  externalBlocks: number | null;
  manualBlocks: number | null;
  /** Airbnb-sourced figures (DB when live, static listings otherwise). */
  averageRating: number;
  totalReviews: number;
};

const staticStats: AdminStats = {
  live: false,
  totalRooms: listings.length,
  activeRooms: listings.length,
  totalRequests: null,
  pendingRequests: null,
  confirmedReservations: null,
  externalBlocks: null,
  manualBlocks: null,
  averageRating: aggregate.rating,
  totalReviews: aggregate.reviewCount,
};

export async function getAdminStats(): Promise<AdminStats> {
  if (!getAdminRuntimeConfig().dbReady) return staticStats;

  try {
    const [
      totalRooms,
      activeRooms,
      totalRequests,
      pendingRequests,
      confirmedReservations,
      externalBlocks,
      manualBlocks,
      ratings,
    ] = await Promise.all([
      adminCount("rooms?deleted_at=is.null"),
      adminCount("rooms?deleted_at=is.null&active=eq.true"),
      adminCount("reservation_requests"),
      adminCount("reservation_requests?status=in.(requested,pending_payment)"),
      adminCount("reservation_requests?status=eq.confirmed"),
      adminCount("external_blocks"),
      adminCount("manual_blocks"),
      adminRest<{ rating: number; review_count: number }[]>(
        "room_ratings?select=rating,review_count",
      ),
    ]);

    const totalReviews = ratings.reduce((n, r) => n + r.review_count, 0);
    const averageRating =
      totalReviews > 0
        ? Math.round(
            (ratings.reduce((n, r) => n + r.rating * r.review_count, 0) / totalReviews) * 100,
          ) / 100
        : 0;

    return {
      live: true,
      totalRooms,
      activeRooms,
      totalRequests,
      pendingRequests,
      confirmedReservations,
      externalBlocks,
      manualBlocks,
      averageRating,
      totalReviews,
    };
  } catch {
    // A reachable-but-unmigrated project should degrade like "not configured".
    return staticStats;
  }
}
