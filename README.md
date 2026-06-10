# La Casa de Roos — Website Project

Direct-booking website for **La Casa de Roos**: four suite/mini-apartment lofts in the historic center of Arequipa, Peru, currently sold via Airbnb (≈★4.85, 346 reviews across 4 listings).

**Status (2026-06-10):** research & planning complete. No app code, no GitHub repo, no Vercel project, no database yet — implementation starts after owner sign-off (see `docs/questions-for-owner.md`).

## Start here

1. [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) — what we're building and the core decisions
2. [`docs/roadmap/MVP_PLAN.md`](docs/roadmap/MVP_PLAN.md) — phased plan with exit criteria
3. [`docs/questions-for-owner.md`](docs/questions-for-owner.md) — Phase 0 blockers (ES + EN)

## Key decisions (TL;DR)

- **Sync:** two-way iCal with Airbnb (import 4 feeds, export 4 feeds) + **request-to-book** to neutralize Airbnb's ~2–3 h pull delay. Channel manager is the documented upgrade path, not the MVP.
- **Stack:** Next.js + TypeScript + Tailwind/shadcn on Vercel · Supabase Postgres · Resend email · `node-ical`/`ical-generator`.
- **Payments:** none at launch (Stripe unavailable in Peru); Yape/Plin/Mercado Pago-link manual flow, Culqi/MP Checkout in Phase 3.
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
