# La Casa de Roos — Website Project

Direct-booking website for **La Casa de Roos**: four suite/mini-apartment lofts in the historic center of Arequipa, Peru, currently sold via Airbnb (≈★4.85, 346 reviews across 4 listings).

**Status (2026-06-10):** Phase 1 web MVP scaffold is live on PR #1 (`feat/scaffold-web-mvp`) with Vercel preview deployments enabled. Production remains gated for `main` in `vercel.json`; no database, no payments, no domain purchase. Latest pass: real owner-sourced images (Carrd hero + four Airbnb listing covers, stored locally, temporary pending owner originals — see rights checklist) and an arequipa.com-faithful typography pass (all-Montserrat, 700/800 headings, rectangular primary CTAs).

Current MVP routes include home, habitaciones, four suite pages, reservar, contacto, privacidad, sitemap/robots, 404, and a new `/arequipa` guest guide based on public research rewritten for the site.

## Start here

1. [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) — what we're building and the core decisions
2. [`docs/roadmap/MVP_PLAN.md`](docs/roadmap/MVP_PLAN.md) — phased plan with exit criteria
3. [`docs/questions-for-owner.md`](docs/questions-for-owner.md) — Phase 0 blockers (ES + EN)

## Key decisions (TL;DR)

- **Sync:** two-way iCal with Airbnb (import 4 feeds, export 4 feeds) + **request-to-book** to neutralize Airbnb's ~2–3 h pull delay. Channel manager is the documented upgrade path, not the MVP.
- **Stack:** Next.js + TypeScript + Tailwind/shadcn on Vercel · Supabase Postgres · Resend email · `node-ical`/`ical-generator`.
- **Payments:** none at launch (Stripe unavailable in Peru); manual Yape/Plin/transfer flow. **Culqi** (owner's pick) researched in Phase 3 — needs account + RUC first.
- **Prices:** iCal syncs availability only — **no Airbnb price sync possible**. "Consultar precio" until owner fixes rates; channel manager is the future price-sync path.
- **Chat:** owner-requested web chat + admin replies parked in **Phase 2** (Supabase Realtime candidate), approval-gated; MVP ships request form + WhatsApp.
- **Photos:** extracted Airbnb URLs = preview placeholders only; production gates on owner originals (checklist in rights doc).
- **Domain:** `lacasaderoos.com` available ($11.25/yr via Vercel, checked 2026-06-10).

## Docs

```
docs/
├── PROJECT_BRIEF.md
├── questions-for-owner.md
├── research/        content-inventory · airbnb-calendar-sync-research · content-rights-checklist
│                    seo-strategy · tooling-audit · raw/ (extraction JSON)
├── architecture/    booking-calendar-options · booking-payment-architecture · recommended-stack
├── design/          design-direction
└── roadmap/         MVP_PLAN · github-vercel-plan
```
