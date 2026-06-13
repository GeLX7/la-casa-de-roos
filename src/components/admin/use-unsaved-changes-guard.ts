"use client";

import { useEffect } from "react";

export const UNSAVED_MESSAGE = "Hay cambios sin publicar. ¿Seguro que deseas salir?";

/**
 * Warns before losing unpublished edits.
 *
 * - `beforeunload` covers tab close, refresh, and external navigation (the
 *   browser shows its own generic prompt; the text cannot be customized).
 * - A capture-phase document click listener intercepts in-app navigations via
 *   internal `<a>`/`<Link>` clicks and asks for confirmation; cancelling stops
 *   the navigation before Next's router runs.
 *
 * Form submits (the "Publicar en Supabase" buttons and row saves) are
 * `<button>`s, not anchors, so they are never blocked — saving clears the
 * dirty state by reloading the page with fresh data.
 */
export function useUnsavedChangesGuard(dirty: boolean): void {
  useEffect(() => {
    if (!dirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Legacy assignment kept for older browsers that gate the prompt on it.
      event.returnValue = "";
    };

    const onClickCapture = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(href, window.location.href);
      // External links cause a real unload — beforeunload already guards those.
      if (destination.origin !== window.location.origin) return;
      // Same page (e.g. an in-page hash) is not a navigation away.
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search
      ) {
        return;
      }

      if (!window.confirm(UNSAVED_MESSAGE)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClickCapture, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClickCapture, true);
    };
  }, [dirty]);
}
