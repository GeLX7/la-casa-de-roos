# Admin Mode — Architecture

Status: built in `feat/admin-catalog-foundation`. Fully functional only after the
Supabase project exists (see `docs/runbooks/admin-supabase-setup.md`); until then
every admin route renders a safe setup-needed state instead of crashing.

## What it is

A Supabase-backed owner panel at `/admin` for managing the catalog content that
today lives statically in `src/data/listings.ts`:

| Route | Purpose |
| --- | --- |
| `/admin` | Dashboard: stats cards, missing-setup warnings, iCal status, site/SEO status |
| `/admin/login` | Email + password login (Supabase Auth) |
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
src/lib/admin/supabase-admin.ts service-role PostgREST helper (server-only)
src/lib/admin/auth.ts          GoTrue REST login/session + admin_users allowlist gate
src/lib/admin/catalog.ts       admin reads (rooms + children) and dashboard stats
src/lib/admin/actions.ts       all server actions (every one calls requireAdmin())
src/lib/catalog/data.ts        PUBLIC data layer: getRooms()/getRoomBySlug() with static fallback
src/components/admin/*         cards, fields, stat/warning cards, submit buttons
src/app/admin/**               routes (login outside the (panel) group)
```

No new npm dependencies: Supabase REST + GoTrue are called with `fetch`, the
same dependency-free pattern as `src/lib/booking/repository.ts`.

## Authentication

- Supabase Auth (GoTrue) password grant via REST; the access token is stored in
  an `httpOnly`/`secure`/`SameSite=Lax` cookie (`lcr_admin_access`).
- Being a valid Supabase user is **not enough**: the user id must exist in the
  `admin_users` allowlist table (inserted manually — no signup flow exists).
- `requireAdmin()` re-verifies the token against `/auth/v1/user` and the
  allowlist on every page render **and** inside every server action (pages and
  layouts render concurrently in App Router, so the layout alone is not a gate).
- Sessions last as long as the Supabase JWT (default 1 h; can be raised in
  Supabase Auth settings). The refresh token is stored but silent refresh is a
  later step (needs a route handler — server components cannot set cookies).
- Without Supabase env vars there is nothing to authenticate against and
  nothing writable; admin pages then show only the setup-needed state.
- `/admin` carries `robots noindex` metadata and is disallowed in `robots.txt`.

## Database

Two migrations (prepared, **not applied** — owner approval required):

- `20260611143000_booking_calendar_foundation.sql` (PR #5): `rooms`,
  `calendar_sources`, `external_blocks`, `reservation_requests`,
  `manual_blocks`, `payment_intents`. RLS enabled, no policies → service-role-only.
- `20260611170000_admin_catalog_foundation.sql` (this branch): extends `rooms`
  with the catalog fields, adds `room_features`, `room_not_included`,
  `room_rules`, `room_images`, `room_ratings`, `admin_users`, an `is_admin()`
  helper, and RLS policies:
  - **anon/public**: `SELECT` only, and only active+non-deleted rooms with
    their enabled/active child content.
  - **authenticated admins** (`is_admin()`): full read/write on catalog tables.
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
- Silent session refresh; optional middleware/proxy pre-check for `/admin`.
- Switching home/sitemap/reservar to the catalog data layer, then flipping
  `CATALOG_DATA_SOURCE=supabase` after content verification.
