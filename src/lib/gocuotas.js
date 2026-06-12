// src/lib/gocuotas.js
// Go Cuotas no requiere auth previo — la API key va directo como Bearer token

const BASE = 'https://api-magento.gocuotas.com';

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