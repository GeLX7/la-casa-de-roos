# Booking Setup Checklist

Use this only after owner approval. Do not paste secrets into Git.

## 1. Create Supabase Project

- Create Supabase project.
- Save project URL and anon key.
- Save service role key server-side only.

## 2. Apply Migration

- Run `supabase/migrations/20260611143000_booking_calendar_foundation.sql`.
- Confirm tables exist: `rooms`, `calendar_sources`, `external_blocks`,
  `reservation_requests`, `manual_blocks`, `payment_intents`.
- Confirm RLS is enabled.

## 3. Confirm Room Records

Migration seeds current four room slugs:

- `suite-queen-con-sala`
- `suite-queen-centro-historico`
- `suite-queen-con-vista`
- `mini-apartamento-familiar`

## 4. Add Env Vars

Add in Vercel and local `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BOOKING_ADMIN_EMAIL`
- `BOOKING_ICAL_SECRET`
- four `AIRBNB_ICAL_*` URLs
- `NEXT_PUBLIC_SITE_URL=https://lacasaderoos.com`

## 5. Add Airbnb iCal Sources

- Owner exports each private Airbnb iCal URL from Airbnb host calendar.
- Add each URL to the matching env var.
- Add `calendar_sources` rows with env key names, not raw public display.

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

## 9. Configure Culqi Later

Only after owner provides:

- Culqi public/private keys;
- webhook secret;
- deposit policy;
- refund/cancellation policy.

Use sandbox first. Confirm webhook sets payment status before any reservation
status becomes final.

## 10. Enable Booking Request Flow

- Turn on DB-backed `POST /api/reservation-requests`.
- Send owner notification email.
- Keep WhatsApp fallback.
- Keep manual confirmation copy.
- Do not launch instant booking until channel-manager/payment process is proven.
