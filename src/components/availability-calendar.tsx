"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AvailabilityChecker } from "@/components/availability-checker";
import { WhatsApp } from "@/components/icons";
import {
  buildMonthGrid,
  dayState,
  monthDataFromResponse,
  monthFromOffset,
  selectDate,
  UNKNOWN_MONTH,
  type DayState,
  type MonthData,
  type Selection,
} from "@/lib/booking/calendar-grid";
import { withSourceTag } from "@/lib/source";
import { site } from "@/data/site";

/* Monthly availability calendar (mobile first).
   - Reads ONE month per request from /api/availability (the Airbnb iCal links
     never reach the browser).
   - "Sin bloqueos detectados" is NOT a confirmed booking: only a human
     confirms, always by WhatsApp. */

const MAX_MONTHS_AHEAD = 11;
const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];
const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** Today in Peru (UTC-5, no DST), so the calendar does not flip at 7 pm. */
function peruToday(): string {
  return new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

const STATE_LABEL: Record<DayState, string> = {
  past: "fecha pasada",
  loading: "consultando",
  occupied: "ocupada",
  free: "sin bloqueos detectados",
  unverified: "no verificada",
};

const STATE_CLASS: Record<DayState, string> = {
  past: "border-transparent text-tinta-500/40",
  loading: "animate-pulse border-transparent bg-sillar-100 text-tinta-500",
  occupied:
    "bg-arcilla-50 text-tinta-500 line-through decoration-arcilla-500/70 border-arcilla-200",
  free: "border-salvia-500/50 bg-salvia-500/10 text-tinta-900 hover:bg-salvia-500/20",
  unverified:
    "border-dashed border-tinta-500/50 bg-white text-tinta-700 hover:bg-sillar-50",
};

function formatLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MONTH_NAMES[m - 1]} de ${y}`;
}

export function AvailabilityCalendar({
  roomSlug,
  roomName,
}: {
  roomSlug: string;
  roomName: string;
}) {
  const today = useMemo(() => peruToday(), []);
  const [offset, setOffset] = useState(0);
  const [months, setMonths] = useState<Record<string, MonthData>>({});
  const [selection, setSelection] = useState<Selection>({ checkin: "", checkout: "" });
  const [notice, setNotice] = useState("");

  const { year, month } = monthFromOffset(today, offset);
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const cacheKey = `${roomSlug}|${grid.key}`;
  const data = months[cacheKey];

  useEffect(() => {
    if (months[cacheKey]) return;
    let cancelled = false;
    const params = new URLSearchParams({ room: roomSlug, start: grid.first, end: grid.next });
    fetch(`/api/availability?${params.toString()}`)
      .then(async (response) => {
        const body = await response.json();
        return response.ok ? monthDataFromResponse(body) : UNKNOWN_MONTH;
      })
      .catch(() => UNKNOWN_MONTH)
      .then((result) => {
        if (!cancelled) setMonths((prev) => ({ ...prev, [cacheKey]: result }));
      });
    return () => {
      cancelled = true;
    };
  }, [cacheKey, grid.first, grid.next, months, roomSlug]);

  const isBlocked = (date: string) =>
    Object.entries(months).some(
      ([key, m]) => key.startsWith(`${roomSlug}|`) && m.blocked.has(date),
    );

  function onPick(date: string) {
    const result = selectDate(selection, date, isBlocked);
    if (result.error === "range_blocked") {
      setNotice("Ese rango incluye noches ocupadas. Elige otra fecha de salida.");
    } else if (result.error === "occupied_checkin") {
      setNotice("Esa noche figura como ocupada. Elige otra fecha de llegada.");
    } else {
      setNotice("");
    }
    setSelection(result.selection);
  }

  const complete = Boolean(selection.checkin && selection.checkout);
  const waMessage = complete
    ? `Hola Roos, vi su página web y quisiera consultar la suite "${roomName}" del ${formatLong(selection.checkin)} al ${formatLong(selection.checkout)}. ¿Pueden confirmarme disponibilidad?`
    : "";

  function openWhatsApp() {
    window.open(
      `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(withSourceTag(waMessage))}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <section
      aria-labelledby="calendario-titulo"
      className="scroll-mt-24 rounded-lg border border-sillar-200 bg-sillar-50/70 p-4 sm:p-5"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-arcilla-600">
        Disponibilidad
      </p>
      <h2 id="calendario-titulo" className="mt-2 font-display text-xl font-bold text-tinta-900">
        Calendario de {roomName}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-tinta-700">
        Toca tu llegada y luego tu salida. Un día sin bloqueos <strong>no es una reserva
        confirmada</strong>: confirmamos tu fecha por WhatsApp.
      </p>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          disabled={offset === 0}
          aria-label="Mes anterior"
          className="flex h-11 w-11 items-center justify-center rounded-md border border-sillar-300 bg-white text-lg text-tinta-900 disabled:opacity-30"
        >
          ‹
        </button>
        <p aria-live="polite" className="text-base font-semibold capitalize text-tinta-900">
          {MONTH_NAMES[month - 1]} {year}
        </p>
        <button
          type="button"
          onClick={() => setOffset((o) => Math.min(MAX_MONTHS_AHEAD, o + 1))}
          disabled={offset === MAX_MONTHS_AHEAD}
          aria-label="Mes siguiente"
          className="flex h-11 w-11 items-center justify-center rounded-md border border-sillar-300 bg-white text-lg text-tinta-900 disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-tinta-500">
        {WEEKDAYS.map((d) => (
          <span key={d} aria-hidden="true">{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1" role="group" aria-label={`${MONTH_NAMES[month - 1]} ${year}`}>
        {grid.cells.map((date, i) => {
          if (!date) return <span key={`pad-${i}`} />;
          const state = dayState(date, today, data);
          const isStart = date === selection.checkin;
          const isEnd = date === selection.checkout;
          const inRange =
            complete && date > selection.checkin && date < selection.checkout;
          const disabled = state === "past" || state === "loading" || state === "occupied";
          // The check-out day is not a night: it may be the first occupied day.
          const asCheckout =
            Boolean(selection.checkin) && !selection.checkout && date > selection.checkin && state === "occupied";
          const selectable = !disabled || asCheckout;
          const selected = isStart || isEnd;
          const day = Number(date.slice(8));
          return (
            <button
              key={date}
              type="button"
              disabled={!selectable}
              onClick={() => onPick(date)}
              aria-pressed={selected}
              aria-label={`${formatLong(date)}: ${STATE_LABEL[state]}${isStart ? ", llegada" : ""}${isEnd ? ", salida" : ""}`}
              className={`flex h-11 items-center justify-center rounded-md border text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-arcilla-500 ${
                selected
                  ? "border-arcilla-600 bg-arcilla-500 text-white"
                  : inRange
                    ? "border-arcilla-200 bg-arcilla-50 text-tinta-900"
                    : STATE_CLASS[state]
              } ${!selectable ? "cursor-not-allowed" : ""}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] text-tinta-700">
        <li className="flex items-center gap-2">
          <span className="h-4 w-4 shrink-0 rounded border border-salvia-500/50 bg-salvia-500/10" />
          Sin bloqueos detectados
        </li>
        <li className="flex items-center gap-2">
          <span className="h-4 w-4 shrink-0 rounded border border-arcilla-200 bg-arcilla-50" />
          <s className="decoration-arcilla-500/70">Ocupado</s>
        </li>
        <li className="flex items-center gap-2">
          <span className="h-4 w-4 shrink-0 rounded border border-dashed border-tinta-500/50 bg-white" />
          No verificado
        </li>
        <li className="flex items-center gap-2">
          <span className="h-4 w-4 shrink-0 rounded border border-arcilla-600 bg-arcilla-500" />
          Tu selección
        </li>
      </ul>
      {data && !data.trusted && (
        <p className="mt-3 rounded-md bg-white px-3 py-2 text-xs leading-relaxed text-tinta-700">
          No pudimos verificar este mes. Las fechas con línea punteada están sujetas a
          confirmación: escríbenos y las revisamos.
        </p>
      )}

      <div aria-live="polite" className="mt-4 space-y-3">
        {notice && <p className="text-xs font-medium text-arcilla-600">{notice}</p>}
        {selection.checkin && !selection.checkout && (
          <p className="text-sm text-tinta-700">
            Llegada: <strong>{formatLong(selection.checkin)}</strong>. Ahora toca tu fecha de salida.
          </p>
        )}
        {complete && (
          <>
            <p className="text-sm text-tinta-700">
              Del <strong>{formatLong(selection.checkin)}</strong> al{" "}
              <strong>{formatLong(selection.checkout)}</strong>.
            </p>
            <AvailabilityChecker
              roomSlug={roomSlug}
              startDate={selection.checkin}
              endDate={selection.checkout}
            />
            <button
              type="button"
              onClick={openWhatsApp}
              className="flex w-full items-center justify-center gap-2 bg-arcilla-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-arcilla-600"
            >
              <WhatsApp className="h-5 w-5" /> Consultar estas fechas por WhatsApp
            </button>
            <Link
              href={`/reservar?suite=${roomSlug}&checkin=${selection.checkin}&checkout=${selection.checkout}`}
              className="block text-center text-xs font-medium text-tinta-500 underline underline-offset-2 hover:text-arcilla-600"
            >
              Completar solicitud con mis datos
            </Link>
            <button
              type="button"
              onClick={() => {
                setSelection({ checkin: "", checkout: "" });
                setNotice("");
              }}
              className="block w-full text-center text-xs text-tinta-500 underline underline-offset-2"
            >
              Borrar selección
            </button>
          </>
        )}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-tinta-500">
        La reserva no es instantánea. La disponibilidad se confirma por WhatsApp antes de reservar.
      </p>
    </section>
  );
}
