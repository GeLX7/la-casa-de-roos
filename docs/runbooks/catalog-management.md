# Runbook — Catalog Management (Admin Mode)

How to edit rooms safely once Supabase is configured
(`docs/runbooks/admin-supabase-setup.md`). Admin lives at
`https://lacasaderoos.com/admin` (Spanish UI, noindex, login required).

## Key concept: two content sources

- **Static catalog** (`src/data/listings.ts`) — what the public site serves
  today and whenever Supabase is missing or fails.
- **Supabase catalog** — what the admin edits. The public site reads it only
  when `CATALOG_DATA_SOURCE=supabase` is set.

Until that flag flips, admin edits are staged: visible in the admin, invisible
to guests. That makes the admin safe to learn with.

## Everyday tasks

### Edit room content
Catálogo → Editar → change fields inside any card → **Guardar** (each card
saves independently). A green "Cambios guardados." banner confirms; red shows
the error. Description paragraphs: separate with one blank line.

### Features / notes / rules
Each row saves on its own. "Visible" unchecked hides the item on the public
page without deleting it (preferred over Eliminar). New items append at the
end; change "Orden" numbers to reorder (lower = first).

### Photos
**Upload (Supabase Storage):** drag photos onto the upload zone in "7 · Fotos y
categorías" (or "Elegir archivos"), pick a default category, then **Subir y
publicar en Supabase**. Files go to the public `room-images` bucket
(`rooms/<slug>/<uuid>-<name>`); accepted types are JPG/PNG/WEBP/AVIF up to
10 MB each. Upload a small batch at a time (a whole batch must stay under
~30 MB). New photos appear at the end of the list — set the cover/order after.

**Metadata:** alt text, category, order, cover (portada) and visible are
editable per photo, for both uploaded and existing photos.

**Source label:** each row shows "Subida a Supabase" (uploaded) or "Archivo
local" (the original seeded `/images/...` files).

**Delete ("Quitar de la galería"):** removes the DB row immediately and, for
uploaded photos, also deletes the Storage object. Original local files in the
repo are **never** deleted. There's a confirmation prompt.

**Cover (portada):** one per room. The cover leads the room card on
`/habitaciones` and the suite-page gallery. (The home page shows fixed sample
rooms from the static module and does not reflect Supabase photo edits.)

You can still add a photo by path with "Añadir foto" (an existing
`/images/...` path or a full `https://` URL) — useful for repo assets.

### Ratings
Airbnb-sourced. Update only by copying the current values from the public
Airbnb listing, and set the verification date. Never invent values or reviews;
they render attributed to Airbnb and are never marked up as structured-data
aggregateRating.

### Add a room
Catálogo → "+ Añadir habitación". Rooms are created **hidden**; complete every
card, then enable "Visible en el sitio público" in card 1. The slug cannot be
changed after creation (it is the public URL).

### Hide / delete
- **Ocultar**: removes from the public site, keeps everything editable.
- **Eliminar**: soft delete (sets `deleted_at`) — disappears from the admin
  list and the public site, but reservation history is preserved. Restoring
  requires SQL for now: `update rooms set deleted_at = null where slug = '…';`

### Reorder rooms
▲/▼ on the catalog list. Order applies to the public `/habitaciones` grid once
the site reads from Supabase.

## Going live with DB content

1. Verify every suite in the admin against the live pages.
2. Set `CATALOG_DATA_SOURCE=supabase` in Vercel and redeploy.
3. Public pages now serve DB content (cached up to 10 minutes; saves from the
   admin revalidate the affected pages immediately).
4. Rollback at any time: remove the flag and redeploy — the site instantly
   returns to the static catalog.

After flipping the flag, keep `src/data/listings.ts` as the frozen fallback;
new permanent content changes belong in the admin, not in the file.

## Out of scope here

Reservation/calendar management (future phase, pending the Airbnb iCal URLs),
payments (none on the site — Airbnb bookings pay on Airbnb, direct requests
are confirmed by WhatsApp), the LAZZAT project (unrelated — never touched by
this admin).

## If the catalog shows "Sin conexión con Supabase"

The env vars exist but the database rejected them ("Invalid API key" in the
Vercel logs). Almost always the keys belong to a previous/recreated Supabase
project: copy `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
`SUPABASE_SERVICE_ROLE_KEY` again from the **current** project (Dashboard →
Settings → API), update them in Vercel, and redeploy
(`docs/runbooks/admin-supabase-setup.md`, step 5).
