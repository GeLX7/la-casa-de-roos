import { NextResponse } from "next/server";
import { getRoomAvailability } from "@/lib/booking/availability";
import { isIsoDate, isValidStayRange } from "@/lib/booking/dates";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const room = searchParams.get("room") ?? "";
  const start = searchParams.get("start") ?? "";
  const end = searchParams.get("end") ?? "";

  if (!room || !isIsoDate(start) || !isIsoDate(end) || !isValidStayRange(start, end)) {
    return NextResponse.json(
      {
        status: "invalid_request",
        message: "Use room=<slug>&start=YYYY-MM-DD&end=YYYY-MM-DD with checkout after checkin.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json(await getRoomAvailability(room, start, end));
}
