import Link from "next/link";
import { site } from "@/data/site";
import { whatsappUrl, defaultWhatsappMessage } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="border-t border-sillar-200 bg-sillar-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-tinta-900">
            La Casa de <span className="text-arcilla-500">Roos</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-tinta-700">
            {site.tagline}.
          </p>
          <p className="mt-3 text-sm text-tinta-500">{site.neighborhood}</p>
        </div>

        <nav aria-label="Pie de página" className="text-sm">
          <p className="mb-3 font-semibold text-tinta-900">Explora</p>
          <ul className="space-y-2 text-tinta-700">
            <li><Link href="/habitaciones" className="hover:text-arcilla-600">Habitaciones</Link></li>
            <li><Link href="/reservar" className="hover:text-arcilla-600">Solicitar reserva</Link></li>
            <li><Link href="/contacto" className="hover:text-arcilla-600">Contacto</Link></li>
            <li><Link href="/privacidad" className="hover:text-arcilla-600">Política de privacidad</Link></li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 font-semibold text-tinta-900">Contacto</p>
          <ul className="space-y-2 text-tinta-700">
            <li>
              <a href={whatsappUrl(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" className="hover:text-arcilla-600">
                WhatsApp {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-arcilla-600">
                Ver en Google Maps
              </a>
            </li>
            <li className="flex gap-4 pt-1">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-arcilla-600">Instagram</a>
              <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-arcilla-600">TikTok</a>
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-arcilla-600">Facebook</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sillar-200 px-6 py-4">
        <p className="mx-auto max-w-6xl text-xs leading-relaxed text-tinta-500">
          © {new Date().getFullYear()} La Casa de Roos, Arequipa. Sitio
          independiente: Airbnb es una marca de Airbnb, Inc.; este sitio no está
          afiliado a Airbnb. Las calificaciones citadas provienen de nuestros
          anuncios públicos en Airbnb ({site.ratingsCheckedAt}).
        </p>
      </div>
    </footer>
  );
}
