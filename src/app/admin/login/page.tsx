import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/lib/admin/actions";
import { getAdminSession } from "@/lib/admin/auth";
import { getAdminRuntimeConfig } from "@/lib/admin/config";
import { SubmitButton } from "@/components/admin/buttons";
import { Field, SetupNeededCard, inputClass } from "@/components/admin/ui";

const ERROR_MESSAGES: Record<string, string> = {
  missing: "Escribe tu correo y contraseña.",
  invalid_credentials: "Correo o contraseña incorrectos.",
  not_admin: "Esta cuenta no tiene permisos de administración.",
  configuration_needed: "Supabase aún no está configurado.",
  upstream_error: "No se pudo conectar con el servidor de autenticación. Intenta de nuevo.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const config = getAdminRuntimeConfig();

  if (config.fullyConfigured && (await getAdminSession())) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-arcilla-500">
        La Casa de Roos
      </p>
      <h1 className="mt-2 text-center font-display text-2xl font-extrabold text-tinta-900">
        Modo administración
      </h1>

      <div className="mt-8">
        {!config.fullyConfigured ? (
          <SetupNeededCard title="Configuración pendiente">
            <p>
              El inicio de sesión se activa cuando exista el proyecto de Supabase y las
              variables <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> y{" "}
              <code>SUPABASE_SERVICE_ROLE_KEY</code> estén definidas.
            </p>
            <p>
              Mientras tanto puedes revisar el estado general en el{" "}
              <Link href="/admin" className="underline underline-offset-2">
                panel de configuración
              </Link>
              .
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
            <Field label="Correo" htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
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
