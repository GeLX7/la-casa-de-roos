/**
 * Static catalog of the four suites.
 *
 * Facts (capacity, ratings, review counts, amenities, rules) come from the
 * owner's public Airbnb listings as documented in
 * docs/research/content-inventory.md (checked 2026-06-10). Copy is written
 * fresh for this site — never paste Airbnb text verbatim.
 *
 * PHOTOS: full galleries are TEMPORARY owner-source-derived assets exported
 * from the owner's own public Airbnb listings (public room-tour data,
 * downloaded 2026-06-10, recompressed and stored locally under
 * public/images/listings/<slug>/ — never hotlinked). Categories and alt
 * text derive from Airbnb's own public room-tour labels. Photos repeated
 * across all four listings (guest kitchen, YURAKUNA restaurant) are pooled
 * once under public/images/listings/comunes/. All of it pending owner
 * originals or explicit approval (docs/research/content-rights-checklist.md).
 *
 * CATEGORY RATINGS: official per-category scores published on each public
 * Airbnb listing page (checked 2026-06-10) — display-only, attributed,
 * never marked up as schema.org aggregateRating.
 *
 * PRICES: owner decision 2026-06-10 — no fixed rates yet and iCal cannot
 * sync Airbnb prices, so every suite shows `priceLabel` ("Consultar precio").
 */

export type GallerySlot = {
  /** Stable id for the photo slot. */
  slot: string;
  /** Spanish label shown inside the placeholder and used as alt text. */
  label: string;
  /** Local asset path (e.g. "/images/brand/casa-hero.jpg"). null = pending. */
  src: string | null;
};

export type GalleryCategory =
  | "Sala"
  | "Habitación"
  | "Cocina"
  | "Baño"
  | "Áreas comunes"
  | "Entorno"
  | "Detalles";

export type GalleryPhoto = {
  /** Local asset path — Airbnb-derived photos are stored locally, never hotlinked. */
  src: string;
  alt: string;
  category: GalleryCategory;
};

/** Official per-category scores from the public Airbnb listing page. */
export type CategoryRatings = {
  cleanliness: number;
  accuracy: number;
  checkin: number;
  communication: number;
  location: number;
  value: number;
};

export type Listing = {
  slug: string;
  /** H1 — Airbnb listing title (owner decision: Airbnb titles win). */
  title: string;
  /** Subtitle — the friendlier Carrd suite name. */
  subtitle: string;
  airbnbUrl: string;
  airbnbListingId: string;
  rating: number;
  reviewCount: number;
  guestFavorite: boolean;
  capacity: number;
  beds: string;
  bath: string;
  shortDescription: string;
  longDescription: string[];
  /** Icon key + label, rendered with AmenityList. */
  amenities: { icon: string; label: string }[];
  notIncluded: string[];
  rules: string[];
  quietHours: string;
  priceLabel: string;
  gallery: GalleryPhoto[];
  categoryRatings: CategoryRatings;
};

const sharedAmenities: { icon: string; label: string }[] = [
  { icon: "wifi", label: "Wifi" },
  { icon: "bath", label: "Baño privado con agua caliente" },
  { icon: "tv", label: "TV" },
  { icon: "kitchen", label: "Kitchenette: minirefrigerador, microondas y cafetera" },
  { icon: "shared-kitchen", label: "Cocina compartida solo para huéspedes" },
  { icon: "key", label: "Llegada autónoma con caja de seguridad" },
  { icon: "luggage", label: "Guardado de equipaje" },
  { icon: "moon", label: "Tapones para los oídos de cortesía" },
  { icon: "calendar", label: "Disponible para estadías largas" },
  { icon: "laundry", label: "Lavandería cercana" },
  { icon: "parking", label: "Estacionamiento de pago cerca" },
];

const sharedNotIncluded = [
  "Aire acondicionado y calefacción (el clima templado de Arequipa los hace poco necesarios)",
  "Lavadora y secadora (hay lavandería a pasos)",
  "Cocina completa dentro de la suite (kitchenette privado + cocina compartida de huéspedes)",
];

const baseRules = (quietHours: string) => [
  "Check-in desde las 14:00 (llegada autónoma con caja de seguridad)",
  "Check-out antes de las 11:00",
  `Horas de silencio: ${quietHours}`,
  "No se permiten fiestas ni eventos",
  "Prohibido fumar dentro del alojamiento",
  "No se admiten mascotas",
  "Penalidad de S/ 350 por incumplir las normas de la casa",
];

