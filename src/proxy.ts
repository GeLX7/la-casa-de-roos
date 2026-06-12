import { NextResponse, type NextRequest } from "next/server";

/* Cheap pre-check for /admin/* — defense in depth only. It checks the kill
   switch and mere cookie PRESENCE (no crypto here); the authoritative
   HMAC/expiry verification happens server-side in requireAdmin()
   (src/lib/admin/auth.ts) on every panel page and server action.
   Must mirror SESSION_COOKIE from that module. */
const ADMIN_SESSION_COOKIE = "lcr_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kill switch: while unset, the whole admin (login included) stays dark.
  if (process.env.ENABLE_ADMIN_ROUTES !== "true") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname !== "/admin/login" && !request.cookies.has(ADMIN_SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
