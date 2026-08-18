// src/app/productos/[id]/layout.js
// Genera metadata dinámica para cada producto (SEO + Open Graph)

import { prisma } from '@/lib/prisma';

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const producto = await prisma.producto.findFirst({
      where:  { id, activo: true },
      select: {
        nombre:      true,
        descripcion: true,
        precio:      true,
        imagen:      true,
        imagenes:    true,
        categoria:   { select: { nombre: true } },
      },
    });

    if (!producto) {
      return {
        title:       'Producto no encontrado — Chloe Showroom',
        description: 'Este producto no está disponible.',
      };
    }

    // Obtener la primera imagen válida
    const imagenes = Array.isArray(producto.imagenes) ? producto.imagenes : [];
    const imagen   = imagenes[0] ?? producto.imagen ?? null;

    const titulo      = `${producto.nombre} — Chloe Showroom`;
    const descripcion = producto.descripcion
      ?? `${producto.nombre} | $${producto.precio.toLocaleString('es-AR')} | Chloe Showroom — Moda femenina en Catamarca`;
    const precioFormateado = producto.precio.toLocaleString('es-AR');

    return {
      title:       titulo,
      description: descripcion,
      keywords:    [
        producto.nombre,
        producto.categoria?.nombre,
        'chloe showroom',
        'moda femenina',
        'indumentaria',
        'catamarca',
      ].filter(Boolean).join(', '),
      openGraph: {
        title:       titulo,
        description: descripcion,
        type:        'website',
        locale:      'es_AR',
        siteName:    'Chloe Showroom',
        ...(imagen && {
          images: [{
            url:    imagen,
            width:  800,
            height: 800,
            alt:    producto.nombre,
          }],
        }),
      },
      twitter: {
        card:        imagen ? 'summary_large_image' : 'summary',
        title:       titulo,
        description: descripcion,
        ...(imagen && { images: [imagen] }),
      },
      // Precio estructurado para Google Shopping (schema.org via meta)
      other: {
        'product:price:amount':   String(producto.precio),
        'product:price:currency': 'ARS',
      },
    };
  } catch {
    return {
      title:       'Chloe Showroom',
      description: 'Moda femenina en Catamarca. Envíos a todo el país.',
    };
  }
}

export default function ProductoLayout({ children }) {
  return children;
}