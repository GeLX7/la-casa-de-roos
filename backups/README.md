# Backups

Local catalog backups live in `backups/local/` and are **gitignored** (never
committed — they mirror live Supabase data).

## What gets backed up

A timestamped JSON snapshot of the catalog tables from the live Supabase
project (`eyzbjtcelekuczqobhau`):

`rooms`, `room_features`, `room_not_included`, `room_rules`, `room_images`,
`room_ratings`, `calendar_sources`.

File: `backups/local/lacasaderoos-catalog-backup-<UTCtimestamp>.json`

## How the snapshot was taken (no data modified)

Read-only `SELECT … json_agg` per table via the Supabase SQL editor / MCP,
written to one JSON object. It never writes to the database.

## Full database backup (documented, run manually if needed)

Supabase keeps automatic daily backups (Dashboard → Database → Backups). For an
on-demand logical dump, use the connection string from
**Dashboard → Settings → Database → Connection string** (keep it secret, never
commit it):

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
