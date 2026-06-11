/**
 * Admin authentication on Supabase Auth (GoTrue) via plain REST — no client
 * library, matching the dependency-free Supabase pattern of this repo.
 *
 * Flow:
 *  - signInWithPassword() exchanges email+password for an access token
 *    (password grant) and stores it in an httpOnly cookie.
 *  - getAdminSession() verifies the token against /auth/v1/user and then
 *    checks the admin_users allowlist with the service role. A valid Supabase
 *    account that is NOT in admin_users is rejected.
 *  - requireAdmin() redirects to /admin/login when any check fails.
 *
 * Sessions last as long as the Supabase JWT (1 h by default; can be raised in
 * Supabase Auth settings). Refresh-token rotation is a documented later step:
 * the refresh token is already stored, but server components cannot write
 * cookies, so silent refresh needs a dedicated route handler.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminRuntimeConfig } from "@/lib/admin/config";
import { adminRest } from "@/lib/admin/supabase-admin";

export const ACCESS_COOKIE = "lcr_admin_access";
export const REFRESH_COOKIE = "lcr_admin_refresh";

export type AdminSession = {
  userId: string;
  email: string;
};

type SignInResult =
  | { ok: true }
  | { ok: false; error: "configuration_needed" | "invalid_credentials" | "not_admin" | "upstream_error" };

function authUrl(path: string): string {
  const { supabaseUrl } = getAdminRuntimeConfig();
  return `${supabaseUrl.replace(/\/$/, "")}/auth/v1/${path}`;
}

async function isAllowlistedAdmin(userId: string): Promise<boolean> {
  const rows = await adminRest<{ user_id: string }[]>(
    `admin_users?user_id=eq.${encodeURIComponent(userId)}&select=user_id&limit=1`,
  );
  return rows.length > 0;
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<SignInResult> {
  const config = getAdminRuntimeConfig();
  if (!config.fullyConfigured) {
    return { ok: false, error: "configuration_needed" };
  }

  let payload: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    user?: { id?: string };
  };
  try {
    const response = await fetch(authUrl("token?grant_type=password"), {
      method: "POST",
      headers: { apikey: config.anonKey, "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      return { ok: false, error: "invalid_credentials" };
    }
    if (!response.ok) {
      return { ok: false, error: "upstream_error" };
    }
    payload = await response.json();
  } catch {
    return { ok: false, error: "upstream_error" };
  }

  const accessToken = payload.access_token;
  const userId = payload.user?.id;
  if (!accessToken || !userId) {
    return { ok: false, error: "upstream_error" };
  }

  // Only allowlisted admins get a session cookie.
  try {
    if (!(await isAllowlistedAdmin(userId))) {
      return { ok: false, error: "not_admin" };
    }
  } catch {
    return { ok: false, error: "upstream_error" };
  }

  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  cookieStore.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: payload.expires_in ?? 3600,
  });
  if (payload.refresh_token) {
    cookieStore.set(REFRESH_COOKIE, payload.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return { ok: true };
}

export async function signOut(): Promise<void> {
  const config = getAdminRuntimeConfig();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (config.authReady && accessToken) {
    // Best effort: revoke the session server-side too.
    try {
      await fetch(authUrl("logout"), {
        method: "POST",
        headers: { apikey: config.anonKey, authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
    } catch {
      // Cookie removal below is what actually ends the admin session.
    }
  }

  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

/** Returns the verified admin session, or null (never throws). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const config = getAdminRuntimeConfig();
  if (!config.fullyConfigured) return null;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  try {
    const response = await fetch(authUrl("user"), {
      headers: { apikey: config.anonKey, authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const user = (await response.json()) as { id?: string; email?: string };
    if (!user.id) return null;
    if (!(await isAllowlistedAdmin(user.id))) return null;
    return { userId: user.id, email: user.email ?? "" };
  } catch {
    return null;
  }
}

/**
 * Gate for every admin page and server action that touches data.
 * Redirects to the login screen when there is no valid admin session.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export type PanelGuard =
  | { configured: false; session: null }
  | { configured: true; session: AdminSession };

/**
 * Guard used by every panel page (not only the layout — layouts and pages
 * render concurrently, so each page enforces it itself).
 *
 * Without Supabase env vars there is no auth server and nothing writable:
 * pages render the setup-needed state. The moment the env vars exist, every
 * panel page requires a logged-in allowlisted admin.
 */
export async function guardAdminPanel(): Promise<PanelGuard> {
  if (!getAdminRuntimeConfig().fullyConfigured) {
    return { configured: false, session: null };
  }
  return { configured: true, session: await requireAdmin() };
}