/** Sequentially numbered photos of one space (sala-01.jpg, sala-02.jpg…). */
const photoRun = (
  slug: string,
  prefix: string,
  category: GalleryCategory,
  alt: string,
  count: number,
): GalleryPhoto[] =>
  Array.from({ length: count }, (_, i) => ({
    src: `/images/listings/${slug}/${prefix}-${String(i + 1).padStart(2, "0")}.jpg`,
    alt: `${alt}, foto ${i + 1}`,
    category,
  }));

/**
 * Photos the owner repeats on all four Airbnb listings (guest kitchen and
 * the YURAKUNA restaurant downstairs) — stored once under comunes/ and
 * appended to every suite gallery.
 */
const sharedGallery: GalleryPhoto[] = [
  ...photoRun("comunes", "area-comun", "Áreas comunes", "Cocina compartida exclusiva para huéspedes", 5),
  ...photoRun("comunes", "entorno", "Entorno", "Restaurante YURAKUNA en el primer piso del edificio", 6),
];

/**
 * Per-suite gallery: the suite's own photos (category counts mirror the
 * files under public/images/listings/<slug>/) followed by the shared set.
 * Order follows the Airbnb room tour: sala → habitación → baño.
 */
const suiteGallery = (
  slug: string,
  counts: { sala: number; habitacion: number; bano: number; areaComun?: number },
): GalleryPhoto[] => [
  ...photoRun(slug, "sala", "Sala", "Sala de estar de la suite", counts.sala),
  ...photoRun(slug, "habitacion", "Habitación", "Dormitorio de la suite", counts.habitacion),
  ...photoRun(slug, "bano", "Baño", "Baño privado de la suite", counts.bano),
  ...(counts.areaComun
    ? photoRun(slug, "area-comun", "Áreas comunes", "Cocina compartida exclusiva para huéspedes", counts.areaComun)
    : []),
  ...sharedGallery,
];

