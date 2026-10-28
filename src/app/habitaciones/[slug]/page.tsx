import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listings } from "@/data/listings";
import { getRoomBySlug, getRooms } from "@/lib/catalog/data";
import { site, SITE_URL } from "@/data/site";
import { SuiteGallery } from "@/components/suite-gallery";
import { AmenityList } from "@/components/amenity-list";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import { JsonLd } from "@/components/json-ld";
import { whatsappUrl, roomWhatsappMessage } from "@/lib/whatsapp";
import {
  Star,
  Users,
  Bed,
  Bath,
  Key,
  Check,
  WhatsApp,
  ExternalLink,
  ArrowRight,
} from "@/components/icons";

type Params = { slug: string };

/* Build-time params come from the static catalog; DB-only slugs (added later
   through the admin) still render on demand via dynamicParams. */
export function generateStaticParams(): Params[] {
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getRoomBySlug(slug);
  if (!listing) return {};
  return {
    /* Listing titles already carry the location keywords; the layout
       template appends "· La Casa de Roos". Adding the subtitle too blows
       far past Google's title display width. */
    title: listing.title,
    description: listing.shortDescription,
    alternates: { canonical: `/habitaciones/${listing.slug}` },
    openGraph: {
      title: `${listing.title} · ${site.name}`,
      description: listing.shortDescription,
    },
  };
}

