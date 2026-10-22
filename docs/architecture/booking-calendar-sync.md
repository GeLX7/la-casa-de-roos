# Booking Calendar Sync — Future Feature (iCal pending)

Status: prepared in code, **not active**. The only missing inputs are the four
private Airbnb iCal export URLs (owner provides) plus `BOOKING_ICAL_SECRET`.
Until then, availability is confirmed personally by WhatsApp — the live
request form already works that way. There is no payment or email step in
this design: Airbnb handles payment for Airbnb bookings, and direct requests
are confirmed through WhatsApp (owner decision, 2026-06-12).

## Why iCal

Airbnb exposes per-listing calendar import/export through the iCalendar
standard. It does not provide a public host API for direct real-time calendar
sync unless the host uses an approved PMS/channel manager. For La Casa de Roos,
iCal is the safest MVP because it is official, free, per-room, and reversible.

## Import Model

Airbnb listing -> private Airbnb iCal export URL -> website calendar import.

Each room will have one server-only env var:

- `AIRBNB_ICAL_ROOS_CORAZON`
- `AIRBNB_ICAL_ROOS_CENTRO`
- `AIRBNB_ICAL_ROOS_VISTA`
- `AIRBNB_ICAL_ROOS_FAMILIAR`
- `AIRBNB_ICAL_ROOS_MINI_CENTRO`

The website parses all-day iCal events into unavailable date ranges and stores
them in `external_blocks`. Public users never see the raw Airbnb URL.

## Export Model

Confirmed web reservations and manual owner blocks -> website `.ics` feed ->
Airbnb imports that feed.

The feed route is prepared as:

`/api/ical/[roomSlug]?token=BOOKING_ICAL_SECRET`

It is disabled until `BOOKING_ICAL_SECRET` and Supabase server credentials are
configured. Feed events use generic text: `Blocked - La Casa de Roos`. Guest
name, email, phone, and message never enter the exported `.ics`.

## Refresh Delay And Double-Booking Risk

Airbnb pulls imported calendars on its own schedule, often every few hours.
That means a website-confirmed booking can take time to block on Airbnb. This
site must not promise instant two-way sync.

Safe launch rule: keep request-to-book. A guest submits dates, Roos checks
availability, then confirms manually. At confirmation time the system should
refresh Airbnb iCal again and then create/confirm the website reservation.

## Failure Behavior

- If Supabase env vars are missing, availability API returns a disabled state.
- If Airbnb iCal URL is missing, that room remains manual-confirmation only.
- If Airbnb fetch fails, owner confirmation remains required and UI must stay
  conservative.
- If website `.ics` secret is missing, export route returns disabled status.
- If overlap checks fail, reservation remains unconfirmed and owner resolves it.

## Manual Override Needs

Owner/admin will need a way to:

- block dates manually;
- edit/cancel blocks;
- confirm/cancel reservation requests;
- see last iCal sync status per room;
- force a fresh iCal sync before confirming;
- rotate Airbnb iCal URLs and website export secret if leaked.

## Upgrade Path

This phase uses iCal + request-to-book. Upgrade when volume or risk demands:

1. PMS/channel manager such as Smoobu, Beds24, Hospitable, Lodgify, Hostaway.
2. Admin dashboard additions: sync health, manual blocks, reservation request
   management.

(Online payments are not on the roadmap — see
`docs/architecture/culqi-payments.md`.)

## Prepared Code

- `src/lib/booking/ical.ts`: parse Airbnb iCal, generate website `.ics`.
- `src/lib/booking/availability.ts`: combine imported/stored blocks.
- `src/app/api/availability/route.ts`: read-only availability endpoint.
- `src/app/api/reservation-requests/route.ts`: disabled-safe request endpoint.
- `src/app/api/ical/[roomSlug]/route.ts`: protected website export feed.
- `supabase/migrations/20260611143000_booking_calendar_foundation.sql`: schema.

## Caché de disponibilidad (5 minutos)

- El calendario de Airbnb de cada alojamiento se guarda en memoria hasta 5 minutos (`AVAILABILITY_CACHE_TTL_SECONDS`, opcional, 0–600; 0 la desactiva).
- Solo una lectura reciente puede dar "available". Si al vencer no se puede refrescar, los bloqueos viejos solo sirven para decir "no disponible" (hasta 1 hora); nunca para confirmar disponibilidad.
- Los errores se recuerdan solo 30 segundos. Cambiar la variable del enlace en Vercel invalida la caché (se compara un hash; el enlace no se guarda).
- `checkedAt` indica cuándo se leyó el calendario realmente.
- La caché es por instancia de servidor: cada instancia puede tener su propia copia.
