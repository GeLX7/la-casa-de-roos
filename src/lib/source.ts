/* Traffic-source tag (point 11). Links we publish (Instagram, TikTok,
   Facebook, Google Business…) carry ?utm_source=…; we remember it for the
   browser tab only (sessionStorage — no cookies, no analytics, nothing sent to
   third parties) and append "(ref: …)" to the WhatsApp message the visitor
   chooses to send, so the owner sees where each chat came from. */

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

/** Appends "(ref: <source>)" to a WhatsApp message when a source is known. */
export function withSourceTag(message: string): string {
  const source = getStoredSource();
  return source ? `${message}\n(ref: ${source})` : message;
}
