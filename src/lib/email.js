// src/lib/email.js
// Notificación por email al admin cuando entra un pedido nuevo.
// Usa Resend con el dominio chloeshowroom.com.ar ya verificado.
//
// SETUP:
// 1. Agregá al .env:
//    RESEND_API_KEY=re_xxxxxxxx        (API Key de Resend, permiso "Sending")
//    RESEND_FROM_EMAIL=pedidos@chloeshowroom.com.ar
// 2. El destinatario es NEXT_PUBLIC_ADMIN_EMAIL (ya configurado).

import { Resend } from 'resend';

const API_KEY   = process.env.RESEND_API_KEY;
const FROM      = process.env.RESEND_FROM_EMAIL ?? 'pedidos@chloeshowroom.com.ar';
const ADMIN_TO  = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const APP_URL   = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

const resend = API_KEY ? new Resend(API_KEY) : null;

function fmtPrecio(n) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(n ?? 0);
}

const METODO_LABEL = {
  mercadopago:   'Mercado Pago',
  transferencia: 'Transferencia bancaria',
  efectivo:      'Efectivo',
  payway:        'Tarjeta (Payway)',
  gocuotas:      'GO Cuotas (débito)',
};

const ENTREGA_LABEL = {
  retiro: 'Retiro en local',
  local:  'Envío local',
  envio:  'Envío a domicilio',
};

