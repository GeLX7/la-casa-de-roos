"use client";

import { usePathname } from "next/navigation";
import { WhatsApp } from "@/components/icons";
import { whatsappUrl, defaultWhatsappMessage } from "@/lib/whatsapp";

/**
 * Sticky WhatsApp button — primary conversion channel, visible site-wide
 * except on /reservar, where the whole page is already a WhatsApp CTA and
 * the floating button overlapped the form on small screens.
 */
export function WhatsAppFab() {
  const pathname = usePathname();
  if (pathname === "/reservar") return null;

  return (
    <a
      href={whatsappUrl(defaultWhatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcilla-500"
    >
      <WhatsApp className="h-7 w-7" />
    </a>
  );
}
