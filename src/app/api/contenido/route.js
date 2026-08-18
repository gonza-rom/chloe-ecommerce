// src/app/api/contenido/route.js
// Lectura pública del contenido editable (Home, Nosotros, Contacto).
import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';
import { DEFAULTS_POR_PAGINA, mergeContenido } from '@/lib/contenido';

const CONTENIDO_ID = 'chloe-contenido';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pagina = searchParams.get('pagina');

    const fila = await prisma.contenidoSitio.findFirst({ where: { id: CONTENIDO_ID } });

    if (pagina) {
      const defaults = DEFAULTS_POR_PAGINA[pagina];
      if (!defaults) {
        return NextResponse.json({ ok: false, error: 'Página inválida' }, { status: 400 });
      }
      return NextResponse.json({ ok: true, data: mergeContenido(defaults, fila?.[pagina]) });
    }

    const data = Object.fromEntries(
      Object.entries(DEFAULTS_POR_PAGINA).map(([key, defaults]) => [key, mergeContenido(defaults, fila?.[key])])
    );
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error('[GET /api/contenido]', error);
    return NextResponse.json({ ok: false, error: 'Error al obtener contenido' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