function itemsFilaHtml(items) {
  return items.map(i => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#111;">
        ${i.nombre}${i.talle ? ` · Talle ${i.talle}` : ''}${i.color ? ` · ${i.color}` : ''}
        <span style="color:#999;"> ×${i.cantidad}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#111;text-align:right;white-space:nowrap;">
        ${fmtPrecio(i.subtotal ?? i.precio * i.cantidad)}
      </td>
    </tr>
  `).join('');
}

function templatePedidoNuevo(pedido, items) {
  const numero = pedido.id.slice(-8).toUpperCase();

  return `
  <div style="background:#f5f4f2;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="background:#111;padding:24px 28px;">
          <p style="margin:0;color:#fff;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.6;">Chloe Showroom</p>
          <p style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700;">Nuevo pedido #${numero}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;">
          <table role="presentation" width="100%" style="margin-bottom:20px;">
            <tr><td style="font-size:13px;color:#888;padding:3px 0;">Cliente</td><td style="font-size:13px;color:#111;text-align:right;font-weight:600;">${pedido.compradorNombre}</td></tr>
            <tr><td style="font-size:13px;color:#888;padding:3px 0;">Teléfono</td><td style="font-size:13px;color:#111;text-align:right;">${pedido.compradorTelefono ?? '—'}</td></tr>
            <tr><td style="font-size:13px;color:#888;padding:3px 0;">Email</td><td style="font-size:13px;color:#111;text-align:right;">${pedido.compradorEmail}</td></tr>
            <tr><td style="font-size:13px;color:#888;padding:3px 0;">Pago</td><td style="font-size:13px;color:#111;text-align:right;">${METODO_LABEL[pedido.metodoPago] ?? pedido.metodoPago}</td></tr>
            <tr><td style="font-size:13px;color:#888;padding:3px 0;">Entrega</td><td style="font-size:13px;color:#111;text-align:right;">${ENTREGA_LABEL[pedido.tipoEnvio] ?? pedido.tipoEnvio ?? '—'}</td></tr>
          </table>

          <table role="presentation" width="100%" style="border-top:2px solid #111;">
            ${itemsFilaHtml(items)}
          </table>

          <table role="presentation" width="100%" style="margin-top:12px;">
            <tr>
              <td style="font-size:15px;font-weight:700;color:#111;padding-top:8px;">Total</td>
              <td style="font-size:18px;font-weight:800;color:#111;text-align:right;padding-top:8px;">${fmtPrecio(pedido.total)}</td>
            </tr>
          </table>

          <a href="${APP_URL}/admin/pedidos"
             style="display:block;text-align:center;margin-top:28px;background:#111;color:#fff;text-decoration:none;
                    padding:14px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;">
            Ver pedido en el admin
          </a>
        </td>
      </tr>
    </table>
  </div>`;
}

function templateConfirmacionCliente(pedido, items) {
  const numero = pedido.id.slice(-8).toUpperCase();

  return `
  <div style="background:#f5f4f2;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="background:#111;padding:32px 28px;text-align:center;">
          <p style="margin:0;color:#fff;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;">Chloe Showroom</p>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 28px 8px;text-align:center;">
          <h1 style="margin:0 0 10px;font-size:22px;font-weight:300;color:#111;">¡Gracias por tu compra!</h1>
          <p style="margin:0 0 4px;font-size:14px;color:#666;line-height:1.7;">
            Recibimos tu pedido <strong style="color:#111;">#${numero}</strong>. Te contactamos por WhatsApp o email
            para coordinar el pago${pedido.tipoEnvio === 'retiro' ? ' y el retiro' : ' y el envío'}.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 0;">
          <table role="presentation" width="100%" style="border-top:2px solid #111;">
            ${itemsFilaHtml(items)}
          </table>
          <table role="presentation" width="100%" style="margin-top:12px;">
            <tr>
              <td style="font-size:15px;font-weight:700;color:#111;padding-top:8px;">Total</td>
              <td style="font-size:18px;font-weight:800;color:#111;text-align:right;padding-top:8px;">${fmtPrecio(pedido.total)}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;">
          <table role="presentation" width="100%" style="margin-bottom:8px;">
            <tr><td style="font-size:12px;color:#999;padding:2px 0;">Método de pago</td><td style="font-size:12px;color:#111;text-align:right;">${METODO_LABEL[pedido.metodoPago] ?? pedido.metodoPago}</td></tr>
            <tr><td style="font-size:12px;color:#999;padding:2px 0;">Entrega</td><td style="font-size:12px;color:#111;text-align:right;">${ENTREGA_LABEL[pedido.tipoEnvio] ?? pedido.tipoEnvio ?? '—'}</td></tr>
          </table>
          <a href="${APP_URL}/contacto"
             style="display:block;text-align:center;margin-top:20px;background:#111;color:#fff;text-decoration:none;
                    padding:14px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;">
            ¿Alguna consulta? Escribinos
          </a>
          <p style="margin:24px 0 0;font-size:11px;color:#bbb;text-align:center;">
            Chloe Showroom — Alpatauca 870, San Fernando del Valle de Catamarca
          </p>
        </td>
      </tr>
    </table>
  </div>`;
}

export async function enviarEmailConfirmacionCliente(pedido, items = []) {
  if (!resend) {
    console.log('[Email Cliente] Desactivado — falta RESEND_API_KEY. Pedido:', pedido.id);
    return { ok: true, skipped: true };
  }
  if (!pedido.compradorEmail) {
    console.warn('[Email Cliente] El pedido no tiene email de comprador:', pedido.id);
    return { ok: false, error: 'Falta email del comprador' };
  }

  try {
    const numero = pedido.id.slice(-8).toUpperCase();
    const { error } = await resend.emails.send({
      from:    `Chloe Showroom <${FROM}>`,
      to:      pedido.compradorEmail,
      subject: `Recibimos tu pedido #${numero} — Chloe Showroom`,
      html:    templateConfirmacionCliente(pedido, items),
    });

    if (error) {
      console.error('[Email Cliente] Error de Resend:', error);
      return { ok: false, error };
    }

    console.log('[Email Cliente] Enviado OK — pedido:', pedido.id);
    return { ok: true };
  } catch (error) {
    console.error('[Email Cliente] Error al enviar:', error);
    return { ok: false, error: error.message };
  }
}

