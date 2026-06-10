# Asset & Content Rights Checklist

2026-06-10. Rule: nothing ships on the website until its row is ✅ confirmed by the owner. Airbnb's ToS restrict scraping/reuse of platform content; reviews belong to their authors; we only reuse what the owner independently owns.

| # | Asset | Source today | Can we use it? | Action needed |
|---|---|---|---|---|
| 1 | Business name "La Casa de Roos" + logo (if any) | Carrd / Airbnb | ✅ owner's brand | Owner sends logo files or we design wordmark |
| 2 | Room/listing descriptions | Owner-written, hosted on Airbnb | ⚠️ owner owns their text, but **rewrite** for the site (SEO duplicate-content + clean provenance) | Owner confirms authorship; we draft new copy for approval |
| 3 | Photos (~90 across listings) | Airbnb CDN (muscache.com) | ⚠️ owner owns the photos and confirmed originals exist (2026-06-10), but asked us to pull from Airbnb web. Extracted URLs = **internal reference/placeholders only** (processed, compressed copies — not production quality) | Production gate: owner sends originals (preferred) **or** explicitly approves shipping the extracted copies — record that approval in this row |
| 4 | Airbnb review texts | Guests' content on Airbnb | ❌ no scraping/wholesale reuse. Owner wants reviews shown on the site (2026-06-10) → build **own on-site review collection** (Phase 3) | Until own reviews exist: aggregate rating + link only; verbatim Airbnb quotes require per-guest permission |
| 5 | Ratings/counts (★4.91, 86 reseñas, Favorito badge) | Public listing pages | ⚠️ OK as **factual claims with attribution + link** ("en Airbnb"), keep updated; ❌ not as schema.org aggregateRating | Show visually with date checked; refresh quarterly |
| 6 | "Airbnb" name/logo | — | ⚠️ nominative use only ("Encuéntranos en Airbnb", plain text link). ❌ no logo as endorsement, no "partner" claims | Follow Airbnb brand guidelines if any badge used |
| 7 | WhatsApp number, socials, Maps pin | Carrd | ✅ owner's | Confirm canonical Facebook URL |
| 8 | Privacy policy PDF | Google Drive | ⚠️ owner's doc | Adapt to website + Ley 29733 (Peru data protection); host on-site, not Drive |
| 9 | Exact address & map precision | Not public on Airbnb | ⚠️ owner decision | Publish full address? Or block-level until booking confirmed? |
| 10 | YURAKUNA restaurant name/photos | Listing photos mention it | ⚠️ third-party business | Mention in text OK; their photos/logo need their nod |
| 11 | "Estudio Museo Lozada Tamayo Coworking" mention | House rules | ⚠️ third-party | Text mention OK for key return instructions |
| 12 | Carrd `card.jpg` OG image | Carrd assets | ⚠️ presumably owner's photo | Replace with original anyway |
| 13 | Guest-facing prices/policies | Not extracted | n/a | Owner provides authoritative values (source of truth = website DB, mirrored manually on Airbnb) |
| 14 | Arequipa travel guide facts | Arequipa.com public info page (checked 2026-06-10) | ⚠️ use as public research only | Website copy is rewritten original text; no Arequipa.com images, paragraphs, or branding reused. Font observed: Montserrat via Google Fonts. |

## Photos needed from owner (production launch gate)

Per suite — 8–12 each, highest resolution available, horizontal preferred:

- [ ] Hero: best wide shot (bed + sala together if possible)
- [ ] Dormitorio: 2–3 (bed made, daylight)
- [ ] Sala privada: 2
- [ ] Baño: 2
- [ ] Detalle: 1–2 (vista al centro histórico where applicable; workspace in suites 1 & 4; cama extra in suite 4)

Shared, once:

- [ ] Cocina compartida: 2–3
- [ ] Edificio: entrance/exterior 1–2
- [ ] Vista del centro histórico: 1–2
- [ ] Logo: original export files from owner's Facebook/Instagram branding (not screenshots)
- [ ] YURAKUNA photo only with that business's permission (text mention is fine)

Until these arrive: layouts use extracted Airbnb image URLs as placeholders in local/preview builds only — **never on the production domain**.

## Extracted assets in the repo (2026-06-10)

All owner-related public sources, downloaded once, resized/compressed locally, never hotlinked. **Status: temporary pending owner originals or explicit approval (row 3).**

| Local file | Source | Used on |
|---|---|---|
| `public/images/brand/casa-hero.jpg` | Owner's Carrd site (`assets/images/bg.jpg`) | Home hero |
| `public/images/brand/sala-cuadro.jpg` | Owner's Carrd site (`assets/images/container03.jpg`) | /arequipa |
| `public/images/listings/suite-queen-con-sala/cover.jpg` | Owner's Airbnb listing og:image (Hosting-1352543068552764001) | Room card + gallery hero |
| `public/images/listings/suite-queen-centro-historico/cover.jpg` | Owner's Airbnb listing og:image (Hosting-1353094020937867539) | Room card + gallery hero |
| `public/images/listings/suite-queen-con-vista/cover.jpg` | Owner's Airbnb listing og:image (Hosting-1352529733779964415) | Room card + gallery hero |
| `public/images/listings/mini-apartamento-familiar/cover.jpg` | Owner's Airbnb listing og:image (Hosting-1352501815600410248) | Room card + gallery hero |

Blocked/limited sources (no bypass attempted): Facebook share link (login-walled, no public og:image); Google Maps photos (JS-only, not politely extractable); full Airbnb galleries (client-rendered — only the public og:image cover per listing was taken). No standalone logo file exists on any public source — Carrd `card.jpg` is a baked screenshot of the wordmark, not a clean asset; the site keeps its typographic wordmark until the owner sends logo files.
