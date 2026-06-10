# Booking & Payment Architecture

Recommendation doc, 2026-06-10. No payment is implemented in MVP — this defines the path.

## Booking flow evolution

| Phase | Flow | Why |
|---|---|---|
| 1 (launch) | **Request form → email/WhatsApp to owner → manual confirm** | Zero payment risk, matches owner's current WhatsApp workflow, closes the iCal sync gap (see booking-calendar-options.md) |
| 2 | Same + **admin mini-dashboard** (confirm/decline buttons, auto emails, iCal feed updates) | Removes copy-paste work, single source of truth |
| 3 | Confirm **with payment**: deposit (e.g. first night or 30–50 %) or full prepay via local provider | Real commitment, fewer no-shows |
| 4 (optional) | Instant book + channel manager | Only if volume demands |

## Booking states

`pending` → (owner) → `confirmed` → `paid` (Phase 3) → `completed`
`pending/confirmed` → `declined` / `cancelled` / `expired (24 h without owner action — notify both sides)`

Rules: only `confirmed`+ block dates in the public calendar and the exported iCal feed; a fresh Airbnb iCal pull runs at the moment of confirmation; Postgres exclusion constraint prevents overlapping confirmed bookings per room.

## Payments in Peru (research summary)

- **Stripe: not available for Peru-domiciled businesses** ([stripe.com/global](https://stripe.com/global)). Workarounds (US LLC + US bank) add legal/tax complexity — not recommended for this business. ([doola guide](https://www.doola.com/stripe-guide/how-to-open-a-stripe-account-in-peru/))
- Practical local options ([overview](https://www.rebill.com/en/blog/payment-gateways-peru)):
  - **Yape / Plin** (BCP/interbank mobile wallets): how most Peruvians pay small businesses. Zero integration — owner shares QR / number. Perfect for Phase 1–2 manual collection from national guests.
  - **Mercado Pago Perú:** cards + wallet; **payment links** need no code (owner sends a link per confirmed booking) and a Checkout API exists for Phase 3. Good first online option.
  - **Culqi** (Peruvian gateway): cards + Yape integration, developer-friendly API, needs RUC. Strong Phase 3 candidate for embedded checkout.
  - **Izipay / Niubiz:** bank-affiliated acquirers, more paperwork; fine alternatives if owner already banks there.
  - **PayPal:** useful for foreign guests (US/EU) who distrust unknown forms; high fees; manual invoice flow works.
- Recommendation: **Phase 1–2: Yape/Plin/transfer + Mercado Pago payment link sent on confirmation. Phase 3: Culqi or Mercado Pago Checkout embedded, charging a deposit.** Decide deposit policy with owner (suggest: 1 night or 30 % to confirm; balance at check-in).

## Email notifications (Phase 1)

**Resend** (free tier 3k/mo, React Email templates) from `reservas@lacasaderoos.com` once domain exists:
1. Guest: "Solicitud recibida" (instant, with summary + WhatsApp link)
2. Owner: "Nueva solicitud" (room, dates, guest, phone; later: confirm/decline links)
3. Guest: "Reserva confirmada" (+ payment instructions) / "No disponible" (+ alternative dates/rooms)

WhatsApp stays the human channel; email is the paper trail. (Optional later: WhatsApp Cloud API templated notifications — needs Meta business verification; not MVP.)

## Database (Supabase Postgres, created at implementation time — not yet)

```
rooms            id, slug, name, airbnb_listing_id, airbnb_ical_url (secret), capacity, beds, summary, sort
bookings         id, room_id, guest_name, email, phone, guests, date_range (daterange), status, source, locale,
                 message, created_at, confirmed_at  + EXCLUDE USING gist (room_id WITH =, date_range WITH &&)
                 WHERE (status IN ('confirmed','paid','completed'))
airbnb_blocks    room_id, uid, date_range, summary, fetched_at   -- cache of imported iCal
manual_blocks    room_id, date_range, note                        -- owner-blocked dates
```

Admin: single owner login (Supabase Auth email OTP) protecting `/admin` (list requests, confirm/decline, manual blocks, iCal URLs). RLS on by default; public role gets read-only availability via an RPC/view that exposes only date ranges, never guest data.

## Explicitly deferred

No card data ever touches our servers (links/redirects only). No invoicing/SUNAT integration (owner handles boletas manually; revisit if required). No multi-currency engine — display PEN (and optional USD reference rate later).