export default async function RoomPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const listing = await getRoomBySlug(slug);
  if (!listing) notFound();
  const allRooms = await getRooms();

  const accommodationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: `${listing.title} · ${listing.subtitle}`,
    description: listing.shortDescription,
    url: `${SITE_URL}/habitaciones/${listing.slug}`,
    occupancy: { "@type": "QuantitativeValue", maxValue: listing.capacity },
    amenityFeature: listing.amenities.slice(0, 8).map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.label,
      value: true,
    })),
    containedInPlace: {
      "@type": "LodgingBusiness",
      name: site.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.city,
        addressCountry: site.country,
      },
    },
  };

  const facts = [
    { icon: Users, label: `Hasta ${listing.capacity} huéspedes` },
    { icon: Bed, label: listing.beds },
    { icon: Bath, label: listing.bath },
    { icon: Key, label: `Check-in ${site.checkin} · Check-out ${site.checkout}` },
  ];

  return (
    <article className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <JsonLd data={accommodationJsonLd} />

      <nav aria-label="Miga de pan" className="mb-6 text-xs text-tinta-500">
        <Link href="/habitaciones" className="hover:text-arcilla-600">
          Habitaciones
        </Link>{" "}
        / <span className="text-tinta-700">{listing.subtitle}</span>
      </nav>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="max-w-3xl font-display text-2xl font-extrabold leading-snug text-tinta-900 sm:text-3xl">
            {listing.title}
          </h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-tinta-500">
            {listing.subtitle}
          </p>
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1.5 text-lg font-semibold text-tinta-900">
            <Star className="h-5 w-5 text-arcilla-500" />
            {listing.rating.toFixed(2)}
          </p>
          <a
            href={listing.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-tinta-500 underline-offset-2 hover:text-arcilla-600 hover:underline"
          >
            {listing.reviewCount} reseñas en Airbnb ↗
          </a>
        </div>
      </header>

      {/* Gallery — temporary Airbnb-derived photos stored locally, pending
          owner originals (docs/research/content-rights-checklist.md). */}
      {listing.gallery.length > 0 && (
        <SuiteGallery photos={listing.gallery} suiteName={listing.subtitle} />
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          <section aria-label="Datos principales" className="flex flex-wrap gap-x-6 gap-y-2">
            {facts.map((f) => (
              <span key={f.label} className="flex items-center gap-2 text-sm text-tinta-700">
                <f.icon className="h-4.5 w-4.5 text-arcilla-500" />
                {f.label}
              </span>
            ))}
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-tinta-900">
              La suite
            </h2>
            {listing.longDescription.map((p) => (
              <p key={p.slice(0, 24)} className="mt-3 text-sm leading-relaxed text-tinta-700">
                {p}
              </p>
            ))}
          </section>

          <AvailabilityCalendar roomSlug={listing.slug} roomName={listing.subtitle} />

          <section>
            <h2 className="mb-4 font-display text-2xl font-bold text-tinta-900">
              ¿Qué incluye?
            </h2>
            <AmenityList items={listing.amenities} />
            <h3 className="mb-2 mt-6 text-sm font-semibold text-tinta-900">
              No incluido en la suite
            </h3>
            <ul className="space-y-1.5">
              {listing.notIncluded.map((n) => (
                <li key={n} className="text-sm text-tinta-500">· {n}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-display text-2xl font-bold text-tinta-900">
              Normas de la casa
            </h2>
            <ul className="space-y-2.5">
              {listing.rules.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-sm text-tinta-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-salvia-500" />
                  {r}
                </li>
              ))}
            </ul>
          </section>

          {/* Official per-category scores from the public Airbnb listing.
              Full review texts aren't publicly extractable, so we show the
              breakdown Airbnb itself publishes — attributed, display-only. */}
          <section>
            <h2 className="mb-1 font-display text-2xl font-bold text-tinta-900">
              Lo que valoran los huéspedes
            </h2>
            <p className="mb-5 flex items-center gap-1.5 text-sm text-tinta-700">
              <Star className="h-4 w-4 text-arcilla-500" />
              {listing.rating.toFixed(2)} de calificación general ·{" "}
              {listing.reviewCount} reseñas
            </p>
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {(
                [
                  ["Limpieza", listing.categoryRatings.cleanliness],
                  ["Llegada", listing.categoryRatings.checkin],
                  ["Comunicación", listing.categoryRatings.communication],
                  ["Ubicación", listing.categoryRatings.location],
                  ["Veracidad", listing.categoryRatings.accuracy],
                  ["Calidad-precio", listing.categoryRatings.value],
                ] as const
              ).map(([label, score]) => (
                <div key={label}>
                  <div className="flex items-baseline justify-between text-sm">
                    <dt className="font-medium text-tinta-900">{label}</dt>
                    <dd className="font-semibold text-tinta-900">
                      {score.toFixed(2)}
                    </dd>
                  </div>
                  <div
                    aria-hidden="true"
                    className="mt-1.5 h-1 overflow-hidden rounded-full bg-sillar-200"
                  >
                    <div
                      className="h-full rounded-full bg-arcilla-500"
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs text-tinta-500">
              Calificaciones por categoría publicadas en nuestro anuncio de
              Airbnb ({site.ratingsCheckedAt}).{" "}
              <a
                href={listing.airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-arcilla-600"
              >
                Ver las reseñas completas en Airbnb ↗
              </a>
            </p>
          </section>
        </div>

        {/* Booking panel */}
        <aside className="h-fit rounded-lg border border-sillar-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display text-2xl font-bold text-arcilla-600">
              {listing.priceLabel}
            </p>
            {listing.guestFavorite && (
              <span className="rounded-md bg-sillar-100 px-2.5 py-1 text-[10px] font-semibold text-tinta-700">
                ❤ Favorito
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-tinta-500">
            Precio referencial por noche. Confirmamos tarifa y disponibilidad por
            WhatsApp, sin compromiso. La reserva se confirma con un adelanto del
            50%, reembolsable si cancelas con 5 o más días de anticipación al
            check-in.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-sillar-200 pt-4 text-xs text-tinta-700">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-arcilla-500" /> {listing.capacity} huéspedes
            </span>
            <span className="flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-arcilla-500" /> {listing.beds}
            </span>
          </div>
          <div className="mt-5 space-y-3">
            <Link
              href={`/reservar?suite=${listing.slug}`}
              className="flex w-full items-center justify-center gap-2 bg-arcilla-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-arcilla-600"
            >
              Solicitar reserva <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappUrl(roomWhatsappMessage(listing.subtitle))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 border border-sillar-300 px-5 py-3 text-sm font-semibold text-tinta-900 transition-colors hover:border-arcilla-400 hover:text-arcilla-600"
            >
              <WhatsApp className="h-4.5 w-4.5 text-[#25D366]" /> Consultar por WhatsApp
            </a>
            <a
              href={listing.airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium text-tinta-500 transition-colors hover:text-arcilla-600"
            >
              Ver anuncio en Airbnb <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/arequipa"
              className="flex w-full items-center justify-center gap-2 px-5 py-1 text-xs font-medium text-tinta-500 transition-colors hover:text-arcilla-600"
            >
              Qué hacer cerca de la casa <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="mt-4 border-t border-sillar-200 pt-4 text-[11px] leading-relaxed text-tinta-500">
            Las solicitudes están sujetas a confirmación de disponibilidad.
            Horas de silencio: {listing.quietHours}.
          </p>
        </aside>
      </div>

      {/* Cross-links */}
      <section className="mt-16 border-t border-sillar-200 pt-10">
        <h2 className="mb-6 text-center font-display text-xl font-bold text-tinta-900">
          Otras suites de la casa
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {allRooms
            .filter((l) => l.slug !== listing.slug)
            .map((l) => (
              <Link
                key={l.slug}
                href={`/habitaciones/${l.slug}`}
                className="rounded-lg border border-sillar-200 bg-white p-5 transition-colors hover:border-arcilla-400"
              >
                <p className="flex items-center gap-1 text-xs font-medium text-tinta-500">
                  <Star className="h-3.5 w-3.5 text-arcilla-500" />
                  {l.rating.toFixed(2)} · {l.reviewCount} reseñas
                </p>
                <p className="mt-2 font-display text-sm font-bold uppercase leading-snug tracking-[0.06em] text-tinta-900">
                  {l.subtitle}
                </p>
                <p className="mt-1 text-xs text-tinta-500">
                  Hasta {l.capacity} huéspedes
                </p>
              </Link>
            ))}
        </div>
      </section>
    </article>
  );
}
