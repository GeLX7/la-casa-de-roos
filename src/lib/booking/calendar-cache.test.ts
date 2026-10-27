import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import {
  clearCalendarCache,
  ERROR_TTL_MS,
  getCachedCalendar,
  getTtlMs,
  STALE_MAX_MS,
} from "@/lib/booking/calendar-cache";
import type { CalendarSyncResult } from "@/lib/booking/ical";
import type { DateBlock } from "@/lib/booking/types";

const ROOM = "roos-corazon";
const TTL = 5 * 60 * 1000;

function block(start: string, end: string): DateBlock {
  return { roomSlug: ROOM, startDate: start, endDate: end, source: "airbnb", uid: `u-${start}`, summary: "Reserved" };
}

function harness() {
  let clock = 1_000_000;
  let calls = 0;
  let next: CalendarSyncResult = { state: "ok", blocks: [] };
  return {
    advance: (ms: number) => { clock += ms; },
    set: (r: CalendarSyncResult) => { next = r; },
    calls: () => calls,
    deps: {
      now: () => clock,
      ttlMs: TTL,
      sync: async () => { calls += 1; return next; },
    },
  };
}

beforeEach(() => {
  clearCalendarCache();
  process.env.AIRBNB_ICAL_ROOS_CORAZON = "http://127.0.0.1:1/test-link-one";
  delete process.env.AVAILABILITY_CACHE_TTL_SECONDS;
});

describe("calendar cache", () => {
  it("serves the second read from cache within the TTL (one call to Airbnb)", async () => {
    const h = harness();
    const a = await getCachedCalendar(ROOM, h.deps);
    h.advance(60_000);
    const b = await getCachedCalendar(ROOM, h.deps);
    assert.equal(a.state, "ok");
    assert.equal(b.state, "ok");
    assert.equal(b.state === "ok" && b.fromCache, true);
    assert.equal(h.calls(), 1);
  });

  it("expires after the TTL and picks up calendar updates (new reservation)", async () => {
    const h = harness();
    await getCachedCalendar(ROOM, h.deps);
    h.set({ state: "ok", blocks: [block("2026-12-10", "2026-12-12")] });
    h.advance(TTL - 1);
    const early = await getCachedCalendar(ROOM, h.deps);
    assert.equal(early.state === "ok" && early.blocks.length, 0, "still cached just before expiry");
    h.advance(2);
    const fresh = await getCachedCalendar(ROOM, h.deps);
    assert.equal(fresh.state === "ok" && fresh.blocks.length, 1, "refreshed after expiry");
    assert.equal(h.calls(), 2);
  });

  it("a cancelled reservation disappears after the next refresh", async () => {
    const h = harness();
    h.set({ state: "ok", blocks: [block("2026-12-10", "2026-12-12")] });
    await getCachedCalendar(ROOM, h.deps);
    h.set({ state: "ok", blocks: [] });
    h.advance(TTL + 1);
    const r = await getCachedCalendar(ROOM, h.deps);
    assert.equal(r.state === "ok" && r.blocks.length, 0);
  });

  it("after expiry a failed refresh returns 'stale', never 'ok'", async () => {
    const h = harness();
    h.set({ state: "ok", blocks: [block("2026-12-10", "2026-12-12")] });
    await getCachedCalendar(ROOM, h.deps);
    h.set({ state: "error", reason: "http_500" });
    h.advance(TTL + 1);
    const r = await getCachedCalendar(ROOM, h.deps);
    assert.equal(r.state, "stale");
    assert.equal(r.state === "stale" && r.blocks.length, 1, "known blocks are kept");
  });

  it("stale data older than the maximum is dropped entirely", async () => {
    const h = harness();
    h.set({ state: "ok", blocks: [block("2026-12-10", "2026-12-12")] });
    await getCachedCalendar(ROOM, h.deps);
    h.set({ state: "error", reason: "fetch_failed" });
    h.advance(STALE_MAX_MS + 1);
    const r = await getCachedCalendar(ROOM, h.deps);
    assert.equal(r.state, "error");
  });

  it("errors are cached only briefly, then retried", async () => {
    const h = harness();
    h.set({ state: "error", reason: "http_404" });
    const a = await getCachedCalendar(ROOM, h.deps);
    h.advance(1_000);
    await getCachedCalendar(ROOM, h.deps);
    assert.equal(a.state, "error");
    assert.equal(h.calls(), 1, "no hammering a broken link");
    h.set({ state: "ok", blocks: [] });
    h.advance(ERROR_TTL_MS + 1);
    const c = await getCachedCalendar(ROOM, h.deps);
    assert.equal(c.state, "ok");
    assert.equal(h.calls(), 2);
  });

  it("concurrent readers share a single call to Airbnb", async () => {
    const h = harness();
    await Promise.all([1, 2, 3, 4, 5].map(() => getCachedCalendar(ROOM, h.deps)));
    assert.equal(h.calls(), 1);
  });

  it("changing the link (Vercel variable) invalidates the cache", async () => {
    const h = harness();
    await getCachedCalendar(ROOM, h.deps);
    process.env.AIRBNB_ICAL_ROOS_CORAZON = "http://127.0.0.1:1/test-link-two";
    await getCachedCalendar(ROOM, h.deps);
    assert.equal(h.calls(), 2);
  });

  it("removing the link returns not_configured and drops the cache", async () => {
    const h = harness();
    await getCachedCalendar(ROOM, h.deps);
    delete process.env.AIRBNB_ICAL_ROOS_CORAZON;
    const r = await getCachedCalendar(ROOM, h.deps);
    assert.equal(r.state, "not_configured");
  });

  it("clearCalendarCache forces a fresh read", async () => {
    const h = harness();
    await getCachedCalendar(ROOM, h.deps);
    clearCalendarCache(ROOM);
    await getCachedCalendar(ROOM, h.deps);
    assert.equal(h.calls(), 2);
  });

  it("TTL can be tuned or disabled by env, capped at 10 minutes", () => {
    assert.equal(getTtlMs(), TTL);
    process.env.AVAILABILITY_CACHE_TTL_SECONDS = "0";
    assert.equal(getTtlMs(), 0);
    process.env.AVAILABILITY_CACHE_TTL_SECONDS = "99999";
    assert.equal(getTtlMs(), 10 * 60 * 1000);
    process.env.AVAILABILITY_CACHE_TTL_SECONDS = "abc";
    assert.equal(getTtlMs(), TTL);
  });

  it("TTL 0 never serves from cache", async () => {
    const h = harness();
    const deps = { ...h.deps, ttlMs: 0 };
    await getCachedCalendar(ROOM, deps);
    await getCachedCalendar(ROOM, deps);
    assert.equal(h.calls(), 2);
  });
});
