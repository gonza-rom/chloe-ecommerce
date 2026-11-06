// src/lib/gocuotas.js
// Go Cuotas no requiere auth previo — la API key va directo como Bearer token

import { createHmac, timingSafeEqual } from 'crypto';

const BASE = 'https://api-magento.gocuotas.com';

// Firma el pedidoId con la API key (secreta) para que el webhook pueda
// verificar que la notificación corresponde a un checkout creado por nosotros.
export function firmarPedidoGoCuotas(pedidoId) {
  const apiKey = process.env.GOCUOTAS_API_KEY;
  if (!apiKey) throw new Error('Falta variable de entorno GOCUOTAS_API_KEY');
  return createHmac('sha256', apiKey).update(`gocuotas:${pedidoId}`).digest('hex');
}

export function verificarFirmaGoCuotas(pedidoId, firma) {
  if (!pedidoId || !firma || typeof firma !== 'string') return false;
  const esperada = Buffer.from(firmarPedidoGoCuotas(pedidoId));
  const recibida = Buffer.from(firma);
  return esperada.length === recibida.length && timingSafeEqual(esperada, recibida);
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Go Cuotas devolvió respuesta no-JSON (HTTP ${res.status}). Primeros 300 chars: ${text.slice(0, 300)}`
    );
  }
}

export async function gocuotasCreateCheckout({
  pedidoId,
  total,
  compradorEmail,
  successUrl,
  failureUrl,
  webhookUrl,
}) {
  const apiKey = process.env.GOCUOTAS_API_KEY;
  if (!apiKey) throw new Error('Falta variable de entorno GOCUOTAS_API_KEY');

  const params = new URLSearchParams({
    amount_in_cents:    String(Math.round(total * 100)),
    order_reference_id: String(pedidoId),
    url_success:        successUrl,
    url_failure:        failureUrl,
    webhook_url:        webhookUrl,
    email:              compradorEmail,
  });

  const res = await fetch(`${BASE}/api_redirect/v1/checkouts?${params.toString()}`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: '',
  });

  const data = await safeJson(res);

  if (!res.ok) {
    throw new Error(
      `Go Cuotas checkout falló (HTTP ${res.status}): ${data.message ?? JSON.stringify(data)}`
    );
  }

  if (!data.url_init) {
    throw new Error(`Go Cuotas no devolvió url_init. Respuesta: ${JSON.stringify(data)}`);
  }

  return { checkoutUrl: data.url_init };
}