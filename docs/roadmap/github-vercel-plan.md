# GitHub & Vercel Plan

2026-06-10. **Nothing created yet — awaiting explicit approval.**

## GitHub

- **Repo:** `GeLX7/la-casa-de-roos` (kebab-case; `gh` CLI already authenticated). **Private** (booking logic + content; site itself is the public artifact).
- **Branches:** `main` = production, short-lived feature branches → PR → squash-merge. Solo-dev friendly; no develop branch. Protect `main` (PRs required) once Phase 2 logic lands.
- **PR hygiene:** Vercel preview link auto-comments; CI = typecheck + lint + build (GitHub Actions free tier). Optional: scheduled action every 15 min as free iCal-refresh trigger (see stack doc).

## Vercel

- Project `la-casa-de-roos` linked to the repo; framework preset Next.js; **Hobby plan suffices for launch** (mind: crons = 1×/day → lazy refresh design already accounts for it). Upgrade trigger: need minute-crons or team features.
- **Preview** on every PR; **production** on `main`. Rolling release features unnecessary at this scale.
- Config via `vercel.ts` (`@vercel/config`) when scaffolding: one daily cron (`/api/cron/refresh-calendars`), security headers, image domains.

## Domain

- `lacasaderoos.com` — **available, $11.25/yr via Vercel** (checked 2026-06-10; `casaderoos.com` also free). Recommend buying in owner-controlled account; attach to Vercel project; `www` → apex redirect.
- Optional `.pe` later through a Peruvian registrar (punto.pe partners; Vercel couldn't price it) → 301 to `.com`.
- Email DNS for Resend (DKIM/SPF on `lacasaderoos.com`, sender `reservas@`).

## Environment variables (planned)

| Var | Scope | Notes |
|---|---|---|
| `DATABASE_URL` / `SUPABASE_URL` + `SUPABASE_ANON_KEY` | all | Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | admin ops, never client |
| `RESEND_API_KEY` | server | email |
| `AIRBNB_ICAL_URL_SUITE_1..4` | server, **secret** | private export URLs from owner |
| `ICAL_FEED_TOKEN` | server | token guarding our exported feeds |
| `CRON_SECRET` | server | protects refresh endpoint |
| `NEXT_PUBLIC_SITE_URL` | all | canonical/OG |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | all | `51967757040` (already public) |
| `ADMIN_EMAIL` | server | owner notification target |

Manage with `vercel env` + `.env.local` pulled via `vercel env pull`; never commit secrets; iCal URLs rotate if leaked (re-export in Airbnb).

## Workflow once approved

1. `gh repo create` (private) → scaffold → first push → `vercel link` + import repo in Vercel
2. Set env vars (placeholders until owner sends iCal URLs)
3. PR-driven development; owner reviews preview URLs on phone (WhatsApp the links)
4. Domain purchase + attach + GSC verification at Phase 1 launch
