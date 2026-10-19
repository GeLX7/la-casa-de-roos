"use client";

import { useMemo, useState } from "react";
import { listings } from "@/data/listings";
import { site } from "@/data/site";
import { addDays } from "@/lib/booking/dates";
import { AvailabilityChecker } from "@/components/availability-checker";
import { WhatsApp } from "@/components/icons";

/**
 * Request-to-book is WhatsApp-first by design: the form opens a prefilled
 * WhatsApp message and the owner confirms availability personally. The
 * availability panel calls the disabled-safe API route so the UI can show
 * live calendars once the Airbnb iCal URLs are configured — there is no
 * online checkout or payment step on the site.
 */
export function RequestForm({ initialSlug }: { initialSlug?: string }) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [submitState, setSubmitState] = useState<
    "idle" | "checking" | "request_sent" | "needs_confirmation"
  >("idle");
  const [form, setForm] = useState({
    suite: listings.some((l) => l.slug === initialSlug)
      ? (initialSlug as string)
      : listings[0].slug,
    checkin: "",
    checkout: "",
    guests: "2",
    name: "",
    contact: "",
    message: "",
  });

  const selected = listings.find((l) => l.slug === form.suite) ?? listings[0];

  // The guest count never exceeds the selected suite's capacity, even when the
  // visitor picked more guests on a larger suite and then switched suites.
  const guests = String(Math.min(Number(form.guests) || 1, selected.capacity));
  // A stay needs at least one night: the departure is after the arrival.
  const minCheckout = form.checkin ? addDays(form.checkin, 1) : addDays(today, 1);

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  // Moving the arrival to the departure date or later clears the departure.
  const setCheckin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkin = e.target.value;
    setForm((f) => ({
      ...f,
      checkin,
      checkout: f.checkout && checkin && f.checkout <= checkin ? "" : f.checkout,
    }));
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitState("checking");
    const lines = [
      "Hola Roos, quisiera solicitar una reserva desde la web:",
      `• Suite: ${selected.title} (${selected.subtitle})`,
      `• Llegada: ${form.checkin || "por definir"}`,
      `• Salida: ${form.checkout || "por definir"}`,
      `• Huéspedes: ${guests}`,
      `• Nombre: ${form.name}`,
      form.contact ? `• Contacto: ${form.contact}` : "",
      form.message ? `• Mensaje: ${form.message}` : "",
    ].filter(Boolean);
    window.open(
      `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSubmitState("request_sent");
    window.setTimeout(() => setSubmitState("needs_confirmation"), 900);
  }

  const inputCls =
    "w-full rounded-md border border-sillar-300 bg-white px-3.5 py-2.5 text-sm text-tinta-900 placeholder:text-tinta-500/60 focus:border-arcilla-400 focus:outline-none focus:ring-2 focus:ring-arcilla-400/30";
  const labelCls = "mb-1.5 block text-sm font-medium text-tinta-900";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="suite" className={labelCls}>Suite</label>
        <select id="suite" value={form.suite} onChange={set("suite")} className={inputCls}>
          {listings.map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.subtitle}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="checkin" className={labelCls}>Llegada</label>
          <input
            id="checkin" type="date" required min={today}
            value={form.checkin} onChange={setCheckin} className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="checkout" className={labelCls}>Salida</label>
          <input
            id="checkout" type="date" required min={minCheckout}
            value={form.checkout} onChange={set("checkout")} className={inputCls}
          />
        </div>
      </div>

      <AvailabilityChecker
        roomSlug={form.suite}
        startDate={form.checkin}
        endDate={form.checkout}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="guests" className={labelCls}>Huéspedes</label>
          <select id="guests" value={guests} onChange={set("guests")} className={inputCls}>
            {Array.from({ length: selected.capacity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-tinta-500">
            Capacidad máxima: {selected.capacity}
          </p>
        </div>
        <div>
          <label htmlFor="name" className={labelCls}>Tu nombre</label>
          <input
            id="name" type="text" required autoComplete="name"
            value={form.name} onChange={set("name")} className={inputCls}
            placeholder="Nombre y apellido"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact" className={labelCls}>
          Correo o teléfono <span className="font-normal text-tinta-500">(opcional)</span>
        </label>
        <input
          id="contact" type="text" autoComplete="email"
          value={form.contact} onChange={set("contact")} className={inputCls}
          placeholder="para responderte si WhatsApp falla"
        />
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          Mensaje <span className="font-normal text-tinta-500">(opcional)</span>
        </label>
        <textarea
          id="message" rows={3} value={form.message} onChange={set("message")}
          className={inputCls} placeholder="Hora estimada de llegada, consultas…"
        />
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 bg-arcilla-500 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-arcilla-600"
      >
        <WhatsApp className="h-5 w-5" />
        <span className="sm:hidden">
          {submitState === "checking" ? "Preparando..." : "Enviar por WhatsApp"}
        </span>
        <span className="hidden sm:inline">
          {submitState === "checking"
            ? "Preparando solicitud..."
            : "Enviar solicitud por WhatsApp"}
        </span>
      </button>

      {submitState !== "idle" && (
        <p className="rounded-md bg-sillar-50 px-3 py-2 text-center text-xs leading-relaxed text-tinta-600">
          {submitState === "needs_confirmation" || submitState === "request_sent"
            ? "Solicitud enviada por WhatsApp. Necesita confirmación de disponibilidad."
            : "Preparando tu solicitud."}
        </p>
      )}

      <p className="text-center text-xs leading-relaxed text-tinta-500">
        Esto es una <strong>solicitud, no una reserva instantánea</strong>: Roos
        confirma la disponibilidad personalmente, normalmente en minutos y
        siempre dentro de 24 horas.
      </p>
    </form>
  );
}
