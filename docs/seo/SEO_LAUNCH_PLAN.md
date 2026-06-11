# SEO Launch Plan — La Casa de Roos

Estado: **pre-indexación** (el sitio sirve `noindex` en todas las páginas).
Última actualización: 2026-06-11 · Investigación SERP: junio 2026.

Interruptor maestro: `INDEXABLE` en `src/data/site.ts`. Mientras sea `false`,
ninguna página se indexa. No activarlo hasta completar el checklist de
go-live (§8) y tener la aprobación del dueño del proyecto.

---

## 1. Situación

- Producción: `https://la-casa-de-roos.vercel.app` (canonical actual, veraz).
- `lacasaderoos.com` **aún no está registrado** (verificado contra el registry
  de Verisign, junio 2026): fue añadido al proyecto de Vercel pero nadie lo
  compró. Hasta tenerlo comprado + DNS válido + HTTPS, el dominio canónico
  sigue siendo el subdominio de Vercel.
- 4 suites privadas, sin dirección exacta publicada (pendiente del dueño),
  reservas por WhatsApp, prueba social de Airbnb (★ ~4.9, +347 reseñas).

## 2. Hallazgos de la investigación (junio 2026)

### 2.1 Composición de resultados por tipo de búsqueda

| Búsqueda (ejemplos) | Intención | Quién domina | ¿Rankeable para nosotros? |
|---|---|---|---|
| `hospedaje en Arequipa`, `hoteles Arequipa centro` | Transaccional amplia | OTAs: Booking (páginas de landmark/ciudad), Hotels.com, Airbnb, agregadores (cozycozy, atrapalo) | No a corto plazo — muro de autoridad de dominio |
| `dónde hospedarse en Arequipa`, `mejor zona` | Informacional | Blogs de viaje (espartedelviaje, losviajesdedomi, kiwinomada; misstourist/imjesstraveling en inglés) + guías de Expedia | A mediano plazo con contenido de guía; no es la batalla inicial |
| `suite/habitación con baño privado cerca Plaza de Armas` | Transaccional larga cola | SERP débil: scrapers, fichas sueltas de Airbnb, y **sitios propios de hoteles pequeños** (p. ej. arequipasuiteplazahotel.com) | **Sí — esta es nuestra vía principal** |
| `mini departamento amoblado Arequipa` | Alquiler de largo plazo | Clasificados inmobiliarios (Urbania, Adondevivir, MercadoLibre) | Intención equivocada: usar solo con calificador turístico/“por noche” |
| `qué hacer en Arequipa`, `Santa Catalina`, `Plaza de Armas` | Informacional turística | Operadores de tours + blogs | Soporte topical (página /arequipa), no objetivo de ranking inicial |
| `La Casa de Roos` (marca) | Navegacional | Hoy: Airbnb/Instagram | **Sí, inmediato y crítico** — debemos ser #1 |

### 2.2 Lectura estratégica

1. **La marca primero.** Huéspedes que nos vieron en Airbnb/Instagram/boca a
   boca nos googlean. Ese tráfico convierte mejor y Google lo usa como señal
   de entidad. El sitio + (futuro) Google Business Profile deben ser el
   resultado #1 por "La Casa de Roos" / "La Casa de Roos Arequipa".
2. **Larga cola descriptiva, no términos de cabeza.** Los SERPs de
   "suites/habitación + baño privado + centro histórico / Plaza de Armas /
   Calle Mercaderes" están poco defendidos. Nuestras páginas ya hablan ese
   idioma; hay que afinarlo, no inventar páginas nuevas.
3. **El mayor multiplicador local no es el sitio: es Google Business
   Profile** (pack de mapas). Bloqueado por la dirección exacta (pendiente
   del dueño). Sin GBP no hay pack local; el sitio solo compite en orgánico.
4. **Patrón de títulos de la competencia chica que sí rankea:**
   `[tipo de alojamiento] + [diferenciador] + [referencia geográfica]`
   (p. ej. "Habitación doble, baño privado, 10 cuadras Plaza de Armas").
   Nuestros títulos de listings ya siguen este patrón — mantenerlo.

