import type { Metadata } from "next";
import { getRooms } from "@/lib/catalog/data";
import { landmarks, site } from "@/data/site";
import { RoomCard } from "@/components/room-card";
import { SectionMotifs } from "@/components/motifs";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Habitaciones y suites en el Centro Histórico de Arequipa",
  description:
    "Suites privadas con baño propio, sala y cocina compartida exclusiva para huéspedes, y un mini apartamento con cocina propia, en el Centro Histórico de Arequipa. Capacidad para 2 a 3 huéspedes, llegada autónoma.",
  alternates: { canonical: "/habitaciones" },
};

/* The questions guests actually ask before booking (sourced from the
   owner's Airbnb conversations and the honesty blocks elsewhere on the
   site). Everything stated here must stay true to the listings data —
   no instant booking, no overpromising. */
const faqs = [
  {
    q: "¿Las habitaciones tienen baño privado?",
    a: "Sí. Todas las habitaciones, suites y mini apartamento, tienen baño completo privado y dormitorio con cama queen. Las suites además tienen sala de estar propia.",
  },
  {
    q: "¿Cómo se reserva?",
    a: "Nos escribes por WhatsApp o desde el formulario de solicitud con tus fechas, y te confirmamos disponibilidad y tarifa, normalmente en minutos. No se paga nada en esta web.",
  },
  {
    q: "¿Dónde está exactamente La Casa de Roos?",
    a: "En el Centro Histórico de Arequipa (Cercado), a una cuadra de la Calle Mercaderes y a unos 3 minutos a pie de la Plaza de Armas. La dirección exacta se comparte al confirmar la reserva.",
  },
  {
    q: "¿Cómo funciona el check-in?",
    a: `Llegada autónoma con cerradura inteligente dentro de un edificio empresarial seguro, desde las ${site.checkin}. El check-out es hasta las ${site.checkout}.`,
  },
  {
    q: "¿Hay cocina?",
    a: "Hay una cocina compartida en el área común por la que se pasa antes de llegar a las suites. Tiene minirefrigerador, microondas y cafetera, y es de uso exclusivo para los huéspedes: nadie más del edificio entra. Tu suite es completamente privada.",
  },
  {
    q: "¿Es ruidoso el centro histórico de noche?",
    a: "El centro tiene vida y algunas noches llega ruido de la calle; por eso cada suite incluye tapones para los oídos de cortesía. Preferimos contarlo antes de que reserves.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default async function HabitacionesPage() {
  /* Static listings by default; Supabase only when CATALOG_DATA_SOURCE=supabase
     (src/lib/catalog/data.ts). */
  const rooms = await getRooms();
  return (
    <div className="relative overflow-hidden">
      <SectionMotifs variant="band" />
      <div className="relative mx-auto max-w-6xl px-6 py-14 lg:py-18">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
            Habitaciones
          </p>
          <h1 className="font-display text-3xl font-extrabold leading-[1.15] text-tinta-900 sm:text-4xl">
            Suites y mini apartamento en una misma casa del centro.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-tinta-700 sm:text-base">
            Cada suite tiene dormitorio queen, sala de estar privada, baño
            propio y acceso a la cocina compartida; el mini apartamento tiene
            cocina propia. Elige por vista, espacio o capacidad; todos
            comparten la misma ubicación caminable.
          </p>
        </div>
        <ul className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2 border-y border-sillar-200 py-4 text-xs text-tinta-700">
          {landmarks.slice(0, 3).map((landmark) => (
            <li key={landmark.name}>
              <span className="font-semibold text-tinta-900">{landmark.name}</span>{" "}
              <span className="text-tinta-500">· {landmark.walk}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {rooms.map((l, i) => (
            <RoomCard key={l.slug} listing={l} variant={i} />
          ))}
        </div>

        {/* Pre-booking FAQ — the real questions guests ask by WhatsApp,
            answered in page so the answer exists before the chat starts. */}
        <section className="mx-auto mt-16 max-w-3xl border-t border-sillar-200 pt-12">
          <JsonLd data={faqJsonLd} />
          <h2 className="text-center font-display text-2xl font-bold text-tinta-900 sm:text-3xl">
            Preguntas frecuentes
          </h2>
          <dl className="mt-8 space-y-7">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-display text-base font-bold text-tinta-900">
                  {f.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-tinta-700">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
