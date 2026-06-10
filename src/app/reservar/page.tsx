import type { Metadata } from "next";
import { RequestForm } from "@/components/request-form";

export const metadata: Metadata = {
  title: "Solicitar reserva",
  description:
    "Solicita tu reserva en La Casa de Roos, Centro Histórico de Arequipa. Cuéntanos tus fechas y te confirmamos disponibilidad, normalmente en minutos.",
  alternates: { canonical: "/reservar" },
};

export default async function ReservarPage({
  searchParams,
}: {
  searchParams: Promise<{ suite?: string }>;
}) {
  const { suite } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="font-display text-4xl font-semibold text-tinta-900">
        Solicita tu reserva
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-tinta-700">
        Elige tu suite y tus fechas; tu solicitud llega directo al WhatsApp de
        Roos, que la confirma personalmente. <strong>No es una reserva
        instantánea</strong> — primero verificamos disponibilidad (también la
        del calendario de Airbnb) y te respondemos, normalmente en minutos.
      </p>

      <div className="mt-8 rounded-3xl border border-sillar-200 bg-white p-5 shadow-sm sm:p-8">
        <RequestForm initialSlug={suite} />
      </div>

      <div className="mt-6 rounded-2xl bg-sillar-100 p-5 text-xs leading-relaxed text-tinta-500">
        <p>
          <strong className="text-tinta-700">Cómo sigue:</strong> Roos confirma
          la disponibilidad y coordina contigo el pago y los detalles de
          llegada. Las tarifas se confirman al responder tu solicitud
          (“Consultar precio”). Si prefieres, también puedes reservar
          directamente en Airbnb desde la página de cada suite.
        </p>
      </div>
    </div>
  );
}
