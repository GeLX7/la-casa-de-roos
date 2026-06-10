# Recommended Stack

2026-06-10. Constraints: GitHub + Vercel fixed; premium mobile-first site; SEO matters; booking/calendar reliability matters; one developer; tiny budget.

## Core

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (latest stable, App Router) + TypeScript** | SSG/ISR for SEO-critical pages, server components, Metadata API, sitemap/robots built-in, first-class Vercel target |
| Styling | **Tailwind CSS v4 + shadcn/ui** | Fast premium UI; calendar/date-picker primitives (`react-day-picker` under shadcn Calendar) |
| Database | **Supabase (Postgres + Auth + RLS)** | Free tier fits; daterange + exclusion constraints (perfect for bookings); owner-auth for `/admin`; Supabase MCP already connected locally |
| ORM | **Drizzle** (or supabase-js only, if schema stays tiny) | Typed schema + migrations in repo; Drizzle plays well with Vercel Fluid Compute |
| Email | **Resend + React Email** | Free 3k/mo, trivial DX, domain DKIM on lacasaderoos.com |
| iCal | **`node-ical`** (parse Airbnb export, v0.26.x) + **`ical-generator`** (serve our feeds, v11.x) | Both current and maintained (verified on npm 2026-06-10) |
| Dates | `date-fns` + `@date-fns/tz` | Lightweight; America/Lima everywhere |
| Validation | `zod` | Form + API payloads |
| Analytics | **Vercel Analytics** + Google Search Console | Zero-config; GSC MCP already available locally for later |
| Images | Owner originals in repo `/public` via `next/image` at launch (≈90 curated photos max) | Free, fast, versioned. Move to Supabase Storage or Cloudinary (MCP available) only if owner needs self-serve uploads |
| CMS | **None at MVP** — content as typed TS/MDX in repo | 4 rooms, rarely changes; owner edits via WhatsApp→dev. Revisit (Sanity/Payload) only if owner wants self-editing |
| i18n | `next-intl`, `es` only at launch, `en` structure-ready | Spanish-first requirement |
| Maps | Google Maps embed (free iframe) or static map image | Owner already shares a Maps pin |

## Availability refresh without paid cron

Vercel **Hobby crons run once per day max** ([docs](https://vercel.com/docs/cron-jobs/usage-and-pricing)); minute-level needs Pro. So:

- **Primary: lazy revalidation** — availability endpoint checks `airbnb_blocks.fetched_at`; if older than ~15 min, re-fetch that room's Airbnb iCal inline (feeds are tiny). Scales with real traffic, zero infra.
- **Floor: one daily Vercel cron** keeps caches warm and emails the owner on fetch failures.
- Optional free upgrade: GitHub Actions schedule (every 15 min) hitting a secured refresh endpoint. Move to Vercel Pro crons only if needed.

## Booking flow tech (Phase 1–2)

Server Actions for the request form → insert `pending` booking → Resend emails → admin confirms → exclusion constraint + fresh iCal pull guard → `/api/ical/[room].ics?token=…` reflects it immediately.

## Repo shape (when implementation is approved)

```
app/            (routes: /, /habitaciones/[slug], /ubicacion, /contacto, /admin, /api/ical/[room])
components/  lib/ (ical, availability, supabase, email)  content/ (rooms.ts, copy)  drizzle/  docs/
```

## Rejected alternatives (short)

- **Booking SaaS widget (Lodgify et al.) at launch** — monthly cost + generic UX before validating direct demand; clean upgrade path documented instead.
- **WordPress + plugins** — hosting/maintenance burden, weaker Vercel story.
- **Vercel Postgres/KV** — discontinued as first-party; Marketplace Neon is fine but Supabase bundles auth + storage we'll use.
- **Stripe** — unavailable in Peru (see booking-payment-architecture.md).
- **Astro** — great for static, but booking flow + admin pushes toward Next.js anyway.