### 2.3 Clusters de palabras clave objetivo

- **Marca:** la casa de roos · la casa de roos arequipa · casa de roos.
- **Primario (ES, larga cola):** suites con baño privado centro histórico
  arequipa · habitación privada cerca plaza de armas arequipa · hospedaje
  cerca calle mercaderes · suite con kitchenette arequipa centro ·
  minidepartamento turístico centro histórico arequipa.
- **Secundario (EN):** private suite historic center arequipa · rooms near
  plaza de armas arequipa · guesthouse arequipa historic center. (El sitio
  es solo-ES por ahora; capturable vía títulos de listings que ya mezclan
  términos y, a futuro, una versión EN — ver §9.)
- **Soporte informacional:** qué hacer en arequipa centro · guía arequipa a
  pie (página /arequipa, alimenta enlaces internos hacia las suites).

## 3. Auditoría técnica (estado actual)

Ya correcto — no tocar:
- `metadataBase` + canonical absolutos y veraces (subdominio Vercel).
- `sitemap.xml` dinámico (8 URLs), `robots.txt` con referencia al sitemap.
- Favicon/icons/manifest con el logo real; OG/Twitter image 1200×630 de
  marca con alt en español.
- JSON-LD: `LodgingBusiness` global (+ `logo`, `image`, `hasMap`,
  `numberOfRooms`) y `Accommodation` por suite con `amenityFeature`.
- `/privacidad` con `noindex` propio (placeholder legal).
- 404 dedicada, jerarquía h1–h3 sana, breadcrumbs en suites, microcopy y
  alt-text en español, imágenes locales optimizadas (≤ ~400 KB), sin JS
  pesado.

