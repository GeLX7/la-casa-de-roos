# La Casa de Roos — Website Project

Direct-booking website for **La Casa de Roos**: four suite/mini-apartment lofts in the historic center of Arequipa, Peru, currently sold via Airbnb (≈★4.85, 346 reviews across 4 listings).

**Status (2026-06-11):** Marketing site is live and indexable at `https://lacasaderoos.com`. Phase 2 booking-calendar foundation is prepared in code, but booking sync is not live until Supabase credentials, four Airbnb iCal URLs, notification email, and owner approval are provided. No payments are live.

**Phase 2 Admin Mode:** a Supabase-backed owner panel at `/admin` (dashboard with stats + setup warnings, catalog management, per-room editor in 9 cards: basics, facts, description, features, not-included notes, house rules, gallery metadata, Airbnb ratings, calendar status). Admin login is username + password against env-var credentials (PBKDF2 hash + HMAC session cookie, `ENABLE_ADMIN_ROUTES` kill switch — no Supabase Auth). Migrations and a seed generated from the static catalog are prepared but **not applied** — the admin stays dark/setup-needed until its env vars exist, and the public site keeps serving `src/data/listings.ts` (the automatic fallback even after setup, behind the `CATALOG_DATA_SOURCE` flag). See `docs/architecture/admin-mode.md` and `docs/runbooks/admin-supabase-setup.md`.

Current MVP routes include home, habitaciones, four suite pages, reservar, contacto, privacidad, sitemap/robots, 404, and a new `/arequipa` guest guide based on public research rewritten for the site.

## Start here

1. [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) — what we're building and the core decisions
2. [`docs/roadmap/MVP_PLAN.md`](docs/roadmap/MVP_PLAN.md) — phased plan with exit criteria
3. [`docs/questions-for-owner.md`](docs/questions-for-owner.md) — Phase 0 blockers (ES + EN)

## Key decisions (TL;DR)

- **Sync:** two-way iCal with Airbnb (import 4 feeds, export 4 feeds) + **request-to-book** to neutralize Airbnb's ~2–3 h pull delay. Channel manager is the documented upgrade path, not the MVP.
- **Stack:** Next.js + TypeScript + Tailwind on Vercel · Supabase Postgres planned through SQL migrations and server-only API routes.
- **Payments:** none live. **Culqi** is documented for a later deposit/advance flow after keys, webhook secret, and policy are provided.
- **Prices:** iCal syncs availability only — **no Airbnb price sync possible**. "Consultar precio" until owner fixes rates; channel manager is the future price-sync path.
- **Chat:** owner-requested web chat + admin replies parked in **Phase 2** (Supabase Realtime candidate), approval-gated; MVP ships request form + WhatsApp.
- **Photos:** extracted Airbnb URLs = preview placeholders only; production gates on owner originals (checklist in rights doc).
- **Domain:** `lacasaderoos.com` live on Vercel; apex is canonical and `www` redirects to apex.

## Docs

```
docs/
├── PROJECT_BRIEF.md
├── questions-for-owner.md
├── research/        content-inventory · airbnb-calendar-sync-research · content-rights-checklist
│                    seo-strategy · tooling-audit · raw/ (extraction JSON)
├── architecture/    admin-mode · booking-calendar-options · booking-calendar-sync
│                    booking-payment-architecture · culqi-payments · owner-admin-panel
│                    recommended-stack
├── design/          design-direction
├── fixtures/        sample Airbnb iCal
├── runbooks/        booking setup checklist · admin-supabase-setup · catalog-management
└── roadmap/         MVP_PLAN · github-vercel-plan
```
