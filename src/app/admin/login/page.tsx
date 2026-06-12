import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/lib/admin/actions";
import { getAdminSession } from "@/lib/admin/auth";
import { getAdminRuntimeConfig } from "@/lib/admin/config";
import { SubmitButton } from "@/components/admin/buttons";
import { Field, SetupNeededCard, inputClass } from "@/components/admin/ui";

const ERROR_MESSAGES: Record<string, string> = {
  missing: "Escribe tu usuario y contraseña.",
  invalid_credentials: "Usuario o contraseña incorrectos.",
  rate_limited: "Demasiados intentos. Espera unos minutos y vuelve a intentarlo.",
  configuration_needed: "Las credenciales de admin aún no están configuradas.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const config = getAdminRuntimeConfig();

  // The proxy already blocks this while the kill switch is off; re-check anyway.
  if (!config.adminRoutesEnabled) redirect("/");
  if (config.credentialsReady && (await getAdminSession())) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
        La Casa de Roos
      </p>
      <h1 className="mt-2 text-center font-display text-2xl font-extrabold text-tinta-900">
        Modo administración
      </h1>

      <div className="mt-8">
        {!config.credentialsReady ? (
          <SetupNeededCard title="Credenciales pendientes">
            <p>
              El inicio de sesión se activa cuando existan las variables de entorno{" "}
              <code>ADMIN_USERNAME</code>, <code>ADMIN_PASSWORD_HASH</code> y{" "}
              <code>ADMIN_SESSION_SECRET</code>.
            </p>
            <p>
              El hash de la contraseña se genera localmente con{" "}
              <code>scripts/hash-admin-password.mjs</code> — la contraseña en claro nunca
              se guarda en el repositorio ni en la base de datos.
            </p>
          </SetupNeededCard>
        ) : (
          <form
            action={loginAction}
            className="space-y-4 rounded-lg border border-sillar-200 bg-white p-6 shadow-sm"
          >
            {error && (
              <p className="rounded-md border border-arcilla-400/50 bg-arcilla-50 px-3 py-2 text-sm text-arcilla-600">
                {ERROR_MESSAGES[error] ?? "No se pudo iniciar sesión."}
              </p>
            )}
            <Field label="Usuario" htmlFor="username">
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                className={inputClass}
              />
            </Field>
            <Field label="Contraseña" htmlFor="password">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className={inputClass}
              />
            </Field>
            <SubmitButton>Entrar</SubmitButton>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-tinta-500">
        <Link href="/" className="underline underline-offset-2 hover:text-arcilla-600">
          ← Volver al sitio público
        </Link>
      </p>
    </main>
  );
}
