# Backups

Local catalog backups live in `backups/local/` and are **gitignored** (never
committed — they mirror live Supabase data).

## What gets backed up

A timestamped JSON snapshot of the catalog tables from the live Supabase
project (`eyzbjtcelekuczqobhau`):

`rooms`, `room_features`, `room_not_included`, `room_rules`, `room_images`,
`room_ratings`, `calendar_sources`.

File: `backups/local/lacasaderoos-catalog-backup-<UTCtimestamp>.json`

## How the snapshot is taken (no data modified)

`scripts/backup-catalog.mjs` reads each table (GET only) and writes one JSON
object. Earlier snapshots were taken with read-only `SELECT … json_agg`. It
never writes to the database.

## Rutina de respaldo (manual)

El proyecto de Supabase está en el plan **free**, que **no incluye copias de
seguridad automáticas diarias** (llegan con el plan Pro). La protección actual
es la exportación manual:

- **Cuándo:** una vez por semana y siempre **antes** de un cambio grande
  (importar fotos, cambiar slugs, editar varias habitaciones, correr SQL).
- **Cómo:** `node scripts/backup-catalog.mjs` con `SUPABASE_URL` (o
  `NEXT_PUBLIC_SUPABASE_URL`) y `SUPABASE_SERVICE_ROLE_KEY` en el entorno
  local. Solo lee (GET); no modifica nada. Genera el JSON en `backups/local/`.
- **Dónde guardarlo:** copiar el archivo a una carpeta privada fuera del
  repositorio (por ejemplo Google Drive privado). Puede contener enlaces iCal:
  no compartirlo ni subirlo a GitHub.
- **Revisión:** abrir el JSON y comprobar que cada tabla tiene filas.
- Si el sitio llegara a guardar reservas, solicitudes o pagos, pasar a
  Supabase Pro (backups diarios) antes de activarlo.

## Volcado completo (opcional, manual)

Para un volcado lógico completo usa la cadena de conexión de
**Dashboard → Settings → Database → Connection string** (secreta, nunca se
sube al repo):

```bash
# Schema + data, custom format (restore with pg_restore):
pg_dump "$SUPABASE_DB_URL" -Fc -f backups/local/full-db-$(date -u +%Y%m%dT%H%M%SZ).dump

# Catalog tables only, plain SQL:
pg_dump "$SUPABASE_DB_URL" --data-only \
  -t public.rooms -t public.room_features -t public.room_not_included \
  -t public.room_rules -t public.room_images -t public.room_ratings \
  -t public.calendar_sources \
  -f backups/local/catalog-$(date -u +%Y%m%dT%H%M%SZ).sql
```

## Restore from the JSON snapshot (manual)

The JSON is grouped by table with full rows (including ids). To restore a single
room's content after a bad edit, locate it by `slug`/`room_id` in the snapshot
and `UPDATE`/`INSERT` the affected rows via the SQL editor. There is no
automated restore script — this snapshot exists so a mistaken edit can be undone
by hand. Rooms use soft delete (`deleted_at`), so a "deleted" room is recovered
with `update rooms set deleted_at = null where slug = '…'`.
