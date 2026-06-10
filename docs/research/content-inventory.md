# Content Inventory — La Casa de Roos

Extracted 2026-06-10 from the public Carrd site and the four public Airbnb listing pages (server-rendered content only; no login, no bot-protection bypass, one polite fetch per page). Raw extraction JSON lives in `docs/research/raw/`.

---

## 1. Carrd site — `https://lacasaderoos.carrd.co/`

**Business name:** La Casa de Roos
**Tagline:** "Habitaciones y minidepartamentos en el corazón de Arequipa"
**Brand tone:** warm, personal, emoji-friendly, Spanish, direct ("Reserva Ahora", "Hola Roos, me das información…"). Host goes by **Roos**.

**Sections:** header (name + socials) → listing links ("🌟 Reserva Ahora en Airbnb") → contact ("📲 Contacto & Reservas") → socials ("📸 Redes Sociales").

**Contact & links:**
- WhatsApp: `wa.me/51967757040` with prefilled text "Hola Roos, me das informacion sobre tus airbnb" → **+51 967 757 040**
- Google Maps: `https://maps.app.goo.gl/EkTeDgo46YoJXW8o9` (exact address not published — ask owner)
- Instagram: `instagram.com/lacasaderoosaqp` · TikTok: `tiktok.com/@lacasaderoos` · Facebook canonical (owner-confirmed 2026-06-10): `facebook.com/profile.php?id=61579891154411`
- Privacy policy: PDF on Google Drive (`drive.google.com/file/d/1ce2dYDO5UY5DV0huKO6gzZuRnXk4_1ix/view`) — owner already has one; needs adaptation for the website

**Room links (Carrd label → Airbnb):**
1. "Suite Queen con sala y Vista al Centro Histórico" → `/h/centrohistoricoaqp1` → rooms/1352543068552764001
2. "Suite Queen en el Centro Histórico" → `/h/centrohistoricoaqp2` → rooms/1353094020937867539
3. "Suite Queen con Vista al Centro Histórico" → `/h/centrohistorico4` → rooms/1352529733779964415
4. "Suite Queen Familiar con Vista al Centro Histórico + Cama Extra" → `/h/centrohistoricoaqp3` → rooms/1352501815600410248

**Images:** only one asset publicly referenced: `assets/images/card.jpg` (1280×800 OG card). No gallery on Carrd. **All real photography must come from the owner.**

**Pricing / amenities / policies on Carrd:** none published.

---

## 2. Shared content across all four Airbnb listings

All four are **"Alojamiento entero: loft"** in **Cercado de Arequipa, Arequipa, Perú**, same building, same host text. Description (owner-authored, verbatim on Airbnb):

> "¡Bienvenidos a La Casa de Roos! Es un placer recibirlos en el corazón del Centro Histórico de Arequipa. Nos encontramos dentro de un edificio empresarial, lo que les garantiza seguridad, tranquilidad y comodidad durante su estadía. … incluimos nuestro servicio como Concierge digital gratuito."

Recurring blocks:
- **El espacio:** each unit = private cozy bedroom + small private sitting area + full private bathroom.
- **Acceso de los huéspedes:** shared guest-only kitchen in common area (electric stove, microwave, mini-fridge, basic utensils).
- **Ubicación:** one block from Calle Mercaderes; steps from Plaza de Armas, Monasterio de Santa Catalina, cafés/restaurants/bars. YURAKUNA vegan restaurant on the 1st floor; optics shop in the building.
- **Honest noise note:** historic-center noise possible; **free earplugs provided** (great trust-building copy — keep on website).
- **Key return:** "Entrega las llaves en el segundo piso en nuestro Estudio Museo Lozada Tamayo Coworking".

**Amenities (common set):** Wifi · TV · hot water · kitchenette (microwave, mini-fridge, kettle, coffee maker, dishes, wine glasses, small kitchen) · bed linens · clothing storage + hangers · iron (listing 1) · books · fire extinguisher · exterior security cameras (common areas only) · luggage drop-off allowed · long stays allowed · self check-in with key lockbox · paid parking off premises · laundromat nearby.
**Explicitly NOT included:** full kitchen in-unit, washer, dryer, A/C, heating, smoke detector, CO detector (Airbnb safety disclosure — decide how to phrase on own site).

**House rules (all listings):** check-in from 2:00 p.m. · checkout before 11:00 a.m. · self check-in, lockbox · no pets · no parties/events · no smoking · quiet hours 11:00 p.m.–6:00 a.m. (listing 3 says until 7:00 a.m. — confirm) · commercial photography allowed · turn off lights/appliances, return keys · **penalty S/ 350** for rule-breaking (parties, smoking inside).

**Host:** "Roos" (full host profile name, photo, superhost status not in server-rendered HTML — ask owner).

---

## 3. Per-listing details

