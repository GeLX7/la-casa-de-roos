import Link from "next/link";
import { notFound } from "next/navigation";
import { guardAdminPanel } from "@/lib/admin/auth";
import {
  getAdminRoom,
  getCalendarSource,
  type AdminListItem,
  type AdminRoom,
} from "@/lib/admin/catalog";
import {
  addImageAction,
  addListItemAction,
  deleteImageAction,
  deleteListItemAction,
  updateImageAction,
  updateListItemAction,
  updateRoomBasicAction,
  updateRoomDescriptionAction,
  updateRoomFactsAction,
  updateRoomRatingsAction,
} from "@/lib/admin/actions";
import { getAirbnbIcalEnvKey, getAirbnbIcalUrl } from "@/lib/booking/config";
import { SITE_URL } from "@/data/site";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import {
  ActionBanner,
  AdminCard,
  Field,
  SetupNeededCard,
  inputClass,
  labelClass,
} from "@/components/admin/ui";

/* Icon keys understood by AmenityIcon (src/components/icons.tsx). */
const ICON_OPTIONS = [
  "check",
  "wifi",
  "tv",
  "bath",
  "bed",
  "users",
  "kitchen",
  "shared-kitchen",
  "key",
  "luggage",
  "moon",
  "calendar",
  "laundry",
  "parking",
  "desk",
  "iron",
];

const IMAGE_CATEGORIES = [
  "Sala",
  "Habitación",
  "Cocina",
  "Baño",
  "Áreas comunes",
  "Entorno",
  "Detalles",
];

function HiddenRoomFields({ room }: { room: AdminRoom }) {
  return (
    <>
      <input type="hidden" name="room_id" value={room.id} />
      <input type="hidden" name="slug" value={room.slug} />
    </>
  );
}

