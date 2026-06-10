import type { Metadata } from "next";
import { listings } from "@/data/listings";
import { landmarks } from "@/data/site";
import { RoomCard } from "@/components/room-card";

export const metadata: Metadata = {
  title: "Habitaciones y suites en el Centro Histórico de Arequipa",
  description:
    "Cuatro suites privadas con baño propio, sala y kitchenette en el Centro Histórico de Arequipa. Capacidad para 2 a 3 huéspedes, llegada autónoma.",
  alternates: { canonical: "/habitaciones" },
};

export default function HabitacionesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 lg:py-18">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
          Habitaciones
        </p>
        <h1 className="font-display text-3xl font-extrabold leading-[1.15] text-tinta-900 sm:text-4xl">
          Cuatro suites en una misma casa del centro.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-tinta-700 sm:text-base">
          Cada suite tiene dormitorio queen, sala de estar privada, baño
          propio y kitchenette. Elige por vista, espacio o capacidad; todas
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
        {listings.map((l, i) => (
          <RoomCard key={l.slug} listing={l} variant={i} />
        ))}
      </div>
    </div>
  );
}