export const listings: Listing[] = [
  {
    slug: "suite-queen-con-sala",
    title: "Habitación Corazón Centro Histórico Arequipa",
    subtitle: "Suite Queen con sala y vista al Centro Histórico",
    airbnbUrl: "https://www.airbnb.com.pe/rooms/1352543068552764001",
    airbnbListingId: "1352543068552764001",
    rating: 4.91,
    reviewCount: 86,
    guestFavorite: true,
    capacity: 2,
    beds: "1 cama queen",
    bath: "Baño privado",
    shortDescription:
      "Suite amplia con sala de estar independiente, zona de trabajo y vista hacia el centro histórico. Cama queen, baño propio y kitchenette para empezar el día con calma.",
    longDescription: [
      "La suite más valorada de la casa: un dormitorio acogedor con cama queen, una sala privada con vista hacia el centro histórico y una zona de trabajo cómoda si viajas con el laptop a cuestas.",
      "Está dentro de un edificio empresarial seguro y tranquilo, a una cuadra de la Calle Mercaderes. Bajas las escaleras y estás en el corazón de Arequipa: la Plaza de Armas, el Monasterio de Santa Catalina y los mejores cafés quedan a minutos a pie.",
    ],
    amenities: [
      ...sharedAmenities,
      { icon: "desk", label: "Zona de trabajo" },
      { icon: "iron", label: "Plancha" },
    ],
    notIncluded: sharedNotIncluded,
    rules: baseRules("23:00 a 06:00"),
    quietHours: "23:00 a 06:00",
    priceLabel: "Consultar precio",
    gallery: suiteGallery("suite-queen-con-sala", { sala: 5, habitacion: 5, bano: 5 }),
    categoryRatings: {
      cleanliness: 4.94,
      accuracy: 4.88,
      checkin: 4.93,
      communication: 4.92,
      location: 4.87,
      value: 4.9,
    },
  },
  {
    slug: "suite-queen-centro-historico",
    title: "Habitación Centro Histórico Arequipa",
    subtitle: "Suite Queen en el Centro Histórico",
    airbnbUrl: "https://www.airbnb.com.pe/rooms/1353094020937867539",
    airbnbListingId: "1353094020937867539",
    rating: 4.81,
    reviewCount: 90,
    guestFavorite: true,
    capacity: 2,
    beds: "1 cama queen",
    bath: "Baño privado",
    shortDescription:
      "Suite acogedora con sala privada y todo lo esencial para una estadía cómoda en pleno centro: cama queen, baño propio y kitchenette.",
    longDescription: [
      "Una suite pensada para descansar bien después de recorrer la ciudad: cama queen, sala de estar privada y un baño completo solo para ti. Los huéspedes destacan la comunicación y la ubicación con puntaje perfecto.",
      "El edificio es empresarial y seguro, con cocina compartida exclusiva para huéspedes y un restaurante vegano en el primer piso. Todo el centro histórico queda a pasos de la puerta.",
    ],
    amenities: sharedAmenities,
    notIncluded: sharedNotIncluded,
    rules: baseRules("23:00 a 06:00"),
    quietHours: "23:00 a 06:00",
    priceLabel: "Consultar precio",
    gallery: suiteGallery("suite-queen-centro-historico", { sala: 4, habitacion: 3, bano: 3 }),
    categoryRatings: {
      cleanliness: 4.92,
      accuracy: 4.84,
      checkin: 4.92,
      communication: 4.96,
      location: 4.99,
      value: 4.79,
    },
  },
  {
    slug: "suite-queen-con-vista",
    title: "Habitación Centro Histórico Arequipa",
    subtitle: "Suite Queen con vista al Centro Histórico",
    airbnbUrl: "https://www.airbnb.com.pe/rooms/1352529733779964415",
    airbnbListingId: "1352529733779964415",
    rating: 4.86,
    reviewCount: 74,
    guestFavorite: true,
    capacity: 2,
    beds: "1 cama queen",
    bath: "Baño privado",
    shortDescription:
      "Suite luminosa con vista al centro histórico, sala de estar privada, cama queen y baño completo. Favorita entre huéspedes en Airbnb.",
    longDescription: [
      "Luz natural y vista al centro histórico desde tu propia sala de estar. El dormitorio con cama queen y el baño privado completan un espacio íntimo y tranquilo dentro de un edificio empresarial seguro.",
      "Sales del edificio y en una cuadra estás en la Calle Mercaderes; en unos minutos, en la Plaza de Armas. Ideal para parejas que quieren vivir Arequipa caminando.",
    ],
    amenities: sharedAmenities,
    notIncluded: sharedNotIncluded,
    rules: baseRules("23:00 a 07:00"),
    quietHours: "23:00 a 07:00",
    priceLabel: "Consultar precio",
    gallery: suiteGallery("suite-queen-con-vista", { sala: 5, habitacion: 3, bano: 2 }),
    categoryRatings: {
      cleanliness: 4.91,
      accuracy: 4.86,
      checkin: 4.93,
      communication: 4.99,
      location: 4.91,
      value: 4.85,
    },
  },
  {
    slug: "mini-apartamento-familiar",
    title: "Mini Apartamento Cerca a Plaza de Armas",
    subtitle: "Suite Queen familiar con vista + cama extra",
    airbnbUrl: "https://www.airbnb.com.pe/rooms/1352501815600410248",
    airbnbListingId: "1352501815600410248",
    rating: 4.82,
    reviewCount: 97,
    guestFavorite: true,
    capacity: 3,
    beds: "1 cama queen + 1 cama individual",
    bath: "Baño privado",
    shortDescription:
      "El espacio más amplio de la casa: para hasta tres personas, con cama queen y cama adicional, sala, zona de trabajo y baño privado, muy cerca de la Plaza de Armas.",
    longDescription: [
      "Un minidepartamento ideal para tres viajeros o para quien simplemente quiere más espacio: dormitorio con cama queen, cama individual adicional, sala de estar amplia y zona de trabajo.",
      "Como toda La Casa de Roos, está dentro de un edificio empresarial seguro a una cuadra de Mercaderes, con cocina compartida de huéspedes y el centro histórico entero a minutos a pie.",
    ],
    amenities: [
      ...sharedAmenities,
      { icon: "desk", label: "Zona de trabajo" },
      { icon: "bed", label: "Cama individual adicional" },
    ],
    notIncluded: sharedNotIncluded,
    // TODO(owner): confirm quiet hours for this suite (Airbnb page didn't expose it).
    rules: baseRules("23:00 a 06:00"),
    quietHours: "23:00 a 06:00",
    priceLabel: "Consultar precio",
    gallery: suiteGallery("mini-apartamento-familiar", {
      sala: 7,
      habitacion: 9,
      bano: 4,
      areaComun: 1,
    }),
    categoryRatings: {
      cleanliness: 4.93,
      accuracy: 4.93,
      checkin: 4.92,
      communication: 4.92,
      location: 4.89,
      value: 4.85,
    },
  },
];

export function getListing(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}

/** Weighted aggregate of the public Airbnb ratings (display-only — never schema.org). */
export const aggregate = (() => {
  const totalReviews = listings.reduce((n, l) => n + l.reviewCount, 0);
  const weighted =
    listings.reduce((n, l) => n + l.rating * l.reviewCount, 0) / totalReviews;
  return {
    rating: Math.round(weighted * 100) / 100,
    reviewCount: totalReviews,
  };
})();
