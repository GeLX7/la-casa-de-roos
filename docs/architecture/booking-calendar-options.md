# Booking & Calendar Architecture — Options

Decision doc, 2026-06-10. Background research: `../research/airbnb-calendar-sync-research.md`.

## Option A — Website imports Airbnb iCal (one-way in)

Website polls each listing's Airbnb iCal export; Airbnb-booked dates show as unavailable on the site.

- ✅ Trivial, read-only, zero risk to Airbnb listings. Latency = our poll interval (minutes).
- ❌ Alone, direct bookings don't block Airbnb → must pair with B or manual blocking.

## Option B — Website publishes its own iCal feed (one-way out)

Site generates `/api/ical/{room}.ics?token=…` per room containing confirmed direct bookings; owner imports each into the matching Airbnb listing once.

- ✅ Standard, free, no Airbnb ToS issues (feature exists exactly for this).
- ❌ Airbnb pulls every ~2–3 h → risk window for double booking.
- ⚠️ Feed URLs must carry a secret token; UIDs must be stable per booking.

## Option C — Channel manager / PMS

Smoobu, Lodgify, Hospitable, Beds24, Hostaway, Guesty etc. — official API partners with near-real-time two-way sync (availability + pricing), often bundling their own booking widget/site.

- ✅ Closes the sync gap; handles pricing sync; mature tooling.
- ❌ US$20–50+/mo; booking UX locked to their widget unless using their APIs; another system for the owner to learn; our custom site would embed or call it.
- Verdict: **not for launch** — revisit when direct-booking volume or double-booking incidents justify it. Best fits for this profile: Smoobu or Beds24 (cheap, API), Lodgify (if owner ever wants their site builder), Hospitable (Preferred+, has direct-booking product).

## Option D — Request-to-book flow (process, not tech)

No instant confirmation on the website. Request → owner verifies (live look at Airbnb calendar + our DB) → confirm → guest notified/pays.

- ✅ Reduces double-booking probability to ~zero; matches WhatsApp-driven local booking culture; no payment infrastructure needed on day one.
- ❌ Slower conversion than instant book; owner must respond quickly (set a 12–24 h SLA, ideally minutes via WhatsApp notification).

## ✅ Recommendation: A + B + D for MVP, C later

1. **Import** all four Airbnb iCal feeds; refresh lazily (on each availability lookup if cache > 10–15 min old) plus a daily floor refresh. Availability calendar on the site = Airbnb blocks ∪ confirmed direct bookings ∪ manual blocks.
2. **Export** one tokenized iCal feed per room; owner imports into Airbnb (one-time setup, ~5 min).
3. **Request-to-book** with auto re-check of the freshest Airbnb feed at confirmation time, plus a Postgres exclusion constraint (`room_id`, `daterange`, status=confirmed) as the final guard.
4. Document the residual risk to the owner: the only unprotected scenario is *Airbnb Instant Book during the ≤3 h pull window after a website confirmation*. At 4 units this is rare; if it ever happens, owner cancels the website booking (refund) rather than the Airbnb one (penalties).

```
Airbnb (4 listings)                    Website (Next.js + Supabase)
   │  iCal export (per listing)            │
   ├──────────────────────────────────────▶│  poll ≤15 min / on-demand → cache table
   │                                       │
   │  iCal import (per listing)            │
   │◀──────────────────────────────────────┤  /api/ical/{room}.ics?token=SECRET
   │   Airbnb pulls every ~2–3 h           │  (confirmed direct bookings)
   │                                       │
 guest books on Airbnb            guest requests on website
   → blocked on site in ≤15 min     → owner confirms (checks calendar)
                                    → blocked on site instantly
                                    → blocked on Airbnb at next pull
```

## What iCal does NOT sync (owner expectation, 2026-06-10)

iCal carries **availability only** — no prices, minimum stays, fees, or policies. The owner expects Airbnb price sync; **this architecture cannot deliver it**, and the website must never promise live Airbnb price parity. Handling:

- MVP: prices are owner-entered in the website DB. Until the owner fixes rates, rooms show **"Consultar precio"** with the request/WhatsApp CTA.
- Optional interim: display Airbnb reference pricing clearly labeled "precio referencial según Airbnb" with a last-checked date, updated manually.
- If a rate changes on Airbnb, the website follows only when the owner updates it.
- Automatic two-way price sync = Option C (channel manager/PMS). This is now an explicit Option C trigger.

## When to move to Option C

Any of: ≥2 near-misses/double bookings in a season · direct bookings > ~30 %/mo and owner wants instant confirmation · owner adds Booking.com or more units · **owner insists on automatic Airbnb price sync** (iCal can't — see above). Migration is clean: the website keeps its UI and swaps the availability source from iCal tables to the channel manager's API.
