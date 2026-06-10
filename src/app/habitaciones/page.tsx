import type { Metadata } from "next";
import { listings } from "@/data/listings";
import { landmarks } from "@/data/site";
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
      <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-arcilla-500">
            Habitaciones
          </p>
          <h1 className="font-display text-4xl font-semibold text-tinta-900">
            Cuatro suites en una misma casa del centro.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-tinta-700">
            Cada suite tiene dormitorio queen, sala de estar privada, baño
            propio y kitchenette. Elige por vista, espacio o capacidad; todas
            comparten la misma ubicación caminable.
          </p>
        </div>
        <aside className="border-l-2 border-arcilla-500 pl-5 text-xs leading-relaxed text-tinta-700">
          <p className="font-semibold text-tinta-900">Desde La Casa de Roos</p>
          <ul className="mt-2 space-y-1.5">
            {landmarks.slice(0, 3).map((landmark) => (
              <li key={landmark.name}>
                {landmark.name}: <span className="text-tinta-500">{landmark.walk}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {listings.map((l, i) => (
          <RoomCard key={l.slug} listing={l} variant={i} />
        ))}
      </div>
    </div>
  );
}
