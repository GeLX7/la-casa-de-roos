# Booking Setup Checklist

Use this only after owner approval. Do not paste secrets into Git.

Scope note (2026-06-12): there is no payment step and no email step anywhere
in this flow. Airbnb handles payment for Airbnb bookings; direct website
inquiries are requested and confirmed by WhatsApp. What remains pending here
is only the Airbnb iCal calendar sync.

## 1. Create Supabase Project — DONE (2026-06-12)

- Project `la-casa-de-roos` exists (ref `eyzbjtcelekuczqobhau`).
- Project URL and anon key saved; service role key server-side only.

## 2. Apply Migration — DONE (2026-06-12)

- `supabase/migrations/20260611143000_booking_calendar_foundation.sql` and
  `20260611170000_admin_catalog_foundation.sql` applied.
- Tables exist: `rooms`, `calendar_sources`, `external_blocks`,
  `reservation_requests`, `manual_blocks`, `payment_intents` (dormant — no
  online payments; see `docs/architecture/culqi-payments.md`).
- RLS enabled.

## 3. Confirm Room Records — DONE (seeded)

The four room slugs exist in the database:

- `suite-queen-con-sala`
- `suite-queen-centro-historico`
- `suite-queen-con-vista`
- `mini-apartamento-familiar`

## 4. Add Env Vars

Add in Vercel (and local `.env.local` if developing against the DB):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BOOKING_ICAL_SECRET` (pending — set together with the iCal URLs)
- four `AIRBNB_ICAL_*` URLs (pending — owner provides)
- `NEXT_PUBLIC_SITE_URL=https://lacasaderoos.com`

⚠ All three Supabase values must come from the **current** project
(Dashboard → Settings → API). Keys from an older/recreated project produce
"Invalid API key" errors in the admin catalog.

## 5. Add Airbnb iCal Sources — PENDING (owner)

- Owner exports each private Airbnb iCal URL from the Airbnb host calendar.
- Add each URL to the matching env var.
- Add `calendar_sources` rows with env key names, not raw URLs.

## 6. Test Availability

Call:

`/api/availability?room=suite-queen-con-sala&start=YYYY-MM-DD&end=YYYY-MM-DD`

Confirm:

- blocked Airbnb dates return unavailable;
- open ranges return available;
- invalid date ranges return 400;
- no guest data appears.

## 7. Give Roos Airbnb Import URLs

For each room, use:

`https://lacasaderoos.com/api/ical/<roomSlug>?token=<BOOKING_ICAL_SECRET>`

Owner imports each website feed into the matching Airbnb listing. Rotate the
secret if the URL leaks.

## 8. Test Website Export Feeds

Create a confirmed test reservation or manual block. Fetch matching `.ics`.
Confirm event says only `Blocked - La Casa de Roos`.

## 9. Enable Booking Request Flow

- Direct inquiries already generate a prefilled WhatsApp message (live today).
- `POST /api/reservation-requests` is TEMPORARILY DISABLED (returns 503, stores
  nothing). Do not re-enable it until terms, privacy policy and security are approved.
- Keep manual WhatsApp confirmation copy — requests are never instant
  bookings, and there is no payment or email step.
- Do not launch instant booking until a channel-manager process is proven.
