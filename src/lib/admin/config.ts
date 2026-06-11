/**
 * Runtime configuration for Admin Mode. Server-side only — never import from
 * client components: serviceRoleKey must not reach the browser bundle.
 *
 * Everything degrades gracefully: with no Supabase env vars the admin renders
 * a setup-needed state instead of crashing (the live marketing site has no
 * Supabase project yet).
 */

export type AdminRuntimeConfig = {
  supabaseUrl: string;
  anonKey: string;
  serviceRoleKey: string;
  /** Login (GoTrue REST) needs the project URL plus the anon key. */
  authReady: boolean;
  /** Server-side data access needs the project URL plus the service role key. */
  dbReady: boolean;
  /** Everything the admin needs to operate. */
  fullyConfigured: boolean;
};

export function getAdminRuntimeConfig(): AdminRuntimeConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  const authReady = Boolean(supabaseUrl && anonKey);
  const dbReady = Boolean(supabaseUrl && serviceRoleKey);

  return {
    supabaseUrl,
    anonKey,
    serviceRoleKey,
    authReady,
    dbReady,
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

  if (!config.supabaseUrl || !config.anonKey || !config.serviceRoleKey) {
    warnings.push({
      key: "supabase",
      label: "Supabase sin configurar",
      detail:
        "Faltan NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY o SUPABASE_SERVICE_ROLE_KEY. Sin esto el admin es solo lectura (docs/runbooks/admin-supabase-setup.md).",
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
