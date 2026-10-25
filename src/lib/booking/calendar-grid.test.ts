import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildMonthGrid,
  dayState,
  monthDataFromResponse,
  monthFromOffset,
  rangeHasKnownBlock,
  selectDate,
  UNKNOWN_MONTH,
} from "./calendar-grid";

describe("buildMonthGrid", () => {
  it("lays out December 2026 Monday-first with padding", () => {
    const g = buildMonthGrid(2026, 12);
    assert.equal(g.first, "2026-12-01");
    assert.equal(g.next, "2027-01-01");
    assert.equal(g.cells.length % 7, 0);
    // 1 Dec 2026 is a Tuesday -> one leading blank
    assert.equal(g.cells[0], null);
    assert.equal(g.cells[1], "2026-12-01");
    assert.equal(g.cells.filter(Boolean).length, 31);
  });
  it("handles February of a non-leap year and the year rollover", () => {
    assert.equal(buildMonthGrid(2027, 2).cells.filter(Boolean).length, 28);
    assert.equal(buildMonthGrid(2026, 12).next, "2027-01-01");
  });
  it("monthFromOffset rolls over the year", () => {
    assert.deepEqual(monthFromOffset("2026-11-20", 0), { year: 2026, month: 11 });
    assert.deepEqual(monthFromOffset("2026-11-20", 2), { year: 2027, month: 1 });
  });
});

describe("monthDataFromResponse / dayState", () => {
  const today = "2026-10-25";
  it("verified month: unblocked days are free, blocked are occupied", () => {
    const d = monthDataFromResponse({ status: "unavailable", live: true, unavailableDates: ["2026-11-02"] });
    assert.equal(dayState("2026-11-02", today, d), "occupied");
    assert.equal(dayState("2026-11-03", today, d), "free");
  });
  it("a month with no blocks and a verified read is free", () => {
    const d = monthDataFromResponse({ status: "available", live: true, unavailableDates: [] });
    assert.equal(dayState("2026-11-03", today, d), "free");
  });
  it("unverified read never produces 'free', but still shows known blocks", () => {
    const d = monthDataFromResponse({ status: "unverified", live: false, unavailableDates: [] });
    assert.equal(dayState("2026-11-03", today, d), "unverified");
    const partial = monthDataFromResponse({ status: "unavailable", live: false, unavailableDates: ["2026-11-02"] });
    assert.equal(dayState("2026-11-02", today, partial), "occupied");
    assert.equal(dayState("2026-11-03", today, partial), "unverified");
  });
  it("configuration_needed and failed requests are never free", () => {
    const c = monthDataFromResponse({ status: "configuration_needed", live: false });
    assert.equal(dayState("2026-11-03", today, c), "unverified");
    assert.equal(dayState("2026-11-03", today, UNKNOWN_MONTH), "unverified");
  });
  it("past days and loading months", () => {
    assert.equal(dayState("2026-10-24", today, undefined), "past");
    assert.equal(dayState("2026-10-25", today, undefined), "loading");
  });
  it("live=true alone is not enough (bad status)", () => {
    const d = monthDataFromResponse({ status: "invalid_request", live: true });
    assert.equal(dayState("2026-11-03", today, d), "unverified");
  });
});

describe("selection", () => {
  const blocked = new Set(["2026-11-10", "2026-11-11"]);
  const isBlocked = (d: string) => blocked.has(d);

  it("first tap sets check-in, second sets check-out", () => {
    const a = selectDate({ checkin: "", checkout: "" }, "2026-11-05", isBlocked);
    assert.deepEqual(a.selection, { checkin: "2026-11-05", checkout: "" });
    const b = selectDate(a.selection, "2026-11-08", isBlocked);
    assert.deepEqual(b.selection, { checkin: "2026-11-05", checkout: "2026-11-08" });
  });
  it("check-out may be the first blocked day (end-exclusive)", () => {
    const r = selectDate({ checkin: "2026-11-08", checkout: "" }, "2026-11-10", isBlocked);
    assert.equal(r.error, undefined);
    assert.equal(r.selection.checkout, "2026-11-10");
  });
  it("a range crossing a block is rejected and keeps the check-in", () => {
    const r = selectDate({ checkin: "2026-11-08", checkout: "" }, "2026-11-12", isBlocked);
    assert.equal(r.error, "range_blocked");
    assert.deepEqual(r.selection, { checkin: "2026-11-08", checkout: "" });
  });
  it("an occupied day cannot be the check-in", () => {
    const r = selectDate({ checkin: "", checkout: "" }, "2026-11-10", isBlocked);
    assert.equal(r.error, "occupied_checkin");
  });
  it("tapping before the check-in, or after a full range, restarts", () => {
    const earlier = selectDate({ checkin: "2026-11-08", checkout: "" }, "2026-11-06", isBlocked);
    assert.equal(earlier.selection.checkin, "2026-11-06");
    const again = selectDate({ checkin: "2026-11-01", checkout: "2026-11-03" }, "2026-11-20", isBlocked);
    assert.deepEqual(again.selection, { checkin: "2026-11-20", checkout: "" });
  });
  it("rangeHasKnownBlock is end-exclusive", () => {
    assert.equal(rangeHasKnownBlock("2026-11-08", "2026-11-10", isBlocked), false);
    assert.equal(rangeHasKnownBlock("2026-11-08", "2026-11-11", isBlocked), true);
  });
});
