// src/app/api/payway/webhook/route.js
// Recibe notificaciones de Payway.
//
// IMPORTANTE: este endpoint es público y Payway no firma las notificaciones,
// así que NO se usa para cambiar el estado de los pedidos (cualquiera podría
// mandar un POST con status "approved"). El pedido se marca como PAGADO en
// /api/payway/pago, con la respuesta que devuelve Payway directamente.
// Acá solo se registra la notificación para poder auditarla.

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Payway webhook recibido:', JSON.stringify(body));
  } catch (error) {
    console.error('Error webhook Payway:', error);
  }
  // Siempre responder 200 a Payway
  return NextResponse.json({ ok: true });
}

// Payway a veces hace GET para verificar que el endpoint existe
export async function GET() {
  return NextResponse.json({ ok: true, service: 'Chloe Showroom Payway Webhook' });
}
