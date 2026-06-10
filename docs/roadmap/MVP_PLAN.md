# MVP Plan — La Casa de Roos

2026-06-10. Phases gated by owner inputs (see `../questions-for-owner.md`). Estimates assume one developer part-time.

## Phase 0 — Inputs & approvals (owner, ~1 week calendar time)

- [x] Owner answered questions doc (2026-06-10 — Resolution log in `../questions-for-owner.md`)
- [x] Repo `GeLX7/la-casa-de-roos` + Vercel project `la-casa-de-roos` created; git deploys disabled via `vercel.json` until scaffold
- [x] Domain approved: `lacasaderoos.com` — purchase deferred to launch
- [ ] 🔑 Owner: exact street address · notification email · cancellation preset + min/max stay ("same as Airbnb" — need concrete values) · fixed nightly prices (else launch with "Consultar precio")
- [ ] 🔑 Owner: 4 Airbnb iCal export URLs (needed before sync goes live in Phase 2, not before scaffold)
- [ ] Owner: original photos + logo files (checklist in `../research/content-rights-checklist.md`); extracted Airbnb URLs are preview-only placeholders meanwhile

**Exit:** scaffold can start now — launch gates on photos, address, policies.

## Phase 1 — Premium static site + availability display (≈1–1.5 weeks dev)

- Next.js scaffold per `../architecture/recommended-stack.md`; GitHub repo; Vercel previews
- Pages: home, 4 room pages (**Airbnb title as H1, Carrd suite name as subtitle** — owner decision), ubicación, contacto, FAQ — full design per `../design/design-direction.md`, Spanish copy (rewritten, owner-approved)
- Prices: **"Consultar precio"** per room until owner provides fixed rates (no Airbnb price sync — iCal is availability-only, see `../architecture/booking-calendar-options.md`); photos: Airbnb-URL placeholders in previews only, swapped for owner originals before the production domain goes live
- Supabase project (free tier): `rooms`, `airbnb_blocks` cache; lazy iCal import of the 4 Airbnb feeds (read-only)
- **Read-only availability calendar** per room (Airbnb blocks visible)
- Booking CTA = WhatsApp deep link with prefilled room/dates + simple request form → Resend email to owner (no admin UI yet; owner replies via WhatsApp/email)
- SEO baseline: metadata, OG images, sitemap, robots, JSON-LD (LodgingBusiness + Accommodation), Vercel Analytics
- Launch on production domain; submit to Google Search Console; update Carrd/Instagram bios to point at the new site

**Exit criteria:** Lighthouse ≥ 90 mobile (perf/SEO/a11y), all 4 calendars mirror Airbnb within 15 min, form → owner email < 1 min.

## Phase 2 — Real request-to-book loop (≈1 week dev)

- `bookings` table + states (`pending → confirmed/declined/expired`), exclusion constraint
- `/admin` (Supabase Auth, owner-only): request list, one-click confirm/decline, manual date blocks
- Confirmation guard: forced fresh Airbnb iCal pull at confirm time
- **Per-room iCal export feeds** (`/api/ical/[room].ics?token=…`); owner imports into the 4 Airbnb listings → two-way sync live
- Email set: guest receipt, owner alert, confirmation/decline (React Email, ES)
- Payment instructions on confirmation (Yape/Plin/transfer/Mercado Pago link) — manual, no integration
- **Web chat + admin replies (owner request — approval-gated, do not build without explicit go):** candidate = Supabase Realtime (or a simple messages table + polling) behind the existing admin auth. Sizing/risk: message storage + retention/privacy policy, spam & abuse protection (rate limiting + captcha), owner notifications (email/WhatsApp ping), mobile-usable admin inbox — adds roughly +1 week to Phase 2. WhatsApp FAB already covers the need at launch

**Exit criteria:** test booking on website blocks Airbnb within one Airbnb pull cycle (~≤3 h); double-booking guards verified by test; owner can operate admin from phone.

## Phase 3 — Money & polish (later, on demand)

**Culqi research + onboarding first** (owner's chosen provider, 2026-06-10; no account/API yet; ⚠️ business onboarding generally needs a RUC — owner has none; fallback: Mercado Pago) → then deposit/full payment · cancellation policy pages · English locale (`next-intl`) · **on-site review collection** (owner wants reviews on the web; verbatim Airbnb quotes only with per-guest permission) · blog/guías Arequipa · WhatsApp Cloud API notifications. No payment implementation before provider account + API keys exist.

## Phase 4 — Scale decision point

Re-evaluate channel manager (Smoobu/Beds24/Hospitable class) when: double-booking near-misses, >30 % direct share, Booking.com expansion, or dynamic pricing needs. Site UI survives; only the availability backend swaps.

## Risk register (top 3)

1. **Double booking in Airbnb-pull window** → request-to-book + confirm-time re-pull + owner cancels website side if ever caught (never the Airbnb side). Residual: low.
2. **Owner response latency kills conversions** → WhatsApp-first alerts, 24 h auto-expiry with apologetic email, FAB fallback everywhere.
3. **Photo rights/quality gap** → launch gated on owner originals (or explicit approval of extracted copies); checklist ready in rights doc; offer a phone-shooting guide if originals are weak.
4. **Price expectation gap** → owner assumes Airbnb price sync; iCal can't do it. Mitigation: "Consultar precio" until fixed rates, no parity promises in UI copy, channel manager documented as the price-sync upgrade.
