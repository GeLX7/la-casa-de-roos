import type { Metadata } from "next";
import { RequestForm } from "@/components/request-form";
import { isValidStayRange } from "@/lib/booking/dates";
import { getRooms } from "@/lib/catalog/data";

export const metadata: Metadata = {
  title: "Solicitar reserva",
  description:
    "Solicita tu reserva en La Casa de Roos, Centro Histórico de Arequipa. Cuéntanos tus fechas y te confirmamos disponibilidad, normalmente en minutos.",
  alternates: { canonical: "/reservar" },
};

export default async function ReservarPage({
  searchParams,
}: {
  searchParams: Promise<{ suite?: string; checkin?: string; checkout?: string }>;
}) {
  const { suite, checkin, checkout } = await searchParams;
  const validRange =
    checkin && checkout && isValidStayRange(checkin, checkout) && checkin >= new Date().toISOString().slice(0, 10);
  const rooms = await getRooms();

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <div className="text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
          Respuesta en minutos
        </p>
        <h1 className="font-display text-4xl font-extrabold text-tinta-900">
          Solicita tu reserva
        </h1>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-tinta-700">
        Elige tu suite y tus fechas; tu solicitud llega directo al WhatsApp de
        Roos, que la confirma personalmente. <strong>No es una reserva
        instantánea</strong>: primero verificamos disponibilidad (también la
        del calendario de Airbnb) y te respondemos, normalmente en minutos.
      </p>

      <div className="mt-8 rounded-lg border border-sillar-200 bg-white p-5 shadow-sm sm:p-8">
        <RequestForm
          initialSlug={suite}
          initialCheckin={validRange ? checkin : undefined}
          initialCheckout={validRange ? checkout : undefined}
          rooms={rooms.map(({ slug, title, subtitle, capacity }) => ({ slug, title, subtitle, capacity }))}
        />
      </div>

      <div className="mt-6 border-l-2 border-arcilla-500 bg-sillar-50 p-5 text-xs leading-relaxed text-tinta-500">
        <p>
          <strong className="text-tinta-700">Cómo sigue:</strong> Roos confirma
          la disponibilidad y coordina contigo el pago y los detalles de
          llegada. Los precios que ves son referenciales: la tarifa final
          se confirma al responder tu solicitud. La reserva directa se confirma
          con un <strong className="text-tinta-700">adelanto del 50%</strong>,
          reembolsable (menos comisiones bancarias) si cancelas con al menos 5
          días de anticipación al check-in; con menos días, o si no te
          presentas, el adelanto no se reembolsa. Si prefieres, también puedes reservar
          directamente en Airbnb desde la página de cada suite.
        </p>
      </div>
    </div>
  );
}
