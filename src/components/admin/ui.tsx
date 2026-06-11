import type { ReactNode } from "react";

/* Shared building blocks for Admin Mode: everything is grouped into clear
   editable cards ("cajas") with the La Casa de Roos palette, but plainer and
   more functional than the marketing site. */

export const inputClass =
  "w-full rounded-md border border-sillar-300 bg-white px-3 py-2 text-sm text-tinta-900 placeholder:text-tinta-500/50 focus:border-arcilla-400";

export const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-tinta-500";

export function AdminCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-sillar-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-display text-base font-bold text-tinta-900">{title}</h2>
      {description && (
        <p className="mt-1 text-xs leading-relaxed text-tinta-500">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelClass} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-sillar-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-tinta-500">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-extrabold text-tinta-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-tinta-500">{hint}</p>}
    </div>
  );
}

export function WarningCard({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-lg border border-arcilla-400/40 bg-arcilla-50 p-4">
      <p className="text-sm font-semibold text-arcilla-600">⚠ {label}</p>
      <p className="mt-1 text-xs leading-relaxed text-tinta-700">{detail}</p>
    </div>
  );
}

/** Success / error banner driven by ?saved=1 / ?error=... query params. */
export function ActionBanner({ saved, error }: { saved?: boolean; error?: string }) {
  if (error) {
    return (
      <p className="rounded-md border border-arcilla-400/50 bg-arcilla-50 px-4 py-2.5 text-sm text-arcilla-600">
        {error}
      </p>
    );
  }
  if (saved) {
    return (
      <p className="rounded-md border border-salvia-500/40 bg-salvia-100 px-4 py-2.5 text-sm text-salvia-700">
        Cambios guardados.
      </p>
    );
  }
  return null;
}

export function SetupNeededCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-sillar-200 bg-sillar-50 p-6">
      <h2 className="font-display text-base font-bold text-tinta-900">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-tinta-700">{children}</div>
      <p className="mt-4 text-xs text-tinta-500">
        Guía completa: <code>docs/runbooks/admin-supabase-setup.md</code>
      </p>
    </div>
  );
}
