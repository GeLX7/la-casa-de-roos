import Link from "next/link";
import { guardAdminPanel } from "@/lib/admin/auth";
import { getAdminRooms } from "@/lib/admin/catalog";
import {
  moveRoomAction,
  softDeleteRoomAction,
  toggleRoomActiveAction,
} from "@/lib/admin/actions";
import { listings } from "@/data/listings";
import { ConfirmSubmit } from "@/components/admin/buttons";
import { SetupNeededCard } from "@/components/admin/ui";

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={
        active
          ? "rounded-md bg-salvia-100 px-2 py-0.5 text-xs font-semibold text-salvia-700"
          : "rounded-md bg-sillar-100 px-2 py-0.5 text-xs font-semibold text-tinta-500"
      }
    >
      {active ? "Activa" : "Oculta"}
    </span>
  );
}

export default async function AdminCatalogPage() {
  const guard = await guardAdminPanel();

  if (!guard.configured) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-xl font-extrabold text-tinta-900">Catálogo</h1>
        <SetupNeededCard title="Catálogo en modo solo lectura">
          <p>
            Estas son las habitaciones del catálogo estático actual del sitio. Para
            editarlas desde aquí hace falta el proyecto de Supabase con sus variables de
            entorno y la semilla inicial.
          </p>
        </SetupNeededCard>
        <ul className="divide-y divide-sillar-200 rounded-lg border border-sillar-200 bg-white">
          {listings.map((room) => (
            <li key={room.slug} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-tinta-900">{room.subtitle}</p>
                <p className="text-xs text-tinta-500">
                  /habitaciones/{room.slug} · hasta {room.capacity} huéspedes
                </p>
              </div>
              <ActiveBadge active />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const rooms = await getAdminRooms();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-extrabold text-tinta-900">Catálogo</h1>
        <Link
          href="/admin/catalogo/nuevo"
          className="rounded-md bg-arcilla-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-arcilla-600"
        >
          + Añadir habitación
        </Link>
      </div>

      <ul className="divide-y divide-sillar-200 rounded-lg border border-sillar-200 bg-white">
        {rooms.map((room, index) => (
          <li key={room.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
            <div className="flex flex-col gap-0.5">
              <form action={moveRoomAction}>
                <input type="hidden" name="room_id" value={room.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={index === 0}
                  aria-label={`Subir ${room.subtitle || room.name}`}
                  className="rounded px-1.5 text-xs text-tinta-500 hover:text-arcilla-600 disabled:opacity-30"
                >
                  ▲
                </button>
              </form>
              <form action={moveRoomAction}>
                <input type="hidden" name="room_id" value={room.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={index === rooms.length - 1}
                  aria-label={`Bajar ${room.subtitle || room.name}`}
                  className="rounded px-1.5 text-xs text-tinta-500 hover:text-arcilla-600 disabled:opacity-30"
                >
                  ▼
                </button>
              </form>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-tinta-900">
                {room.subtitle || room.name}
              </p>
              <p className="truncate text-xs text-tinta-500">
                /habitaciones/{room.slug} · hasta {room.capacity} huéspedes
              </p>
            </div>

            <ActiveBadge active={room.active} />

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/catalogo/${room.slug}`}
                className="rounded-md border border-sillar-300 px-3 py-1.5 text-xs font-semibold text-tinta-700 transition-colors hover:border-arcilla-400 hover:text-arcilla-600"
              >
                Editar
              </Link>
              <form action={toggleRoomActiveAction}>
                <input type="hidden" name="room_id" value={room.id} />
                <input type="hidden" name="slug" value={room.slug} />
                <input type="hidden" name="next" value={String(!room.active)} />
                <button
                  type="submit"
                  className="rounded-md border border-sillar-300 px-3 py-1.5 text-xs font-semibold text-tinta-700 transition-colors hover:border-arcilla-400 hover:text-arcilla-600"
                >
                  {room.active ? "Ocultar" : "Activar"}
                </button>
              </form>
              <form action={softDeleteRoomAction}>
                <input type="hidden" name="room_id" value={room.id} />
                <input type="hidden" name="slug" value={room.slug} />
                <ConfirmSubmit message={`¿Eliminar "${room.subtitle || room.name}"? Se ocultará del sitio pero su historial se conserva (eliminación suave).`}>
                  Eliminar
                </ConfirmSubmit>
              </form>
            </div>
          </li>
        ))}
        {rooms.length === 0 && (
          <li className="px-5 py-8 text-center text-sm text-tinta-500">
            No hay habitaciones en la base de datos. Ejecuta la semilla
            (docs/runbooks/admin-supabase-setup.md) o crea una nueva.
          </li>
        )}
      </ul>

      <p className="text-xs text-tinta-500">
        El sitio público sigue mostrando el catálogo estático hasta activar{" "}
        <code>CATALOG_DATA_SOURCE=supabase</code> (docs/runbooks/catalog-management.md).
      </p>
    </div>
  );
}
