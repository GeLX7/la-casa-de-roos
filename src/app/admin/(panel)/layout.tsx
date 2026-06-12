import Link from "next/link";
import type { ReactNode } from "react";
import { guardAdminPanel } from "@/lib/admin/auth";
import { logoutAction } from "@/lib/admin/actions";

const NAV = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/catalogo", label: "Catálogo" },
] as const;

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  /* Pages re-run this guard themselves; the layout only decides what shell
     to draw (setup mode has no session/logout). */
  const guard = await guardAdminPanel();

  return (
    <>
      <header className="border-b border-sillar-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3.5">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-sm font-extrabold uppercase tracking-[0.1em] text-tinta-900">
              La Casa de Roos · Admin
            </Link>
            <nav className="flex gap-4 text-sm text-tinta-700">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-arcilla-600"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/"
                target="_blank"
                className="text-tinta-500 hover:text-arcilla-600"
              >
                Ver sitio ↗
              </Link>
            </nav>
          </div>
          {guard.configured ? (
            <form action={logoutAction} className="flex items-center gap-3">
              <span className="text-xs text-tinta-500">{guard.session.username}</span>
              <button
                type="submit"
                className="rounded-md border border-sillar-300 px-3 py-1.5 text-xs font-semibold text-tinta-700 transition-colors hover:border-arcilla-400 hover:text-arcilla-600"
              >
                Salir
              </button>
            </form>
          ) : (
            <span className="rounded-md bg-sillar-100 px-3 py-1.5 text-xs font-semibold text-tinta-500">
              Modo configuración
            </span>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </>
  );
}