Implementado en este pase:
- **Pausa de indexación** site-wide (`INDEXABLE=false` → `noindex, follow`).
- **Título en Title Case real** ("La Casa de Roos · Suites en el Centro
  Histórico de Arequipa") — antes gritaba en mayúsculas; los heads visibles
  del diseño siguen uppercase por CSS, que es donde corresponde.
- Título por suite deduplicado (`listing.title · La Casa de Roos`).
- Manifest con nombre en Title Case.

Deuda aceptada conscientemente (no bloquea indexación):
- Dirección postal incompleta en JSON-LD (sin `streetAddress`) hasta que el
  dueño la apruebe.
- Sin hreflang/versión EN (sitio monolingüe por decisión de MVP).

## 4. Checklist SEO local

- [ ] Dirección exacta aprobada por el dueño → añadir `streetAddress` +
      `postalCode` al JSON-LD y al footer (NAP visible).
- [ ] **Google Business Profile** "La Casa de Roos" (categoría: casa de
      huéspedes/hospedaje), con el mismo nombre, teléfono (+51 967 757 040)
      y dirección que el sitio y Airbnb (consistencia NAP estricta).
- [ ] Vincular GBP ↔ sitio web (dominio final, no el subdominio Vercel).
- [ ] Fotos del GBP: usar las mismas fotos reales de las suites.
- [ ] Pedir a huéspedes felices reseñas en Google (no solo Airbnb).
- [ ] `geo` (lat/long) en JSON-LD cuando exista dirección publicada.

## 5. Títulos y descripciones por página (estado tras este pase)

| Página | `<title>` | Nota |
|---|---|---|
| `/` | La Casa de Roos · Suites en el Centro Histórico de Arequipa | ~60 chars; keyword + marca |
| `/habitaciones` | Habitaciones y suites en el Centro Histórico de Arequipa · La Casa de Roos | ok |
| `/habitaciones/[slug]` | {título del listing} · La Casa de Roos | listing titles ya geo-cargados |
| `/arequipa` | Guía de Arequipa para hospedarte en el Centro Histórico · La Casa de Roos | ok |
| `/reservar` | Solicitar reserva · La Casa de Roos | transaccional propia |
| `/contacto` | Contacto · La Casa de Roos | ok |
| `/privacidad` | (noindex) | ok |

Descripciones: todas mencionan baño privado / kitchenette / Calle
Mercaderes / Plaza de Armas — alineadas con los clusters. Revisar solo si
cambia el inventario.

## 6. Contenido — qué NO hace falta ahora

No crear todavía landing pages tipo `/hospedaje-arequipa-centro-historico`
o `/habitaciones-cerca-plaza-de-armas-arequipa`: con 8 URLs y sin señales
de autoridad, fragmentar sería canibalizar nuestras propias páginas. Las
páginas actuales ya mapean 1:1 a los clusters. Reevaluar con datos de GSC
(≥ 2–3 meses post-indexación): si aparecen impresiones por consultas que
ninguna página atiende bien, ahí sí crear la landing específica.

## 7. SEO de conversión (ya sano, mantener)

- CTA WhatsApp persistente + mensajes precargados por suite.
- Lenguaje honesto: "solicitar reserva" (no promete booking instantáneo).
- Prueba social Airbnb con atribución explícita y fecha de corte.
- Bloque "Hablemos claro" (ruido nocturno, sin A/C) — reduce reseñas
  negativas futuras; es señal E-E-A-T rara en este nicho.

## 8. Go-live de indexación (ejecutar en orden, con aprobación)

1. Comprar/registrar `lacasaderoos.com` (hoy disponible, ~US$11/año) —
   decisión del dueño. Configurar DNS según Vercel y esperar HTTPS válido.
2. Decidir host canónico: recomendado `www.lacasaderoos.com` como primario
   (CNAME requerido por Vercel) y apex redirigiendo 308 → www en Vercel.
3. Setear `NEXT_PUBLIC_SITE_URL=https://www.lacasaderoos.com` en Vercel
   (Production) — canonical, sitemap, robots, OG y JSON-LD se actualizan
   solos (todo deriva de `SITE_URL`).
4. Verificar que el subdominio `*.vercel.app` redirige al dominio custom
   (Vercel lo hace automático al asignar el dominio a Production).
5. Flip `INDEXABLE = true` → deploy → verificar `meta robots` = `index,
   follow` en producción y que `/sitemap.xml` y `/robots.txt` muestren el
   dominio nuevo.
6. Google Search Console: crear propiedad de **Dominio** (lacasaderoos.com)
   con verificación DNS TXT, o propiedad de prefijo https://www. Enviar
   `https://www.lacasaderoos.com/sitemap.xml`.
7. Inspección de URL + "Solicitar indexación" para `/`, `/habitaciones` y
   las 4 suites (en ese orden de prioridad).
8. Crear GBP (cuando haya dirección) y enlazarlo al dominio.

## 9. Monitoreo post-launch

- Semana 1–2: GSC → Cobertura (las 8 URLs indexadas, sin "duplicada sin
  canonical"), rendimiento de la query de marca.
- Mes 1–3: impresiones/clicks por cluster de larga cola; CTR de títulos
  (si Google reescribe títulos, acortar/ajustar); Core Web Vitals en GSC.
- Trimestral: reevaluar landing pages específicas (§6), considerar versión
  EN si ≥ ~20 % de impresiones vienen de queries en inglés.
- El favicon en resultados de Google puede tardar días/semanas en aparecer
  tras la indexación — ya servimos el icono correcto, no hay acción.

## 10. Qué NO hacer todavía

- No enviar a GSC ni pedir indexación (sitio en `noindex` deliberado).
- No comprar dominio sin aprobación explícita del dueño.
- No crear landing pages de keywords (§6) ni blog.
- No publicar dirección exacta hasta aprobación del dueño.
- No añadir `aggregateRating` al JSON-LD con datos de Airbnb (las reseñas
  no están en nuestro sitio; mostrarlas visualmente con atribución es lo
  correcto, marcarlas como schema propio arriesga penalización de rich
  results).
- No tocar LAZZAT ni añadir backend/booking real.
