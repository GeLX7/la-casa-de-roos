# Culqi Payments — Removed From Active Scope

**Status: not planned (owner decision, 2026-06-12).** The site processes no
online payments. Airbnb remains the booking/payment platform for Airbnb
bookings, and direct website inquiries are requested and confirmed through
WhatsApp. There is no Culqi account, no Culqi keys, no payment UI, and no
payment environment variables.

This file is kept only as a historical record of the Phase 3 exploration
(2026-06-10) so the context is not lost if online payments are ever
reconsidered. The original research lives in
`docs/architecture/booking-payment-architecture.md` (also marked historical).

## What remains in the codebase (dormant, intentionally)

- The `payment_intents` table exists in
  `supabase/migrations/20260611143000_booking_calendar_foundation.sql` and in
  the live database. It is empty, service-role-only (RLS, no policies), and
  nothing reads or writes it. It stays because dropping live schema is a
  destructive change with no benefit; if it is ever removed, that is a separate
  approved migration.
- `reservation_requests.payment_status` (always `"none"`) and the
  `pending_payment` status value exist for the same reason. Website requests
  only use `requested` / `confirmed` / `cancelled`.
- No Culqi env vars exist in `.env.example`, Vercel, or the admin setup
  warnings.

## If payments are ever reconsidered

Treat it as a new project: provider evaluation (Culqi required RUC onboarding —
see the historical research), deposit/refund policy, and explicit owner
approval would all need to happen first. Nothing in the current site assumes
or prepares for it beyond the dormant schema above.
