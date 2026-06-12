# Owner Admin Panel — Future Plan

Status: docs only. No admin UI is built in this branch.

## Required Owner Workflows

- See reservation requests by status.
- Approve, cancel, expire, or mark unavailable.
- Mark payment manually for offline payments.
- Create manual date blocks.
- Edit/delete manual blocks.
- See Airbnb iCal sync health per room.
- See last sync time, last status, and last error.
- Force a fresh Airbnb iCal import before confirming.
- Copy per-room website `.ics` export URLs for Airbnb import.
- Resend WhatsApp/email follow-ups.
- Edit prices once owner provides fixed nightly rates.

## Safety Rules

- Admin must require authentication.
- Public users never read guest PII directly.
- Airbnb iCal URLs and export feed token are secrets.
- Confirmed reservations and manual blocks must not overlap.
- Owner should cancel website request before Airbnb booking if conflict appears
  during the Airbnb pull-delay window.

## Suggested First Version

1. ~~Passwordless owner login through Supabase Auth.~~ Superseded (2026-06-11):
   username/password against env-var credentials, no Supabase Auth — see
   `docs/architecture/admin-mode.md`.
2. Requests table with filters: requested, pending payment, confirmed,
   cancelled, expired.
3. Manual block form.
4. Room sync panel.
5. Copy buttons for Airbnb import URLs.
6. Minimal audit trail of status changes.

## Later

- Culqi payment status panel.
- Email/WhatsApp templates.
- Price editor.
- Export CSV.
- Dashboard metrics: direct requests, conversion, blocked nights, conflicts.
