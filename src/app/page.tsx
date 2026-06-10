import Link from "next/link";
import { listings } from "@/data/listings";
import { site, landmarks } from "@/data/site";
import { RoomCard } from "@/components/room-card";
import { TrustStrip } from "@/components/trust-strip";
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

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sillar-100 via-sillar-50 to-sillar-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pb-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sillar-300 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-tinta-700">
              <MapPin className="h-3.5 w-3.5 text-arcilla-500" />
              Centro Histórico · Arequipa, Perú
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-tinta-900 sm:text-5xl lg:text-6xl">
              Tu suite privada en el corazón de la{" "}
              <span className="text-arcilla-500">Ciudad Blanca</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-tinta-700 sm:text-lg">
              {site.description} Cuatro suites con baño propio, sala de estar y
              llegada autónoma — y una anfitriona que responde en minutos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/habitaciones"
                className="inline-flex items-center gap-2 rounded-full bg-arcilla-500 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-arcilla-600"
              >
                Ver habitaciones <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappUrl(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-sillar-300 bg-white px-6 py-3 text-base font-semibold text-tinta-900 transition-colors hover:border-arcilla-400 hover:text-arcilla-600"
              >
                <WhatsApp className="h-5 w-5 text-[#25D366]" />
                Escríbenos
              </a>
            </div>
          </div>

          {/* Hero photo slot — replace with owner's best original (rights doc). */}
          <div
            role="img"
            aria-label="Foto pendiente: fachada y suites de La Casa de Roos"
            className="relative hidden aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-sillar-200 via-sillar-300 to-arcilla-50 shadow-inner lg:flex"
          >
            <div className="px-8 text-center">
              <p className="font-display text-xl font-medium text-tinta-700">
                Aquí va la foto estrella de la casa
              </p>
              <p className="mt-2 text-sm text-tinta-500">
                Esperando las fotos originales del propietario
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Suites */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold text-tinta-900">
              Nuestras suites
            </h2>
            <p className="mt-2 max-w-lg text-sm text-tinta-700">
              Cuatro espacios privados, cada uno con su propia personalidad y
              la misma calidez.
            </p>
          </div>
          <Link
            href="/habitaciones"
            className="flex items-center gap-1.5 text-sm font-semibold text-arcilla-600 hover:text-arcilla-500"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {listings.slice(0, 4).map((l) => (
            <RoomCard key={l.slug} listing={l} />
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-sillar-100">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <h2 className="font-display text-3xl font-semibold text-tinta-900">
            Por qué La Casa de Roos
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title}>
                <r.icon className="h-7 w-7 text-arcilla-500" />
                <h3 className="mt-3 font-display text-lg font-semibold text-tinta-900">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-700">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-tinta-900">
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
          <div className="rounded-3xl border border-sillar-200 bg-white p-8 shadow-sm">
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-tinta-900">
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

      {/* CTA */}
      <section className="bg-tinta-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
          <h2 className="max-w-2xl font-display text-3xl font-semibold text-sillar-50">
            ¿Listo para despertar en el centro histórico?
          </h2>
          <p className="max-w-xl text-sm text-sillar-200">
            Cuéntanos tus fechas y te confirmamos disponibilidad — normalmente
            en minutos.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/reservar"
              className="rounded-full bg-arcilla-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-arcilla-400"
            >
              Solicitar reserva
            </Link>
            <a
              href={whatsappUrl(defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-sillar-200/30 px-6 py-3 text-base font-semibold text-sillar-50 transition-colors hover:border-sillar-200/60"
            >
              <WhatsApp className="h-5 w-5 text-[#25D366]" /> WhatsApp directo
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
