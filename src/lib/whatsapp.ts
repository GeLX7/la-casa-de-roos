import { site } from "@/data/site";

/** wa.me deep link with a prefilled Spanish message. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const defaultWhatsappMessage =
  "Hola Roos, vi su página web y quisiera información sobre disponibilidad.";

export function roomWhatsappMessage(roomName: string): string {
  return `Hola Roos, vi su página web y me interesa la suite "${roomName}". ¿Tienen disponibilidad?`;
}
