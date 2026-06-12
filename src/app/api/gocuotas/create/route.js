// src/app/api/gocuotas/create/route.js
import { NextResponse } from 'next/server';
import { gocuotasCreateCheckout } from '@/lib/gocuotas';

export async function POST(req) {
  try {
    const { pedidoId, total, compradorEmail } = await req.json();

    if (!pedidoId || !total || !compradorEmail) {
      return NextResponse.json(
        { ok: false, error: 'Faltan datos: pedidoId, total o compradorEmail' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

    const { checkoutUrl } = await gocuotasCreateCheckout({
      pedidoId,
      total,
      compradorEmail,
      successUrl: `${baseUrl}/checkout/exito?pedido=${pedidoId}&metodo=debito`,
      failureUrl: `${baseUrl}/checkout?cancelado=1&pedido=${pedidoId}`,
      webhookUrl: `${baseUrl}/api/gocuotas/webhook`,
    });

    return NextResponse.json({ ok: true, checkoutUrl });
  } catch (err) {
    console.error('[GoCuotas Create]', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}