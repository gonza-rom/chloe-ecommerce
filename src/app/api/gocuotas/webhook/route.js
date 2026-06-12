// src/app/api/gocuotas/webhook/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    // body.external_reference = tu pedidoId
    // body.status = 'approved' | 'rejected' | 'pending'

    const { external_reference, status } = body;

    if (external_reference && status === 'approved') {
      await prisma.pedido.update({
        where: { id: external_reference },
        data:  { estado: 'PAGADO', metodoPago: 'gocuotas' },
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[GoCuotas Webhook]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}