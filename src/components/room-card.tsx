import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/data/listings";
import { Star, Users, Bed, ArrowRight } from "@/components/icons";

export function RoomCard({ listing }: { listing: Listing; variant?: number }) {
  const cover = listing.gallery[0];
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-sillar-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/habitaciones/${listing.slug}`}
        aria-label={`Ver ${listing.subtitle}`}
        className="relative block"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </div>
        {listing.guestFavorite && (
          <span className="absolute left-3 top-3 rounded-md bg-white/90 px-3 py-1 text-[11px] font-semibold text-tinta-900 shadow-sm backdrop-blur">
            ❤ Favorito entre huéspedes
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-bold leading-snug text-tinta-900">
              {listing.title}
            </h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-tinta-500">
              {listing.subtitle}
            </p>
          </div>
          <p
            className="flex shrink-0 items-center gap-1 rounded-md bg-sillar-100 px-2.5 py-1 text-sm font-medium text-tinta-700"
            title={`${listing.reviewCount} reseñas en Airbnb`}
          >
            <Star className="h-3.5 w-3.5 text-arcilla-500" />
            {listing.rating.toFixed(2)}
            <span className="text-xs text-tinta-500">({listing.reviewCount})</span>
          </p>
        </div>

        <p className="text-sm leading-relaxed text-tinta-700">
          {listing.shortDescription}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-tinta-500">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> Hasta {listing.capacity} huéspedes
          </span>
          <span className="flex items-center gap-1.5">
            <Bed className="h-4 w-4" /> {listing.beds}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-sillar-200 pt-4">
          <span className="text-sm font-medium text-arcilla-600">
            {listing.priceLabel}
          </span>
          <Link
            href={`/habitaciones/${listing.slug}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-tinta-900 transition-colors hover:text-arcilla-600"
          >
            Ver suite <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
