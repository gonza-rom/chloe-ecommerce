'use client';
// src/app/productos/[id]/page.js

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag, ArrowLeft, Truck, Shield, RefreshCw,
  ChevronLeft, ChevronRight, Plus, Minus, Share2,
  Banknote, Building2, Heart, Check,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { COLOR_MAP } from '@/lib/colorMap';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtPrecio(n) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(n);
}

// ── Galería — thumbnails verticales a la izquierda (desktop) ─────────────────

function Gallery({ producto }) {
  const imagenes = useMemo(() => {
    const imgs = [];
    if (producto.imagen) imgs.push(producto.imagen);
    if (Array.isArray(producto.imagenes))
      imgs.push(...producto.imagenes.filter((i) => i && i !== producto.imagen));
    return imgs.length ? imgs : [null];
  }, [producto]);

  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((i) => (i - 1 + imagenes.length) % imagenes.length);
  const next = () => setIdx((i) => (i + 1) % imagenes.length);

  return (
    <>
      <style>{`
        .gallery-wrap {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        @media (min-width: 768px) {
          .gallery-wrap {
            flex-direction: row;
            gap: 12px;
            align-items: flex-start;
          }
        }
        .gallery-thumbs-col {
          display: flex;
          flex-direction: row;
          gap: 8px;
          order: 2;
          overflow-x: auto;
          padding-top: 12px;
        }
        @media (min-width: 768px) {
          .gallery-thumbs-col {
            flex-direction: column;
            order: 0;
            overflow-x: unset;
            overflow-y: auto;
            padding-top: 0;
            width: 80px;
            flex-shrink: 0;
            max-height: 560px;
          }
        }
        .gallery-thumb-btn {
          flex-shrink: 0;
          width: 68px;
          height: 86px;
          overflow: hidden;
          background: #f3f3f4;
          border: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.2s;
          padding: 0;
          min-height: unset;
          min-width: unset;
          position: relative;
        }
        @media (min-width: 768px) {
          .gallery-thumb-btn { width: 80px; height: 100px; }
        }
        .gallery-thumb-btn.active { border-color: #0A0A0A; }
        .gallery-thumb-btn:hover:not(.active) { border-color: #7e7576; }
        .gallery-main-wrap {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: #f3f3f4;
        }
      `}</style>

      <div className="gallery-wrap">
        {/* Thumbnails */}
        {imagenes.length > 1 && (
          <div className="gallery-thumbs-col">
            {imagenes.map((src, i) => (
              <button
                key={i}
                className={`gallery-thumb-btn ${i === idx ? 'active' : ''}`}
                onClick={() => setIdx(i)}
                aria-label={`Imagen ${i + 1}`}
              >
                {src && (
                  <Image
                    src={src}
                    alt={`Vista ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Imagen principal */}
        <div className="gallery-main-wrap" style={{ aspectRatio: '3/4' }}>
          {imagenes[idx] ? (
            <Image
              key={imagenes[idx]}
              src={imagenes[idx]}
              alt={producto.nombre}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-outline-variant">image_not_supported</span>
            </div>
          )}

          {/* Badge */}
          {producto.destacado && (
            <div
              style={{
                position: 'absolute', top: 16, left: 16,
                background: '#e8e2d4', color: '#0A0A0A',
                fontFamily: 'var(--font-hanken)', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '5px 12px',
              }}
            >
              Fav ✮
            </div>
          )}

          {/* Flechas */}
          {imagenes.length > 1 && (
            <>
              <button
                onClick={prev}
                style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 36, height: 36, background: 'rgba(255,255,255,0.85)',
                  border: 'none', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)', minHeight: 'unset', minWidth: 'unset',
                }}
                aria-label="Anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 36, height: 36, background: 'rgba(255,255,255,0.85)',
                  border: 'none', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)', minHeight: 'unset', minWidth: 'unset',
                }}
                aria-label="Siguiente"
              >
                <ChevronRight size={18} />
              </button>

              {/* Contador */}
              <div style={{
                position: 'absolute', bottom: 16, right: 16,
                background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
                padding: '4px 10px',
              }}>
                <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.15em', color: 'white' }}>
                  {idx + 1} / {imagenes.length}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Acordeón ──────────────────────────────────────────────────────────────────

function Accordion({ titulo, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: '1px solid #E5E5E5' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0A0A0A',
        }}
      >
        {titulo}
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 18, transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          add
        </span>
      </button>
      <div style={{ overflow: 'hidden', maxHeight: open ? 400 : 0, transition: 'max-height 0.35s ease' }}>
        <div style={{ paddingBottom: 20, fontFamily: 'var(--font-karla)', fontSize: 14, color: '#4c4546', lineHeight: 1.8 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── WhatsApp icon ─────────────────────────────────────────────────────────────

function IconWhatsApp({ size = 20 }) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-10 md:py-16 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <div className="bg-surface-container" style={{ aspectRatio: '3/4' }} />
        <div className="space-y-5">
          <div className="h-3 bg-surface-container rounded w-1/4" />
          <div className="h-8 bg-surface-container rounded w-3/4" />
          <div className="h-5 bg-surface-container rounded w-1/3" />
          <div className="h-20 bg-surface-container rounded" />
          <div className="h-20 bg-surface-container rounded" />
          <div className="h-12 bg-surface-container rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────

export default function ProductoDetallePage() {
  const params = useParams();
  const router = useRouter();

  const [producto,              setProducto]              = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [loading,               setLoading]               = useState(true);
  const [error,                 setError]                 = useState(null);
  const [cantidad,              setCantidad]              = useState(1);
  const [agregado,              setAgregado]              = useState(false);
  const [talleSeleccionado,     setTalleSeleccionado]     = useState('');
  const [colorSeleccionado,     setColorSeleccionado]     = useState('');
  const [errorVariante,         setErrorVariante]         = useState('');
  const [wishlist,              setWishlist]              = useState(false);

  const { addToCart } = useCart();

  const fetchRelacionados = useCallback(async (categoriaId, productoId) => {
    try {
      const res  = await fetch(`/api/productos?categoria=${categoriaId}&exclude=${productoId}&limit=4`);
      const data = await res.json();
      setProductosRelacionados(Array.isArray(data) ? data : data.productos ?? []);
    } catch {}
  }, []);

  const fetchProducto = useCallback(async () => {
    if (!params.id) return;
    try {
      setLoading(true); setError(null);
      const res = await fetch(`/api/productos/${params.id}`);
      if (!res.ok) { setError(res.status === 404 ? 'not_found' : 'error'); return; }
      const data = await res.json();
      setProducto(data);
      fetchRelacionados(data.categoriaId, data.id);
    } catch { setError('error'); }
    finally  { setLoading(false); }
  }, [params.id, fetchRelacionados]);

  useEffect(() => { fetchProducto(); }, [fetchProducto]);

  const variantes      = useMemo(() => producto?.variantes ?? [], [producto]);
  const tieneVariantes = !!(producto?.tieneVariantes && variantes.length > 0);

  const tallesDisponibles = useMemo(() => {
    if (!tieneVariantes) return [];
    return [...new Set(variantes.filter(v => v.stock > 0).map(v => v.talle).filter(Boolean))];
  }, [variantes, tieneVariantes]);

  const coloresDisponibles = useMemo(() => {
    if (!tieneVariantes) return [];
    const base = talleSeleccionado
      ? variantes.filter(v => v.talle === talleSeleccionado && v.stock > 0)
      : variantes.filter(v => v.stock > 0);
    return [...new Set(base.map(v => v.color).filter(Boolean))];
  }, [variantes, tieneVariantes, talleSeleccionado]);

  const varianteSeleccionada = useMemo(() => {
    if (!tieneVariantes) return null;
    return variantes.find(v =>
      (!talleSeleccionado || v.talle === talleSeleccionado) &&
      (!colorSeleccionado || v.color === colorSeleccionado)
    ) ?? null;
  }, [variantes, tieneVariantes, talleSeleccionado, colorSeleccionado]);

  const stockEfectivo = tieneVariantes ? (varianteSeleccionada?.stock ?? 0) : (producto?.stock ?? 0);
  const precioBase    = varianteSeleccionada?.precio ?? producto?.precio ?? 0;
  const descuento     = 20; // siempre 20%, no depende del caché
  const precioTransf  = Math.round(precioBase * (1 - descuento / 100));
  const ahorro        = precioBase - precioTransf;
  const precio3c      = Math.round(precioBase / 3);

  function handleTalle(talle) {
    setTalleSeleccionado(p => p === talle ? '' : talle);
    setColorSeleccionado('');
    setErrorVariante('');
  }
  function handleColor(color) {
    setColorSeleccionado(p => p === color ? '' : color);
    setErrorVariante('');
  }

  function handleAgregarCarrito() {
    if (!producto) return;
    if (tieneVariantes) {
      if (tallesDisponibles.length > 0 && !talleSeleccionado)  { setErrorVariante('Seleccioná un talle'); return; }
      if (coloresDisponibles.length > 0 && !colorSeleccionado) { setErrorVariante('Seleccioná un color'); return; }
      if (!varianteSeleccionada || varianteSeleccionada.stock === 0) { setErrorVariante('Sin stock para esta combinación'); return; }
    }
    const item = {
      ...producto,
      precio:            precioBase,
      descuentoEfectivo: descuento,
      varianteId:        varianteSeleccionada?.id ?? null,
      talle:             talleSeleccionado || null,
      color:             colorSeleccionado || null,
      id: varianteSeleccionada ? `${producto.id}-${varianteSeleccionada.id}` : producto.id,
    };
    addToCart(item, cantidad);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2200);
  }

  function handleWhatsApp() {
    if (!producto) return;
    const varInfo = [talleSeleccionado && `Talle: ${talleSeleccionado}`, colorSeleccionado && `Color: ${colorSeleccionado}`].filter(Boolean).join(' | ');
    const msg =
      `¡Hola! Me interesa este producto:\n\n` +
      `*${producto.nombre}*${varInfo ? `\n${varInfo}` : ''}\n` +
      `Cantidad: ${cantidad}\n` +
      `Precio: ${fmtPrecio(precioBase)}\n\n¿Está disponible?`;
    window.open(`https://wa.me/5493834615992?text=${encodeURIComponent(msg)}`, '_blank');
  }

  async function handleCompartir() {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: producto.nombre, url }); } catch {} }
    else { try { await navigator.clipboard.writeText(url); } catch {} }
  }

  // ── Estados ───────────────────────────────────────────────────────────────

  if (loading) return <Skeleton />;

  if (error || !producto) return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <span className="material-symbols-outlined text-6xl text-outline-variant block mb-4">
          {error === 'not_found' ? 'search_off' : 'error_outline'}
        </span>
        <h2 className="font-headline-lg text-headline-lg mb-3">
          {error === 'not_found' ? 'Producto no encontrado' : 'Error al cargar'}
        </h2>
        <Link href="/catalogo"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 font-label-md text-label-md uppercase tracking-widest hover:bg-onyx-black transition-colors mt-4">
          <ArrowLeft size={16} /> Ver Catálogo
        </Link>
      </div>
    </div>
  );

  // ── Estilos compartidos ───────────────────────────────────────────────────
  const labelStyle = {
    fontFamily: 'var(--font-hanken)', fontSize: 9, fontWeight: 700,
    letterSpacing: '0.18em', textTransform: 'uppercase',
  };

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Breadcrumb ── */}
      <div className="border-b border-platinum-grey bg-surface">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-3">
          <nav className="flex items-center gap-2 flex-wrap">
            {[
              { label: 'Inicio', href: '/' },
              { label: 'Catálogo', href: '/catalogo' },
              ...(producto.categoria ? [{ label: producto.categoria.nombre, href: `/catalogo?categoria=${producto.categoriaId}` }] : []),
            ].map((item, i) => (
              <span key={item.href} className="flex items-center gap-2">
                {i > 0 && <span style={{ color: '#cfc4c5', fontSize: 10 }}>›</span>}
                <Link href={item.href}
                  style={{ ...labelStyle, fontSize: 10, color: '#4c4546', textDecoration: 'none' }}
                  className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              </span>
            ))}
            <span style={{ color: '#cfc4c5', fontSize: 10 }}>›</span>
            <span style={{ ...labelStyle, fontSize: 10, color: '#0A0A0A' }} className="truncate max-w-[180px]">
              {producto.nombre}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-8 md:py-14">

        {/* Volver */}
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
            cursor: 'pointer', marginBottom: 32, ...labelStyle, fontSize: 10, color: '#4c4546',
          }}
        >
          <ArrowLeft size={13} /> Volver
        </button>

        {/* ── Grid principal ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 mb-20 md:mb-28">

          {/* ── Galería ── */}
          <div>
            <Gallery producto={producto} />
            <button
              onClick={handleCompartir}
              style={{
                marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', cursor: 'pointer',
                ...labelStyle, fontSize: 10, color: '#4c4546',
              }}
            >
              <Share2 size={13} /> Compartir
            </button>
          </div>

          {/* ── Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Marca */}
            <p style={{ ...labelStyle, fontSize: 10, color: '#4c4546', marginBottom: 8, letterSpacing: '0.22em' }}>
              Chloe Showroom · {producto.categoria?.nombre ?? 'Colección 2026'}
            </p>

            {/* Nombre */}
            <h1 style={{
              fontFamily: 'var(--font-hanken)', fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
              fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 24,
              color: '#0A0A0A',
            }}>
              {producto.nombre}
            </h1>

            {/* ══════════════════════════════════
                BLOQUE DE PRECIOS — estilo Chloe
            ══════════════════════════════════ */}
            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #E5E5E5' }}>

              {/* Precio anterior */}
              {producto.precioAnterior && producto.precioAnterior > precioBase && (
                <p style={{ fontFamily: 'var(--font-karla)', fontSize: 13, color: '#7e7576', textDecoration: 'line-through', marginBottom: 12 }}>
                  Antes: {fmtPrecio(producto.precioAnterior)}
                </p>
              )}

              {/* ── Tarjeta / Mercado Pago ── */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: '#fafafa',
                border: '1.5px solid #E5E5E5', marginBottom: 6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: '#E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#4c4546' }}>credit_card</span>
                  </div>
                  <div>
                    <p style={{ ...labelStyle, fontSize: 10, color: '#4c4546' }}>Tarjeta / Mercado Pago</p>
                    <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#7e7576', marginTop: 1 }}>
                      3 cuotas de {fmtPrecio(precio3c)} sin interés
                    </p>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', fontWeight: 700, color: '#0A0A0A', flexShrink: 0 }}>
                  {fmtPrecio(precioBase)}
                </p>
              </div>

              {/* ── Efectivo / Transferencia ── */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: '#f0fdf4',
                border: '1.5px solid #bbf7d0', marginBottom: 6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Banknote size={15} color="#16a34a" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <p style={{ ...labelStyle, fontSize: 10, color: '#16a34a' }}>Efectivo / Transferencia</p>
                      {/* Badge OFF */}
                      <span style={{
                        fontFamily: 'var(--font-hanken)', fontSize: 8, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        background: '#16a34a', color: 'white', padding: '2px 7px',
                      }}>
                        {descuento}% OFF
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#4ade80', marginTop: 2, color: '#15803d' }}>
                      Ahorrás {fmtPrecio(ahorro)}
                    </p>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', fontWeight: 700, color: '#16a34a', flexShrink: 0 }}>
                  {fmtPrecio(precioTransf)}
                </p>
              </div>

              {/* ── 3 cuotas en local ── */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: '#eff6ff',
                border: '1.5px solid #bfdbfe',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#1d4ed8' }}>store</span>
                  </div>
                  <div>
                    <p style={{ ...labelStyle, fontSize: 10, color: '#1d4ed8' }}>3 cuotas sin interés</p>
                    <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#3b82f6', marginTop: 1 }}>
                      con tarjeta en el local
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 'clamp(1rem,2.5vw,1.3rem)', fontWeight: 700, color: '#1d4ed8' }}>
                    {fmtPrecio(precio3c)}
                    <span style={{ fontFamily: 'var(--font-karla)', fontSize: 11, fontWeight: 400, color: '#3b82f6' }}>/mes</span>
                  </p>
                </div>
              </div>

              {/* Subtotal multi-cantidad */}
              {cantidad > 1 && (
                <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#7e7576', textAlign: 'right', marginTop: 8 }}>
                  Subtotal transferencia: <strong style={{ color: '#0A0A0A' }}>{fmtPrecio(precioTransf * cantidad)}</strong>
                </p>
              )}
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <p style={{
                fontFamily: 'var(--font-karla)', fontSize: 15, color: '#4c4546',
                lineHeight: 1.7, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #E5E5E5',
              }}>
                {producto.descripcion}
              </p>
            )}

            {/* Talles */}
            {tallesDisponibles.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ ...labelStyle, fontSize: 10, color: '#4c4546', marginBottom: 12 }}>
                  Talle
                  {talleSeleccionado && (
                    <span style={{ marginLeft: 8, fontFamily: 'var(--font-karla)', fontWeight: 700, textTransform: 'none', letterSpacing: 0, color: '#0A0A0A' }}>
                      {talleSeleccionado}
                    </span>
                  )}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {tallesDisponibles.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTalle(t)}
                      style={{
                        minWidth: 44, height: 36, padding: '0 12px',
                        border:     talleSeleccionado === t ? '2px solid #0A0A0A' : '1px solid #E5E5E5',
                        background: talleSeleccionado === t ? '#0A0A0A' : '#fff',
                        color:      talleSeleccionado === t ? '#fff' : '#4c4546',
                        cursor: 'pointer', minHeight: 'unset',
                        fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 600,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        transition: 'all 0.15s',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colores */}
            {coloresDisponibles.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ ...labelStyle, fontSize: 10, color: '#4c4546', marginBottom: 12 }}>
                  Color
                  {colorSeleccionado && (
                    <span style={{ marginLeft: 8, fontFamily: 'var(--font-karla)', fontWeight: 700, textTransform: 'capitalize', letterSpacing: 0, color: '#0A0A0A' }}>
                      {colorSeleccionado}
                    </span>
                  )}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {coloresDisponibles.map((color) => {
                    const hex    = COLOR_MAP[color?.toLowerCase()] ?? null;
                    const activo = colorSeleccionado === color;
                    return (
                      <button
                        key={color}
                        onClick={() => handleColor(color)}
                        title={color}
                        style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: hex ?? '#e5e5e5',
                          border: activo ? '3px solid #0A0A0A' : hex === '#ffffff' ? '1px solid #ddd' : '2px solid transparent',
                          outline: activo ? '2px solid white' : 'none',
                          outlineOffset: '-4px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 8, fontWeight: 700, color: '#888',
                          minHeight: 'unset', minWidth: 'unset', transition: 'all 0.15s',
                        }}
                        aria-label={color}
                      >
                        {!hex && color?.slice(0, 1).toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error variante */}
            {errorVariante && (
              <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#ba1a1a', marginBottom: 12 }}>
                {errorVariante}
              </p>
            )}

            {/* Stock */}
            <p style={{
              ...labelStyle, fontSize: 10, marginBottom: 20,
              color: stockEfectivo > 0 ? '#16a34a' : '#ba1a1a',
            }}>
              {tieneVariantes && !talleSeleccionado && !colorSeleccionado
                ? 'Seleccioná opciones para ver stock'
                : stockEfectivo > 0
                  ? `${stockEfectivo} unidades disponibles`
                  : 'Sin stock para esta selección'
              }
            </p>

            {/* Cantidad */}
            {stockEfectivo > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ ...labelStyle, fontSize: 10, color: '#4c4546', marginBottom: 12 }}>Cantidad</p>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E5E5E5', width: 'fit-content' }}>
                  <button
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', minHeight: 'unset', minWidth: 'unset' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ width: 38, textAlign: 'center', fontFamily: 'var(--font-hanken)', fontSize: 13, fontWeight: 600 }}>
                    {cantidad}
                  </span>
                  <button
                    onClick={() => setCantidad((c) => Math.min(stockEfectivo, c + 1))}
                    style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', minHeight: 'unset', minWidth: 'unset' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {stockEfectivo > 0 ? (
                <>
                  <button
                    onClick={handleAgregarCarrito}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '16px 24px', border: 'none', cursor: 'pointer',
                      background: agregado ? '#16a34a' : '#0A0A0A', color: '#fff',
                      fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.15em', textTransform: 'uppercase',
                      transition: 'background 0.2s', minHeight: 'unset',
                    }}
                  >
                    {agregado ? <Check size={16} /> : <ShoppingBag size={16} />}
                    {agregado ? '¡Agregado!' : 'Agregar al carrito'}
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '16px 24px', border: 'none', cursor: 'pointer',
                      background: '#25D366', color: '#fff',
                      fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.15em', textTransform: 'uppercase', minHeight: 'unset',
                    }}
                  >
                    <IconWhatsApp size={18} />
                    Consultar por WhatsApp
                  </button>
                </>
              ) : (
                <button
                  onClick={handleWhatsApp}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '16px 24px', border: 'none', cursor: 'pointer',
                    background: '#4c4546', color: '#fff',
                    fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.15em', textTransform: 'uppercase', minHeight: 'unset',
                  }}
                >
                  <IconWhatsApp size={18} />
                  Consultar disponibilidad
                </button>
              )}

              {/* Favoritos */}
              <button
                onClick={() => setWishlist((w) => !w)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 24px', background: 'none', cursor: 'pointer',
                  border: `1.5px solid ${wishlist ? '#ba1a1a' : '#E5E5E5'}`,
                  color: wishlist ? '#ba1a1a' : '#4c4546',
                  fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  transition: 'all 0.2s', minHeight: 'unset',
                }}
              >
                <Heart size={14} fill={wishlist ? '#ba1a1a' : 'none'} />
                {wishlist ? 'Guardado en favoritos' : 'Guardar en favoritos'}
              </button>
            </div>

            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #E5E5E5' }}>
              {[
                { icon: <Truck size={15} />,      text: 'Envíos a todo el país próximamente' },
                { icon: <RefreshCw size={15} />,  text: 'Cambios y devoluciones gratis'      },
                { icon: <Shield size={15} />,     text: 'Compra 100% segura'                 },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#7e7576', flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontFamily: 'var(--font-karla)', fontSize: 13, color: '#4c4546' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Acordeones */}
            {/* <div>
              <Accordion titulo="Descripción" defaultOpen>
                {producto.descripcion || 'Sin descripción disponible.'}
              </Accordion>
              <Accordion titulo="Envíos & Devoluciones">
                Realizamos envíos a todo el país. El plazo de entrega es de 3 a 7 días hábiles. Cambios y devoluciones dentro de los 30 días de recibido el pedido, sin cargo.
              </Accordion>
              <div style={{ borderTop: '1px solid #E5E5E5' }} />
            </div> */}
          </div>
        </div>

        {/* ── Productos relacionados ── */}
        {productosRelacionados.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                También te puede gustar
              </h2>
              {producto.categoria && (
                <Link
                  href={`/catalogo?categoria=${producto.categoriaId}`}
                  style={{ fontFamily: 'var(--font-hanken)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'underline', textUnderlineOffset: 4, color: '#4c4546' }}
                >
                  Ver más
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {productosRelacionados.map((p) => (
                <Link key={p.id} href={`/productos/${p.id}`} className="group cursor-pointer block">
                  <div className="relative overflow-hidden mb-3 bg-surface-container-low" style={{ aspectRatio: '3/4' }}>
                    {p.imagen ? (
                      <Image
                        src={p.imagen} alt={p.nombre} fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container" />
                    )}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}
                    className="group-hover:underline line-clamp-1">
                    {p.nombre}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 14, fontWeight: 700 }}>
                    {fmtPrecio(p.precio)}
                  </p>
                  <p style={{ fontFamily: 'var(--font-karla)', fontSize: 10, color: '#7e7576' }}>
                    3 x {fmtPrecio(Math.round(p.precio / 3))} sin interés
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Banner ── */}
      <div style={{ background: '#e8e2d4', borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5', marginTop: 40 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[
            { icon: 'local_shipping', text: 'Envíos a todo el país próximamente' },
            { icon: 'credit_card',    text: 'Cuotas sin interés'    },
            { icon: 'lock',           text: 'Compra segura'         },
            { icon: 'autorenew',      text: 'Cambios gratis'        },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#4c4546' }}>{icon}</span>
              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}