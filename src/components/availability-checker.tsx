"use client";

import { useEffect, useState } from "react";

type AvailabilityStatus =
  | "idle"
  | "checking"
  | "configuration_needed"
  | "available"
  | "unavailable"
  | "error";

type Props = {
  roomSlug: string;
  startDate: string;
  endDate: string;
};

type AvailabilityResponse = {
  status: "configuration_needed" | "available" | "unavailable";
  message: string;
  unavailableDates?: string[];
};

type AvailabilityState = {
  key: string;
  status: Exclude<AvailabilityStatus, "idle" | "checking">;
  message: string;
};

const statusStyles: Record<AvailabilityStatus, string> = {
  idle: "border-sillar-200 bg-sillar-50 text-tinta-700",
  checking: "border-sillar-300 bg-white text-tinta-700",
  configuration_needed: "border-arcilla-200 bg-arcilla-50/40 text-tinta-700",
  available: "border-salvia-500/30 bg-salvia-500/10 text-tinta-700",
  unavailable: "border-arcilla-500/40 bg-arcilla-50 text-tinta-700",
  error: "border-arcilla-500/40 bg-arcilla-50 text-tinta-700",
};

export function AvailabilityChecker({ roomSlug, startDate, endDate }: Props) {
  const [result, setResult] = useState<AvailabilityState | null>(null);
  const hasValidDates = Boolean(roomSlug && startDate && endDate && startDate < endDate);
  const requestKey = `${roomSlug}|${startDate}|${endDate}`;

  useEffect(() => {
    if (!hasValidDates) return;

    let cancelled = false;

    const params = new URLSearchParams({ room: roomSlug, start: startDate, end: endDate });
    fetch(`/api/availability?${params.toString()}`)
      .then(async (response) => {
        const data = (await response.json()) as AvailabilityResponse;
        if (cancelled) return;
        if (!response.ok) throw new Error(data.message);
        setResult({
          key: requestKey,
          status: data.status,
          message: data.unavailableDates?.length
            ? `${data.message} Días bloqueados: ${data.unavailableDates.join(", ")}.`
            : data.message,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setResult({
          key: requestKey,
          status: "error",
          message:
            "No pudimos revisar el calendario. Escríbenos para confirmar disponibilidad.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [endDate, hasValidDates, requestKey, roomSlug, startDate]);

  const status: AvailabilityStatus = !hasValidDates
    ? "idle"
    : result?.key === requestKey
      ? result.status
      : "checking";
  const message = !hasValidDates
    ? "Calendario en preparación. Escríbenos para confirmar disponibilidad."
    : result?.key === requestKey
      ? result.message
      : "Revisando disponibilidad...";

  return (
    <div className={`rounded-md border p-4 text-sm leading-relaxed ${statusStyles[status]}`}>
      <p className="font-semibold text-tinta-900">Disponibilidad</p>
      <p className="mt-1">{message}</p>
      <p className="mt-2 text-xs text-tinta-500">
        La disponibilidad se confirma antes de la reserva. La reserva no es instantánea.
      </p>
    </div>
  );
}
