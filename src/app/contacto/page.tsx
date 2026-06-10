import type { Metadata } from "next";
import { site } from "@/data/site";
import { whatsappUrl, defaultWhatsappMessage } from "@/lib/whatsapp";
import { WhatsApp, MapPin, ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos por WhatsApp o redes sociales. La Casa de Roos — Centro Histórico de Arequipa, Perú.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-4xl font-semibold text-tinta-900">Contacto</h1>
      <p className="mt-3 text-sm leading-relaxed text-tinta-700">
        El canal más rápido es WhatsApp — Roos responde normalmente en minutos.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href={whatsappUrl(defaultWhatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-3xl border border-sillar-200 bg-white p-6 shadow-sm transition-colors hover:border-arcilla-400"
        >
          <WhatsApp className="h-8 w-8 text-[#25D366]" />
          <h2 className="mt-3 font-display text-xl font-semibold text-tinta-900">
            WhatsApp
          </h2>
          <p className="mt-1 text-sm text-tinta-700">{site.whatsappDisplay}</p>
          <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-arcilla-600">
            Iniciar conversación
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </p>
        </a>

        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-3xl border border-sillar-200 bg-white p-6 shadow-sm transition-colors hover:border-arcilla-400"
        >
          <MapPin className="h-8 w-8 text-arcilla-500" />
          <h2 className="mt-3 font-display text-xl font-semibold text-tinta-900">
            Ubicación
          </h2>
          <p className="mt-1 text-sm text-tinta-700">{site.neighborhood}</p>
          {/* TODO(owner): publish exact street address when provided (Q4 — approved). */}
          <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-arcilla-600">
            Abrir en Google Maps
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </p>
        </a>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-tinta-900">Síguenos</h2>
        <ul className="mt-4 flex flex-wrap gap-3 text-sm">
          {(
            [
              ["Instagram", site.social.instagram],
              ["TikTok", site.social.tiktok],
              ["Facebook", site.social.facebook],
            ] as const
          ).map(([name, url]) => (
            <li key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-sillar-300 bg-white px-5 py-2.5 font-medium text-tinta-900 transition-colors hover:border-arcilla-400 hover:text-arcilla-600"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl bg-sillar-100 p-5 text-xs leading-relaxed text-tinta-500">
        Para llegadas: el check-in es autónomo con caja de seguridad desde las{" "}
        {site.checkin}; las llaves se devuelven en el segundo piso (Estudio
        Museo Lozada Tamayo Coworking). Te enviamos las instrucciones completas
        al confirmar tu reserva.
      </section>
    </div>
  );
}
