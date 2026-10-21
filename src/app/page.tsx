import Image from "next/image";
import Link from "next/link";
import { computeAggregate, getRooms } from "@/lib/catalog/data";
import { arequipaExperiences } from "@/data/arequipa";
import { site, landmarks } from "@/data/site";
import { RoomCard } from "@/components/room-card";
import { TrustStrip } from "@/components/trust-strip";
import { PlaceholderImage } from "@/components/placeholder-image";
import {
  SectionMotifs,
  MotifCantuta,
  MotifFlower,
  MotifLlamita,
  MotifSprig,
} from "@/components/motifs";
import { whatsappUrl, defaultWhatsappMessage } from "@/lib/whatsapp";
import {
  WhatsApp,
  MapPin,
  Key,
  SharedKitchen,
  Users,
  Moon,
  ArrowRight,
} from "@/components/icons";

const reasons = [
  {
    icon: Users,
    title: "Privacidad total",
    text: "Cada suite tiene dormitorio, sala de estar y baño completamente privados. Tu espacio es solo tuyo.",
  },
  {
    icon: MapPin,
    title: "Ubicación inmejorable",
    text: "A una cuadra de la Calle Mercaderes y a minutos a pie de la Plaza de Armas y Santa Catalina.",
  },
  {
    icon: Key,
    title: "Llegada autónoma",
    text: "Check-in autónomo con cerradura inteligente, a tu propio ritmo, dentro de un edificio empresarial seguro.",
  },
  {
    icon: SharedKitchen,
    title: "Cocina de huéspedes",
    text: "Cocina compartida exclusiva para huéspedes, equipada para preparar algo rico sin salir.",
  },
] as const;

/* Home teaser: three walkable highlights from the curated guide. */
const teaserExperiences = arequipaExperiences.filter((e) =>
  [
    "Monasterio de Santa Catalina",
    "Mirador de Yanahuara",
    "Cañón del Colca",
  ].includes(e.title),
);

/* Hero actions — rendered twice: overlaid inside the artwork's empty cream
   quarter on large screens, below the artwork on smaller ones. */
