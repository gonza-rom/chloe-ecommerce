// src/app/privacidad/page.js
import Link from 'next/link';

export const metadata = {
  title:       'Política de Privacidad — Chloe Showroom',
  description: 'Cómo tratamos tus datos personales en Chloe Showroom.',
};

export default function PrivacidadPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      <section style={{ background: '#111', color: '#fff', padding: '56px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.4, margin: '0 0 10px' }}>
            Información legal
          </p>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(36px, 6vw, 56px)',
            lineHeight: 0.95, letterSpacing: '0.02em', margin: '0 0 16px',
          }}>
            POLÍTICA DE PRIVACIDAD
          </h1>
          <p style={{ fontSize: 14, opacity: 0.5, lineHeight: 1.7, margin: 0 }}>
            Última actualización: agosto de 2026.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>

        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Qué datos recolectamos</h2>
          <div style={proseStyle}>
            <p>Cuando comprás, creás una cuenta o nos escribís, podemos pedirte: nombre y apellido, email,
            teléfono, DNI, dirección de entrega y datos de facturación. Los medios de pago (tarjeta, etc.)
            se procesan directamente por nuestros proveedores de pago — nunca guardamos números de tarjeta
            en nuestros servidores.</p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>2. Para qué usamos tus datos</h2>
          <div style={proseStyle}>
            <p>Usamos tus datos para: procesar y entregar tus pedidos, responder consultas, enviarte
            notificaciones sobre el estado de tu compra, y mejorar nuestro servicio. No vendemos ni
            compartimos tus datos personales con terceros para fines de marketing ajenos a Chloe Showroom.</p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Con quién los compartimos</h2>
          <div style={proseStyle}>
            <p>Compartimos lo estrictamente necesario con los proveedores que hacen posible la compra:
            pasarelas de pago (Mercado Pago, Payway, GO Cuotas), el proveedor de envíos/correo, y los
            servicios técnicos que alojan la tienda (base de datos, email transaccional). Todos están
            obligados a proteger tu información y usarla solo para prestarnos ese servicio.</p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Tus derechos</h2>
          <div style={proseStyle}>
            <p>De acuerdo a la Ley 25.326 de Protección de Datos Personales, podés pedirnos en cualquier
            momento acceder, corregir o eliminar tus datos personales de nuestra base. Para ejercer estos
            derechos, escribinos desde{' '}
              <Link href="/contacto" style={{ color: '#111', fontWeight: 700 }}>nuestra página de contacto</Link>.</p>
            <p>La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la
            Ley 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes
            resulten afectados en sus derechos por incumplimiento de las normas vigentes.</p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Cookies</h2>
          <div style={proseStyle}>
            <p>Usamos almacenamiento local del navegador para mantener funciones básicas como tu carrito de
            compras y tu sesión iniciada. No usamos cookies de rastreo publicitario de terceros en este
            sitio.</p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>6. Seguridad</h2>
          <div style={proseStyle}>
            <p>Tomamos medidas razonables para proteger tu información (conexión cifrada, acceso restringido
            a nuestros sistemas administrativos), aunque ningún sistema es 100% infalible.</p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>7. Contacto</h2>
          <div style={proseStyle}>
            <p>Ante cualquier consulta sobre el uso de tus datos, escribinos desde{' '}
              <Link href="/contacto" style={{ color: '#111', fontWeight: 700 }}>nuestra página de contacto</Link>.</p>
          </div>
        </section>

        <p style={{ fontSize: 12, color: '#aaa', marginTop: 48, borderTop: '1px solid #f0ede8', paddingTop: 20 }}>
          Este texto es una guía general y no reemplaza el asesoramiento de un profesional legal.
          Recomendamos revisarlo con un abogado antes de operar a mayor escala.
        </p>

      </div>
    </div>
  );
}

const sectionStyle = { marginBottom: 40 };
const h2Style = { fontSize: 18, fontWeight: 800, color: '#111', letterSpacing: '-0.01em', margin: '0 0 14px' };
const proseStyle = { fontSize: 14, color: '#555', lineHeight: 1.8 };
