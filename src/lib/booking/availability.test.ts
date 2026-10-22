/* Safety tests for availability. Run with: npm test
   A local HTTP server plays both Supabase REST and the Airbnb iCal feeds, so no
   real service is contacted and no secret is needed. */
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, beforeEach, describe, it } from "node:test";

const ROOM = "roos-corazon";
const ICAL_ENV = "AIRBNB_ICAL_ROOS_CORAZON";

function feed(...events: [string, string][]): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0"];
  events.forEach(([start, end], i) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:test-${i}`,
      `DTSTART;VALUE=DATE:${start.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${end.replace(/-/g, "")}`,
      "SUMMARY:Reserved",
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

type Mode = {
  feed: { status: number; body: string; hang?: boolean };
  restStatus: number;
  manualBlocks: { id: string; start_date: string; end_date: string; reason: string }[];
};

let server: Server;
let base = "";
let mode: Mode;
let getRoomAvailability: typeof import("@/lib/booking/availability").getRoomAvailability;
let clearCalendarCache: typeof import("@/lib/booking/calendar-cache").clearCalendarCache;

before(async () => {
  server = createServer((req, res) => {
    const url = req.url ?? "";
    if (url.startsWith("/ical")) {
      if (mode.feed.hang) return; // never answers: exercises the timeout
      res.statusCode = mode.feed.status;
      res.end(mode.feed.body);
      return;
    }
    if (url.startsWith("/rest/v1/")) {
      if (mode.restStatus !== 200) {
        res.statusCode = mode.restStatus;
        res.end("{}");
        return;
      }
      res.setHeader("content-type", "application/json");
      if (url.includes("rooms?")) res.end(JSON.stringify([{ id: "room-1", slug: ROOM, name: "Test" }]));
      else if (url.includes("manual_blocks")) res.end(JSON.stringify(mode.manualBlocks));
      else res.end("[]");
      return;
    }
    res.statusCode = 404;
    res.end();
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  process.env.NEXT_PUBLIC_SUPABASE_URL = base;
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key-not-real";
  delete process.env.CATALOG_DATA_SOURCE; // catalog stays on the static fallback
  ({ getRoomAvailability } = await import("@/lib/booking/availability"));
  ({ clearCalendarCache } = await import("@/lib/booking/calendar-cache"));
});

after(() => {
  server.close();
});

beforeEach(() => {
  clearCalendarCache();
  mode = { feed: { status: 200, body: feed() }, restStatus: 200, manualBlocks: [] };
  process.env[ICAL_ENV] = `${base}/ical`;
});

describe("availability never reports 'available' without verified data", () => {
  it("valid empty calendar + database ok => available", async () => {
    const r = await getRoomAvailability(ROOM, "2026-12-10", "2026-12-12");
    assert.equal(r.status, "available");
    assert.equal(r.live, true);
  });

  it("no calendar link configured => unverified", async () => {
    delete process.env[ICAL_ENV];
    const r = await getRoomAvailability(ROOM, "2026-12-10", "2026-12-12");
    assert.equal(r.status, "unverified");
    assert.equal(r.live, false);
    assert.equal(r.message, "Disponibilidad sujeta a confirmación.");
  });

  it("broken link (HTTP 404 / 500) => unverified", async () => {
    for (const status of [404, 500]) {
      mode.feed = { status, body: "x" };
      const r = await getRoomAvailability(ROOM, "2026-12-10", "2026-12-12");
      assert.equal(r.status, "unverified", `HTTP ${status}`);
    }
  });

  it("response that is not a calendar (login page) => unverified", async () => {
    mode.feed = { status: 200, body: "<html>login</html>" };
    const r = await getRoomAvailability(ROOM, "2026-12-10", "2026-12-12");
    assert.equal(r.status, "unverified");
  });

  it("network error (connection refused) => unverified", async () => {
    process.env[ICAL_ENV] = "http://127.0.0.1:1/ical";
    const r = await getRoomAvailability(ROOM, "2026-12-10", "2026-12-12");
    assert.equal(r.status, "unverified");
  });

  it("feed that never answers (timeout) => unverified", { timeout: 15000 }, async () => {
    mode.feed = { status: 200, body: "", hang: true };
    const r = await getRoomAvailability(ROOM, "2026-12-10", "2026-12-12");
    assert.equal(r.status, "unverified");
  });

  it("database error with a valid calendar => unverified", async () => {
    mode.restStatus = 500;
    const r = await getRoomAvailability(ROOM, "2026-12-10", "2026-12-12");
    assert.equal(r.status, "unverified");
  });

  it("invalid dates => never available", async () => {
    const r = await getRoomAvailability(ROOM, "2026-12-12", "2026-12-10");
    assert.notEqual(r.status, "available");
  });
});

describe("known blocks produce 'unavailable'", () => {
  it("overlapping reservation in the Airbnb feed", async () => {
    mode.feed = { status: 200, body: feed(["2026-12-12", "2026-12-15"]) };
    const r = await getRoomAvailability(ROOM, "2026-12-13", "2026-12-14");
    assert.equal(r.status, "unavailable");
    assert.deepEqual(r.unavailableDates, ["2026-12-12", "2026-12-13", "2026-12-14"]);
  });

  it("a known block wins even if the other source fails", async () => {
    mode.feed = { status: 500, body: "x" };
    mode.manualBlocks = [{ id: "m1", start_date: "2026-12-12", end_date: "2026-12-14", reason: "x" }];
    const r = await getRoomAvailability(ROOM, "2026-12-13", "2026-12-14");
    assert.equal(r.status, "unavailable");
  });

  it("stay that ends on the check-in day of a reservation is available", async () => {
    mode.feed = { status: 200, body: feed(["2026-12-12", "2026-12-15"]) };
    const r = await getRoomAvailability(ROOM, "2026-12-10", "2026-12-12");
    assert.equal(r.status, "available");
  });

  it("stay that starts on the check-out day of a reservation is available", async () => {
    mode.feed = { status: 200, body: feed(["2026-12-12", "2026-12-15"]) };
    const r = await getRoomAvailability(ROOM, "2026-12-15", "2026-12-17");
    assert.equal(r.status, "available");
  });

  it("consecutive reservations leave no gap", async () => {
    mode.feed = { status: 200, body: feed(["2026-12-12", "2026-12-15"], ["2026-12-15", "2026-12-18"]) };
    const r = await getRoomAvailability(ROOM, "2026-12-15", "2026-12-16");
    assert.equal(r.status, "unavailable");
  });

  it("stay that overlaps one night of a reservation is unavailable", async () => {
    mode.feed = { status: 200, body: feed(["2026-12-12", "2026-12-15"]) };
    const r = await getRoomAvailability(ROOM, "2026-12-14", "2026-12-16");
    assert.equal(r.status, "unavailable");
  });
});

describe("cache never turns old data into 'available'", () => {
  it("within the cache window a known block still wins and a new read after clearing sees updates", async () => {
    mode.feed = { status: 200, body: feed(["2026-12-12", "2026-12-15"]) };
    const first = await getRoomAvailability(ROOM, "2026-12-13", "2026-12-14");
    assert.equal(first.status, "unavailable");
    mode.feed = { status: 200, body: feed() };
    const cached = await getRoomAvailability(ROOM, "2026-12-13", "2026-12-14");
    assert.equal(cached.status, "unavailable", "served from cache (<5 min)");
    clearCalendarCache();
    const refreshed = await getRoomAvailability(ROOM, "2026-12-13", "2026-12-14");
    assert.equal(refreshed.status, "available", "reservation cancelled and cache refreshed");
  });

  it("a cached 'ok' feed is not trusted once the link is removed", async () => {
    await getRoomAvailability(ROOM, "2026-12-10", "2026-12-12");
    delete process.env[ICAL_ENV];
    const r = await getRoomAvailability(ROOM, "2026-12-10", "2026-12-12");
    assert.equal(r.status, "unverified");
  });

  it("checkedAt is when the calendar was read, not 'now'", async () => {
    const r = await getRoomAvailability(ROOM, "2026-12-10", "2026-12-12");
    assert.ok(Date.now() - Date.parse(r.checkedAt) < 5000);
  });
});
