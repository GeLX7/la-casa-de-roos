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
| 14 | Arequipa travel guide facts | Arequipa.com public info page (checked 2026-06-10) | ⚠️ use as public research only | Website copy is rewritten original text; no Arequipa.com paragraphs or branding reused. Font observed: Montserrat via Google Fonts. |
| 15 | Logo image (arch + flower lockup) | Owner's public Facebook photo (provided by owner, 2026-06-10) | ✅ owner's brand asset | Stored locally (`public/images/brand/logo.jpg`, tight crop `logo-mark.jpg`). Ask owner for original export files (vector/PNG with transparency) for production quality |
| 16 | Arequipa tourism photos (10) | Arequipa.com public pages (`/` and `/info/`, checked 2026-06-10) | ⚠️ **temporary tourism/reference assets for preview/MVP only** — licensing not cleared | Production gate: replace with owner-shot/licensed photos **or** obtain written permission from Arequipa.com before public launch; record outcome here |

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

### Full Airbnb listing galleries (2026-06-10 — TEMPORARY, owner-source-derived)

Extracted from the public HTML of the owner's own four Airbnb listing pages
(the embedded room-tour data each page serves to any anonymous visitor — no
login, no private API, one fetch per page). Downloaded once at `im_w=1440`,
recompressed locally (JPEG q60, max 1440px), never hotlinked. Categories and
alt text come from Airbnb's own public room-tour labels ("Sala imagen 2",
"Baño completo imagen 1", …). **Temporary pending owner originals or
explicit approval (row 3).** The old `cover.jpg` files were removed: each
cover was pixel-identical to that suite's `sala-01.jpg`.

| Suite (listing) | Files under `public/images/listings/` | Own photos |
|---|---|---|
| suite-queen-con-sala (Hosting-1352543068552764001) | `sala-01..05`, `habitacion-01..05`, `bano-01..05` | 15 |
| suite-queen-centro-historico (Hosting-1353094020937867539) | `sala-01..04`, `habitacion-01..03`, `bano-01..03` | 10 |
| suite-queen-con-vista (Hosting-1352529733779964415) | `sala-01..05`, `habitacion-01..03`, `bano-01..02` | 10 |
| mini-apartamento-familiar (Hosting-1352501815600410248) | `sala-01..07`, `habitacion-01..09`, `bano-01..04`, `area-comun-01` | 21 |
| comunes (photos repeated on all four listings, pooled once) | `area-comun-01..05` (cocina de huéspedes), `entorno-01..06` (restaurante YURAKUNA) | 11 |

67 files, ≈9.7 MB total. Per-category ratings (limpieza, llegada,
comunicación, ubicación, veracidad, calidad-precio) were also read from the
same public pages and shown attributed on each suite page.

Blocked/limited sources (no bypass attempted): Facebook share link
(login-walled, no public og:image); Google Maps photos (JS-only, not
politely extractable); **Airbnb review texts** (loaded by a client-side API
after page load — not present in the public HTML, so no review quotes are
shown; only Airbnb's published per-category scores, attributed, with a link
to the listing for full reviews).

### Logo (2026-06-10, row 15)

Owner provided a direct Facebook CDN URL to the brand lockup (arch + flower, "LA CASA de ROOS"). Downloaded once and stored locally:

| Local file | Notes |
|---|---|
| `public/images/brand/logo.jpg` | Full 1024×1024 lockup, cream background |
| `public/images/brand/logo-mark.jpg` | 512×512 tight crop for header/footer/crest placements |

JPEG on cream — no transparency. Request original export (SVG/PNG) from owner for production.

### Arequipa.com tourism images (2026-06-10, row 16 — TEMPORARY)

Public images from `https://www.arequipa.com/` and `/info/`, downloaded once, recompressed locally, never hotlinked. **Preview/MVP reference assets only — licensing review or replacement required before public launch.**

| Local file | Source file | Used on |
|---|---|---|
| `public/images/arequipa/plaza-de-armas.jpg` | `arequipa-main-e1700501027346.jpg` | Home Arequipa section + /arequipa hero |
| `public/images/arequipa/catedral-misti.jpg` | `arequipa-history.jpg` | Experience card (Plaza/Catedral) |
| `public/images/arequipa/santa-catalina.jpg` | `article-must-do-things.jpg` | Experience card + home teaser |
| `public/images/arequipa/canon-del-colca.jpg` | `explore-colca-canyon.jpg` | Experience card + home teaser |
| `public/images/arequipa/mirador-yanahuara.jpg` | `cityfacts.jpg` | Experience card + home teaser |
| `public/images/arequipa/ruta-del-sillar.jpg` | `ruta-del-sillar-thumbnail.jpg` | Experience card |
| `public/images/arequipa/gastronomia-rocoto.jpg` | `useful-dishes.jpg` | Experience card |
| `public/images/arequipa/atardecer-ciudad.jpg` | `arequipa-info.jpg` | /arequipa closing CTA band |
| `public/images/arequipa/festival-arequipeno.jpg` | `celebrations-in-arequipa.jpg` | (reserved, not yet placed) |
| `public/images/arequipa/rafting-rio-chili.jpg` | `rafting-thumbnail.jpg` | (reserved, not yet placed) |
