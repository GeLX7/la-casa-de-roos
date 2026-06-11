# SEO Competitive Research — Alojamiento en Arequipa

Fecha de investigación: 11 de junio de 2026 (SERPs muestreados vía búsqueda
web; ~12 consultas + 11 páginas competidoras analizadas). Complementa y
alimenta `SEO_LAUNCH_PLAN.md`. Nada de este documento copia texto de
competidores; son observaciones de patrones y recomendaciones originales.

---

## 1. Composición de SERPs por cluster

### A. Intención comercial amplia
Consultas: `hospedaje en Arequipa`, `hoteles Arequipa centro`,
`hotel centro histórico Arequipa`, `alojamiento centro histórico Arequipa`.

- Dominan **páginas de área/landmark de OTAs**: Booking
  (`/landmark/pe/historic-centre-of-arequipa`), Hoteles.com, TripAdvisor
  ("HotelsNear"), Kayak, Trivago, Trip.com, Expedia, Despegar + agregadores
  (cozycozy, atrapalo, hostelworld).
- Cuelan resultados algunos **sitios propios** de propiedades chicas
  (viajerohostels.com) y scrapers de baja calidad (arequipahotels24,
  hospedajeenpiura) — señal de SERPs no totalmente blindados.
- Veredicto: no compitamos de frente todavía. El camino de entrada es marca
  + larga cola (ver C).

### B. Intención por landmark
Consultas: `hotel cerca Plaza de Armas`, `alojamiento cerca Monasterio
Santa Catalina`, `hospedaje Cercado de Arequipa`.

- Mismo muro de OTAs con páginas "Hotels near X" generadas por landmark.
- Pero: propiedades con **nombre exact-match** se infiltran
  ("Hotel Turístico A Una Cuadra De La Plaza De Armas" en Trivago,
  "San Agustín Posada del Monasterio" con sitio propio). El nombre/los
  títulos descriptivos geográficos funcionan en este nicho.
- `Calle Mercaderes` **no es una consulta de alojamiento**: su SERP es
  informacional (Wikipedia, TripAdvisor attraction, blogs de historia).
  Úsala como prueba de proximidad en el copy ("a una cuadra de…"), no como
  keyword objetivo.

### C. Larga cola descriptiva — NUESTRO CARRIL
Consultas: `suites con baño privado cerca Plaza de Armas`, `habitación
privada baño propio centro histórico Arequipa`, `habitaciones privadas
Arequipa`.

- SERPs débiles: scrapers, fichas individuales de Airbnb, páginas de filtro
  de Hostelworld ("private rooms"), y **sitios propios de hoteles pequeños
  que sí rankean** (arequipasuiteplazahotel.com).
- Los listings de Airbnb que rankean usan títulos cargados de hechos:
  "Céntrico Mini Departamento Privado", "baño privado, 10 cuadras Plaza de
  Armas". Google premia la especificidad descriptiva en este nicho.
- Veredicto: **objetivo primario**. Nuestras páginas ya hablan así;
  los ajustes de este pase lo reafirman.

### D. `mini departamento` / `departamento turístico`
- "mini departamento amoblado Arequipa" → clasificados inmobiliarios de
  **larga estadía** (Urbania, Adondevivir, MercadoLibre): intención
  equivocada.
- "departamento turístico por noche" → SERP confundido (atracciones +
  Airbnb). Volumen/intención difusos.
- Veredicto: mantener "minidepartamento" en el copy (es nuestro inventario
  real) pero siempre acompañado de señales de corta estadía ("por noche",
  "turístico", "check-in/check-out") y nunca como keyword principal.

### E. Informacional de viaje
Consultas: `dónde hospedarse en Arequipa`, `mejor zona`, `qué hacer en
Arequipa`, `where to stay in Arequipa`.

- Blogs de viaje consolidados (espartedelviaje, losviajesdedomi,
  kiwinomada, viajandoalaluna; misstourist/imjesstraveling en inglés),
  operadores de tours (civitatis, topinkatravel) y guías de OTA.
- Veredicto: no ganable a corto plazo, pero la página `/arequipa` debe
  cubrir el patrón de contenido (zonas + qué hacer) para soporte topical,
  captura de larga cola y enlaces internos hacia las suites.

## 2. Páginas competidoras analizadas

