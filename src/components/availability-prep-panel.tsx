export function AvailabilityPrepPanel({ roomName }: { roomName: string }) {
  return (
    <section className="rounded-lg border border-sillar-200 bg-sillar-50/70 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-arcilla-600">
        Disponibilidad
      </p>
      <h2 className="mt-2 font-display text-xl font-bold text-tinta-900">
        Calendario de {roomName}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-tinta-700">
        Calendario en preparación. Escríbenos para confirmar disponibilidad.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-tinta-600">
        <span className="rounded-md border border-salvia-500/30 bg-white px-2 py-2">
          Disponible
        </span>
        <span className="rounded-md border border-arcilla-500/30 bg-white px-2 py-2">
          No disponible
        </span>
        <span className="rounded-md border border-sillar-300 bg-white px-2 py-2">
          Revisando
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-tinta-500">
        La disponibilidad se confirma antes de la reserva. La reserva no es instantánea.
      </p>
    </section>
  );
}
