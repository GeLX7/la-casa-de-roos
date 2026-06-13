import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { whatsappUrl, defaultWhatsappMessage } from "@/lib/whatsapp";
import { Instagram, TikTok, Facebook, WhatsApp, MapPin } from "@/components/icons";

const socials = [
  { name: "Instagram", href: site.social.instagram, icon: Instagram },
  { name: "TikTok", href: site.social.tiktok, icon: TikTok },
  { name: "Facebook", href: site.social.facebook, icon: Facebook },
  { name: "WhatsApp", href: whatsappUrl(defaultWhatsappMessage), icon: WhatsApp },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-sillar-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          {/* Owner-provided brand lockup */}
          <Image
            src="/images/brand/logo-mark.jpg"
            alt="Logo de La Casa de Roos"
            width={72}
            height={72}
            className="h-18 w-18 rounded-lg border border-sillar-200 object-cover"
          />
          <p className="mt-4 font-display text-base font-bold uppercase tracking-[0.1em] text-tinta-900">
            La Casa de <span className="text-arcilla-500">Roos</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-tinta-700">
            {site.tagline}.
          </p>
          <p className="mt-3 text-sm text-tinta-500">{site.neighborhood}</p>
        </div>

        <nav aria-label="Pie de página" className="text-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-tinta-900">
            Explora
          </p>
          <ul className="space-y-2 text-tinta-700">
            <li><Link href="/habitaciones" className="hover:text-arcilla-600">Habitaciones</Link></li>
            <li><Link href="/arequipa" className="hover:text-arcilla-600">Arequipa</Link></li>
            <li><Link href="/reservar" className="hover:text-arcilla-600">Solicitar reserva</Link></li>
            <li><Link href="/contacto" className="hover:text-arcilla-600">Contacto</Link></li>
            <li><Link href="/privacidad" className="hover:text-arcilla-600">Política de privacidad</Link></li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-tinta-900">
            Contacto
          </p>
          <ul className="space-y-2 text-tinta-700">
            <li>
              <a href={whatsappUrl(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-arcilla-600">
                <WhatsApp className="h-4 w-4 shrink-0 text-arcilla-500" />
                WhatsApp {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-arcilla-600">
                <MapPin className="h-4 w-4 shrink-0 text-arcilla-500" />
                Ver en Google Maps
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Centered social band (composition cue: lazzat.online footer) */}
      <div className="border-t border-sillar-200">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-tinta-900">
            Síguenos
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 border border-sillar-200 bg-sillar-50/60 px-4 py-3.5 text-sm font-semibold text-tinta-900 transition-colors hover:border-arcilla-400 hover:text-arcilla-600"
                >
                  <s.icon className="h-4.5 w-4.5 text-arcilla-500" />
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-sillar-200 bg-sillar-50/60 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-xs leading-relaxed text-tinta-500">
            © {new Date().getFullYear()} La Casa de Roos, Arequipa. Sitio
            independiente: Airbnb es una marca de Airbnb, Inc.; este sitio no está
            afiliado a Airbnb. Las calificaciones citadas provienen de nuestros
            anuncios públicos en Airbnb ({site.ratingsCheckedAt}).
          </p>
          {/* Discreet owner entry point. /admin is protected (kill switch +
              login) and noindex; rel=nofollow keeps it out of SEO weight. */}
          <Link
            href="/admin"
            rel="nofollow"
            className="shrink-0 self-end text-xs text-tinta-400 underline-offset-2 transition-colors hover:text-arcilla-600 hover:underline sm:self-auto"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
