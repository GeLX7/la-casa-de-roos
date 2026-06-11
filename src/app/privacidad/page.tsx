import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de La Casa de Roos.",
  alternates: { canonical: "/privacidad" },
  robots: { index: false },
};

/* Placeholder: the owner has an existing privacy policy (PDF in Google
   Drive, see docs/research/content-inventory.md). It will be adapted for
   the web + Ley 29733 before launch (questions-for-owner.md Q19 = yes).
   Until then this page makes no untrue claims and collects nothing. */
export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="font-display text-4xl font-extrabold text-tinta-900">
        Política de privacidad
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-tinta-700">
        <p>
          Estamos preparando la versión web de nuestra política de privacidad,
          que publicaremos aquí antes del lanzamiento oficial del sitio.
        </p>
        <p>
          Mientras tanto, lo esencial: este sitio <strong>no guarda tus datos
          en ninguna base de datos</strong>. El formulario de solicitud solo
          compone un mensaje de WhatsApp que tú mismo envías; tus datos viajan
          directamente a nuestra conversación contigo y se usan únicamente para
          gestionar tu reserva.
        </p>
        <p>
          ¿Dudas sobre tus datos? Escríbenos por WhatsApp al{" "}
          {site.whatsappDisplay}.
        </p>
        <p className="text-xs text-tinta-500">
          Última actualización: junio de 2026 · Documento definitivo en
          preparación conforme a la Ley N.º 29733 (Protección de Datos
          Personales, Perú).
        </p>
      </div>
    </div>
  );
}
