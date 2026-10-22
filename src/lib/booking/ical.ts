import { SITE_URL } from "@/data/site";
import { getAirbnbIcalUrl } from "@/lib/booking/config";
import { addDays, normalizeDateBlocks, toIsoDate } from "@/lib/booking/dates";
import type { DateBlock } from "@/lib/booking/types";

function unfoldIcalLines(input: string): string[] {
  const rawLines = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const lines: string[] = [];

  for (const line of rawLines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && lines.length > 0) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }

  return lines;
}

function getIcalValue(lines: string[], field: string): string | undefined {
  const prefix = `${field}`;
  const line = lines.find((candidate) => candidate.startsWith(prefix));
  if (!line) return undefined;
  const colonIndex = line.indexOf(":");
  return colonIndex >= 0 ? line.slice(colonIndex + 1).trim() : undefined;
}

function parseIcalDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const compactDate = value.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!compactDate) return undefined;
  return `${compactDate[1]}-${compactDate[2]}-${compactDate[3]}`;
}

export function parseIcalEvents(input: string, roomSlug: string): DateBlock[] {
  const lines = unfoldIcalLines(input);
  const blocks: DateBlock[] = [];
  let current: string[] | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = [];
      continue;
    }
    if (line === "END:VEVENT" && current) {
      const uid = getIcalValue(current, "UID") ?? `airbnb-${blocks.length}`;
      const startDate = parseIcalDate(getIcalValue(current, "DTSTART"));
      const rawEndDate = parseIcalDate(getIcalValue(current, "DTEND"));
      const summary = getIcalValue(current, "SUMMARY") ?? "Airbnb block";

      if (startDate) {
        blocks.push({
          roomSlug,
          startDate,
          endDate: rawEndDate && rawEndDate > startDate ? rawEndDate : addDays(startDate, 1),
          source: "airbnb",
          uid,
          summary,
        });
      }
      current = null;
      continue;
    }
    if (current) current.push(line);
  }

  return normalizeDateBlocks(blocks);
}

export async function importAirbnbCalendar(roomSlug: string): Promise<DateBlock[]> {
  const icalUrl = getAirbnbIcalUrl(roomSlug);
  if (!icalUrl) return [];

  const response = await fetch(icalUrl, {
    headers: { accept: "text/calendar,text/plain,*/*" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Airbnb iCal fetch failed with ${response.status}`);
  }

  return parseIcalEvents(await response.text(), roomSlug);
}

export type CalendarSyncResult =
  | { state: "not_configured" }
  | { state: "error"; reason: string }
  | { state: "ok"; blocks: DateBlock[] };

/**
 * Safe read of the Airbnb export feed. Never throws: any problem (no link,
 * network error, timeout, non-200, body that is not a calendar) is reported
 * as a non-"ok" state so callers can NEVER treat it as "no blocks".
 */
export async function syncAirbnbCalendar(roomSlug: string): Promise<CalendarSyncResult> {
  const icalUrl = getAirbnbIcalUrl(roomSlug);
  if (!icalUrl) return { state: "not_configured" };

  try {
    const response = await fetch(icalUrl, {
      headers: { accept: "text/calendar,text/plain,*/*" },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return { state: "error", reason: `http_${response.status}` };

    const text = await response.text();
    if (!/BEGIN:VCALENDAR/.test(text) || !/END:VCALENDAR/.test(text)) {
      return { state: "error", reason: "not_a_calendar" };
    }
    return { state: "ok", blocks: parseIcalEvents(text, roomSlug) };
  } catch {
    return { state: "error", reason: "fetch_failed" };
  }
}

function escapeIcalText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatIcalDate(date: string): string {
  return date.replace(/-/g, "");
}

function foldIcalLine(line: string): string {
  if (line.length <= 72) return line;
  const chunks: string[] = [];
  let cursor = line;
  while (cursor.length > 72) {
    chunks.push(cursor.slice(0, 72));
    cursor = ` ${cursor.slice(72)}`;
  }
  chunks.push(cursor);
  return chunks.join("\r\n");
}

export function generateWebsiteIcalFeed(roomSlug: string, blocks: DateBlock[]): string {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const normalized = normalizeDateBlocks(blocks);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//La Casa de Roos//Booking Calendar//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:La Casa de Roos - ${roomSlug}`,
    `X-PUBLISHED-TTL:PT1H`,
  ];

  for (const block of normalized) {
    const uid = `${block.uid}@lacasaderoos.com`;
    lines.push(
      "BEGIN:VEVENT",
      foldIcalLine(`UID:${escapeIcalText(uid)}`),
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${formatIcalDate(block.startDate)}`,
      `DTEND;VALUE=DATE:${formatIcalDate(block.endDate)}`,
      "SUMMARY:Blocked - La Casa de Roos",
      "TRANSP:OPAQUE",
      foldIcalLine(`URL:${SITE_URL}/habitaciones/${roomSlug}`),
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

export function sampleWebsiteBlock(roomSlug: string): DateBlock {
  return {
    roomSlug,
    startDate: toIsoDate(new Date()),
    endDate: addDays(toIsoDate(new Date()), 1),
    source: "website",
    uid: `sample-${roomSlug}`,
    summary: "Blocked - La Casa de Roos",
  };
}
