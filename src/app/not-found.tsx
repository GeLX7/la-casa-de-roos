import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <p className="font-display text-6xl font-extrabold text-arcilla-500">404</p>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-tinta-900">
        Esta página no existe
      </h1>
      <p className="mt-2 text-sm text-tinta-700">
        Pero nuestras suites sí. ¿Te mostramos las habitaciones?
      </p>
      <Link
        href="/habitaciones"
        className="mt-6 bg-arcilla-500 px-6 py-3 text-sm font-semibold text-white hover:bg-arcilla-600"
      >
        Ver habitaciones
      </Link>
    </div>
  );
}
