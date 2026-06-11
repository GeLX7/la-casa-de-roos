/**
 * Minimal Supabase PostgREST helper for Admin Mode, using the service role
 * key. Mirrors the dependency-free pattern of src/lib/booking/repository.ts.
 *
 * SERVER-SIDE ONLY. The service role bypasses RLS, so every caller must gate
 * with requireAdmin() (src/lib/admin/auth.ts) before touching this module.
 */

import { getAdminRuntimeConfig } from "@/lib/admin/config";

export async function adminRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = getAdminRuntimeConfig();
  if (!config.dbReady) {
    throw new Error("Supabase admin environment is not configured.");
  }

  const headers = new Headers(init.headers);
  headers.set("apikey", config.serviceRoleKey);
  headers.set("authorization", `Bearer ${config.serviceRoleKey}`);
  headers.set("content-type", "application/json");
  if (!headers.has("prefer")) {
    headers.set("prefer", "return=representation");
  }

  const response = await fetch(
    `${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`,
    { ...init, headers, cache: "no-store" },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase REST ${response.status}: ${text}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/** Exact row count via a HEAD request (no rows transferred). */
export async function adminCount(path: string): Promise<number> {
  const config = getAdminRuntimeConfig();
  if (!config.dbReady) {
    throw new Error("Supabase admin environment is not configured.");
  }

  const response = await fetch(
    `${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`,
    {
      method: "HEAD",
      headers: {
        apikey: config.serviceRoleKey,
        authorization: `Bearer ${config.serviceRoleKey}`,
        prefer: "count=exact",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase REST count ${response.status}`);
  }

  // content-range: 0-24/3573 — the total sits after the slash.
  const range = response.headers.get("content-range") ?? "";
  const total = Number(range.split("/")[1]);
  return Number.isFinite(total) ? total : 0;
}