### Listing 1 — Habitación Corazón Centro Histórico Arequipa
- **URL:** https://www.airbnb.com.pe/rooms/1352543068552764001 · Carrd: "Suite Queen con sala y Vista al Centro Histórico"
- **Type:** entire loft · 2 guests · 1 bedroom (queen) · 1 bed · 1 private bath · sala · kitchenette · **zona de trabajo (workspace)**
- **Rating:** ★4.91 · 86 reviews · 91% five-star · category ratings: cleanliness 4.9, accuracy 4.9, check-in 4.9, communication 4.9, location 4.9, value 4.9
- **Images:** 20 owner photos in SSR (sala ×5, cocina ×5, habitación ×5, baño ×4, exterior/restaurant ×1+), alts like "Cómoda cama Queen". Full URLs in `raw/ex_1352543068552764001.json`.
- **Unique rules text:** S/ 350 penalty paragraph; key return at coworking.

### Listing 2 — Habitación Centro Histórico Arequipa
- **URL:** https://www.airbnb.com.pe/rooms/1353094020937867539 · Carrd: "Suite Queen en el Centro Histórico"
- **Type:** entire loft · 2 guests · 1 bedroom · 1 bed · 1 private bath · kitchenette
- **Rating:** ★4.81 · 90 reviews · 88% five-star · cleanliness 4.9, accuracy 4.8, check-in 4.9, **communication 5.0, location 5.0**, value 4.8
- **Images:** 20 owner photos in SSR (sala, cocina, habitación, baño, YURAKUNA ×5). No workspace listed.

### Listing 3 — Habitación Centro Histórico Arequipa
- **URL:** https://www.airbnb.com.pe/rooms/1352529733779964415 · Carrd: "Suite Queen con Vista al Centro Histórico"
- **Type:** entire loft · 2 guests · 1 bedroom · 1 bed · 1 private bath · kitchenette
- **Rating:** ★4.86 · 74 reviews · 88% five-star · cleanliness 4.9, accuracy 4.9, check-in 4.9, communication 5.0, location 4.9, value 4.8 · **"Favorito entre huéspedes" badge confirmed in page**
- **Images:** 21 owner photos in SSR. Quiet hours shown as 11 p.m.–**7 a.m.**

### Listing 4 — Mini Apartamento Cerca a Plaza de Armas
- **URL:** https://www.airbnb.com.pe/rooms/1352501815600410248 · Carrd: "Suite Queen Familiar con Vista al Centro Histórico + Cama Extra"
- **Type:** entire loft · **3 guests** · 1 bedroom · **2 beds (queen + single)** · 1 private bath · kitchenette · workspace
- **Rating:** ★4.82 · 96 reviews · 84% five-star · cleanliness 4.9, accuracy 4.9, check-in 4.9, communication 4.9, location 4.9, value 4.8 · **"Favorito entre huéspedes" badge confirmed in page**
- **Images:** 30 owner photos in SSR (sala ×7, habitación ×9, baño ×4, cocina, YURAKUNA ×5).
- Note: some description text auto-translated flag present ("Se tradujo automáticamente") — original may be mixed-language; confirm final copy with owner.

---

## 4. Not available from public pages (owner or manual export must provide)

- **Nightly prices** (date-dependent, JS-loaded — intentionally not captured), cleaning fees, discounts. Owner decision 2026-06-10: defer — site shows **"Consultar precio"** until fixed rates arrive (iCal cannot sync Airbnb prices, see `../architecture/booking-calendar-options.md`)
- **Cancellation policy** name/terms per listing (loads client-side)
- **Individual review texts** (lazy-loaded; only counts/ratings/percentages were server-rendered)
- **Host profile** (display name, photo, superhost status, response rate)
- **Exact street address** (Airbnb hides it; Maps short-link not resolved on purpose)
- **Min/max stay rules**, advance-notice and preparation-time settings
- **Original photo files** — owner confirmed originals exist (2026-06-10) but asked us to pull from Airbnb web; policy: extracted muscache.com URLs are **internal placeholders only**, production needs originals or explicit owner sign-off (photo checklist in `content-rights-checklist.md`)
- **Airbnb iCal export URLs** (private, per listing, from host dashboard)

## 5. Website copy possibilities (draft angles, ES-first)

- Hero: "La Casa de Roos — Suites y minidepartamentos en el corazón del Centro Histórico de Arequipa" + "A una cuadra de Calle Mercaderes, a pasos de la Plaza de Armas".
- Trust strip: "★4.85 promedio · +340 reseñas en Airbnb · Favorito entre huéspedes" (link out to listings; see rights checklist).
- Per-room pages: **Airbnb title as H1** (owner decision 2026-06-10), Carrd "Suite Queen…" name as subtitle + amenity icons + "Lo que no incluimos" honesty block (earplugs note converts skeptics).
- Location section: walking times to Plaza de Armas, Santa Catalina, Mercaderes; YURAKUNA mention.
- Booking CTA: "Consulta disponibilidad" + WhatsApp fallback button everywhere.

## 6. Questions raised (full list in `docs/questions-for-owner.md`)

Answered 2026-06-10 — see Resolution log in `../questions-for-owner.md`. Still pending from owner: exact address, fixed prices, cancellation preset + min/max stay, notification email, iCal export URLs, photo originals + logo files.
