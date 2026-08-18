// src/app/api/config/route.js
// Config de la tienda para uso público (checkout, footer, etc.).
// A diferencia de /api/admin/config, NUNCA expone mpAccessToken ni mpWebhookSecret.
import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';

const CONFIG_ID = 'hoky-config';

export async function GET() {
  try {
    const config = await prisma.configTienda.findFirst({ where: { id: CONFIG_ID } });

    if (!config) return NextResponse.json({ ok: true, data: null });

    const { mpAccessToken, mpWebhookSecret, ...publico } = config;

    return NextResponse.json({ ok: true, data: publico });
  } catch (error) {
    console.error('[GET /api/config]', error);
    return NextResponse.json({ ok: false, error: 'Error al obtener configuración' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
