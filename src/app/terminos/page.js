// src/app/terminos/page.js
import Link from 'next/link';

export const metadata = {
  title:       'Términos y Condiciones — Chloe Showroom',
  description: 'Condiciones de uso y de compra de Chloe Showroom.',
};

export default function TerminosPage() {
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
            TÉRMINOS Y CONDICIONES
          </h1>
          <p style={{ fontSize: 14, opacity: 0.5, lineHeight: 1.7, margin: 0 }}>
            Última actualización: agosto de 2026.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>

        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Quiénes somos</h2>
          <div style={proseStyle}>
            <p>Chloe Showroom es una tienda de indumentaria femenina con showroom físico en Alpatauca 870,
            San Fernando del Valle de Catamarca, y venta online en chloeshowroom.com.ar.</p>
            <p>Al comprar en este sitio, aceptás las condiciones descriptas a continuación.</p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>2. Productos y precios</h2>
          <div style={proseStyle}>
            <p>Los precios publicados están expresados en pesos argentinos (ARS) e incluyen los impuestos
            correspondientes. Los precios y la disponibilidad de stock pueden cambiar sin previo aviso.</p>
            <p>Hacemos nuestro mejor esfuerzo para que las fotos y descripciones reflejen fielmente cada
            prenda; pueden existir variaciones leves de color según la pantalla desde la que se mire.</p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Compra y medios de pago</h2>
          <div style={proseStyle}>
            <p>Aceptamos pago con tarjeta de crédito/débito, transferencia bancaria y efectivo (retiro en
            local), según el método disponible al momento del checkout. El pedido se confirma una vez
            acreditado el pago.</p>
            <p>Los detalles de envío, costos y plazos están en nuestra página de{' '}
              <Link href="/envios" style={{ color: '#111', fontWeight: 700 }}>Envíos y cambios</Link>.</p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Derecho de arrepentimiento</h2>
          <div style={proseStyle}>
            <p>De acuerdo a la Ley de Defensa del Consumidor (Ley 24.240), tenés derecho a arrepentirte de
            la compra dentro de los <strong>10 días corridos</strong> desde que recibís el producto, sin
            necesidad de justificar el motivo. El producto debe devolverse sin uso, con etiquetas y en su
            embalaje original.</p>
            <p>Para ejercer este derecho, escribinos por WhatsApp o a través del{' '}
              <Link href="/contacto" style={{ color: '#111', fontWeight: 700 }}>formulario de contacto</Link>.</p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Cambios y devoluciones</h2>
          <div style={proseStyle}>
            <p>Nuestra política específica de cambios y devoluciones (plazos, condiciones y excepciones) está
            detallada en{' '}
              <Link href="/envios" style={{ color: '#111', fontWeight: 700 }}>Envíos y cambios</Link>.</p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>6. Datos personales</h2>
          <div style={proseStyle}>
            <p>Tratamos tus datos personales de acuerdo a nuestra{' '}
              <Link href="/privacidad" style={{ color: '#111', fontWeight: 700 }}>Política de Privacidad</Link>,
              en línea con la Ley 25.326 de Protección de Datos Personales.</p>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>7. Contacto</h2>
          <div style={proseStyle}>
            <p>Ante cualquier consulta sobre estos términos, escribinos desde{' '}
              <Link href="/contacto" style={{ color: '#111', fontWeight: 700 }}>nuestra página de contacto</Link>.</p>
          </div>
        </section>

        <p style={{ fontSize: 12, color: '#aaa', marginTop: 48, borderTop: '1px solid #f0ede8', paddingTop: 20 }}>
          Este texto es una guía general y no reemplaza el asesoramiento de un profesional legal.
          Recomendamos revisarlo con un abogado/contador antes de operar a mayor escala.
        </p>

      </div>
    </div>
  );
}

const sectionStyle = { marginBottom: 40 };
const h2Style = { fontSize: 18, fontWeight: 800, color: '#111', letterSpacing: '-0.01em', margin: '0 0 14px' };
const proseStyle = { fontSize: 14, color: '#555', lineHeight: 1.8 };
