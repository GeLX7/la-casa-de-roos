/**
 * Site-wide constants for La Casa de Roos.
 * Sources: docs/research/content-inventory.md (public Carrd + Airbnb data,
 * checked 2026-06-10). Exact street address pending from owner.
 */

/* Production lives on the Vercel subdomain until the owner buys a custom
   domain; NEXT_PUBLIC_SITE_URL overrides it when that day comes. Keeping
   the default truthful matters: metadataBase, canonical, sitemap, robots
   and JSON-LD all derive absolute URLs from it. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://la-casa-de-roos.vercel.app";

export const site = {
  name: "La Casa de Roos",
  tagline:
    "Suites y minidepartamentos en el corazón del Centro Histórico de Arequipa",
  description:
    "Suites privadas con baño propio, sala de estar y kitchenette en el Centro Histórico de Arequipa, a una cuadra de la Calle Mercaderes y a pasos de la Plaza de Armas.",
  locale: "es_PE",
  whatsappNumber: "51967757040",
  whatsappDisplay: "+51 967 757 040",
  // TODO(owner): notification email pending (questions-for-owner.md Q12).
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
