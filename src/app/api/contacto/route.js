// src/app/api/contacto/route.js
import { NextResponse } from 'next/server';
import { enviarEmailContacto } from '@/lib/email';

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, email, asunto, mensaje } = body;

    if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
      return NextResponse.json({ ok: false, error: 'Completá nombre, email y mensaje' }, { status: 400 });
    }

    const resultado = await enviarEmailContacto({
      nombre:  nombre.trim(),
      email:   email.trim(),
      asunto:  asunto ?? null,
      mensaje: mensaje.trim(),
    });

    if (!resultado.ok) {
      return NextResponse.json({ ok: false, error: 'No se pudo enviar el mensaje' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[POST /api/contacto]', error);
    return NextResponse.json({ ok: false, error: 'Error al enviar el mensaje' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
