import type { DateBlock } from "@/lib/booking/types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && toIsoDate(date) === value;
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  const next = new Date(`${date}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return toIsoDate(next);
}

export function isValidStayRange(startDate: string, endDate: string): boolean {
  return isIsoDate(startDate) && isIsoDate(endDate) && startDate < endDate;
}

export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function filterBlocksInRange(
  blocks: DateBlock[],
  startDate: string,
  endDate: string,
): DateBlock[] {
  return blocks.filter((block) =>
    rangesOverlap(block.startDate, block.endDate, startDate, endDate),
  );
}

export function enumerateBlockedDates(blocks: DateBlock[]): string[] {
  const dates = new Set<string>();

  for (const block of blocks) {
    let cursor = block.startDate;
    while (cursor < block.endDate) {
      dates.add(cursor);
      cursor = addDays(cursor, 1);
    }
  }

  return [...dates].sort();
}

export function normalizeDateBlocks(blocks: DateBlock[]): DateBlock[] {
  return [...blocks]
    .filter((block) => isValidStayRange(block.startDate, block.endDate))
    .sort((a, b) =>
      a.startDate === b.startDate
        ? a.endDate.localeCompare(b.endDate)
        : a.startDate.localeCompare(b.startDate),
    );
}
