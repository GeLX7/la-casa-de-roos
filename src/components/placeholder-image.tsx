import Image from "next/image";
import { Camera } from "@/components/icons";
import type { GallerySlot } from "@/data/listings";

/**
 * Photo slot. Renders the owner-provided original when `src` is set;
 * otherwise a clearly-marked warm placeholder. Airbnb images are never
 * used here (docs/research/content-rights-checklist.md).
 */
export function PlaceholderImage({
  photo,
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  photo: GallerySlot;
  className?: string;
  sizes?: string;
  priority?: boolean;
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

  return (
    <div
      role="img"
      aria-label={`Foto pendiente: ${photo.label}`}
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-sillar-100 via-sillar-200 to-sillar-300 ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(168,74,35,0.06) 14px, rgba(168,74,35,0.06) 28px)",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <Camera className="h-7 w-7 text-arcilla-500/70" />
        <p className="text-xs font-medium text-tinta-500">{photo.label}</p>
        <p className="text-[10px] uppercase tracking-wider text-tinta-500/70">
          Foto original en camino
        </p>
      </div>
    </div>
  );
}
