import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  arequipaFacts,
  arequipaGuide,
  arequipaNearby,
  arequipaExperiences,
} from "@/data/arequipa";
import { site, landmarks } from "@/data/site";
import { PlaceholderImage } from "@/components/placeholder-image";
import { ArrowRight, CalendarIcon, MapPin, Moon, SharedKitchen } from "@/components/icons";

export const metadata: Metadata = {
  title: "Guía de Arequipa para hospedarte en el Centro Histórico",
  description:
    "Una guía breve para elegir dónde hospedarte en Arequipa: centro histórico, sillar, caminatas, clima, movilidad y lugares cerca de La Casa de Roos.",
  alternates: { canonical: "/arequipa" },
};

const reasons = [
  {
    icon: MapPin,
    title: "Centro como base",
    text: "Dormir en el centro histórico reduce traslados y te deja volver a la suite entre caminatas, almuerzos y visitas.",
  },
  {
    icon: CalendarIcon,
    title: "Ritmo de 2 a 4 días",
    text: "Para una primera visita, conviene reservar margen: ciudad, monasterio, miradores y una salida corta fuera del centro.",
  },
  {
    icon: SharedKitchen,
    title: "Comer y caminar",
    text: "Cafés, restaurantes, mercados y bares quedan cerca. La cocina compartida ayuda cuando prefieres algo simple.",
  },
  {
    icon: Moon,
    title: "Centro vivo",
    text: "La ubicación es práctica y urbana. Contamos el posible ruido nocturno de frente para que reserves con contexto.",
  },
] as const;

