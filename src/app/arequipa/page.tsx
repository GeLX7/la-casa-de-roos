import type { Metadata } from "next";
import Link from "next/link";
import { arequipaFacts, arequipaGuide, arequipaNearby } from "@/data/arequipa";
import { site, landmarks } from "@/data/site";
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
      <section className="border-b border-sillar-200">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase text-arcilla-600">
              Guía local
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-tinta-900 sm:text-5xl">
              Arequipa se disfruta mejor cuando puedes caminarla.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-tinta-700">
              La Casa de Roos está pensada para viajeros que quieren vivir el
              Centro Histórico con calma: salir temprano, volver a descansar y
              tener Plaza de Armas, Mercaderes y Santa Catalina a pocos minutos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/habitaciones"
                className="inline-flex items-center gap-2 rounded-lg bg-arcilla-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-arcilla-600"
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

          <aside className="self-end border-l-2 border-arcilla-500 pl-6">
            <p className="font-display text-2xl font-semibold leading-snug text-tinta-900">
              Ciudad Blanca: sillar, cielo seco y una escala natural entre costa,
              sierra y Colca.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              {arequipaFacts.map((fact) => (
                <div key={fact.label} className="border-t border-sillar-200 pt-3">
                  <dt className="text-xs font-semibold uppercase text-tinta-500">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-tinta-900">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-arcilla-600">
              Por qué el centro
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-tinta-900">
              Base práctica, días más ligeros.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-tinta-700">
              Arequipa tiene una escala amable, pero varios planes quedan en
              direcciones distintas. Hospedarte en el centro te deja resolver lo
              esencial a pie y guardar los traslados para Colca, Ruta del Sillar
              o miradores.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map((item) => (
              <section key={item.title} className="border-t border-sillar-200 pt-5">
                <item.icon className="h-6 w-6 text-arcilla-500" />
                <h3 className="mt-4 font-display text-xl font-semibold text-tinta-900">
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

      <section className="border-y border-sillar-200 bg-sillar-50/60">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-semibold uppercase text-arcilla-600">
                Cerca de la casa
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-tinta-900">
                Caminatas que ayudan a decidir.
              </h2>
            </div>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-sillar-300 bg-white px-4 py-2.5 text-sm font-semibold text-tinta-900 transition-colors hover:border-arcilla-400 hover:text-arcilla-600"
            >
              Ver ubicación <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {arequipaNearby.map((item) => (
              <article key={item.title} className="bg-white p-5 shadow-[0_18px_40px_-34px_rgba(41,36,32,0.55)]">
                <h3 className="font-display text-lg font-semibold leading-snug text-tinta-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-tinta-700">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1fr] lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase text-arcilla-600">
            Guía breve
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-tinta-900">
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
              <h3 className="font-display text-xl font-semibold text-tinta-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta-700">
                {item.text}
              </p>
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}
