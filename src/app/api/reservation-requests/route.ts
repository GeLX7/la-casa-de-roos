import { NextResponse } from "next/server";
import { getRoomBySlug } from "@/lib/catalog/data";
import { getRoomAvailability } from "@/lib/booking/availability";
import { isValidStayRange } from "@/lib/booking/dates";
import {
  createReservationRequest,
  isBookingDatabaseConfigured,
} from "@/lib/booking/repository";
import type { ReservationRequestInput } from "@/lib/booking/types";

export const dynamic = "force-dynamic";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const input: ReservationRequestInput = {
    roomSlug: asString(body.roomSlug),
    guestName: asString(body.guestName),
    guestEmail: asString(body.guestEmail),
    guestPhone: asString(body.guestPhone),
    startDate: asString(body.startDate),
    endDate: asString(body.endDate),
    guests: Number(body.guests),
    message: asString(body.message),
  };
  const room = await getRoomBySlug(input.roomSlug);

  if (
    !room ||
    !input.guestName ||
    !Number.isInteger(input.guests) ||
    input.guests < 1 ||
    input.guests > room.capacity ||
    !isValidStayRange(input.startDate, input.endDate)
  ) {
    return NextResponse.json(
      { status: "invalid_request", message: "Solicitud inválida." },
      { status: 400 },
    );
  }

  if (!isBookingDatabaseConfigured()) {
    return NextResponse.json(
      {
        status: "configuration_needed",
        whatsappFallback: true,
        message:
          "Calendario en preparación. Escríbenos por WhatsApp para confirmar disponibilidad.",
      },
      { status: 501 },
    );
  }

  const availability = await getRoomAvailability(input.roomSlug, input.startDate, input.endDate);
  if (availability.status === "unavailable") {
    return NextResponse.json(
      {
        status: "unavailable",
        message: "Fechas no disponibles. Escríbenos para buscar alternativas.",
        unavailableRanges: availability.unavailableRanges,
      },
      { status: 409 },
    );
  }

  const created = await createReservationRequest(input);
  if (!created.ok) {
    return NextResponse.json(
      { status: created.reason, message: created.message, whatsappFallback: true },
      { status: created.reason === "configuration_needed" ? 501 : 502 },
    );
  }

  return NextResponse.json(
    {
      status: "requested",
      id: created.data.id,
      message: "Solicitud recibida. La reserva necesita confirmación manual.",
    },
    { status: 201 },
  );
}
