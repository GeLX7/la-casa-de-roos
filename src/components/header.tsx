"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/habitaciones", label: "Habitaciones" },
  { href: "/arequipa", label: "Arequipa" },
  { href: "/contacto", label: "Contacto" },
] as const;

/* Branded bar in the logo's own background cream (crema-50, sampled from
   logo-mark.jpg) so the mark merges seamlessly with the bar and can sit
   large on the left as the brand anchor. Layout: brand left, nav centered,
   reserve CTA right. Text drops to the lockup's cacao brown for contrast
   on cream; the CTA keeps white-on-arcilla. */
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-sillar-300/70 bg-crema-50/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 md:grid md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 md:justify-self-start"
        >
          {/* Owner-provided brand lockup (docs/research/content-rights-checklist.md);
              borderless so it blends into the matching cream bar. */}
          <Image
            src="/images/brand/logo-mark.jpg"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 rounded-md object-cover"
            priority
          />
          <span className="font-display text-sm font-extrabold uppercase leading-tight tracking-[0.08em] text-cacao-900 sm:text-[15px]">
            La Casa de <span className="text-arcilla-600">Roos</span>
          </span>
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center justify-center gap-6 md:flex lg:gap-8"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`border-b-2 pb-1 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                pathname === item.href
                  ? "border-arcilla-500 text-cacao-900"
                  : "border-transparent text-cacao-800/70 hover:text-cacao-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/reservar"
          className="hidden bg-arcilla-500 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white shadow-sm transition-colors hover:bg-arcilla-600 md:inline-flex md:justify-self-end"
        >
          Solicitar reserva
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-cacao-900 md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Principal móvil"
          className="border-t border-sillar-300/70 bg-crema-50 px-6 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block border-l-2 py-1.5 pl-3 text-sm font-bold uppercase tracking-[0.14em] ${
                    pathname === item.href
                      ? "border-arcilla-500 text-cacao-900"
                      : "border-transparent text-cacao-800/70"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/reservar"
                onClick={() => setOpen(false)}
                className="mt-1 block bg-arcilla-500 px-4 py-2.5 text-center text-sm font-bold uppercase tracking-[0.1em] text-white"
              >
                Solicitar reserva
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
