import Link from "next/link";
import { guardAdminPanel } from "@/lib/admin/auth";
import { createRoomAction } from "@/lib/admin/actions";
import { SubmitButton } from "@/components/admin/buttons";
import {
  ActionBanner,
  AdminCard,
  Field,
  SetupNeededCard,
  inputClass,
} from "@/components/admin/ui";

export default async function NewRoomPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const guard = await guardAdminPanel();
  const { error } = await searchParams;

  if (!guard.configured || !guard.dbReady) {
    return (
      <SetupNeededCard title="Crear habitaciones requiere Supabase">
        <p>Configura el proyecto de Supabase para poder añadir habitaciones.</p>
      </SetupNeededCard>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <nav className="text-xs text-tinta-500">
        <Link href="/admin/catalogo" className="hover:text-arcilla-600">
          Catálogo
        </Link>{" "}
        / <span className="text-tinta-700">Nueva habitación</span>
      </nav>

      <h1 className="font-display text-xl font-extrabold text-tinta-900">
        Nueva habitación
      </h1>
      <ActionBanner error={error} />

      <AdminCard
        title="Datos iniciales"
        description="La habitación se crea oculta: complétala (descripción, servicios, normas, fotos) y actívala cuando esté lista. El slug no se puede cambiar después."
      >
        <form action={createRoomAction} className="space-y-4">
          <Field label="Título (H1 de la página)" htmlFor="name">
            <input id="name" name="name" required className={inputClass} />
          </Field>
          <Field label="Subtítulo (nombre amistoso de la suite)" htmlFor="subtitle">
            <input id="subtitle" name="subtitle" className={inputClass} />
          </Field>
          <Field label="Slug (URL: /habitaciones/<slug>)" htmlFor="slug">
            <input
              id="slug"
              name="slug"
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              placeholder="suite-nueva"
              className={inputClass}
            />
          </Field>
          <Field label="URL del anuncio en Airbnb" htmlFor="airbnb_url">
            <input
              id="airbnb_url"
              name="airbnb_url"
              type="url"
              placeholder="https://www.airbnb.com.pe/rooms/…"
              className={inputClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Capacidad" htmlFor="capacity">
              <input
                id="capacity"
                name="capacity"
                type="number"
                min={1}
                max={10}
                defaultValue={2}
                className={inputClass}
              />
            </Field>
            <Field label="Camas" htmlFor="beds" className="sm:col-span-2">
              <input id="beds" name="beds" placeholder="1 cama queen" className={inputClass} />
            </Field>
          </div>
          <SubmitButton>Crear habitación</SubmitButton>
        </form>
      </AdminCard>
    </div>
  );
}
