// src/app/api/checkout/route.js
import { NextResponse } from 'next/server';
import { prisma }       from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { notificarPedidoNuevo } from '@/lib/notificaciones';
import { enviarEmailPedidoNuevo, enviarEmailConfirmacionCliente } from '@/lib/email';
import { precioSegunMetodo } from '@/lib/precios';
import { calcularEnvio }     from '@/lib/envio';

const TIPOS_ENVIO = ['retiro', 'local', 'envio'];

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      items: itemsCliente, total: totalCliente,
      metodoPago, tipoEnvio,
      compradorNombre, compradorEmail, compradorTelefono,
      notas, direccion, entregaLocal,
    } = body;

    if (!Array.isArray(itemsCliente) || !itemsCliente.length)
      return NextResponse.json({ ok: false, error: 'El carrito está vacío' }, { status: 400 });
    if (!compradorNombre)
      return NextResponse.json({ ok: false, error: 'Nombre requerido' }, { status: 400 });
    if (!compradorEmail)
      return NextResponse.json({ ok: false, error: 'Email requerido' }, { status: 400 });
    if (!metodoPago)
      return NextResponse.json({ ok: false, error: 'Método de pago requerido' }, { status: 400 });
    if (tipoEnvio === 'envio' && !direccion)
      return NextResponse.json({ ok: false, error: 'Dirección requerida para envío' }, { status: 400 });

    if (!TIPOS_ENVIO.includes(tipoEnvio))
      return NextResponse.json({ ok: false, error: 'Tipo de entrega inválido' }, { status: 400 });

    // ── Validar items, stock y calcular precios con los datos de la BD ──────
    // Nunca se usan precios ni totales enviados por el navegador.
    const items = [];
    for (const item of itemsCliente) {
      if (!Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > 100)
        return NextResponse.json({ ok: false, error: `Cantidad inválida para: ${item.nombre}` }, { status: 400 });

      const producto = item.productoId
        ? await prisma.producto.findFirst({ where: { id: item.productoId, activo: true } })
        : null;
      if (!producto)
        return NextResponse.json({ ok: false, error: `Producto no disponible: ${item.nombre}` }, { status: 409 });

      let variante = null;
      if (item.varianteId) {
        variante = await prisma.productoVariante.findFirst({
          where: { id: item.varianteId, productoId: producto.id, activo: true },
        });
        if (!variante || variante.stock < item.cantidad)
          return NextResponse.json({ ok: false, error: `Sin stock suficiente para: ${producto.nombre}` }, { status: 409 });
      } else {
        if (producto.tieneVariantes)
          return NextResponse.json({ ok: false, error: `Elegí talle/color para: ${producto.nombre}` }, { status: 400 });
        if (producto.stock < item.cantidad)
          return NextResponse.json({ ok: false, error: `Sin stock suficiente para: ${producto.nombre}` }, { status: 409 });
      }

      const precio = precioSegunMetodo(variante?.precio ?? producto.precio, producto.descuentoEfectivo, metodoPago);
      items.push({
        productoId: producto.id,
        varianteId: variante?.id ?? null,
        nombre:     producto.nombre,
        precio,
        cantidad:   item.cantidad,
        subtotal:   precio * item.cantidad,
        talle:      variante?.talle ?? null,
        color:      variante?.color || null,
        imagen:     item.imagen ?? producto.imagen ?? null,
      });
    }

    const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);

    let costoEnvio = 0;
    if (tipoEnvio === 'envio') {
      const infoEnvio = calcularEnvio(direccion.provincia, subtotal);
      if (!infoEnvio.disponible)
        return NextResponse.json({ ok: false, error: 'No hacemos envíos a esa provincia' }, { status: 400 });
      costoEnvio = infoEnvio.precio;
    }
    const total = subtotal + costoEnvio;

    // Si el total que vio el cliente no coincide (precio cambiado, carrito viejo),
    // no crear el pedido: que vea el total real antes de pagar.
    if (typeof totalCliente === 'number' && Math.abs(totalCliente - total) > 1) {
      return NextResponse.json({
        ok: false,
        error: 'Los precios de tu carrito se actualizaron. Recargá la página para ver el total actualizado.',
      }, { status: 409 });
    }

    // Usuario autenticado (opcional)
    let clienteId = null;
    try {
      const supabase           = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        const cliente = await prisma.cliente.findUnique({ where: { supabaseId: user.id }, select: { id: true } });
        if (cliente) clienteId = cliente.id;
      }
    } catch {}

    // Parsear dirección local si viene como string "calle numero, barrio"
    let localCalle = null, localNumero = null, localBarrio = null;
    let localLat   = null, localLng    = null;
    if (tipoEnvio === 'local' && entregaLocal) {
      localCalle  = entregaLocal.calle     ?? entregaLocal.direccion ?? null;
      localNumero = entregaLocal.numero    ?? null;
      localBarrio = entregaLocal.barrio    ?? null;
      localLat    = entregaLocal.lat       ?? null;
      localLng    = entregaLocal.lng       ?? null;
    }

    // Crear pedido
    const pedido = await prisma.$transaction(async (tx) => {
      let direccionId = null;
      if (tipoEnvio === 'envio' && direccion && clienteId) {
        const dir = await tx.direccion.create({
          data: {
            clienteId,
            calle:        direccion.calle,
            numero:       direccion.numero       ?? null,
            piso:         direccion.piso         ?? null,
            departamento: direccion.departamento ?? null,
            ciudad:       direccion.ciudad,
            provincia:    direccion.provincia,
            codigoPostal: direccion.codigoPostal,
          },
        });
        direccionId = dir.id;
      }

      const p = await tx.pedido.create({
        data: {
          clienteId,
          direccionId,
          estado:    'PENDIENTE',
          subtotal,
          costoEnvio,
          total,
          metodoPago,
          tipoEnvio,
          compradorNombre,
          compradorEmail,
          compradorTelefono,
          notas: notas ?? null,

          // Campos de envío a domicilio
          ...(tipoEnvio === 'envio' && direccion && {
            envCalle:        direccion.calle        ?? null,
            envNumero:       direccion.numero       ?? null,
            envPiso:         direccion.piso         ?? null,
            envDepartamento: direccion.departamento ?? null,
            envCiudad:       direccion.ciudad       ?? null,
            envProvincia:    direccion.provincia    ?? null,
            envCodigoPostal: direccion.codigoPostal ?? null,
          }),

          // Campos de envío local
          ...(tipoEnvio === 'local' && {
            localCalle:  localCalle,
            localLat:    localLat  ? parseFloat(localLat)  : null,
            localLng:    localLng  ? parseFloat(localLng)  : null,
          }),

          items: {
            create: items.map(item => ({
              productoId: item.productoId ?? null,
              varianteId: item.varianteId ?? null,
              nombre:     item.nombre,
              precio:     item.precio,
              cantidad:   item.cantidad,
              subtotal:   item.subtotal,
              talle:      item.talle  ?? null,
              color:      item.color  ?? null,
              imagen:     item.imagen ?? null,
            })),
          },
        },
      });

      // Descontar stock de forma atómica: si entre la verificación y acá otra
      // compra se llevó el stock, no se descuenta y se cancela todo el pedido.
      for (const item of items) {
        let res = null;
        if (item.varianteId) {
          res = await tx.productoVariante.updateMany({
            where: { id: item.varianteId, stock: { gte: item.cantidad } },
            data:  { stock: { decrement: item.cantidad } },
          });
        } else if (item.productoId) {
          res = await tx.producto.updateMany({
            where: { id: item.productoId, stock: { gte: item.cantidad } },
            data:  { stock: { decrement: item.cantidad } },
          });
        }
        if (res && res.count === 0) {
          const err = new Error(`Sin stock suficiente para: ${item.nombre}`);
          err.sinStock = true;
          throw err;
        }
      }

      return p;
    });

    notificarPedidoNuevo(pedido, items).catch(err =>
      console.error('[WA Notif] Error background:', err)
    );
    enviarEmailPedidoNuevo(pedido, items).catch(err =>
      console.error('[Email Pedido] Error background:', err)
    );
    enviarEmailConfirmacionCliente(pedido, items).catch(err =>
      console.error('[Email Cliente] Error background:', err)
    );

    return NextResponse.json({ ok: true, pedidoId: pedido.id });

  } catch (error) {
    if (error?.sinStock)
      return NextResponse.json({ ok: false, error: error.message }, { status: 409 });
    console.error('[POST /api/checkout]', error);
    return NextResponse.json({ ok: false, error: 'Error al procesar el pedido' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';