/** One repeatable list (features / not-included notes / house rules) as inline row forms. */
function ItemListCard({
  room,
  kind,
  title,
  description,
  items,
  withIcon = false,
}: {
  room: AdminRoom;
  kind: "feature" | "note" | "rule";
  title: string;
  description: string;
  items: AdminListItem[];
  withIcon?: boolean;
}) {
  return (
    <AdminCard title={title} description={description}>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-md border border-sillar-200 p-3">
            <form action={updateListItemAction} className="flex flex-wrap items-end gap-3">
              <HiddenRoomFields room={room} />
              <input type="hidden" name="kind" value={kind} />
              <input type="hidden" name="item_id" value={item.id} />
              {withIcon && (
                <Field label="Icono">
                  <select name="icon" defaultValue={item.icon ?? "check"} className={inputClass}>
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
              <Field label="Texto" className="min-w-60 flex-1">
                <input name="label" defaultValue={item.label} required className={inputClass} />
              </Field>
              <Field label="Orden">
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={item.sort_order}
                  className={`${inputClass} w-20`}
                />
              </Field>
              <label className="flex items-center gap-2 pb-2 text-sm text-tinta-700">
                <input type="checkbox" name="enabled" defaultChecked={item.enabled} />
                Visible
              </label>
              <div className="flex items-center gap-2 pb-0.5">
                <SubmitButton variant="ghost">Guardar</SubmitButton>
              </div>
            </form>
            <form action={deleteListItemAction} className="mt-2">
              <HiddenRoomFields room={room} />
              <input type="hidden" name="kind" value={kind} />
              <input type="hidden" name="item_id" value={item.id} />
              <ConfirmSubmit message="¿Eliminar este elemento? Esta acción no se puede deshacer.">
                Eliminar
              </ConfirmSubmit>
            </form>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-tinta-500">Sin elementos todavía.</li>
        )}
      </ul>

      <form
        action={addListItemAction}
        className="mt-4 flex flex-wrap items-end gap-3 border-t border-sillar-200 pt-4"
      >
        <HiddenRoomFields room={room} />
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="sort_order" value={items.length} />
        {withIcon && (
          <Field label="Icono">
            <select name="icon" defaultValue="check" className={inputClass}>
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Nuevo elemento" className="min-w-60 flex-1">
          <input name="label" required className={inputClass} />
        </Field>
        <SubmitButton variant="ghost">+ Añadir</SubmitButton>
      </form>
    </AdminCard>
  );
}

export default async function AdminRoomEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const guard = await guardAdminPanel();
  const { slug } = await params;
  const { saved, error } = await searchParams;

  if (!guard.configured) {
    return (
      <SetupNeededCard title="Editar habitaciones requiere Supabase">
        <p>
          Configura el proyecto de Supabase y ejecuta la semilla para editar el contenido
          de <code>/habitaciones/{slug}</code> desde aquí.
        </p>
      </SetupNeededCard>
    );
  }

  const room = await getAdminRoom(slug);
  if (!room) notFound();

  const ratings = room.room_ratings;
  const icalEnvKey = getAirbnbIcalEnvKey(room.slug) ?? `AIRBNB_ICAL_${room.slug.toUpperCase().replace(/-/g, "_")}`;
  const icalConfigured = Boolean(getAirbnbIcalUrl(room.slug));
  const icalSecretConfigured = Boolean(process.env.BOOKING_ICAL_SECRET);
  const calendarSource = await getCalendarSource(room.id);

  return (
    <div className="space-y-6">
      <nav className="text-xs text-tinta-500">
        <Link href="/admin/catalogo" className="hover:text-arcilla-600">
          Catálogo
        </Link>{" "}
        / <span className="text-tinta-700">{room.subtitle || room.name}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-extrabold text-tinta-900">
          {room.subtitle || room.name}
        </h1>
        <Link
          href={`/habitaciones/${room.slug}`}
          target="_blank"
          className="text-sm text-tinta-500 underline-offset-2 hover:text-arcilla-600 hover:underline"
        >
          Ver página pública ↗
        </Link>
      </div>

      <ActionBanner saved={saved === "1"} error={error} />

      {/* 1 — Basic info */}
      <AdminCard
        title="1 · Información básica"
        description="Título, subtítulo, visibilidad y enlace de Airbnb. El slug queda fijo tras la creación para no romper URLs ya indexadas."
      >
        <form action={updateRoomBasicAction} className="space-y-4">
          <HiddenRoomFields room={room} />
          <Field label="Título (H1)" htmlFor="name">
            <input id="name" name="name" defaultValue={room.name} required className={inputClass} />
          </Field>
          <Field label="Subtítulo" htmlFor="subtitle">
            <input id="subtitle" name="subtitle" defaultValue={room.subtitle} className={inputClass} />
          </Field>
          <Field label="Slug (fijo)" htmlFor="slug_display">
            <input
              id="slug_display"
              value={`/habitaciones/${room.slug}`}
              disabled
              className={`${inputClass} bg-sillar-50 text-tinta-500`}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="URL del anuncio en Airbnb" htmlFor="airbnb_url">
              <input
                id="airbnb_url"
                name="airbnb_url"
                type="url"
                defaultValue={room.airbnb_url}
                className={inputClass}
              />
            </Field>
            <Field label="ID del anuncio (Airbnb)" htmlFor="airbnb_listing_id">
              <input
                id="airbnb_listing_id"
                name="airbnb_listing_id"
                defaultValue={room.airbnb_listing_id ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Etiqueta de precio" htmlFor="price_label">
            <input
              id="price_label"
              name="price_label"
              defaultValue={room.price_label}
              className={inputClass}
            />
          </Field>
          <div className="flex flex-wrap gap-6 text-sm text-tinta-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active" defaultChecked={room.active} />
              Visible en el sitio público
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="guest_favorite" defaultChecked={room.guest_favorite} />
              Insignia “Favorito de huéspedes”
            </label>
          </div>
          <SubmitButton />
        </form>
      </AdminCard>

      {/* 2 — Summary facts */}
      <AdminCard
        title="2 · Datos principales"
        description="La fila de datos al inicio de la página: huéspedes, camas, baño y horarios."
      >
        <form action={updateRoomFactsAction} className="space-y-4">
          <HiddenRoomFields room={room} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Huéspedes máx." htmlFor="capacity">
              <input
                id="capacity"
                name="capacity"
                type="number"
                min={1}
                max={10}
                defaultValue={room.capacity}
                className={inputClass}
              />
            </Field>
            <Field label="Camas" htmlFor="beds">
              <input id="beds" name="beds" defaultValue={room.beds} className={inputClass} />
            </Field>
            <Field label="Baño" htmlFor="bath">
              <input id="bath" name="bath" defaultValue={room.bath} className={inputClass} />
            </Field>
            <Field label="Check-in desde" htmlFor="checkin">
              <input id="checkin" name="checkin" defaultValue={room.checkin} className={inputClass} />
            </Field>
            <Field label="Check-out hasta" htmlFor="checkout">
              <input id="checkout" name="checkout" defaultValue={room.checkout} className={inputClass} />
            </Field>
            <Field label="Horas de silencio" htmlFor="quiet_hours">
              <input
                id="quiet_hours"
                name="quiet_hours"
                defaultValue={room.quiet_hours}
                className={inputClass}
              />
            </Field>
          </div>
          <SubmitButton />
        </form>
      </AdminCard>

      {/* 3 — Description */}
      <AdminCard
        title="3 · Descripción"
        description="El bloque “LA SUITE” y el resumen corto que también se usa en buscadores. Separa los párrafos con una línea en blanco."
      >
        <form action={updateRoomDescriptionAction} className="space-y-4">
          <HiddenRoomFields room={room} />
          <Field label="Título de la sección" htmlFor="description_title">
            <input
              id="description_title"
              name="description_title"
              defaultValue={room.description_title}
              className={inputClass}
            />
          </Field>
          <Field label="Descripción corta (tarjetas y SEO)" htmlFor="short_description">
            <textarea
              id="short_description"
              name="short_description"
              rows={3}
              defaultValue={room.short_description}
              className={inputClass}
            />
          </Field>
          <Field label="Párrafos (línea en blanco = nuevo párrafo)" htmlFor="long_description">
            <textarea
              id="long_description"
              name="long_description"
              rows={8}
              defaultValue={room.long_description.join("\n\n")}
              className={inputClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título SEO (opcional)" htmlFor="seo_title">
              <input
                id="seo_title"
                name="seo_title"
                defaultValue={room.seo_title ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Meta descripción SEO (opcional)" htmlFor="seo_description">
              <input
                id="seo_description"
                name="seo_description"
                defaultValue={room.seo_description ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
          <SubmitButton />
        </form>
      </AdminCard>

      {/* 4 — Features */}
      <ItemListCard
        room={room}
        kind="feature"
        title="4 · ¿Qué incluye? (servicios)"
        description="Servicios y comodidades con icono. Desmarca “Visible” para ocultar sin borrar."
        items={room.room_features}
        withIcon
      />

      {/* 5 — Not included */}
      <ItemListCard
        room={room}
        kind="note"
        title="5 · Para que lo sepas antes de reservar"
        description="Lo que NO está incluido o conviene saber antes de reservar — el bloque de honestidad."
        items={room.room_not_included}
      />

      {/* 6 — House rules */}
      <ItemListCard
        room={room}
        kind="rule"
        title="6 · Normas de la casa"
        description="Check-in/out, silencio, fiestas, mascotas, penalidades."
        items={room.room_rules}
      />

      {/* 7 — Gallery */}
      <AdminCard
        title="7 · Fotos y categorías"
        description="Edición de metadatos (texto alternativo, categoría, orden, portada). La subida de archivos llega con Supabase Storage en una fase posterior; por ahora las rutas apuntan a public/images/."
      >
        <ul className="space-y-3">
          {room.room_images.map((image) => (
            <li key={image.id} className="rounded-md border border-sillar-200 p-3">
              <p className="mb-2 truncate font-mono text-xs text-tinta-500">{image.src}</p>
              <form action={updateImageAction} className="flex flex-wrap items-end gap-3">
                <HiddenRoomFields room={room} />
                <input type="hidden" name="image_id" value={image.id} />
                <Field label="Texto alternativo" className="min-w-60 flex-1">
                  <input name="alt" defaultValue={image.alt} className={inputClass} />
                </Field>
                <Field label="Categoría">
                  <select name="category" defaultValue={image.category} className={inputClass}>
                    {IMAGE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Orden">
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={image.sort_order}
                    className={`${inputClass} w-20`}
                  />
                </Field>
                <div className="flex flex-col gap-1 pb-1 text-sm text-tinta-700">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="is_cover" defaultChecked={image.is_cover} />
                    Portada
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="active" defaultChecked={image.active} />
                    Visible
                  </label>
                </div>
                <SubmitButton variant="ghost">Guardar</SubmitButton>
              </form>
              <form action={deleteImageAction} className="mt-2">
                <HiddenRoomFields room={room} />
                <input type="hidden" name="image_id" value={image.id} />
                <ConfirmSubmit message="¿Quitar esta foto de la galería? El archivo no se borra del repositorio.">
                  Quitar de la galería
                </ConfirmSubmit>
              </form>
            </li>
          ))}
          {room.room_images.length === 0 && (
            <li className="text-sm text-tinta-500">Sin fotos registradas.</li>
          )}
        </ul>

        <form
          action={addImageAction}
          className="mt-4 flex flex-wrap items-end gap-3 border-t border-sillar-200 pt-4"
        >
          <HiddenRoomFields room={room} />
          <input type="hidden" name="sort_order" value={room.room_images.length} />
          <Field label="Ruta (/images/… o https://…)" className="min-w-60 flex-1">
            <input name="src" required placeholder="/images/listings/…" className={inputClass} />
          </Field>
          <Field label="Texto alternativo" className="min-w-40 flex-1">
            <input name="alt" className={inputClass} />
          </Field>
          <Field label="Categoría">
            <select name="category" defaultValue="Habitación" className={inputClass}>
              {IMAGE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <SubmitButton variant="ghost">+ Añadir foto</SubmitButton>
        </form>
      </AdminCard>

      {/* 8 — Ratings */}
      <AdminCard
        title="8 · Calificaciones (origen: Airbnb)"
        description="Puntajes publicados en el anuncio de Airbnb — actualizar con cuidado y solo con los valores reales del anuncio. Se muestran citados en el sitio; nunca se marcan como aggregateRating de schema.org y no se inventan reseñas."
      >
        <form action={updateRoomRatingsAction} className="space-y-4">
          <HiddenRoomFields room={room} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Calificación general" htmlFor="rating">
              <input
                id="rating"
                name="rating"
                type="number"
                step="0.01"
                min={0}
                max={5}
                defaultValue={ratings?.rating ?? 0}
                className={inputClass}
              />
            </Field>
            <Field label="Nº de reseñas" htmlFor="review_count">
              <input
                id="review_count"
                name="review_count"
                type="number"
                min={0}
                defaultValue={ratings?.review_count ?? 0}
                className={inputClass}
              />
            </Field>
            <Field label="Fecha de verificación" htmlFor="checked_at">
              <input
                id="checked_at"
                name="checked_at"
                type="date"
                defaultValue={ratings?.checked_at ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {(
              [
                ["cleanliness", "Limpieza", ratings?.cleanliness],
                ["checkin", "Llegada", ratings?.checkin],
                ["communication", "Comunicación", ratings?.communication],
                ["location", "Ubicación", ratings?.location],
                ["accuracy", "Veracidad", ratings?.accuracy],
                ["value", "Calidad-precio", ratings?.value],
              ] as const
            ).map(([key, label, value]) => (
              <Field key={key} label={label} htmlFor={key}>
                <input
                  id={key}
                  name={key}
                  type="number"
                  step="0.01"
                  min={0}
                  max={5}
                  defaultValue={value ?? 0}
                  className={inputClass}
                />
              </Field>
            ))}
          </div>
          <SubmitButton />
        </form>
      </AdminCard>

      {/* 9 — Calendar / booking setup */}
      <AdminCard
        title="9 · Calendario y sincronización"
        description="Estado de la sincronización con Airbnb para esta suite. Solo lectura: las URLs privadas viven en variables de entorno, nunca en la base de datos."
      >
        <dl className="space-y-3 text-sm">
          <div>
            <dt className={labelClass}>iCal de Airbnb (importación)</dt>
            <dd className="text-tinta-700">
              {icalConfigured ? (
                <span className="font-semibold text-salvia-700">Configurado</span>
              ) : (
                <>
                  <span className="font-semibold text-arcilla-600">Falta la URL</span>{" "}
                  — se define en la variable de entorno <code>{icalEnvKey}</code>.
                </>
              )}
            </dd>
          </div>
          <div>
            <dt className={labelClass}>Última sincronización</dt>
            <dd className="text-tinta-700">
              {calendarSource?.last_synced_at
                ? new Date(calendarSource.last_synced_at).toLocaleString("es-PE")
                : "Nunca (la sincronización se activa en una fase posterior)."}
              {calendarSource?.last_error && (
                <span className="block text-arcilla-600">
                  Último error: {calendarSource.last_error}
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className={labelClass}>Exportación .ics del sitio (para importar en Airbnb)</dt>
            <dd className="text-tinta-700">
              <code className="break-all text-xs">
                {SITE_URL}/api/ical/{room.slug}?token=…
              </code>
              <span className="mt-1 block text-xs text-tinta-500">
                {icalSecretConfigured
                  ? "El secreto BOOKING_ICAL_SECRET está configurado: la URL funciona con el token real."
                  : "Falta BOOKING_ICAL_SECRET: la URL aún no funciona."}
              </span>
            </dd>
          </div>
        </dl>
      </AdminCard>
    </div>
  );
}
