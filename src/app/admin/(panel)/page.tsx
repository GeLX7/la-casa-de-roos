import Link from "next/link";
import { guardAdminPanel } from "@/lib/admin/auth";
import { getAdminStats } from "@/lib/admin/catalog";
import { getSetupWarnings } from "@/lib/admin/config";
import { AIRBNB_ICAL_ENV_BY_ROOM, getAirbnbIcalUrl } from "@/lib/booking/config";
import { getRooms } from "@/lib/catalog/data";
import { INDEXABLE, SITE_URL } from "@/data/site";
import { AdminCard, StatCard, WarningCard } from "@/components/admin/ui";

export default async function AdminDashboardPage() {
  const guard = await guardAdminPanel();
  const stats = await getAdminStats();
  const listings = await getRooms();
  const warnings = getSetupWarnings();

  const dbValue = (value: number | null) => (value === null ? "—" : String(value));
  const dbHint = stats.live ? undefined : "Disponible al configurar Supabase";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-xl font-extrabold text-tinta-900">Panel</h1>
        <p className="mt-1 text-sm text-tinta-500">
          {!guard.configured
            ? "Vista previa con el catálogo estático. Configura las credenciales de admin para iniciar sesión."
            : !guard.dbReady
              ? "Sesión activa. Configura Supabase para activar la edición del catálogo y las estadísticas en vivo."
              : "Resumen de la casa y estado del sistema."}
        </p>
      </div>

      {warnings.length > 0 && (
        <section aria-label="Configuración pendiente" className="grid gap-3 sm:grid-cols-2">
          {warnings.map((w) => (
            <WarningCard key={w.key} label={w.label} detail={w.detail} />
          ))}
        </section>
      )}

      <section aria-label="Estadísticas" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Habitaciones" value={String(stats.totalRooms)} />
        <StatCard label="Habitaciones activas" value={String(stats.activeRooms)} />
        <StatCard
          label="Calificación promedio"
          value={stats.averageRating > 0 ? `★ ${stats.averageRating.toFixed(2)}` : "—"}
          hint="Promedio ponderado de Airbnb"
        />
        <StatCard
          label="Reseñas en Airbnb"
          value={String(stats.totalReviews)}
          hint="Total entre todas las habitaciones"
        />
        <StatCard label="Solicitudes de reserva" value={dbValue(stats.totalRequests)} hint={dbHint} />
        <StatCard label="Solicitudes pendientes" value={dbValue(stats.pendingRequests)} hint={dbHint} />
        <StatCard label="Reservas confirmadas" value={dbValue(stats.confirmedReservations)} hint={dbHint} />
        <StatCard
          label="Fechas bloqueadas"
          value={
            stats.externalBlocks === null && stats.manualBlocks === null
              ? "—"
              : String((stats.externalBlocks ?? 0) + (stats.manualBlocks ?? 0))
          }
          hint={stats.live ? "Airbnb importado + bloqueos manuales" : dbHint}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard
          title="Calendarios de Airbnb (iCal)"
          description="Cada suite necesita su URL privada de exportación iCal de Airbnb (la provee la dueña). Sin ellas, la disponibilidad no se sincroniza."
        >
          <ul className="divide-y divide-sillar-200 text-sm">
            {listings.map((room) => {
              const configured = Boolean(getAirbnbIcalUrl(room.slug));
              return (
                <li key={room.slug} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-tinta-700">{room.subtitle}</span>
                  <span
                    className={
                      configured
                        ? "rounded-md bg-salvia-100 px-2 py-0.5 text-xs font-semibold text-salvia-700"
                        : "rounded-md bg-sillar-100 px-2 py-0.5 text-xs font-semibold text-tinta-500"
                    }
                  >
                    {configured ? "Configurado" : "Falta URL"}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-tinta-500">
            Variables esperadas: {Object.values(AIRBNB_ICAL_ENV_BY_ROOM).join(", ")}.
          </p>
        </AdminCard>

        <AdminCard
          title="Estado del sitio / SEO"
          description="Resumen mínimo del sitio público."
        >
          <ul className="space-y-2.5 text-sm text-tinta-700">
            <li>
              Dominio:{" "}
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-arcilla-600"
              >
                {SITE_URL.replace("https://", "")}
              </a>{" "}
              <span className="text-salvia-700">· en producción</span>
            </li>
            <li>
              Sitemap:{" "}
              <a
                href={`${SITE_URL}/sitemap.xml`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-arcilla-600"
              >
                /sitemap.xml
              </a>
            </li>
            <li>
              Indexación: {INDEXABLE ? "activada (los buscadores pueden indexar)" : "pausada (noindex)"}
            </li>
            <li className="text-tinta-500">Google Search Console: verificación manual pendiente.</li>
          </ul>
        </AdminCard>
      </div>

      <p className="text-sm text-tinta-500">
        Gestiona habitaciones, textos, servicios, normas y fotos en{" "}
        <Link href="/admin/catalogo" className="font-semibold text-arcilla-600 underline-offset-2 hover:underline">
          Catálogo
        </Link>
        .
      </p>
    </div>
  );
}
