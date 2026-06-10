# MVP Plan — La Casa de Roos

2026-06-10. Phases gated by owner inputs (see `../questions-for-owner.md`). Estimates assume one developer part-time.

## Phase 0 — Inputs & approvals (owner, ~1 week calendar time)

- [ ] Owner answers questions doc (prices, policies, address publication, naming)
- [ ] Owner sends original photos (per room: 8–12 best) + logo/brand assets if any
- [ ] Owner copies the 4 Airbnb iCal **export** URLs from the host dashboard
- [ ] Decide domain (`lacasaderoos.com` available, $11.25/yr via Vercel) — who buys/owns it (recommend: owner's account, dev as collaborator)
- [ ] User approves: create GitHub repo + Vercel project

**Exit:** content pack complete, repo approved.

## Phase 1 — Premium static site + availability display (≈1–1.5 weeks dev)

- Next.js scaffold per `../architecture/recommended-stack.md`; GitHub repo; Vercel previews
- Pages: home, 4 room pages, ubicación, contacto, FAQ — full design per `../design/design-direction.md`, Spanish copy (rewritten, owner-approved)
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

**Exit criteria:** test booking on website blocks Airbnb within one Airbnb pull cycle (~≤3 h); double-booking guards verified by test; owner can operate admin from phone.

## Phase 3 — Money & polish (later, on demand)

Deposit/full payment via **Culqi or Mercado Pago Checkout** · cancellation policy pages · English locale (`next-intl`) · testimonials collected directly (then review schema) · blog/guías Arequipa · WhatsApp Cloud API notifications.

## Phase 4 — Scale decision point

Re-evaluate channel manager (Smoobu/Beds24/Hospitable class) when: double-booking near-misses, >30 % direct share, Booking.com expansion, or dynamic pricing needs. Site UI survives; only the availability backend swaps.

## Risk register (top 3)

1. **Double booking in Airbnb-pull window** → request-to-book + confirm-time re-pull + owner cancels website side if ever caught (never the Airbnb side). Residual: low.
2. **Owner response latency kills conversions** → WhatsApp-first alerts, 24 h auto-expiry with apologetic email, FAB fallback everywhere.
3. **Photo rights/quality gap** → Phase 0 blocks launch until originals arrive; offer a phone-shooting checklist if originals are weak.
