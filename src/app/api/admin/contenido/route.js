// src/app/api/admin/contenido/route.js
import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';
import { DEFAULTS_POR_PAGINA, mergeContenido } from '@/lib/contenido';

const CONTENIDO_ID = 'chloe-contenido';

export async function GET() {
  try {
    const fila = await prisma.contenidoSitio.findFirst({ where: { id: CONTENIDO_ID } });
    const data = Object.fromEntries(
      Object.entries(DEFAULTS_POR_PAGINA).map(([key, defaults]) => [key, mergeContenido(defaults, fila?.[key])])
    );
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error('[GET /api/admin/contenido]', error);
    return NextResponse.json({ ok: false, error: 'Error al obtener contenido' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { pagina, data } = body;

    if (!DEFAULTS_POR_PAGINA[pagina]) {
      return NextResponse.json({ ok: false, error: 'Página inválida' }, { status: 400 });
    }

    const fila = await prisma.contenidoSitio.upsert({
      where:  { id: CONTENIDO_ID },
      update: { [pagina]: data },
      create: { id: CONTENIDO_ID, [pagina]: data },
    });

    return NextResponse.json({ ok: true, data: fila[pagina] });
  } catch (error) {
    console.error('[POST /api/admin/contenido]', error);
    return NextResponse.json({ ok: false, error: 'Error al guardar contenido' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
