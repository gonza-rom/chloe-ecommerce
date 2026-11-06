// src/app/api/gocuotas/webhook/route.js
// La URL del webhook lleva ?pedido=<id>&firma=<hmac> (ver /api/gocuotas/create).
// Sin una firma válida no se toca ningún pedido.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verificarFirmaGoCuotas } from '@/lib/gocuotas';

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pedidoId = searchParams.get('pedido');
    const firma    = searchParams.get('firma');

    if (!verificarFirmaGoCuotas(pedidoId, firma)) {
      console.warn('[GoCuotas Webhook] Firma inválida', pedidoId);
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    console.log('[GoCuotas Webhook] recibido:', pedidoId, JSON.stringify(body));

    const status = String(body.status ?? '').toLowerCase();

    if (status === 'approved') {
      await prisma.pedido.updateMany({
        where: { id: pedidoId, estado: 'PENDIENTE' },
        data:  { estado: 'PAGADO', metodoPago: 'gocuotas', pagadoAt: new Date() },
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[GoCuotas Webhook]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