const MOTIVO_LABEL = {
  pedido: 'Consulta sobre un pedido',
  tallas: 'Tallas y disponibilidad',
  envio:  'Información de envíos',
  turno:  'Reserva de turno en el showroom',
  cambio: 'Cambios y devoluciones',
  otro:   'Otro',
};

function templateContacto({ nombre, email, asunto, mensaje }) {
  return `
  <div style="background:#f5f4f2;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="background:#111;padding:24px 28px;">
          <p style="margin:0;color:#fff;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.6;">Chloe Showroom</p>
          <p style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700;">Nueva consulta de contacto</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;">
          <table role="presentation" width="100%" style="margin-bottom:20px;">
            <tr><td style="font-size:13px;color:#888;padding:3px 0;">Nombre</td><td style="font-size:13px;color:#111;text-align:right;font-weight:600;">${nombre}</td></tr>
            <tr><td style="font-size:13px;color:#888;padding:3px 0;">Email</td><td style="font-size:13px;color:#111;text-align:right;">${email}</td></tr>
            <tr><td style="font-size:13px;color:#888;padding:3px 0;">Motivo</td><td style="font-size:13px;color:#111;text-align:right;">${MOTIVO_LABEL[asunto] ?? asunto ?? '—'}</td></tr>
          </table>
          <div style="border-top:2px solid #111;padding-top:16px;">
            <p style="font-size:14px;color:#111;line-height:1.7;white-space:pre-wrap;margin:0;">${mensaje}</p>
          </div>
        </td>
      </tr>
    </table>
  </div>`;
}

export async function enviarEmailContacto({ nombre, email, asunto, mensaje }) {
  if (!resend) {
    console.log('[Email Contacto] Desactivado — falta RESEND_API_KEY.');
    return { ok: true, skipped: true };
  }
  if (!ADMIN_TO) {
    console.warn('[Email Contacto] Falta NEXT_PUBLIC_ADMIN_EMAIL en .env');
    return { ok: false, error: 'Falta email de destino' };
  }

  try {
    const { error } = await resend.emails.send({
      from:    `Chloe Showroom <${FROM}>`,
      to:      ADMIN_TO,
      replyTo: email,
      subject: `Contacto: ${MOTIVO_LABEL[asunto] ?? asunto ?? 'Consulta'} — ${nombre}`,
      html:    templateContacto({ nombre, email, asunto, mensaje }),
    });

    if (error) {
      console.error('[Email Contacto] Error de Resend:', error);
      return { ok: false, error };
    }

    console.log('[Email Contacto] Enviado OK —', email);
    return { ok: true };
  } catch (error) {
    console.error('[Email Contacto] Error al enviar:', error);
    return { ok: false, error: error.message };
  }
}

export async function enviarEmailPedidoNuevo(pedido, items = []) {
  if (!resend) {
    console.log('[Email Pedido] Desactivado — falta RESEND_API_KEY. Pedido:', pedido.id);
    return { ok: true, skipped: true };
  }
  if (!ADMIN_TO) {
    console.warn('[Email Pedido] Falta NEXT_PUBLIC_ADMIN_EMAIL en .env');
    return { ok: false, error: 'Falta email de destino' };
  }

  try {
    const numero = pedido.id.slice(-8).toUpperCase();
    const { error } = await resend.emails.send({
      from:    `Chloe Showroom <${FROM}>`,
      to:      ADMIN_TO,
      subject: `Nuevo pedido #${numero} — ${fmtPrecio(pedido.total)}`,
      html:    templatePedidoNuevo(pedido, items),
    });

    if (error) {
      console.error('[Email Pedido] Error de Resend:', error);
      return { ok: false, error };
    }

    console.log('[Email Pedido] Enviado OK — pedido:', pedido.id);
    return { ok: true };
  } catch (error) {
    console.error('[Email Pedido] Error al enviar:', error);
    return { ok: false, error: error.message };
  }
}