export default function ArequipaPage() {
  return (
    <article className="bg-white">
      {/* Hero — centered editorial stack over a wide panorama.
          Tourism images: temporary reference assets from Arequipa.com
          (docs/research/content-rights-checklist.md). */}
      <section className="border-b border-sillar-200">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-14 lg:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-arcilla-600">
              Guía local
            </p>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.12] text-tinta-900 sm:text-4xl lg:text-5xl">
              Descubre Arequipa
            </h1>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-tinta-500">
              Una ciudad que se camina
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-tinta-700">
              Monasterios de colores, portales de sillar, picanterías y volcanes
              en el horizonte. La Casa de Roos está pensada como base tranquila
              para vivir el Centro Histórico con calma: salir temprano, volver a
              descansar y salir otra vez.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/habitaciones"
                className="inline-flex items-center gap-2 bg-arcilla-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-arcilla-600"
              >
                Ver suites <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/reservar"
                className="inline-flex items-center gap-2 border-b border-arcilla-500 py-3 text-sm font-semibold text-arcilla-600 hover:text-arcilla-500"
              >
                Consultar fechas
              </Link>
            </div>
          </div>

          <div className="relative mt-10">
            <Image
              src="/images/arequipa/plaza-de-armas.jpg"
              alt="Plaza de Armas de Arequipa con la catedral, los portales y los volcanes al fondo"
              width={1440}
              height={511}
              priority
              className="w-full rounded-lg rounded-t-[4rem] object-cover sm:rounded-t-[6rem]"
              sizes="(min-width: 1280px) 1152px, 100vw"
            />
            <p className="absolute bottom-3 left-3 rounded-md bg-white/90 px-3 py-1 text-[11px] font-medium text-tinta-700 shadow-sm backdrop-blur">
              Plaza de Armas · ± 3 min a pie de la casa
            </p>
          </div>

          {/* Quick facts band under the panorama. */}
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-sillar-200 pt-6 text-center sm:grid-cols-4">
            {arequipaFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-tinta-500">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 font-display text-base font-bold text-tinta-900">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Why the center — asymmetric split with the owner's interior shot. */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-arcilla-600">
              Por qué el centro
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-tinta-900 sm:text-3xl">
              Base práctica, días más ligeros.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-tinta-700">
              Arequipa tiene una escala amable, pero varios planes quedan en
              direcciones distintas. Hospedarte en el centro te deja resolver lo
              esencial a pie y guardar los traslados para Colca, Ruta del Sillar
              o miradores.
            </p>
            {/* Real interior shot from the owner's public Carrd site (local
                copy; see content-rights checklist). */}
            <PlaceholderImage
              photo={{
                slot: "sala-cuadro",
                label:
                  "Sala de una suite de La Casa de Roos con pintura arequipeña",
                src: "/images/brand/sala-cuadro.jpg",
              }}
              className="mt-8 aspect-[5/4] w-full rounded-lg"
              sizes="(min-width: 1024px) 35vw, 100vw"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map((item) => (
              <section key={item.title} className="border-t border-sillar-200 pt-5">
                <item.icon className="h-6 w-6 text-arcilla-500" />
                <h3 className="mt-4 font-display text-xl font-bold text-tinta-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-700">
                  {item.text}
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* Must-see gallery — centered heading over a 3-column image grid. */}
      <section className="border-y border-sillar-200 bg-sillar-50/60">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-arcilla-600">
              Qué hacer
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-tinta-900 sm:text-3xl lg:text-4xl">
              Lugares imperdibles
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-tinta-700 sm:text-base">
              Una selección corta y honesta: lo que de verdad vale tu tiempo en
              una primera visita, ordenado desde la puerta de la casa.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {arequipaExperiences.map((e) => (
              <article
                key={e.title}
                className="group overflow-hidden rounded-lg border border-sillar-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={e.image}
                    alt={e.alt}
                    width={640}
                    height={480}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-tinta-900 shadow-sm backdrop-blur">
                    {e.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold leading-snug text-tinta-900">
                    {e.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-tinta-500">
                    {e.distance}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-tinta-700">
                    {e.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Near the house — walking decisions. */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-arcilla-600">
            Cerca de la casa
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-tinta-900 sm:text-3xl lg:text-4xl">
            A pasos de La Casa de Roos
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-tinta-700">
            Caminatas que ayudan a decidir: lo esencial queda tan cerca que
            puedes improvisar el día sin organizar traslados.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {arequipaNearby.map((item) => (
            <article
              key={item.title}
              className="border-t-2 border-arcilla-500 bg-white pt-4"
            >
              <h3 className="font-display text-lg font-bold leading-snug text-tinta-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-tinta-700">
                {item.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-sillar-300 bg-white px-5 py-3 text-sm font-semibold text-tinta-900 transition-colors hover:border-arcilla-400 hover:text-arcilla-600"
          >
            Ver ubicación en Google Maps <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Practical guide — split layout for rhythm. */}
      <section className="border-t border-sillar-200">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1fr] lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-arcilla-600">
              Guía breve
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-tinta-900 sm:text-3xl">
              Lo útil antes de elegir fechas.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-tinta-700">
              No hace falta convertir tu estadía en una agenda rígida. Basta con
              ubicarte bien, saber cómo moverte y separar tiempo para descansar.
            </p>
            <ul className="mt-6 space-y-3">
              {landmarks.map((landmark) => (
                <li key={landmark.name} className="flex items-start gap-3 text-sm text-tinta-700">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-arcilla-500" />
                  <span>
                    <span className="font-semibold text-tinta-900">{landmark.name}</span>
                    <span className="text-tinta-500"> · {landmark.walk}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="divide-y divide-sillar-200 border-y border-sillar-200">
            {arequipaGuide.map((item) => (
              <section key={item.title} className="py-6">
                <h3 className="font-display text-xl font-bold text-tinta-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-700">
                  {item.text}
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* Closing — sunset band with centered overlay CTA. */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/arequipa/atardecer-ciudad.jpg"
          alt="Atardecer sobre Arequipa con la catedral y los volcanes de fondo"
          width={1440}
          height={600}
          className="h-[26rem] w-full object-cover sm:h-[24rem]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta-900/80 via-tinta-900/35 to-transparent" />
        <div className="absolute inset-0 flex items-end justify-center pb-12">
          <div className="max-w-3xl px-6 text-center">
            <h2 className="font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
              Despierta a tres minutos de todo esto.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/90">
              Cuéntanos tus fechas y arma tus días en Arequipa desde una base
              céntrica y tranquila.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/reservar"
                className="bg-white px-6 py-3 text-sm font-semibold text-tinta-900 transition-colors hover:bg-sillar-100"
              >
                Solicitar reserva
              </Link>
              <Link
                href="/habitaciones"
                className="inline-flex items-center gap-2 border border-white/70 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Ver suites <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
