import { site } from "@/data/site";
import { appendMarkers } from "@/lib/source";

/** wa.me deep link with a prefilled Spanish message. The "(ref: web)" marker is
 *  part of the link itself (also server-rendered), so it survives right-click,
 *  copy link and no-JS clicks; the UTM "(fuente: …)" is added on click by
 *  SourceCapture. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(appendMarkers(message, null))}`;
}

export const defaultWhatsappMessage =
  "Hola Roos, vi su página web y quisiera información sobre disponibilidad.";

export function roomWhatsappMessage(roomName: string): string {
  return `Hola Roos, vi su página web y me interesa la suite "${roomName}". ¿Tienen disponibilidad?`;
}
