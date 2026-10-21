import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo La Casa de Roos recopila, usa y protege los datos personales de sus huéspedes y visitantes, conforme a la Ley N.º 29733 de Perú.",
  alternates: { canonical: "/privacidad" },
};

/* Adapted from the owner's existing policy (PDF, Sept. 2025) for the website
   and Ley N.º 29733 + its Reglamento (D.S. 016-2024-JUS). Every statement must
   stay true to what the site really does: today the request form only builds a
   WhatsApp message and stores nothing. If the site starts saving requests,
   payments or analytics, update this page BEFORE enabling them. */
export default function PrivacidadPage() {
  const { legal } = site;

  const h2 = "mt-10 font-display text-xl font-extrabold text-tinta-900";
  const ul = "mt-3 list-disc space-y-1.5 pl-5";

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="font-display text-4xl font-extrabold text-tinta-900">
        Política de privacidad
      </h1>
      <p className="mt-3 text-sm text-tinta-500">
        Última actualización: 21 de octubre de 2026
      </p>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-tinta-700">
        <p>
          En {legal.tradeName} respetamos la privacidad de nuestros huéspedes y
          visitantes. Esta política explica qué datos personales recopilamos,
          para qué los usamos y cómo puedes ejercer tus derechos, conforme a la
          Ley N.º 29733 de Protección de Datos Personales y su Reglamento.
        </p>

        <h2 className={h2}>1. Responsable del tratamiento</h2>
        <p>
          {legal.tradeName} (RUC {legal.ruc}), con domicilio en {legal.address}.
        </p>

        <h2 className={h2}>2. Datos que recopilamos</h2>
        <ul className={ul}>
          <li>
            <strong>En el formulario de solicitud de este sitio:</strong> la
            suite elegida, fechas de llegada y salida, número de huéspedes, tu
            nombre y, si quieres, un correo o teléfono y un mensaje.
          </li>
          <li>
            <strong>Por WhatsApp, redes sociales o correo:</strong> nombre,
            número de teléfono, correo y los mensajes o consultas que nos
            envíes.
          </li>
          <li>
            <strong>Registro de huéspedes:</strong> al hospedarte registramos
            los datos que exige la normativa de alojamientos (por ejemplo,
            documento de identidad, nacionalidad e información del viaje y de
            la estadía). Se recogen en un formulario digital y se guardan en
            herramientas de Google (Formularios y Hojas de cálculo).
          </li>
          <li>
            <strong>Reservas hechas en Airbnb:</strong> la información de la
            reserva la gestiona Airbnb bajo sus propias políticas.
          </li>
        </ul>
        <p>
          Este sitio <strong>no guarda en una base de datos</strong> lo que
          escribes en el formulario de solicitud: solo compone un mensaje de
          WhatsApp que tú mismo envías. Si más adelante la web empezara a
          guardar solicitudes, actualizaremos esta política antes de hacerlo.
        </p>
        <p>
          Al consultar la disponibilidad, nuestro servidor recibe únicamente la
          suite y las fechas. Como cualquier sitio web, nuestro proveedor de
          alojamiento puede registrar datos técnicos básicos (como la dirección
          IP) para el funcionamiento y la seguridad del sitio.
        </p>

        <h2 className={h2}>3. Para qué usamos tus datos</h2>
        <ul className={ul}>
          <li>Gestionar reservas y confirmar disponibilidad.</li>
          <li>Responder consultas y solicitudes de información.</li>
          <li>Coordinar tu llegada y tu estadía.</li>
          <li>Cumplir obligaciones legales, entre ellas el registro de huéspedes.</li>
          <li>Mejorar nuestros servicios de hospedaje.</li>
        </ul>

        <h2 className={h2}>4. Base legal</h2>
        <p>
          Tratamos tus datos con tu consentimiento previo, informado, expreso e
          inequívoco, que nos das al marcar la casilla del formulario o al
          escribirnos, y porque son necesarios para prestarte el servicio de
          alojamiento y para cumplir obligaciones legales. Puedes revocar tu
          consentimiento en cualquier momento.
        </p>

        <h2 className={h2}>5. Con quién compartimos tus datos</h2>
        <p>
          No vendemos ni cedemos tu información personal. Solo la compartimos
          cuando:
        </p>
        <ul className={ul}>
          <li>
            Usamos servicios de terceros para mensajería y gestión de reservas:
            WhatsApp (Meta), Airbnb y Google. Cada uno aplica su propia política
            de privacidad.
          </li>
          <li>
            Usamos proveedores de alojamiento web y de base de datos para
            mantener este sitio en funcionamiento.
          </li>
          <li>Lo exige la ley o una autoridad competente.</li>
        </ul>

        <h2 className={h2}>6. Cuánto tiempo los conservamos</h2>
        <p>
          Conservamos tus datos durante el tiempo necesario para cumplir las
          finalidades de esta política y mientras la ley lo exija. Los datos del
          registro de huéspedes se guardan por el plazo que fije la normativa de
          alojamientos.
        </p>

        <h2 className={h2}>7. Seguridad</h2>
        <p>
          Adoptamos medidas razonables para proteger tus datos contra accesos no
          autorizados, pérdida o alteración. Aun así, ninguna transmisión por
          Internet es completamente segura.
        </p>

        <h2 className={h2}>8. Cookies</h2>
        <p>
          No usamos cookies de seguimiento, publicidad ni analítica. El sitio
          solo utiliza una cookie técnica de sesión en el panel de
          administración, que no se activa para los visitantes.
        </p>

        <h2 className={h2}>9. Tus derechos</h2>
        <p>Puedes en cualquier momento:</p>
        <ul className={ul}>
          <li>Acceder a los datos que guardamos sobre ti.</li>
          <li>Solicitar su rectificación o actualización.</li>
          <li>Solicitar su cancelación (eliminación).</li>
          <li>Oponerte a su tratamiento y revocar tu consentimiento.</li>
        </ul>
        <p>
          Para ejercer estos derechos escríbenos a{" "}
          <a
            href={`mailto:${legal.privacyEmail}`}
            className="font-semibold text-arcilla-600 underline underline-offset-2"
          >
            {legal.privacyEmail}
          </a>{" "}
          o por WhatsApp al {site.whatsappDisplay}, indicando tu nombre y qué
          deseas solicitar. Si consideras que no atendimos tu solicitud
          correctamente, puedes acudir a la Autoridad Nacional de Protección de
          Datos Personales.
        </p>

        <h2 className={h2}>10. Cambios en esta política</h2>
        <p>
          Podemos modificar esta política para adaptarla a cambios legales o a
          mejoras del servicio. La versión vigente estará siempre en esta
          página, con su fecha de actualización.
        </p>

        <h2 className={h2}>11. Contacto</h2>
        <p>
          {legal.tradeName} · {legal.address}
          <br />
          {legal.privacyEmail} · {site.whatsappDisplay}
        </p>
      </div>
    </div>
  );
}
