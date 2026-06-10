import Image from "next/image";
import Link from "next/link";
import { listings, aggregate } from "@/data/listings";
import { arequipaExperiences } from "@/data/arequipa";
import { site, landmarks } from "@/data/site";
import { RoomCard } from "@/components/room-card";
import { TrustStrip } from "@/components/trust-strip";
import { PlaceholderImage } from "@/components/placeholder-image";
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
    text: "Check-in con caja de seguridad a tu propio ritmo, dentro de un edificio empresarial seguro.",
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

export default function HomePage() {
  return (
    <>
      {/* Hero — centered editorial stack over a wide photo
          (composition cue: lazzat.online's logo-led, centered hero). */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 pt-12 sm:pt-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            {/* Owner-provided brand lockup as a small crest above the title. */}
            <Image
              src="/images/brand/logo-mark.jpg"
              alt="Logo de La Casa de Roos"
              width={88}
              height={88}
              priority
              className="h-20 w-20 rounded-xl border border-sillar-200 object-cover sm:h-22 sm:w-22"
            />
            <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-tinta-700">
              <MapPin className="h-3.5 w-3.5 text-arcilla-500" />
              Centro Histórico · Arequipa, Perú
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-tinta-900 sm:text-5xl lg:text-6xl">
              Tu suite privada en el corazón de la{" "}
              <span className="text-arcilla-500">Ciudad Blanca</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-tinta-700 sm:text-lg">
              A una cuadra de la Calle Mercaderes y a pasos de la Plaza de
              Armas: cuatro suites privadas con baño propio, sala de estar y
              kitchenette, llegada autónoma — y una anfitriona que responde en
              minutos.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/habitaciones"
                aria-label="Ver habitaciones"
                className="inline-flex items-center gap-2 bg-arcilla-500 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-arcilla-600"
              >
                <span className="sm:hidden">Ver suites</span>
                <span className="hidden sm:inline">Ver habitaciones</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappUrl(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribir por WhatsApp"
                className="inline-flex items-center gap-2 border-b border-arcilla-500 px-1 py-3 text-base font-semibold text-tinta-900 transition-colors hover:text-arcilla-600"
              >
                <WhatsApp className="h-5 w-5 text-[#25D366]" />
                <span className="sm:hidden">WhatsApp</span>
                <span className="hidden sm:inline">Escríbenos</span>
              </a>
            </div>
          </div>

          {/* Hero photo — real suite shot from the owner's public Carrd site
              (stored locally; see content-rights checklist). Arch radius nods
              to Arequipa's sillar portales. */}
          <div className="relative mt-10 pb-10 sm:mt-12 sm:pb-12">
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

      {/* Suites — centered heading, grid, centered closing action. */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
            La casa
          </p>
          <h2 className="font-display text-3xl font-bold text-tinta-900 sm:text-4xl">
            Nuestras suites
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-tinta-700 sm:text-base">
            Cuatro espacios privados, cada uno con su propia personalidad y la
            misma calidez.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {listings.slice(0, 4).map((l, i) => (
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
      </section>

      {/* Why us — centered heading over a 4-column feature row. */}
      <section className="border-y border-sillar-200 bg-sillar-50/60">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
              Por qué nosotros
            </p>
            <h2 className="font-display text-3xl font-bold text-tinta-900 sm:text-4xl">
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
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
              Ubicación
            </p>
            <h2 className="font-display text-3xl font-bold text-tinta-900 sm:text-4xl">
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
                No hay aire acondicionado ni calefacción — con el clima templado
                de Arequipa casi nunca se extrañan.
              </li>
              <li>
                La cocina completa es compartida (solo huéspedes); tu suite tiene
                kitchenette con lo esencial.
              </li>
            </ul>
            <p className="mt-4 text-xs text-tinta-500">
              Preferimos contártelo antes de que reserves: por algo nuestros
              huéspedes nos puntúan tan alto.
            </p>
          </div>
        </div>
      </section>

      {/* Arequipa — centered heading, wide panorama, three highlight cards.
          Images: temporary tourism/reference assets from Arequipa.com
          (docs/research/content-rights-checklist.md). */}
      <section className="border-t border-sillar-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
              Guía Arequipa
            </p>
            <h2 className="font-display text-3xl font-bold text-tinta-900 sm:text-4xl">
              Descubre Arequipa
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-tinta-700 sm:text-base">
              Monasterios, miradores, picanterías y el cañón a un par de horas:
              la Ciudad Blanca se camina — y la casa queda justo en medio.
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
      <section className="border-t border-sillar-200 bg-sillar-50/60">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl rounded-xl border border-sillar-200 bg-white px-6 py-12 text-center shadow-sm sm:px-12">
            <Image
              src="/images/brand/logo-mark.jpg"
              alt=""
              width={56}
              height={56}
              className="mx-auto h-14 w-14 rounded-lg border border-sillar-200 object-cover"
            />
            <h2 className="mt-5 font-display text-3xl font-bold text-tinta-900 sm:text-4xl">
              ¿Listo para despertar en el centro histórico?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-tinta-700 sm:text-base">
              Cuéntanos tus fechas y te confirmamos disponibilidad — normalmente
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
