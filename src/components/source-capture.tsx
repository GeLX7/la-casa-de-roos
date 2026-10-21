"use client";

import { useEffect } from "react";
import { sourceFromSearch, storeSource, withSourceTag } from "@/lib/source";

/**
 * Remembers ?utm_source for this tab and tags every wa.me link on click, so
 * no call site needs changing. Renders nothing.
 */
export function SourceCapture() {
  useEffect(() => {
    const source = sourceFromSearch(window.location.search);
    if (source) storeSource(source);

    function onClick(e: MouseEvent) {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const a = target.closest<HTMLAnchorElement>('a[href^="https://wa.me/"]');
      if (!a) return;
      try {
        const url = new URL(a.href);
        const text = url.searchParams.get("text");
        if (!text || /\n\(ref: [a-z0-9_/-]+\)$/.test(text)) return;
        const tagged = withSourceTag(text);
        if (tagged === text) return;
        url.searchParams.set("text", tagged);
        a.href = url.toString();
      } catch {
        /* leave the link untouched */
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
