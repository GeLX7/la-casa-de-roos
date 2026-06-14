# La Casa de Roos — Website Project

Direct-booking website for **La Casa de Roos**: four suite/mini-apartment lofts in the historic center of Arequipa, Peru, currently sold via Airbnb (≈★4.85, 346 reviews across 4 listings).

**Status (2026-06-13):** Marketing site is live and indexable at `https://lacasaderoos.com`. Admin Mode is live and the public catalog is **Supabase-backed** (`CATALOG_DATA_SOURCE=supabase`): the owner edits rooms — including uploading photos to Supabase Storage — at `/admin`, and changes reach the live site after revalidation. `src/data/listings.ts` remains the automatic fallback on any Supabase error.

**Product scope (owner decision, 2026-06-12):** everything operational is **WhatsApp + Airbnb**. Airbnb is the booking/payment platform for Airbnb bookings; direct website inquiries open a prefilled WhatsApp message and the owner confirms personally. **No online payments (no Culqi), no email workflow.** Airbnb iCal calendar sync is the one pending feature — prepared in code, waiting only for the four private Airbnb iCal export URLs; until then availability is confirmed by WhatsApp.

**Admin Mode:** a Supabase-backed owner panel at `/admin` (dashboard with stats + setup warnings, catalog management, per-room editor in 9 cards: basics, facts, description, features, not-included notes, house rules, photo upload + gallery management (Supabase Storage), Airbnb ratings, calendar status). Admin login is username + password against env-var credentials (PBKDF2 hash + HMAC session cookie, `ENABLE_ADMIN_ROUTES` kill switch — no Supabase Auth). See `docs/architecture/admin-mode.md` and `docs/runbooks/admin-supabase-setup.md`.

Current MVP routes include home, habitaciones, four suite pages, reservar, contacto, privacidad, sitemap/robots, 404, and a new `/arequipa` guest guide based on public research rewritten for the site.

## Start here

1. [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) — what we're building and the core decisions
2. [`docs/roadmap/MVP_PLAN.md`](docs/roadmap/MVP_PLAN.md) — phased plan with exit criteria
3. [`docs/questions-for-owner.md`](docs/questions-for-owner.md) — Phase 0 blockers (ES + EN)

## Key decisions (TL;DR)

- **Sync:** two-way iCal with Airbnb (import 4 feeds, export 4 feeds) + **request-to-book** to neutralize Airbnb's ~2–3 h pull delay. Pending the owner's four iCal URLs; channel manager is the documented upgrade path, not the MVP.
- **Stack:** Next.js + TypeScript + Tailwind on Vercel · Supabase Postgres through SQL migrations and server-only API routes.
- **Payments:** **none — removed from the product.** Airbnb collects for Airbnb bookings; direct reservations are confirmed by WhatsApp with no online checkout. Culqi exploration is archived as a historical note (`docs/architecture/culqi-payments.md`). No email workflow either: WhatsApp is the only direct channel.
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
