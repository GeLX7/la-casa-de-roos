import { NextResponse } from "next/server";
import { getBookingRuntimeConfig, isKnownRoomSlug } from "@/lib/booking/config";
import { generateWebsiteIcalFeed } from "@/lib/booking/ical";
import { getIcalExportBlocks, isBookingDatabaseConfigured } from "@/lib/booking/repository";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomSlug: string }> },
) {
  const { roomSlug } = await params;
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";
  const config = getBookingRuntimeConfig();

  if (!isKnownRoomSlug(roomSlug)) {
    return NextResponse.json({ status: "not_found" }, { status: 404 });
  }

  if (!config.hasIcalSecret) {
    return NextResponse.json(
      {
        status: "configuration_needed",
        message: "BOOKING_ICAL_SECRET is required before iCal feeds are enabled.",
      },
      { status: 501 },
    );
  }

  if (token !== config.icalSecret) {
    return NextResponse.json({ status: "not_found" }, { status: 404 });
  }

  if (!isBookingDatabaseConfigured()) {
    return NextResponse.json(
      {
        status: "configuration_needed",
        message: "Supabase booking environment is required before iCal feeds are enabled.",
      },
      { status: 501 },
    );
  }

  const blocks = await getIcalExportBlocks(roomSlug);
  if (!blocks.ok) {
    return NextResponse.json(
      { status: blocks.reason, message: blocks.message },
      { status: blocks.reason === "configuration_needed" ? 501 : 502 },
    );
  }

  return new Response(generateWebsiteIcalFeed(roomSlug, blocks.data), {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
