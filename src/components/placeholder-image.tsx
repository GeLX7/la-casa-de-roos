import Image from "next/image";
import type { GallerySlot } from "@/data/listings";

/**
 * Photo slot. Renders the owner-provided original when `src` is set;
 * otherwise a warm, intentional placeholder with an Arequipa-arch motif.
 * Airbnb images are never used here
 * (docs/research/content-rights-checklist.md).
 *
 * `variant` cycles three warm tints so grids of pending photos don't
 * read as one flat beige block.
 */
const TINTS = [
  "from-sillar-100 via-sillar-200 to-sillar-300",
  "from-arcilla-50 via-sillar-100 to-sillar-200",
  "from-cielo-100 via-salvia-100 to-sillar-100",
] as const;

function Arch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path
        d="M10 42V24c0-7.7 6.3-14 14-14s14 6.3 14 14v18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M6 42h36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function PlaceholderImage({
  photo,
  className = "",
  sizes = "100vw",
  priority = false,
  variant = 0,
  compact = false,
}: {
  photo: GallerySlot;
  className?: string;
  sizes?: string;
  priority?: boolean;
  variant?: number;
  compact?: boolean;
}) {
  if (photo.src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={photo.src}
          alt={photo.label}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  const tint = TINTS[variant % TINTS.length];

  return (
    <div
      role="img"
      aria-label={`Foto pendiente: ${photo.label}`}
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${tint} ${className}`}
    >
      <div className="absolute inset-2 rounded-[inherit] border border-white/50" aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-1.5 px-4 text-center">
        <Arch className={compact ? "h-6 w-6 text-arcilla-500/50" : "h-9 w-9 text-arcilla-500/50"} />
        {!compact && (
          <>
            <p className="max-w-[16rem] text-xs font-medium leading-snug text-tinta-700/80">
              {photo.label}
            </p>
            <p className="text-[10px] uppercase text-tinta-500/60">
              Foto original en camino
            </p>
          </>
        )}
      </div>
    </div>
  );
}
