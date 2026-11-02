import type { Metadata } from "next";
import { RequestForm } from "@/components/request-form";
import { isValidStayRange } from "@/lib/booking/dates";
import { getRooms } from "@/lib/catalog/data";

export const metadata: Metadata = {
  title: "Solicitar reserva",
  description:
    "Solicita tu reserva en La Casa de Roos, Centro Histórico de Arequipa. Cuéntanos tus fechas y el equipo confirmará la disponibilidad.",
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
          Atención personalizada
        </p>
        <h1 className="font-display text-4xl font-extrabold text-tinta-900">
          Solicita tu reserva
        </h1>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-tinta-700">
        Elige tu suite y tus fechas; tu solicitud llega directo al WhatsApp de
        Roos, donde el equipo la revisa personalmente. <strong>No es una reserva
        instantánea</strong>: primero verificamos disponibilidad (también la
        del calendario de Airbnb) y nos comunicamos contigo para continuar con la solicitud.
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
          se confirma al responder tu solicitud. Toda reserva directa requiere
          el <strong className="text-tinta-700">pago anticipado del 100%</strong>{" "}
          del importe total, que se solicita después de confirmar la
          disponibilidad y el precio final; la reserva solo queda confirmada
          cuando se verifica el pago completo. Si cancelas con al menos 5 días
          de anticipación al check-in, se devuelve el 100% del importe pagado
          (descontando los gastos bancarios aplicables); con menos días no
          corresponde devolución. Si prefieres, también puedes reservar
          directamente en Airbnb desde la página de cada suite.
        </p>
      </div>
    </div>
  );
}
