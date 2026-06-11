import type { Metadata } from "next";
import type { ReactNode } from "react";

/* Admin Mode shell. Never indexable; robots.ts also disallows /admin. The
   marketing header/footer stay out — the admin is its own functional space. */

export const metadata: Metadata = {
  title: "Admin · La Casa de Roos",
  robots: { index: false, follow: false, nocache: true },
};

/* Always render per request: the setup/auth guard must reflect the live
   environment, never a build-time snapshot. */
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-sillar-50">{children}</div>;
}
