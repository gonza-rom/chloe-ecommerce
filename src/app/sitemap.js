// src/app/sitemap.js
import { prisma } from '@/lib/prisma';

const SITE_URL = 'https://www.chloeshowroom.com.ar';

export default async function sitemap() {
  const paginasFijas = [
    { url: `${SITE_URL}/`,           changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/productos`,  changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/nosotros`,   changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contacto`,   changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/envios`,     changeFrequency: 'monthly', priority: 0.4 },
  ].map(p => ({ ...p, lastModified: new Date() }));

  let productos = [];
  try {
    productos = await prisma.producto.findMany({
      where:  { activo: true },
      select: { id: true, updatedAt: true },
    });
  } catch {
    productos = [];
  }

  const paginasProductos = productos.map(p => ({
    url:            `${SITE_URL}/productos/${p.id}`,
    lastModified:   p.updatedAt,
    changeFrequency: 'weekly',
    priority:       0.7,
  }));

  return [...paginasFijas, ...paginasProductos];
}
