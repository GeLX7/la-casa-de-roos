import { addDays, isIsoDate } from "@/lib/booking/dates";

/* Pure helpers for the monthly availability calendar (unit-tested).
   A calendar day stands for the NIGHT that starts on that date: a stay is
   [check-in, check-out) and the check-out date itself is not a night. */

export type DayState = "past" | "loading" | "occupied" | "free" | "unverified";

/** What the API told us about one month. */
export type MonthData = {
  blocked: ReadonlySet<string>;
  /** true ONLY when every source was read successfully for that query. */
  trusted: boolean;
};

export type MonthCell = string | null;

export type MonthGrid = {
  year: number;
  /** 1-12 */
  month: number;
  key: string;
  /** First day of the month (ISO). */
  first: string;
  /** First day of the following month (ISO, exclusive end of the query). */
  next: string;
  /** Monday-first grid; null = padding cell. */
  cells: MonthCell[];
};

const pad = (n: number) => String(n).padStart(2, "0");

export function monthKey(year: number, month: number): string {
  return `${year}-${pad(month)}`;
}

/** Month `offset` months after the one containing `todayIso`. */
export function monthFromOffset(todayIso: string, offset: number): { year: number; month: number } {
  const [y, m] = todayIso.split("-").map(Number);
  const index = y * 12 + (m - 1) + offset;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function buildMonthGrid(year: number, month: number): MonthGrid {
  const first = `${year}-${pad(month)}-01`;
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const next = `${nextYear}-${pad(nextMonth)}-01`;

  // getUTCDay: 0 = Sunday. Monday-first: Monday -> 0.
  const lead = (new Date(`${first}T00:00:00.000Z`).getUTCDay() + 6) % 7;
  const cells: MonthCell[] = Array.from({ length: lead }, () => null);
  for (let d = first; d < next; d = addDays(d, 1)) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return { year, month, key: monthKey(year, month), first, next, cells };
}

/** Reads an /api/availability response for a whole month. Never trusts a failed read. */
export function monthDataFromResponse(response: {
  status?: string;
  live?: boolean;
  unavailableDates?: string[];
}): MonthData {
  const blocked = new Set(
    (response.unavailableDates ?? []).filter((date) => isIsoDate(date)),
  );
  const trusted =
    response.live === true &&
    (response.status === "available" || response.status === "unavailable");
  return { blocked, trusted };
}

/** Unknown / failed month: nothing is known, nothing is free. */
export const UNKNOWN_MONTH: MonthData = { blocked: new Set(), trusted: false };

export function dayState(date: string, todayIso: string, data: MonthData | undefined): DayState {
  if (date < todayIso) return "past";
  if (!data) return "loading";
  if (data.blocked.has(date)) return "occupied";
  return data.trusted ? "free" : "unverified";
}

/** True when no night of [checkin, checkout) is a known block. */
export function rangeHasKnownBlock(
  checkin: string,
  checkout: string,
  blockedOf: (date: string) => boolean,
): boolean {
  for (let d = checkin; d < checkout; d = addDays(d, 1)) {
    if (blockedOf(d)) return true;
  }
  return false;
}

export type Selection = { checkin: string; checkout: string };

/**
 * Next selection after tapping `date`:
 * - first tap (or tap after a complete range) = new check-in;
 * - second tap after the check-in = check-out, unless the range crosses a known block.
 */
export function selectDate(
  current: Selection,
  date: string,
  blockedOf: (date: string) => boolean,
): { selection: Selection; error?: "range_blocked" | "occupied_checkin" } {
  const startNew = !current.checkin || Boolean(current.checkout) || date <= current.checkin;

  if (startNew) {
    if (blockedOf(date)) {
      return { selection: current, error: "occupied_checkin" };
    }
    return { selection: { checkin: date, checkout: "" } };
  }

  if (rangeHasKnownBlock(current.checkin, date, blockedOf)) {
    return { selection: current, error: "range_blocked" };
  }
  return { selection: { checkin: current.checkin, checkout: date } };
}
