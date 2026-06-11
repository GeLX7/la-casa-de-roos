"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children = "Guardar",
  variant = "primary",
}: {
  children?: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const { pending } = useFormStatus();
  const base =
    variant === "primary"
      ? "bg-arcilla-500 text-white hover:bg-arcilla-600"
      : "border border-sillar-300 text-tinta-700 hover:border-arcilla-400 hover:text-arcilla-600";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${base}`}
    >
      {pending ? "Guardando…" : children}
    </button>
  );
}

/** Submit that asks for confirmation first — used by destructive actions. */
export function ConfirmSubmit({
  children,
  message,
}: {
  children: React.ReactNode;
  message: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className="rounded-md border border-arcilla-400/50 px-3 py-1.5 text-xs font-semibold text-arcilla-600 transition-colors hover:bg-arcilla-50 disabled:opacity-50"
    >
      {pending ? "…" : children}
    </button>
  );
}
