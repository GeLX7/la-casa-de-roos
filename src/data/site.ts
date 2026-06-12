/**
 * Site-wide constants for La Casa de Roos.
 * Sources: docs/research/content-inventory.md (public Carrd + Airbnb data,
 * checked 2026-06-10). Exact street address pending from owner.
 */

/* Canonical host. lacasaderoos.com was purchased through Vercel on
   2026-06-11 (Vercel-managed DNS, HTTPS live on apex and www); the apex is
   the primary and every other host (www + *.vercel.app) consolidates into
   it via the canonical tags — which all derive from this constant, as do
   metadataBase, sitemap, robots and JSON-LD. NEXT_PUBLIC_SITE_URL can
   still override per environment. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lacasaderoos.com";

/* Master indexing switch. While false, every page carries noindex: the
   site stays out of Google until the custom domain resolves and the SEO
   launch plan (docs/seo/SEO_LAUNCH_PLAN.md) is approved. Flip to true,
   redeploy, then follow the plan's go-live checklist. */
export const INDEXABLE = true;

export const site = {
  name: "La Casa de Roos",
  tagline:
    "Suites y minidepartamentos en el corazón del Centro Histórico de Arequipa",
  /* Short variant for <title> (the full tagline pushes the browser/search
     title past Google's ~60-char display cutoff). */
  seoTagline: "Suites en el Centro Histórico de Arequipa",
  description:
    "Suites privadas con baño propio, sala de estar y kitchenette en el Centro Histórico de Arequipa, a una cuadra de la Calle Mercaderes y a pasos de la Plaza de Armas.",
  locale: "es_PE",
  whatsappNumber: "51967757040",
  whatsappDisplay: "+51 967 757 040",
  /* WhatsApp is the only direct contact/reservation channel; there is no
     email workflow (owner decision, June 2026). */
  city: "Arequipa",
  region: "Arequipa",
  country: "PE",
  neighborhood: "Cercado de Arequipa, Centro Histórico",
  // TODO(owner): exact street address approved for publication (Q4), pending value.
  mapsUrl: "https://maps.app.goo.gl/EkTeDgo46YoJXW8o9",
  checkin: "14:00",
  checkout: "11:00",
  social: {
    instagram: "https://www.instagram.com/lacasaderoosaqp/",
    tiktok: "https://www.tiktok.com/@lacasaderoos",
    facebook: "https://www.facebook.com/profile.php?id=61579891154411",
  },
  /** Date the public Airbnb figures below were last checked. */
  ratingsCheckedAt: "junio 2026",
} as const;

export const landmarks = [
  { name: "Calle Mercaderes", walk: "1 min a pie" },
  { name: "Plaza de Armas", walk: "± 3 min a pie" },
  { name: "Monasterio de Santa Catalina", walk: "± 7 min a pie" },
  { name: "Cafés, restaurantes y bares del centro", walk: "en la misma cuadra" },
] as const;
