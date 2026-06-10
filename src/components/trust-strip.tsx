import { aggregate } from "@/data/listings";
import { site } from "@/data/site";
import { Star, Key, MapPin } from "@/components/icons";

/**
 * Aggregate Airbnb figures shown as attributed facts (display only —
 * intentionally no schema.org aggregateRating, see docs/research/seo-strategy.md).
 */
export function TrustStrip() {
  return (
    <section aria-label="Reputación" className="border-y border-sillar-200 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 text-center sm:grid-cols-4 sm:divide-x sm:divide-sillar-200">
        <div>
          <p className="flex items-center justify-center gap-1.5 font-display text-2xl font-semibold text-tinta-900">
            <Star className="h-5 w-5 text-arcilla-500" />
            {aggregate.rating.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-tinta-500">calificación promedio</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-tinta-900">
            +{aggregate.reviewCount}
          </p>
          <p className="mt-1 text-xs text-tinta-500">reseñas en Airbnb</p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-1.5 font-display text-2xl font-semibold text-tinta-900">
            <Key className="h-5 w-5 text-arcilla-500" />
            24/7
          </p>
          <p className="mt-1 text-xs text-tinta-500">llegada autónoma</p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-1.5 font-display text-2xl font-semibold text-tinta-900">
            <MapPin className="h-5 w-5 text-arcilla-500" />1 cuadra
          </p>
          <p className="mt-1 text-xs text-tinta-500">de la Calle Mercaderes</p>
        </div>
      </div>
      <p className="pb-4 text-center text-[11px] text-tinta-500/80">
        Datos públicos de nuestros anuncios en Airbnb ({site.ratingsCheckedAt}).
      </p>
    </section>
  );
}
