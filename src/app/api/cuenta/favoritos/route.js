// src/app/api/cuenta/favoritos/route.js
import { NextResponse }  from 'next/server';
import { prisma }        from '@/lib/prisma';
import { createClient }  from '@/lib/supabase/server';

async function getClienteActual() {
  const supabase           = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) return null;
  return prisma.cliente.findUnique({ where: { supabaseId: user.id }, select: { id: true } });
}

export async function GET() {
  const cliente = await getClienteActual();
  if (!cliente) return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 });

  try {
    const conFavoritos = await prisma.cliente.findUnique({
      where:  { id: cliente.id },
      select: {
        favoritos: {
          where:  { activo: true },
          select: { id: true, nombre: true, precio: true, imagen: true },
        },
      },
    });
    return NextResponse.json({ ok: true, data: conFavoritos?.favoritos ?? [] });
  } catch (error) {
    console.error('[GET /api/cuenta/favoritos]', error);
    return NextResponse.json({ ok: false, error: 'Error al obtener favoritos' }, { status: 500 });
  }
}

export async function POST(req) {
  const cliente = await getClienteActual();
  if (!cliente) return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 });

  try {
    const { productoId } = await req.json();
    if (!productoId) return NextResponse.json({ ok: false, error: 'Falta productoId' }, { status: 400 });

    await prisma.cliente.update({
      where: { id: cliente.id },
      data:  { favoritos: { connect: { id: productoId } } },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[POST /api/cuenta/favoritos]', error);
    return NextResponse.json({ ok: false, error: 'Error al guardar favorito' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const cliente = await getClienteActual();
  if (!cliente) return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const productoId = searchParams.get('productoId');
    if (!productoId) return NextResponse.json({ ok: false, error: 'Falta productoId' }, { status: 400 });

    await prisma.cliente.update({
      where: { id: cliente.id },
      data:  { favoritos: { disconnect: { id: productoId } } },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[DELETE /api/cuenta/favoritos]', error);
    return NextResponse.json({ ok: false, error: 'Error al quitar favorito' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
