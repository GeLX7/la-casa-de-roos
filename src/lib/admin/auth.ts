/**
 * Admin authentication: username + password against env-var credentials —
 * no Supabase Auth involved (pattern adapted from the LAZZAT admin, see
 * docs/architecture/admin-mode.md).
 *
 * Flow:
 *  - signInWithCredentials() compares the username and the PBKDF2 hash from
 *    ADMIN_USERNAME / ADMIN_PASSWORD_HASH (constant-time, with a timing
 *    equalizer when the username is wrong) and, on success, sets a stateless
 *    HMAC-signed session cookie (httpOnly, Secure in prod, SameSite=Lax).
 *  - getAdminSession() verifies the cookie signature/expiry locally — no
 *    network round trip — and re-checks the username against the env var, so
 *    rotating ADMIN_USERNAME or ADMIN_SESSION_SECRET invalidates sessions
 *    immediately.
 *  - requireAdmin() gates every panel page and server action.
 *
 * The plaintext password and its hash never live in the repo or database:
 * the hash is generated locally with scripts/hash-admin-password.mjs and
 * stored only as a Vercel/server env var.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminRuntimeConfig } from "@/lib/admin/config";
import {
  burnPasswordVerification,
  createSessionValue,
  verifyPassword,
  verifySessionValue,
} from "@/lib/admin/credentials";

/* Cookie name is duplicated as a literal in src/proxy.ts (the proxy only
   checks presence and must stay free of server-only imports). */
export const SESSION_COOKIE = "lcr_admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export type AdminSession = {
  username: string;
};

type SignInResult =
  | { ok: true }
  | { ok: false; error: "configuration_needed" | "invalid_credentials" };

export async function signInWithCredentials(
  username: string,
  password: string,
): Promise<SignInResult> {
  const config = getAdminRuntimeConfig();
  if (!config.authReady) {
    return { ok: false, error: "configuration_needed" };
  }

  if (username !== config.adminUsername) {
    // Same PBKDF2 cost as the real check: response timing stays uniform.
    burnPasswordVerification(password);
    return { ok: false, error: "invalid_credentials" };
  }
  if (!verifyPassword(password, config.adminPasswordHash)) {
    return { ok: false, error: "invalid_credentials" };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE,
    createSessionValue(username, config.sessionSecret, SESSION_TTL_SECONDS),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    },
  );

  return { ok: true };
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Returns the verified admin session, or null (never throws). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const config = getAdminRuntimeConfig();
  if (!config.authReady) return null;

  const cookieStore = await cookies();
  const username = verifySessionValue(
    cookieStore.get(SESSION_COOKIE)?.value,
    config.sessionSecret,
  );
  if (!username || username !== config.adminUsername) return null;
  return { username };
}

/**
 * Gate for every admin page and server action that touches data. Redirects
 * home while the admin kill switch is off, and to the login screen when
 * there is no valid admin session.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const config = getAdminRuntimeConfig();
  if (!config.adminRoutesEnabled) redirect("/");

  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export type PanelGuard =
  | { configured: false; dbReady: boolean; session: null }
  | { configured: true; dbReady: boolean; session: AdminSession };

/**
 * Guard used by every panel page (not only the layout — layouts and pages
 * render concurrently, so each page enforces it itself).
 *
 * Kill switch off → redirect home (the proxy already blocks this earlier).
 * Credentials missing → setup-needed mode, nothing writable, no session.
 * Credentials present → a valid session is required; `dbReady` then tells
 * the page whether Supabase-backed editing is available or the catalog is
 * still read-only.
 */
export async function guardAdminPanel(): Promise<PanelGuard> {
  const config = getAdminRuntimeConfig();
  if (!config.adminRoutesEnabled) redirect("/");

  if (!config.credentialsReady) {
    return { configured: false, dbReady: config.dbReady, session: null };
  }
  const session = await requireAdmin();
  return { configured: true, dbReady: config.dbReady, session };
}
