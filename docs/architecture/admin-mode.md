# Admin Mode — Architecture

Status: foundation built in `feat/admin-catalog-foundation`; auth switched to
username/password env credentials in `feat/admin-username-auth`. Every `/admin`
route stays disabled (redirects home) until `ENABLE_ADMIN_ROUTES=true`; login
works once the admin credential env vars exist, and catalog editing becomes
available after the Supabase project exists
(`docs/runbooks/admin-supabase-setup.md`). Missing pieces always render a safe
setup-needed state instead of crashing.

## What it is

A Supabase-backed owner panel at `/admin` for managing the catalog content that
today lives statically in `src/data/listings.ts`:

| Route | Purpose |
| --- | --- |
| `/admin` | Dashboard: stats cards, missing-setup warnings, iCal status, site/SEO status |
| `/admin/login` | Username + password login (env credentials, no Supabase Auth) |
| `/admin/catalogo` | Room list: add, edit, reorder, hide/show, soft delete |
| `/admin/catalogo/nuevo` | Create a room (created hidden; slug locked after creation) |
| `/admin/catalogo/[slug]` | Room editor, organized in 9 cards |

The room editor cards mirror the sections of the public suite page:

1. **Información básica** — title, subtitle, slug (read-only), Airbnb URL/ID, price label, active, guest-favorite badge
2. **Datos principales** — max guests, beds, bathroom, check-in/out, quiet hours
3. **Descripción** — section title, short description, long paragraphs (blank-line separated), optional SEO title/meta
4. **¿Qué incluye?** — repeatable features with icon key, visible toggle, order
5. **Para que lo sepas antes de reservar** — repeatable not-included notes
6. **Normas de la casa** — repeatable rules
7. **Fotos** — gallery metadata: src path, alt, category (Sala/Habitación/Cocina/Baño/Áreas comunes/Entorno/Detalles), order, cover, visible. No file upload yet (see "Later phases")
8. **Calificaciones** — Airbnb-sourced overall + per-category scores, marked "update carefully"; never schema.org aggregateRating, no fake reviews
9. **Calendario** — per-room Airbnb iCal env status, last sync (from `calendar_sources`), website `.ics` export URL preview

## Layers

```
src/lib/admin/config.ts        env detection + missing-setup warnings
src/lib/admin/credentials.ts   pure crypto: PBKDF2 hash + HMAC session value (node:crypto only)
src/lib/admin/auth.ts          username/password sign-in, session cookie, requireAdmin gate
src/lib/admin/rate-limit.ts    in-memory login rate limiter
src/lib/admin/supabase-admin.ts service-role PostgREST helper (server-only)
src/lib/admin/catalog.ts       admin reads (rooms + children) and dashboard stats
src/lib/admin/actions.ts       all server actions (every one calls requireAdmin())
src/lib/catalog/data.ts        PUBLIC data layer: getRooms()/getRoomBySlug() with static fallback
src/components/admin/*         cards, fields, stat/warning cards, submit buttons
src/app/admin/**               routes (login outside the (panel) group)
src/proxy.ts                   kill switch + cookie-presence pre-check for /admin/*
scripts/hash-admin-password.mjs local generator for ADMIN_PASSWORD_HASH
```

No npm dependencies: Supabase REST is called with `fetch` and all auth crypto
is `node:crypto`, the same dependency-free pattern as
`src/lib/booking/repository.ts`.

## Authentication

Username + password against **env-var credentials** — Supabase Auth is not
used (pattern adapted conceptually from the LAZZAT admin). Supabase only
stores catalog/booking data.

- Env vars: `ENABLE_ADMIN_ROUTES` (kill switch), `ADMIN_USERNAME`,
  `ADMIN_PASSWORD_HASH` (salted PBKDF2-SHA256, 210k iterations, format
  `pbkdf2$iter$digest$salt$hash`), `ADMIN_SESSION_SECRET` (≥32 chars).
- The plaintext password and its hash never live in the repo or the database.
  The hash is generated locally with `scripts/hash-admin-password.mjs` and
  stored only as a server env var.
- Login is a server action: constant-time PBKDF2 verification (with a
  timing-equalizer burn when the username is wrong) plus an in-memory rate
  limit of 5 attempts / 10 minutes / IP. Failures log IP + reason only.
