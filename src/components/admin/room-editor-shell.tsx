"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { RoomPreview, type PreviewData } from "@/components/admin/room-preview";
import { useUnsavedChangesGuard } from "@/components/admin/use-unsaved-changes-guard";

type EditableField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** Maps a changed scalar field (scoped by its form's data-card) onto the preview. */
function applyField(prev: PreviewData, card: string, input: EditableField): PreviewData {
  const { name, value } = input;
  const checked = (input as HTMLInputElement).checked;
  switch (card) {
    case "basic":
      if (name === "name") return { ...prev, name: value };
      if (name === "subtitle") return { ...prev, subtitle: value };
      if (name === "price_label") return { ...prev, priceLabel: value };
      if (name === "active") return { ...prev, active: checked };
      if (name === "guest_favorite") return { ...prev, guestFavorite: checked };
      return prev;
    case "facts":
      if (name === "capacity") return { ...prev, capacity: value };
      if (name === "beds") return { ...prev, beds: value };
      if (name === "bath") return { ...prev, bath: value };
      if (name === "checkin") return { ...prev, checkin: value };
      if (name === "checkout") return { ...prev, checkout: value };
      if (name === "quiet_hours") return { ...prev, quietHours: value };
      return prev;
    case "description":
      if (name === "description_title") return { ...prev, descriptionTitle: value };
      if (name === "short_description") return { ...prev, shortDescription: value };
      if (name === "long_description") return { ...prev, longDescription: value };
      return prev;
    case "ratings":
      if (name === "rating") return { ...prev, rating: Number(value) || 0 };
      if (name === "review_count") return { ...prev, reviewCount: Number(value) || 0 };
      return prev;
    default:
      return prev;
  }
}

/**
 * Two-column editor layout: the server-rendered cards on the left, a live
 * preview on the right (sticky on desktop, a toggle on mobile).
 *
 * Native input/change events are observed through the container (delegation),
 * so the existing uncontrolled server-action forms keep working untouched: any
 * edit marks the page dirty (unsaved-changes guard) and scalar fields scoped by
 * `data-card` update the preview in real time. Lists, photos, notes and rules
 * save per-row, so the preview shows their last-saved values.
 */
export function RoomEditorShell({
  initial,
  children,
}: {
  initial: PreviewData;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<PreviewData>(initial);
  const [dirty, setDirty] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useUnsavedChangesGuard(dirty);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handle = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target || !("name" in target) || !(target as EditableField).name) return;
      const input = target as EditableField;
      setDirty(true);
      const card = input.closest("form")?.dataset.card;
      if (card) setPreview((prev) => applyField(prev, card, input));
    };

    // Any save (server action) reloads the page with fresh data, so submitting
    // clears the unsaved state. Resetting here is reliable whether the soft
    // navigation remounts this component or preserves its state. HTML5-invalid
    // forms never fire `submit`, so a blocked save keeps the page dirty.
    const handleSubmit = () => setDirty(false);

    el.addEventListener("input", handle);
    el.addEventListener("change", handle);
    el.addEventListener("submit", handleSubmit, true);
    return () => {
      el.removeEventListener("input", handle);
      el.removeEventListener("change", handle);
      el.removeEventListener("submit", handleSubmit, true);
    };
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        className="mb-4 w-full rounded-md border border-sillar-300 px-4 py-2 text-sm font-semibold text-tinta-700 lg:hidden"
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? "Ocultar vista previa" : "Mostrar vista previa"}
      </button>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
        <aside
          className={`${mobileOpen ? "block" : "hidden"} mb-6 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:block lg:sticky lg:top-6 lg:self-start`}
        >
          <div className="lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <RoomPreview data={preview} />
          </div>
        </aside>

        <div ref={containerRef} className="space-y-6 lg:col-start-1 lg:row-start-1">
          {children}
        </div>
      </div>
    </div>
  );
}
