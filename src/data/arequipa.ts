/**
 * Original guest-guide copy for La Casa de Roos.
 * Research source: https://www.arequipa.com/info/ (checked 2026-06-10).
 * Copy is original. The images under /public/images/arequipa/ are public
 * tourism photos sourced from Arequipa.com for this preview/MVP only —
 * temporary reference assets pending owner approval / licensing review
 * before public launch (docs/research/content-rights-checklist.md).
 */

export const arequipaFacts = [
  { label: "Altitud", value: "2,330 m" },
  { label: "Para una primera visita", value: "2 a 4 días" },
  { label: "Mejor temporada seca", value: "abril a diciembre" },
  { label: "Desde la casa", value: "centro a pie" },
] as const;

export const arequipaNearby = [
  {
    title: "Plaza de Armas y portales de sillar",
    text: "El punto de partida natural para orientarte, mirar la catedral y caminar sin prisa por el centro histórico.",
  },
  {
    title: "Monasterio de Santa Catalina",
    text: "Uno de los recorridos más especiales de Arequipa: patios, color, silencio y varias horas de arquitectura viva.",
  },
  {
    title: "Calle Mercaderes",
    text: "La conexión rápida para cafés, compras, bancos, farmacias y movimiento urbano sin depender de taxi.",
  },
  {
    title: "Ruta del Sillar",
    text: "Una salida corta para entender la piedra volcánica que le da carácter y nombre a la Ciudad Blanca.",
  },
] as const;

/**
 * Curated activities/places gallery. Images: temporary tourism/reference
 * assets from Arequipa.com (see header note).
 */
export const arequipaExperiences = [
  {
    title: "Monasterio de Santa Catalina",
    tag: "Imperdible",
    text: "Una ciudadela dentro de la ciudad: muros rojos y azules, patios en silencio y varias horas de recorrido a tu ritmo.",
    image: "/images/arequipa/santa-catalina.jpg",
    alt: "Corredor rojo con arcos y macetas en el Monasterio de Santa Catalina",
    distance: "± 7 min a pie",
  },
  {
    title: "Plaza de Armas y la Catedral",
    tag: "Centro histórico",
    text: "Portales de sillar, la catedral de frente y los volcanes detrás. El mejor punto para empezar y para volver al atardecer.",
    image: "/images/arequipa/catedral-misti.jpg",
    alt: "Torre de la Catedral de Arequipa con el volcán Chachani nevado al fondo",
    distance: "± 3 min a pie",
  },
  {
    title: "Mirador de Yanahuara",
    tag: "Vistas",
    text: "Arcos de sillar con el Misti de fondo y la ciudad completa a los pies. Ideal para una tarde corta fuera del centro.",
    image: "/images/arequipa/mirador-yanahuara.jpg",
    alt: "Pérgolas del mirador de Yanahuara con el volcán Misti al fondo",
    distance: "± 10 min en taxi",
  },
  {
    title: "Cañón del Colca",
    tag: "Excursión",
    text: "Terrazas, cóndores y uno de los cañones más profundos del mundo. Se visita en tour de un día o con una noche en el valle.",
    image: "/images/arequipa/canon-del-colca.jpg",
    alt: "Vista panorámica del Cañón del Colca con terrazas y el río al fondo",
    distance: "excursión de 1 a 2 días",
  },
  {
    title: "Ruta del Sillar",
    tag: "Cultura viva",
    text: "Las canteras blancas donde nace la piedra de la Ciudad Blanca, con figuras talladas directamente en la roca.",
    image: "/images/arequipa/ruta-del-sillar.jpg",
    alt: "Paredes de sillar blanco talladas en las canteras de Añashuayco",
    distance: "media jornada",
  },
  {
    title: "Cocina arequipeña",
    tag: "Sabores",
    text: "Rocoto relleno, chupe de camarones y picanterías de tradición. Varias de las mejores quedan a minutos de la casa.",
    image: "/images/arequipa/gastronomia-rocoto.jpg",
    alt: "Rocoto relleno arequipeño servido con pastel de papa",
    distance: "alrededor del centro",
  },
] as const;

export const arequipaGuide = [
  {
    title: "Qué hacer cerca",
    text: "Empieza por Plaza de Armas, Santa Catalina y los museos del centro. Si tienes más tiempo, suma Ruta del Sillar, miradores y un día para Colca.",
  },
  {
    title: "Cómo moverte",
    text: "Desde el centro, lo mejor es caminar para lo cercano y usar taxi por app para trayectos largos o llegadas tarde. Para buses locales conviene llevar monedas.",
  },
  {
    title: "Ideal para",
    text: "Parejas, viajeros solos y familias pequeñas que quieren dormir cerca de todo, volver a descansar a media tarde y salir otra vez sin organizar traslados.",
  },
  {
    title: "Antes de reservar",
    text: "Arequipa es amable, seca y de altura. La noche del centro puede tener vida y sonido; por eso contamos esa parte con claridad antes de confirmar.",
  },
] as const;
