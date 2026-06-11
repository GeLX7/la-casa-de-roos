"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/data/listings";
import { Camera } from "@/components/icons";

/**
 * Airbnb-style suite gallery: a 5-photo collage that opens a full-screen
 * lightbox with prev/next, counter, category label, Escape/arrow keys and
 * a body scroll lock. No dependencies — plain React state.
 */
export function SuiteGallery({
  photos,
  suiteName,
}: {
  photos: GalleryPhoto[];
  suiteName: string;
}) {
  const [current, setCurrent] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const open = current !== null;

  const show = (i: number) => {
    openerRef.current = document.activeElement as HTMLElement;
    setCurrent(i);
  };
  const close = () => {
    setCurrent(null);
    openerRef.current?.focus();
  };
  const step = (d: number) =>
    setCurrent((c) => (c === null ? c : (c + d + photos.length) % photos.length));

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const photo = current !== null ? photos[current] : null;

  return (
    <>
      {/* Collage: lead photo + four secondary tiles, "view all" on the last. */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {photos.slice(0, 5).map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => show(i)}
            aria-label={`Abrir galería en la foto ${i + 1}: ${p.alt}`}
            className={`group relative overflow-hidden rounded-md ${
              i === 0
                ? "col-span-2 row-span-2 aspect-[4/3] rounded-lg sm:aspect-auto"
                : "aspect-[4/3]"
            }`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              priority={i === 0}
              sizes={
                i === 0
                  ? "(min-width: 640px) 50vw, 100vw"
                  : "(min-width: 640px) 25vw, 50vw"
              }
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            {i === 4 && photos.length > 5 && (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-tinta-900/55 text-white transition-colors group-hover:bg-tinta-900/45">
                <Camera className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.12em]">
                  Ver las {photos.length} fotos
                </span>
              </span>
            )}
          </button>
        ))}
      </div>

      {open && photo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de fotos: ${suiteName}`}
          className="fixed inset-0 z-[60] flex flex-col bg-tinta-900"
          onClick={close}
        >
          {/* Top bar: counter + category, close. */}
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="flex items-center gap-3 text-sm font-medium text-white">
              {current! + 1} / {photos.length}
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/90">
                {photo.category}
              </span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Cerrar galería"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-white"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Stage */}
          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-tinta-900/40 text-white transition-colors hover:bg-tinta-900/70 focus-visible:outline-white sm:left-5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-tinta-900/40 text-white transition-colors hover:bg-tinta-900/70 focus-visible:outline-white sm:right-5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <p
            className="px-6 pb-5 pt-3 text-center text-sm text-white/80"
            onClick={(e) => e.stopPropagation()}
          >
            {photo.alt}
          </p>
        </div>
      )}
    </>
  );
}
