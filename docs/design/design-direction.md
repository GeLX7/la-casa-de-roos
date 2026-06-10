# Design Direction

2026-06-10. Premium, warm, trustworthy, photo-first, Spanish-first, mobile-first.

## Concept: "Sillar y calidez"

Arequipa is *la Ciudad Blanca* — white volcanic sillar stone, warm Andean light. The palette and texture come straight from that:

- **Base:** mostly white, with warm off-white / sillar cream used as quiet section bands.
- **Accents:** terracotta/clay for CTAs, deep volcanic charcoal for text, a muted sage or Misti-sky blue as secondary.
- **Type:** all-Montserrat system following arequipa.com's typography (revised 2026-06-10; Fraunces dropped — the dual-family mix read generic). Arequipa.com uses Montserrat for everything: hero h1 64px/700, h2 40px/700, h3 24px/700, h4 20px/600, body 16px/400 at 145% line-height. We mirror that: headings 700–800 weight with slight negative tracking, body 400 at 1.45, hierarchy from weight not typeface.
- **Buttons:** arequipa.com uses sharp rectangular buttons (no border-radius, solid fill, 600 weight). Ours: primary CTAs rectangular solid terracotta, secondary rectangular bordered, tertiary underlined text links. Cards/inputs keep a soft radius — intentional mix, no pills.
- **Texture:** subtle paper/stone grain on section backgrounds; no glassmorphism, no neon, no generic AI-gradient look.

## Page anatomy (home)

1. **Hero:** full-bleed photo (best suite or rooftop view toward the cathedral/Misti if owner has one), name, one-line value prop, primary CTA "Ver disponibilidad" + secondary WhatsApp button.
2. **Trust strip:** ★4.85 promedio · +340 reseñas en Airbnb · Favorito entre huéspedes · "Llegada autónoma" · "Centro Histórico" (icons, links out to Airbnb with attribution).
3. **Room cards (4):** large photo, name, capacity icons (2–3 huéspedes · cama queen · baño privado), "Desde S/ — por noche" (once prices provided), state ("Disponible hoy") + CTA per card.
4. **La casa:** shared kitchen, concierge digital, building security, YURAKUNA mention — the "why us" section.
5. **Ubicación:** map embed + walking-time chips (Plaza de Armas, Santa Catalina, Mercaderes).
6. **Honestidad block:** historic-center noise + free earplugs + what's *not* included (no A/C…). Builds disproportionate trust.
7. **Arequipa guide teaser:** practical travel context: Centro Histórico, walkability, sillar, weather, how to move.
8. **Footer:** contact, socials, privacy policy, "Síguenos".

## Room page anatomy

Gallery (grid + lightbox, owner originals) → facts row (capacity/beds/bath/check-in) → description (rewritten) → amenities grouped with icons (incl. "No incluido") → **availability calendar** (months view; blocked = Airbnb ∪ direct ∪ manual) → request form (dates, guests, name, WhatsApp/email, message) → house rules accordion → location snippet → cross-links to other suites.

## Booking UX principles

- Calendar always visible before the form; disabled dates obvious; America/Lima dates.
- Form ≤ 6 fields; submit states in Spanish ("Solicitud enviada — Roos te responderá en menos de 24 h, normalmente en minutos").
- **Sticky WhatsApp FAB** on mobile everywhere (current conversion channel — never bury it).
- Request-to-book framing: "Solicita tu reserva" not "Reservar ahora" (no payment yet — set expectations honestly).

## Components (shadcn/ui base)

Navbar (transparent→solid on scroll) · RoomCard · TrustBadges · AvailabilityCalendar (react-day-picker, range display-only) · RequestForm · AmenityList · GalleryLightbox · FAQAccordion · WhatsAppFAB · Footer. Motion: subtle only (fade/slide on scroll, hover lift on cards); respect `prefers-reduced-motion`.

## Voice

Warm second-person plural like the owner's own writing ("¡Bienvenidos!"), short sentences, zero corporate filler, light emoji only where the brand already uses them (hero badges, FAQ). English copy later mirrors tone, not literal translation.
