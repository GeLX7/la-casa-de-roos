import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* TEMPORALMENTE DESHABILITADO.
   Este endpoint no lee el cuerpo de la solicitud ni guarda datos personales.
   Las solicitudes se preparan como mensaje de WhatsApp desde el formulario (request-form.tsx).
   Para reactivarlo: restaurar el commit anterior de este archivo (git revert), después de
   aprobar términos, política de privacidad y medidas de seguridad. Las tablas y datos
   existentes no se tocan. */
const DISABLED_BODY = {
  status: "temporarily_disabled",
  whatsappFallback: true,
  message:
    "Las solicitudes en línea están temporalmente deshabilitadas. Escríbenos por WhatsApp para consultar disponibilidad y reservar.",
} as const;

const HEADERS = { "Retry-After": "86400", "Cache-Control": "no-store" } as const;

export async function POST() {
  return NextResponse.json(DISABLED_BODY, { status: 503, headers: HEADERS });
}