function HeroActions() {
  return (
    <>
      <Link
        href="/habitaciones"
        className="inline-flex items-center justify-center gap-2 bg-arcilla-500 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-sm transition-colors hover:bg-arcilla-600"
      >
        Ver habitaciones
        <ArrowRight className="h-4 w-4" />
      </Link>
      <a
        href={whatsappUrl(defaultWhatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="inline-flex items-center justify-center gap-2 border border-sillar-300 bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-tinta-900 transition-colors hover:border-arcilla-400 hover:text-arcilla-600"
      >
        <WhatsApp className="h-5 w-5 text-[#25D366]" />
        Escríbenos
      </a>
    </>
  );
}

export default async function HomePage() {
  const listings = await getRooms();
  const aggregate = computeAggregate(listings);
  return (
    <>
      {/* Hero — the owner's landing artwork is the brand piece: cathedral,
          Misti and the wordmark all live inside the illustration, so the
          section only gives it a matching cream canvas (crema-200, sampled
          from the artwork's background) and the two actions. The artwork
          fills the first viewport (minus the 5rem header); the photo and
          review proof arrive on scroll. */}
      <section className="relative overflow-hidden bg-crema-200">
        <SectionMotifs variant="hero" />
        <div className="relative mx-auto max-w-6xl px-6">
          <h1 className="sr-only">La Casa de Roos — Suites privadas en Arequipa, Perú</h1>
          <div className="flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center pb-12 pt-4 sm:pb-14">
            <div className="relative -mx-6 w-[calc(100%+3rem)] sm:mx-0 sm:w-full">
              <Image
                src="/images/brand/landing-page.jpg"
                alt="La Casa de Roos, Arequipa, Perú — ilustración de la catedral y el volcán Misti"
                width={1672}
                height={941}
                priority
                sizes="(min-width: 1280px) 1104px, 100vw"
                className="w-full"
              />
              {/* Soft cream vignette: melts the JPEG's edges into the section
                  even when image optimization shifts its background a hair. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 shadow-[inset_0_0_28px_12px_var(--color-crema-200)]"
              />
              {/* Large screens: the actions hang in the illustration's empty
                  cream quarter, stacked right under its wordmark. */}
              <div className="absolute left-3/4 top-[46%] hidden w-max -translate-x-1/2 flex-col items-stretch gap-3 lg:flex">
                <HeroActions />
              </div>
              {/* Artwork-anchored florals — pinned to the banner's own box so
                  they flank it from the outside at every width and never get
                  cut by its invisible cream edge (aria-hidden; the section
                  motif field handles smaller screens). */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden select-none xl:block">
                <MotifSprig className="motif-drift-c absolute -left-28 top-[36%] w-20 text-salvia-500/[0.17] [--motif-rot:-6deg]" />
                <MotifCantuta className="motif-drift-b absolute -right-40 top-[30%] w-32 text-arcilla-500/[0.13] [--motif-rot:11deg]" />
                <MotifLlamita className="motif-drift-a absolute -left-24 top-[70%] w-10 text-arcilla-400/[0.16] [--motif-rot:9deg]" />
                <MotifFlower className="motif-drift-a absolute -right-32 top-[58%] w-32 text-cacao-700/[0.1] [--motif-rot:-10deg]" />
                <MotifLlamita className="motif-drift-b absolute -right-20 top-[8%] w-9 text-cacao-700/[0.13] [--motif-rot:-7deg]" />
              </div>
            </div>
            <div className="mt-8 flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center lg:hidden">
              <HeroActions />
            </div>
          </div>

          {/* Hero photo — real suite shot from the owner's public Carrd site
              (stored locally; see content-rights checklist). Arch radius nods
              to Arequipa's sillar portales. Sits past the first viewport so
              it reveals on scroll. */}
          <div className="relative pb-12 sm:pb-14">
            <PlaceholderImage
              photo={{
                slot: "hero-casa",
                label:
                  "Suite de La Casa de Roos: cama queen y sala de estar luminosa",
                src: "/images/brand/casa-hero.jpg",
              }}
              variant={1}
              className="aspect-[16/10] w-full rounded-lg rounded-t-[5rem] shadow-sm sm:aspect-[21/9] sm:rounded-t-[8rem]"
              sizes="(min-width: 1280px) 1152px, 100vw"
              priority
            />
            <p className="absolute bottom-7 left-1/2 w-max -translate-x-1/2 rounded-md border border-sillar-200 bg-white px-4 py-1.5 text-xs font-medium text-tinta-700 shadow-sm sm:bottom-9">
              ★ {aggregate.rating.toFixed(2)} · +{aggregate.reviewCount} reseñas
              en Airbnb
            </p>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Location pitch — the former hero copy, now a supporting band
          between the proof strip and the suites. */}
      <section className="relative overflow-hidden bg-white">
        <SectionMotifs variant="band" />
        <div className="relative mx-auto max-w-4xl px-6 pb-4 pt-14 text-center lg:pt-16">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-tinta-700">
            <MapPin className="h-3.5 w-3.5 text-arcilla-500" />
            Centro Histórico · Arequipa, Perú
          </p>
          <h2 className="mt-4 font-display text-2xl font-extrabold leading-[1.12] text-tinta-900 sm:text-3xl lg:text-4xl">
            Tu suite privada en la{" "}
            <span className="text-arcilla-500">Ciudad Blanca</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-tinta-700 sm:text-lg">
            A una cuadra de la Calle Mercaderes y a pasos de la Plaza de
            Armas: suites privadas con baño propio, sala de estar y acceso
            a la cocina compartida, más un mini apartamento con cocina propia.
            Todo con llegada autónoma y una anfitriona que responde en
            minutos.
          </p>
        </div>
      </section>

      {/* Suites — centered heading, grid, centered closing action. */}
      <section className="relative overflow-hidden bg-white">
        <SectionMotifs variant="garden" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
              La casa
            </p>
            <h2 className="font-display text-2xl font-bold text-tinta-900 sm:text-3xl lg:text-4xl">
              Suites y mini apartamento
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-tinta-700 sm:text-base">
              Espacios privados, cada uno con su propia personalidad y la
              misma calidez.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {listings.map((l, i) => (
              <RoomCard key={l.slug} listing={l} variant={i} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/habitaciones"
              className="inline-flex items-center gap-2 border border-sillar-300 bg-white px-6 py-3 text-sm font-semibold text-tinta-900 transition-colors hover:border-arcilla-400 hover:text-arcilla-600"
            >
              Ver todas las habitaciones <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why us — centered heading over a 4-column feature row. */}
      <section className="relative overflow-hidden border-y border-sillar-200 bg-sillar-50/60">
        <SectionMotifs variant="panel" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
              ¿Por qué nosotros?
            </p>
            <h2 className="font-display text-2xl font-bold leading-snug text-tinta-900 sm:text-3xl lg:text-4xl">
              Hecho para descansar, pensado para confiar
            </h2>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="text-center">
                <r.icon className="mx-auto h-7 w-7 text-arcilla-500" />
                <h3 className="mt-4 font-display text-lg font-bold text-tinta-900">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-700">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location — asymmetric split for rhythm between centered bands. */}
      <section className="relative overflow-hidden bg-white">
        <SectionMotifs variant="aside" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
              Ubicación
            </p>
            <h2 className="font-display text-2xl font-bold text-tinta-900 sm:text-3xl">
              Todo Arequipa, a pie
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-tinta-700">
              Estamos en {site.neighborhood}, dentro de un edificio empresarial
              tranquilo y seguro. En el primer piso te espera YURAKUNA, un
              restaurante vegano favorito de nuestros huéspedes.
            </p>
            <ul className="mt-6 space-y-3">
              {landmarks.map((l) => (
                <li key={l.name} className="flex items-center gap-3 text-sm text-tinta-700">
                  <MapPin className="h-4 w-4 shrink-0 text-arcilla-500" />
                  <span className="font-medium text-tinta-900">{l.name}</span>
                  <span className="text-tinta-500">· {l.walk}</span>
                </li>
              ))}
            </ul>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-arcilla-600 hover:text-arcilla-500"
            >
              Abrir en Google Maps <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Honesty block — distinctive trust copy (design doc §honestidad). */}
          <div className="border-l-2 border-arcilla-500 bg-white py-2 pl-7">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold text-tinta-900">
              <Moon className="h-5 w-5 text-arcilla-500" />
              Hablemos claro
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-tinta-700">
              <li>
                El centro histórico tiene vida: de noche puede llegar algo de
                ruido de la calle. Por eso cada suite incluye{" "}
                <strong>tapones para los oídos de cortesía</strong>.
              </li>
              <li>
                No hay aire acondicionado ni calefacción. Con el clima templado
                de Arequipa casi nunca se extrañan.
              </li>
              <li>
                La cocina es compartida (solo huéspedes) y está en el área común
                antes de llegar a tu suite: tiene minirefrigerador, microondas y
                cafetera. Tu suite es completamente privada y no tiene cocina propia.
              </li>
            </ul>
            <p className="mt-4 text-xs text-tinta-500">
              Preferimos contártelo antes de que reserves: por algo nuestros
              huéspedes nos puntúan tan alto.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* Arequipa — centered heading, wide panorama, three highlight cards.
          Images: temporary tourism/reference assets from Arequipa.com
          (docs/research/content-rights-checklist.md). */}
      <section className="relative overflow-hidden border-t border-sillar-200 bg-white">
        <SectionMotifs variant="garden" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
              Guía Arequipa
            </p>
            <h2 className="font-display text-2xl font-bold text-tinta-900 sm:text-3xl lg:text-4xl">
              Descubre Arequipa
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-tinta-700 sm:text-base">
              Monasterios, miradores, picanterías y el cañón a un par de horas:
              la Ciudad Blanca se camina, y la casa queda justo en medio.
            </p>
          </div>

          <div className="relative">
            <Image
              src="/images/arequipa/plaza-de-armas.jpg"
              alt="Plaza de Armas de Arequipa con la catedral y los volcanes al atardecer"
              width={1440}
              height={511}
              className="w-full rounded-lg object-cover"
              sizes="(min-width: 1280px) 1152px, 100vw"
            />
            <p className="absolute bottom-3 left-3 rounded-md bg-white/90 px-3 py-1 text-[11px] font-medium text-tinta-700 shadow-sm backdrop-blur">
              Plaza de Armas · ± 3 min a pie de la casa
            </p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {teaserExperiences.map((e) => (
              <article key={e.title} className="group">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={e.image}
                    alt={e.alt}
                    width={640}
                    height={480}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(min-width: 640px) 33vw, 100vw"
                  />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-tinta-900">
                  {e.title}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-tinta-500">
                  {e.distance}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-tinta-700">
                  {e.text}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/arequipa"
              className="inline-flex items-center gap-2 border-b border-arcilla-500 pb-1 text-sm font-semibold text-arcilla-600 hover:text-arcilla-500"
            >
              Ver la guía completa de Arequipa <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA — centered card (composition cue: lazzat.online's app card). */}
      <section className="relative overflow-hidden border-t border-sillar-200 bg-sillar-50/60">
        <SectionMotifs variant="cta" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl rounded-xl border border-sillar-200 bg-white px-6 py-12 text-center shadow-sm sm:px-12">
            <Image
              src="/images/brand/logo-mark.jpg"
              alt=""
              width={56}
              height={56}
              className="mx-auto h-14 w-14 rounded-lg border border-sillar-200 object-cover"
            />
            <h2 className="mt-5 font-display text-2xl font-bold leading-snug text-tinta-900 sm:text-3xl">
              ¿Listo para despertar en el centro histórico?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-tinta-700 sm:text-base">
              Cuéntanos tus fechas y te confirmamos disponibilidad, normalmente
              en minutos.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/reservar"
                className="bg-arcilla-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-arcilla-600"
              >
                Solicitar reserva
              </Link>
              <a
                href={whatsappUrl(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-sillar-300 bg-white px-6 py-3 text-base font-semibold text-tinta-900 transition-colors hover:border-arcilla-400 hover:text-arcilla-600"
              >
                <WhatsApp className="h-5 w-5 text-[#25D366]" /> WhatsApp directo
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
