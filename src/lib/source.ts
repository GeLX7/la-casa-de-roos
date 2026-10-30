/* Web-origin and traffic-source markers.
   Every WhatsApp message that starts from lacasaderoos.com ends with a stable
   marker "(ref: web)" so the reservations automation can tell web inquiries
   from any other chat. When the visitor arrived from a link we published
   (Instagram, TikTok, Facebook, Google Business…) with ?utm_source=…, the
   campaign source is kept separately as "(fuente: instagram/bio)" — we remember
   it for the browser tab only (sessionStorage — no cookies, no analytics,
   nothing sent to third parties).

   The "(ref: web)" marker is a routing hint, not proof of identity: anyone can
   type it. Exclusion tags in the CRM always take precedence. */

const KEY = "roos_src";

function clean(value: string | null): string | null {
  const s = (value ?? "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30);
  return s || null;
}

/** "instagram" or "instagram/bio" from utm_source (+ utm_campaign). */
export function sourceFromSearch(search: string): string | null {
  const params = new URLSearchParams(search);
  const source = clean(params.get("utm_source"));
  if (!source) return null;
  const campaign = clean(params.get("utm_campaign"));
  return campaign ? `${source}/${campaign}` : source;
}

export function storeSource(source: string): void {
  try {
    window.sessionStorage.setItem(KEY, source);
  } catch {
    /* storage unavailable: the tag is simply skipped */
  }
}

export function getStoredSource(): string | null {
  try {
    const raw = window.sessionStorage.getItem(KEY) ?? "";
    return /^[a-z0-9_-]{1,30}(\/[a-z0-9_-]{1,30})?$/.test(raw) ? raw : null;
  } catch {
    return null;
  }
}

export const WEB_MARKER = "(ref: web)";
const WEB_MARKER_RE = /\(ref: web\)/;
const SOURCE_MARKER_RE = /\(fuente: [a-z0-9_/-]+\)/;

/**
 * Pure helper: appends "(ref: web)" and, when known, "(fuente: <origen>)".
 * Idempotent — never duplicates a marker that is already in the message.
 */
export function appendMarkers(message: string, source: string | null): string {
  const extra: string[] = [];
  if (!WEB_MARKER_RE.test(message)) extra.push(WEB_MARKER);
  if (source && !SOURCE_MARKER_RE.test(message)) extra.push(`(fuente: ${source})`);
  return extra.length ? `${message}\n${extra.join("\n")}` : message;
}

/** Message with the web marker and, if a UTM source is stored, the source. */
export function withSourceTag(message: string): string {
  return appendMarkers(message, getStoredSource());
}