- Session: stateless HMAC-SHA256-signed value
  (`username.expiresAt.signature`) in an `httpOnly`/`secure`/`SameSite=Lax`
  cookie (`lcr_admin_session`), 8 h TTL. No server-side session store; being
  stateless, individual sessions cannot be revoked early — rotating
  `ADMIN_SESSION_SECRET` (or `ADMIN_USERNAME`) invalidates all of them
  instantly.
- `requireAdmin()` verifies the cookie locally (no network) on every page
  render **and** inside every server action (pages and layouts render
  concurrently in App Router, so the layout alone is not a gate).
- `src/proxy.ts` adds a cheap pre-check on `/admin/:path*`: while
  `ENABLE_ADMIN_ROUTES` ≠ `"true"` every admin route (login included)
  redirects home; otherwise requests without the session cookie redirect to
  `/admin/login`. Presence-only — the authoritative verification stays
  server-side.
- With credentials missing (and the kill switch on, e.g. locally) admin pages
  show only the setup-needed state; nothing is writable.
- `/admin` carries `robots noindex/nofollow/nocache` metadata and is
  disallowed in `robots.txt`.

## Database

Two migrations (prepared, **not applied** — owner approval required):

- `20260611143000_booking_calendar_foundation.sql` (PR #5): `rooms`,
  `calendar_sources`, `external_blocks`, `reservation_requests`,
  `manual_blocks`, `payment_intents`. RLS enabled, no policies → service-role-only.
- `20260611170000_admin_catalog_foundation.sql`: extends `rooms` with the
  catalog fields and adds `room_features`, `room_not_included`, `room_rules`,
  `room_images`, `room_ratings`, with RLS:
  - **anon/public**: `SELECT` only, and only active+non-deleted rooms with
    their enabled/active child content.
  - **no write policies at all**: every write reaches Postgres exclusively
    through server-side code using the service role (which bypasses RLS)
    *after* `requireAdmin()` has verified the admin session. There is no
    admin role inside the database because admin auth is env-based.
  - guest-PII/booking tables stay service-role-only.
  - The service role key is used exclusively server-side (`SUPABASE_SERVICE_ROLE_KEY`
    has no `NEXT_PUBLIC_` prefix and is only read in `src/lib/admin/*` / `src/lib/booking/*`).

Seed: `scripts/seed-rooms.ts` regenerates `supabase/seed/admin_catalog_seed.sql`
from `src/data/listings.ts` (rooms, features, notes, rules, ~90 gallery images,
ratings, calendar source env-key refs). Deleting a room from the admin is a
soft delete (`deleted_at`), so reservation history survives.

## Public site safety model

The live marketing site keeps working with zero configuration:

1. `getRooms()`/`getRoomBySlug()` serve `src/data/listings.ts` by default.
2. Supabase reads activate **only** when `CATALOG_DATA_SOURCE=supabase` is set
   *and* the URL + anon key exist — adding Supabase credentials for the booking
   foundation can never silently swap the content source.
3. Any Supabase error falls back to the static catalog (and logs server-side).
4. Supabase reads use the anon key + RLS (never the service role) and cache for
   10 minutes; admin actions call `revalidatePath` on the public routes.
5. `/habitaciones` and `/habitaciones/[slug]` are the only public routes wired
   through the data layer so far. Home, `/reservar` and the sitemap still read
   the static module directly — they only use stable fields (slug, names), and
   switching them is listed under later phases.

## Stats

`getAdminStats()` returns live counts (rooms, reservation requests by status,
imported/manual blocks, weighted Airbnb rating) when Supabase is configured,
and static-listing-derived values otherwise — with `live: false` so the
dashboard labels DB-only numbers as "available after Supabase setup".

## Later phases (intentionally not built)

- Image upload via Supabase Storage (schema already accepts absolute URLs).
- Reservation request management UI (approve/cancel) — tables exist from PR #5.
- iCal import job + sync status writes; Culqi payments; notification email.
- Persistent audit log of admin logins/edits (LAZZAT-style `recordAuditLog`).
- Switching home/sitemap/reservar to the catalog data layer, then flipping
  `CATALOG_DATA_SOURCE=supabase` after content verification.
