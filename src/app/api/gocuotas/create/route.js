// src/app/api/gocuotas/create/route.js
import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';
import { gocuotasCreateCheckout, firmarPedidoGoCuotas } from '@/lib/gocuotas';

export async function POST(req) {
  try {
    const { pedidoId } = await req.json();

    if (!pedidoId) {
      return NextResponse.json({ ok: false, error: 'Falta pedidoId' }, { status: 400 });
    }

    // Monto y email salen de la BD, nunca del cliente
    const pedido = await prisma.pedido.findUnique({
      where:  { id: pedidoId },
      select: { id: true, total: true, compradorEmail: true, estado: true },
    });
    if (!pedido) {
      return NextResponse.json({ ok: false, error: 'Pedido no encontrado' }, { status: 404 });
    }
    if (pedido.estado !== 'PENDIENTE') {
      return NextResponse.json({ ok: false, error: 'Este pedido ya fue procesado' }, { status: 409 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const firma   = firmarPedidoGoCuotas(pedido.id);

    const { checkoutUrl } = await gocuotasCreateCheckout({
      pedidoId:       pedido.id,
      total:          pedido.total,
      compradorEmail: pedido.compradorEmail,
      successUrl: `${baseUrl}/checkout/exito?pedido=${pedido.id}&metodo=debito`,
      failureUrl: `${baseUrl}/checkout?cancelado=1&pedido=${pedido.id}`,
      webhookUrl: `${baseUrl}/api/gocuotas/webhook?pedido=${pedido.id}&firma=${firma}`,
    });

    return NextResponse.json({ ok: true, checkoutUrl });
  } catch (err) {
    console.error('[GoCuotas Create]', err);
    return NextResponse.json({ ok: false, error: 'Error al conectar con Go Cuotas' }, { status: 500 });
  }
}
