"use client";

import { AmenityIcon, Star } from "@/components/icons";

export type PreviewData = {
  name: string;
  subtitle: string;
  priceLabel: string;
  active: boolean;
  guestFavorite: boolean;
  capacity: string;
  beds: string;
  bath: string;
  checkin: string;
  checkout: string;
  quietHours: string;
  descriptionTitle: string;
  shortDescription: string;
  longDescription: string;
  features: { icon: string; label: string }[];
  notes: string[];
  rules: string[];
  cover: { src: string; alt: string } | null;
  gallery: { src: string; alt: string }[];
  rating: number;
  reviewCount: number;
};

function paragraphs(raw: string): string[] {
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/**
 * Faithful-but-simplified mirror of the public room page, driven by live form
 * state. Read-only: it renders props, never submits or fetches anything, so it
 * cannot write data or leak admin-only fields (it only shows public content).
 */
export function RoomPreview({ data }: { data: PreviewData }) {
  const facts = [
    `${data.capacity || "—"} huéspedes`,
    data.beds,
    data.bath,
    data.checkin && `Check-in ${data.checkin}`,
    data.checkout && `Check-out ${data.checkout}`,
  ].filter(Boolean) as string[];

  return (
    <div className="overflow-hidden rounded-lg border border-sillar-200 bg-white">
      <div className="flex items-center justify-between border-b border-sillar-200 bg-sillar-50/70 px-4 py-2">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-tinta-500">
          Vista previa
        </span>
        {!data.active && (
          <span className="rounded bg-sillar-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-tinta-500">
            Oculta
          </span>
        )}
      </div>

      <div className="space-y-4 p-4">
        {data.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.cover.src}
            alt={data.cover.alt}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-md object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md bg-sillar-100 text-xs text-tinta-500">
            Sin portada
          </div>
        )}

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {data.guestFavorite && (
              <span className="rounded-full bg-arcilla-50 px-2 py-0.5 text-[10px] font-semibold text-arcilla-600">
                Favorito de huéspedes
              </span>
            )}
            {data.rating > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-tinta-700">
                <Star className="h-3.5 w-3.5 text-arcilla-500" />
                {data.rating.toFixed(2)}
                <span className="font-normal text-tinta-500">({data.reviewCount})</span>
              </span>
            )}
          </div>
          <h3 className="mt-1 font-display text-lg font-extrabold leading-tight text-tinta-900">
            {data.name || "Sin título"}
          </h3>
          {data.subtitle && <p className="text-sm text-tinta-600">{data.subtitle}</p>}
          {data.priceLabel && (
            <p className="mt-1 text-sm font-semibold text-arcilla-600">{data.priceLabel}</p>
          )}
        </div>

        {facts.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {facts.map((f, i) => (
              <li
                key={i}
                className="rounded-md bg-sillar-100 px-2 py-0.5 text-xs text-tinta-700"
              >
                {f}
              </li>
            ))}
          </ul>
        )}

        {(data.descriptionTitle || data.shortDescription || data.longDescription) && (
          <div className="space-y-1.5">
            {data.descriptionTitle && (
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-tinta-500">
                {data.descriptionTitle}
              </p>
            )}
            {data.shortDescription && (
              <p className="text-sm text-tinta-700">{data.shortDescription}</p>
            )}
            {paragraphs(data.longDescription).map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-tinta-600">
                {p}
              </p>
            ))}
          </div>
        )}

        {data.features.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.12em] text-tinta-500">
              ¿Qué incluye?
            </p>
            <ul className="grid grid-cols-2 gap-1.5">
              {data.features.map((f, i) => (
                <li key={i} className="flex items-center gap-1.5 text-xs text-tinta-700">
                  <AmenityIcon name={f.icon} className="h-4 w-4 shrink-0 text-arcilla-500" />
                  <span className="truncate">{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.notes.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.12em] text-tinta-500">
              Para que lo sepas
            </p>
            <ul className="list-disc space-y-0.5 pl-4 text-xs text-tinta-600">
              {data.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        )}

        {data.rules.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.12em] text-tinta-500">
              Normas de la casa
            </p>
            <ul className="list-disc space-y-0.5 pl-4 text-xs text-tinta-600">
              {data.rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {data.gallery.length > 0 && (
          <div className="grid grid-cols-4 gap-1.5">
            {data.gallery.map((g, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="aspect-square w-full rounded object-cover"
              />
            ))}
          </div>
        )}

        <p className="border-t border-sillar-200 pt-3 text-[11px] leading-relaxed text-tinta-400">
          Los textos y datos principales se actualizan en vivo. Servicios, fotos,
          notas y normas reflejan lo último guardado en cada bloque.
        </p>
      </div>
    </div>
  );
}
