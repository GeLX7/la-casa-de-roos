"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/habitaciones", label: "Habitaciones" },
  { href: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-sillar-200/80 bg-sillar-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-lg font-semibold text-tinta-900"
        >
          La Casa de <span className="text-arcilla-500">Roos</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 sm:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors hover:text-arcilla-600 ${
                pathname === item.href
                  ? "font-semibold text-tinta-900"
                  : "text-tinta-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/reservar"
            className="rounded-full bg-arcilla-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-arcilla-600"
          >
            Solicitar reserva
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex h-10 w-10 items-center justify-center rounded-md text-tinta-900 sm:hidden"
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
          className="border-t border-sillar-200 bg-sillar-50 px-6 py-4 sm:hidden"
        >
          <ul className="flex flex-col gap-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-base text-tinta-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/reservar"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-full bg-arcilla-500 px-4 py-2.5 text-center text-base font-semibold text-white"
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
