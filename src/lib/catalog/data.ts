/**
 * Public catalog data layer.
 *
 * The public site keeps working with zero Supabase configuration: by default
 * (or on any fetch/mapping error) it serves the static catalog from
 * src/data/listings.ts. Reads only switch to Supabase when BOTH are true:
 *
 *   1. NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY exist, and
 *   2. CATALOG_DATA_SOURCE=supabase is set explicitly.
 *
 * The explicit flag means adding Supabase credentials for the booking
 * foundation can never silently swap the live site's content source.
 * Supabase reads use the anon key: RLS only exposes active, non-deleted
 * rooms and their enabled content (see the admin_catalog migration).
 */

import { listings, type GalleryCategory, type Listing } from "@/data/listings";

type RatingsRow = {
  rating: number;
  review_count: number;
  cleanliness: number;
  accuracy: number;
  checkin: number;
  communication: number;
  location: number;
  value: number;
};

type RoomRow = {
  slug: string;
  name: string;
  subtitle: string;
  airbnb_url: string;
  airbnb_listing_id: string | null;
  capacity: number;
  beds: string;
  bath: string;
  quiet_hours: string;
  short_description: string;
  long_description: string[];
  price_label: string;
  guest_favorite: boolean;
  room_features: { icon: string; label: string; sort_order: number }[];
  room_not_included: { label: string; sort_order: number }[];
  room_rules: { label: string; sort_order: number }[];
  room_images: { src: string; alt: string; category: string; sort_order: number; is_cover: boolean }[];
  // room_ratings is one-to-one (room_id is its primary key), so PostgREST embeds
  // it as a single object; older shapes returned a one-item array. Accept both.
  room_ratings: RatingsRow[] | RatingsRow | null;
};

const ROOM_SELECT =
  "slug,name,subtitle,airbnb_url,airbnb_listing_id,capacity,beds,bath,quiet_hours," +
  "short_description,long_description,price_label,guest_favorite," +
  "room_features(icon,label,sort_order),room_not_included(label,sort_order)," +
  "room_rules(label,sort_order),room_images(src,alt,category,sort_order,is_cover)," +
  "room_ratings(rating,review_count,cleanliness,accuracy,checkin,communication,location,value)";

function supabaseCatalogEnabled(): boolean {
  return (
    process.env.CATALOG_DATA_SOURCE === "supabase" &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

async function anonRest<T>(path: string): Promise<T> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${path}`, {
    headers: { apikey: anonKey, authorization: `Bearer ${anonKey}` },
    // Public catalog content may cache briefly; admin edits show within 10 min
    // (sooner when revalidatePath fires from the admin actions).
    next: { revalidate: 600 },
  });
  if (!response.ok) {
    throw new Error(`Supabase catalog REST ${response.status}`);
  }
  return (await response.json()) as T;
}

const byOrder = <T extends { sort_order: number }>(rows: T[]) =>
  [...rows].sort((a, b) => a.sort_order - b.sort_order);

function toListing(row: RoomRow): Listing {
  const ratings = Array.isArray(row.room_ratings)
    ? row.room_ratings[0]
    : (row.room_ratings ?? undefined);
  return {
    slug: row.slug,
    title: row.name,
    subtitle: row.subtitle,
    airbnbUrl: row.airbnb_url,
    airbnbListingId: row.airbnb_listing_id ?? "",
    rating: ratings?.rating ?? 0,
    reviewCount: ratings?.review_count ?? 0,
    guestFavorite: row.guest_favorite,
    capacity: row.capacity,
    beds: row.beds,
    bath: row.bath,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    amenities: byOrder(row.room_features).map(({ icon, label }) => ({ icon, label })),
    notIncluded: byOrder(row.room_not_included).map(({ label }) => label),
    rules: byOrder(row.room_rules).map(({ label }) => label),
    quietHours: row.quiet_hours,
    priceLabel: row.price_label,
    // Cover first (so it leads room cards + the suite gallery), then by order.
    gallery: [...row.room_images]
      .sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order)
      .map(({ src, alt, category }) => ({
        src,
        alt,
        category: category as GalleryCategory,
      })),
    categoryRatings: {
      cleanliness: ratings?.cleanliness ?? 0,
      accuracy: ratings?.accuracy ?? 0,
      checkin: ratings?.checkin ?? 0,
      communication: ratings?.communication ?? 0,
      location: ratings?.location ?? 0,
      value: ratings?.value ?? 0,
    },
  };
}

/** Weighted aggregate of the public Airbnb ratings (display-only — never schema.org). */
export function computeAggregate(rooms: Listing[]): { rating: number; reviewCount: number } {
  const reviewCount = rooms.reduce((n, l) => n + l.reviewCount, 0);
  if (reviewCount === 0) return { rating: 0, reviewCount: 0 };
  const weighted = rooms.reduce((n, l) => n + l.rating * l.reviewCount, 0) / reviewCount;
  return { rating: Math.round(weighted * 100) / 100, reviewCount };
}

/** Active rooms for the public site (static fallback always available). */
export async function getRooms(): Promise<Listing[]> {
  if (!supabaseCatalogEnabled()) return listings;
  try {
    const rows = await anonRest<RoomRow[]>(`rooms?select=${ROOM_SELECT}&order=sort_order.asc`);
    if (rows.length === 0) return listings;
    return rows.map(toListing);
  } catch (error) {
    console.error("getRooms: falling back to static listings.", error);
    return listings;
  }
}

export async function getRoomBySlug(slug: string): Promise<Listing | undefined> {
  if (!supabaseCatalogEnabled()) {
    return listings.find((l) => l.slug === slug);
  }
  try {
    const rows = await anonRest<RoomRow[]>(
      `rooms?slug=eq.${encodeURIComponent(slug)}&select=${ROOM_SELECT}&limit=1`,
    );
    if (rows[0]) return toListing(rows[0]);
    // Unknown in the DB: fall back so static-only slugs keep resolving.
    return listings.find((l) => l.slug === slug);
  } catch (error) {
    console.error("getRoomBySlug: falling back to static listings.", error);
    return listings.find((l) => l.slug === slug);
  }
}
