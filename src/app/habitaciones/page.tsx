import type { Metadata } from "next";
import { listings } from "@/data/listings";
import { RoomCard } from "@/components/room-card";

export const metadata: Metadata = {
  title: "Habitaciones y suites en el Centro Histórico de Arequipa",
  description:
    "Cuatro suites privadas con baño propio, sala y kitchenette en el Centro Histórico de Arequipa. Capacidad para 2–3 huéspedes, llegada autónoma.",
  alternates: { canonical: "/habitaciones" },
};

export default function HabitacionesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 lg:py-18">
      <h1 className="font-display text-4xl font-semibold text-tinta-900">
        Nuestras habitaciones
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-tinta-700">
        Cuatro suites tipo loft en el mismo edificio del centro histórico: cada
        una con dormitorio queen, sala de estar privada, baño propio y
        kitchenette. Elige la tuya y solicita tus fechas.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {listings.map((l) => (
          <RoomCard key={l.slug} listing={l} />
        ))}
      </div>
    </div>
  );
}