### OTAs / alta autoridad
| Página | Patrón observado | Lección |
|---|---|---|
| Booking — landmark "Historic Centre of Arequipa" | Título "Hotels near [landmark], [país]"; meta apila beneficios: "Good availability and great rates… pay at the hotel. No reservation costs." | Apilar beneficios honestos en descriptions: "respuesta en minutos", "sin pago online", "check-in autónomo" |
| TripAdvisor — "HotelsNear" Santa Catalina | Páginas por landmark + radio a pie; "X.X km / N min walk" en cada card | Las distancias a pie por landmark son el idioma del nicho — ya las usamos; mantener formato "± N min a pie" |
| Hostelworld — filtro "private rooms" Arequipa | Página dedicada al atributo "habitación privada" con precio desde | El atributo "privado/a" es un eje de búsqueda real; nuestro H1/copy debe seguir liderando con él |

### Hoteles/suites locales (sitios propios)
| Página | Patrón | Lección |
|---|---|---|
| arequipasuiteplazahotel.com | Rankea para "suites… Plaza de Armas" con título débil ("Inicio"), H2s emocionales y **precios por noche visibles (S/ 140–200)** | La vara técnica local es baja: títulos limpios ya nos diferencian. La transparencia de precio es señal fuerte de conversión/SERP — pendiente decisión del dueño (mostramos "desde S/ X"?) |
| San Agustín Posada del Monasterio | Nombre exact-match del landmark + título marca+estrellas, página en EN/ES | El naming geográfico-descriptivo gana en este nicho; nuestros títulos de suites ya lo hacen (mantener) |
| Katari Hotel / Tierra Viva Arequipa Plaza | Títulos cortos de marca; Tierra Viva inaccesible al fetch (JS) | Cadenas viven de marca + OTA; no son el modelo a imitar para nosotros |

### Blogs de viaje
| Página | Estructura | Lección |
|---|---|---|
| espartedelviaje.com (ES) | Mapa de zonas → comparativa → 4 zonas con H3 de beneficio ("la zona más práctica para caminar") → seguridad → presupuesto → recomendación personal | El formato "zonas sin vueltas" añadido a `/arequipa` sigue esta expectativa de contenido, en corto y honesto |
| misstourist.com (EN) | Quick picks → tiers de precio (luxury/mid/budget) → tipos (hoteles/B&B/aptos) → **FAQs** → conclusión | FAQs pre-reserva = patrón ganador; añadidas a `/habitaciones` con schema FAQPage |
| kiwinomada.com | Inaccesible al fetch (JS); en SERP compite con el mismo formato de zonas | Confirma el patrón dominante |

### Airbnb
| Página | Patrón | Lección |
|---|---|---|
| airbnb.com/arequipa-peru/stays | Título de categoría con rating agregado: "Arequipa, Peru Vacation Rentals (4.9 out of 5)" | Airbnb usa rating en título; nosotros NO lo replicamos en metadata propia (no verificable en nuestro dominio) — el rating vive en el contenido visible con atribución |
| Ficha individual (apartamento céntrico) | Título apilado de hechos: "Vivienda rentada · Arequipa · ★4.88 · 2 habitaciones · 2 camas" | La especificidad fáctica (capacidad, camas, baño) en titles/copy es la lingua franca del nicho |

## 3. Temas de FAQ detectados en el nicho

De blogs (misstourist FAQ) y patrones de listings: mejor zona / seguridad ·
cuántos días · precios típicos · baño privado sí/no · check-in flexible ·
ruido nocturno · cocina disponible · cómo reservar sin OTA. → Las 6 FAQs
añadidas a `/habitaciones` cubren los que aplican a nuestra casa, con
respuestas 100 % veraces de los datos existentes.

## 4. Brechas de contenido detectadas (futuras, NO ahora)

1. Versión EN de páginas clave (cluster "where to stay in Arequipa
   historic center" tiene SERP blog-débil en propiedades individuales).
   Esperar datos de GSC.
2. Página "desde el aeropuerto a la casa" (micro-intención práctica con
   SERP débil) — solo si GSC muestra demanda.
3. Precio visible "desde S/ X" — decisión del dueño, no técnica.
4. Reseñas de Google propias (GBP) para el pack local — bloqueado por
   dirección exacta.

## 5. Qué NO copiar del nicho

- Páginas-landmark fabricadas en masa ("hotels near X" × 20) — thin
  content sin inventario que lo respalde.
- Rating propio en `<title>`/schema (`aggregateRating` con datos de
  Airbnb) — riesgo de penalización de rich results.
- Promesas de OTA ("cancelación gratis", "reserva instantánea") que
  nuestro flujo por WhatsApp no garantiza.
- Keyword stuffing de "barato/cheap" — no es nuestro posicionamiento.
