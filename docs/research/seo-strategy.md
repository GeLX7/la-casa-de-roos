# SEO & Content Strategy (v1)

2026-06-10. Spanish-first. Goal: own the brand, then capture "hospedaje centro histórico Arequipa"-class queries.

## Query targets

**Brand (win immediately):** la casa de roos · casa de roos arequipa · la casa de roos airbnb.
**Lodging + location (core, es):** hospedaje centro histórico arequipa · alojamiento centro de arequipa · habitación con baño privado arequipa · minidepartamento arequipa centro · suite arequipa plaza de armas · hospedaje cerca a la plaza de armas arequipa · departamento por noche arequipa · donde alojarse/quedarse en arequipa centro histórico · estadías largas arequipa.
**Long-tail (blog/FAQ later):** alojamiento cerca monasterio santa catalina · hospedaje calle mercaderes · airbnb arequipa centro alternativa · hospedaje para dos arequipa.
**EN (phase with i18n):** where to stay in arequipa historic center · guesthouse/loft arequipa plaza de armas.

## Page map (each a landing page with one search intent)

```
/                         hospedaje centro histórico Arequipa + brand
/habitaciones/[slug]      4 pages — one per suite (unique copy per unit: vista, sala, familiar, workspace)
/ubicacion                "a una cuadra de Mercaderes, X min a pie de la Plaza de Armas" + mapa
/contacto                 WhatsApp / email / redes
/faq                      check-in, llaves, ruido, cocina compartida, pagos (rich FAQ schema)
(later) /arequipa/...     guías: qué hacer, dónde comer (YURAKUNA), Santa Catalina
```

Slugs from Carrd names, e.g. `/habitaciones/suite-queen-con-sala`, `/habitaciones/suite-queen-familiar`.

## Technical SEO (Next.js)

- Metadata API per route: unique `title` ("Suite Queen con Sala y Vista — La Casa de Roos, Arequipa"), `description`, canonical, `og:*` + Twitter cards; OG images via `next/og` (photo + name + ★rating).
- `sitemap.ts` + `robots.ts`; clean static/ISR HTML for all public pages (no client-only content for room copy).
- **Schema.org (JSON-LD):**
  - Site-wide: `LodgingBusiness` (or `BedAndBreakfast`) — name, address (once owner approves publishing), geo, telephone, sameAs (Airbnb listings, Instagram, TikTok, Facebook, Maps), checkinTime/checkoutTime, amenityFeature.
  - Per room: `Accommodation`/`Apartment` with occupancy, bed details, amenityFeature; `VacationRental` type exists but Google's vacation-rental rich results require a partner feed — use the generic types.
  - `FAQPage` on /faq, `BreadcrumbList` everywhere.
  - ⚠️ **Do not mark up `aggregateRating` with Airbnb scores** — Google requires on-site-collected reviews; show Airbnb ratings visually with attribution instead. Schema reviews come later when we collect our own.
- Performance = ranking: next/image with proper `sizes`, AVIF/WebP, preloaded hero, font subset (one serif + one sans), LCP < 2.5 s on 4G.
- `hreflang` es-PE/en when English ships; `lang="es"` now.

## Local SEO

- **Google Business Profile** is the highest-leverage move outside the site (owner action; the Maps pin suggests one may exist — verify, claim, link website ↔ GBP, same NAP everywhere).
- Consistent name/phone across Carrd→new site, Instagram, TikTok, Facebook, GBP, Airbnb.
- Encourage guests to drop Google reviews post-stay (QR card in rooms) — feeds both Maps ranking and future on-site schema.

## Measurement

Google Search Console (verify via DNS once domain is live; `gsc` MCP available locally for monitoring) + Vercel Analytics. KPIs: brand impressions, "hospedaje arequipa…" rankings, request-form submissions, WhatsApp clicks (track via `?utm_` + click handler).

## Content rules

Rewrite all room copy fresh (don't paste Airbnb text verbatim: avoids duplicate-content and rights ambiguity; Airbnb pages will otherwise outrank us with our own words). Keep the honest-noise/earplugs note — it's distinctive, converts, and is exactly the long-tail text people search ("arequipa centro ruido").
