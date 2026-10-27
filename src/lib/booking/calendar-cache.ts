import { createHash } from "node:crypto";
import { getAirbnbIcalUrl } from "@/lib/booking/config";
import { syncAirbnbCalendar, type CalendarSyncResult } from "@/lib/booking/ical";
import type { DateBlock } from "@/lib/booking/types";

/* Short in-memory cache of the Airbnb feed, per room and per server instance.

   Rules that keep it honest:
   - A fresh read (<= TTL, default 5 minutes) may support "available".
   - If the feed cannot be refreshed after the TTL, the old blocks are still used to
     say "unavailable" (conservative) but NEVER to say "available": state "stale".
   - Failures are cached only for a few seconds (to avoid hammering a broken link).
   - The cache key includes a hash of the link, so changing the Vercel variable
     invalidates it. The link itself is never stored. */

export const DEFAULT_TTL_MS = 5 * 60 * 1000;
export const MAX_TTL_MS = 10 * 60 * 1000;
export const ERROR_TTL_MS = 30 * 1000;
/** Old blocks older than this are dropped even for "unavailable". */
export const STALE_MAX_MS = 60 * 60 * 1000;

export type CachedCalendar =
  | { state: "ok"; blocks: DateBlock[]; fetchedAt: number; fromCache: boolean }
  | { state: "stale"; blocks: DateBlock[]; fetchedAt: number; reason: string }
  | { state: "not_configured" }
  | { state: "error"; reason: string };

type Deps = {
  now?: () => number;
  sync?: (roomSlug: string) => Promise<CalendarSyncResult>;
  ttlMs?: number;
};

type Entry = {
  linkHash: string;
  good?: { blocks: DateBlock[]; fetchedAt: number };
  error?: { reason: string; at: number };
};

const cache = new Map<string, Entry>();
const inFlight = new Map<string, Promise<CalendarSyncResult>>();

function hashLink(url: string): string {
  return createHash("sha256").update(url).digest("hex").slice(0, 16);
}

export function getTtlMs(): number {
  const raw = process.env.AVAILABILITY_CACHE_TTL_SECONDS;
  if (raw === undefined || raw === "") return DEFAULT_TTL_MS;
  const seconds = Number(raw);
  if (!Number.isFinite(seconds) || seconds < 0) return DEFAULT_TTL_MS;
  return Math.min(seconds * 1000, MAX_TTL_MS);
}

/** Forces the next read to hit Airbnb. With no argument clears every room. */
export function clearCalendarCache(roomSlug?: string): void {
  if (roomSlug) {
    cache.delete(roomSlug);
    inFlight.delete(roomSlug);
  } else {
    cache.clear();
    inFlight.clear();
  }
}

export async function getCachedCalendar(
  roomSlug: string,
  deps: Deps = {},
): Promise<CachedCalendar> {
  const now = deps.now ?? Date.now;
  const sync = deps.sync ?? syncAirbnbCalendar;
  const ttl = deps.ttlMs ?? getTtlMs();

  const link = getAirbnbIcalUrl(roomSlug);
  if (!link) {
    cache.delete(roomSlug);
    return { state: "not_configured" };
  }

  const linkHash = hashLink(link);
  let entry = cache.get(roomSlug);
  if (!entry || entry.linkHash !== linkHash) {
    entry = { linkHash };
    cache.set(roomSlug, entry);
  }

  const t = now();
  if (entry.good && ttl > 0 && t - entry.good.fetchedAt < ttl && t >= entry.good.fetchedAt) {
    return { state: "ok", blocks: entry.good.blocks, fetchedAt: entry.good.fetchedAt, fromCache: true };
  }
  if (entry.error && t - entry.error.at < ERROR_TTL_MS && t >= entry.error.at) {
    return staleOrError(entry, t, entry.error.reason);
  }

  // One request to Airbnb at a time per room; concurrent callers share it.
  let pending = inFlight.get(roomSlug);
  if (!pending) {
    pending = sync(roomSlug).finally(() => inFlight.delete(roomSlug));
    inFlight.set(roomSlug, pending);
  }
  const result = await pending;
  const doneAt = now();

  if (result.state === "ok") {
    entry.good = { blocks: result.blocks, fetchedAt: doneAt };
    entry.error = undefined;
    return { state: "ok", blocks: result.blocks, fetchedAt: doneAt, fromCache: false };
  }

  const reason = result.state === "error" ? result.reason : "not_configured";
  entry.error = { reason, at: doneAt };
  return staleOrError(entry, doneAt, reason);
}

function staleOrError(entry: Entry, t: number, reason: string): CachedCalendar {
  if (entry.good && t - entry.good.fetchedAt < STALE_MAX_MS) {
    return { state: "stale", blocks: entry.good.blocks, fetchedAt: entry.good.fetchedAt, reason };
  }
  return { state: "error", reason };
}
