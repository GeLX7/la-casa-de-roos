/**
 * Runtime configuration for Admin Mode. Server-side only — never import from
 * client components: serviceRoleKey and the admin credential env vars must
 * not reach the browser bundle.
 *
 * Admin auth does not use Supabase: the owner signs in with a username plus
 * a PBKDF2 password hash and an HMAC session secret, all provided as env
 * vars (see docs/architecture/admin-mode.md). Supabase only stores data.
 *
 * Everything degrades gracefully: with env vars missing the admin renders a
 * setup-needed state (or stays disabled entirely while ENABLE_ADMIN_ROUTES
 * is not "true") instead of crashing — the live marketing site keeps working
 * with zero configuration.
 */

import { MIN_SESSION_SECRET_LENGTH } from "@/lib/admin/credentials";

export type AdminRuntimeConfig = {
  supabaseUrl: string;
  anonKey: string;
  serviceRoleKey: string;
  /** Kill switch: every /admin route is disabled until this is "true". */
  adminRoutesEnabled: boolean;
  adminUsername: string;
  adminPasswordHash: string;
  sessionSecret: string;
  /** Username + password hash + strong session secret all present. */
  credentialsReady: boolean;
  /** Server-side data access needs the project URL plus the service role key. */
  dbReady: boolean;
  /** Login possible: routes enabled and credentials configured. */
  authReady: boolean;
  /** Everything the admin needs to operate, including catalog data. */
  fullyConfigured: boolean;
};

export function getAdminRuntimeConfig(): AdminRuntimeConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const adminRoutesEnabled = process.env.ENABLE_ADMIN_ROUTES === "true";
  const adminUsername = process.env.ADMIN_USERNAME ?? "";
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH ?? "";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? "";

  const credentialsReady = Boolean(
    adminUsername &&
      adminPasswordHash &&
      sessionSecret.length >= MIN_SESSION_SECRET_LENGTH,
  );
  const dbReady = Boolean(supabaseUrl && serviceRoleKey);
  const authReady = adminRoutesEnabled && credentialsReady;

  return {
    supabaseUrl,
    anonKey,
    serviceRoleKey,
    adminRoutesEnabled,
    adminUsername,
    adminPasswordHash,
    sessionSecret,
    credentialsReady,
    dbReady,
    authReady,
    fullyConfigured: authReady && dbReady,
  };
}

export type SetupWarning = {
  key: string;
  label: string;
  detail: string;
};

/** Missing-setup warnings surfaced on the dashboard. */
export function getSetupWarnings(): SetupWarning[] {
  const config = getAdminRuntimeConfig();
  const warnings: SetupWarning[] = [];

  if (!config.authReady) {
    const missing = [
      !config.adminRoutesEnabled && "ENABLE_ADMIN_ROUTES=true",
      !config.adminUsername && "ADMIN_USERNAME",
      !config.adminPasswordHash && "ADMIN_PASSWORD_HASH",
      config.sessionSecret.length < MIN_SESSION_SECRET_LENGTH && "ADMIN_SESSION_SECRET (≥32 caracteres)",
    ].filter(Boolean);
    warnings.push({
      key: "admin-credentials",
      label: "Credenciales de admin pendientes",
      detail: `Faltan variables: ${missing.join(", ")}. El hash se genera localmente con scripts/hash-admin-password.mjs (docs/runbooks/admin-supabase-setup.md).`,
    });
  }

  if (!config.dbReady || !config.anonKey) {
    warnings.push({
      key: "supabase",
      label: "Supabase sin configurar",
      detail:
        "Faltan NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY o SUPABASE_SERVICE_ROLE_KEY. Sin esto el catálogo del admin es solo lectura (docs/runbooks/admin-supabase-setup.md).",
    });
  }

  const icalKeys = [
    "AIRBNB_ICAL_SUITE_QUEEN_CON_SALA",
    "AIRBNB_ICAL_SUITE_QUEEN_CENTRO_HISTORICO",
    "AIRBNB_ICAL_SUITE_QUEEN_CON_VISTA",
    "AIRBNB_ICAL_MINI_APARTAMENTO_FAMILIAR",
  ];
  const missingIcal = icalKeys.filter((key) => !process.env[key]);
  if (missingIcal.length > 0) {
    warnings.push({
      key: "ical",
      label: "iCal de Airbnb pendiente",
      detail: `Faltan ${missingIcal.length} de 4 URLs privadas de exportación iCal de Airbnb (las provee la dueña).`,
    });
  }

  if (!process.env.CULQI_PUBLIC_KEY || !process.env.CULQI_PRIVATE_KEY) {
    warnings.push({
      key: "culqi",
      label: "Culqi sin claves",
      detail: "Los pagos siguen desactivados hasta tener llaves de Culqi (fase posterior).",
    });
  }

  if (!process.env.BOOKING_ADMIN_EMAIL) {
    warnings.push({
      key: "email",
      label: "Email de notificaciones pendiente",
      detail: "BOOKING_ADMIN_EMAIL vacío: no hay correo para avisar nuevas solicitudes.",
    });
  }

  if (!process.env.BOOKING_ICAL_SECRET) {
    warnings.push({
      key: "ical-secret",
      label: "Secreto del feed iCal pendiente",
      detail: "BOOKING_ICAL_SECRET vacío: las URLs de exportación .ics del sitio aún no funcionan.",
    });
  }

  return warnings;
}
