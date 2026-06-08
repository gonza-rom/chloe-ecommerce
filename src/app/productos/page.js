'use client';
// src/app/productos/page.js
// Catálogo Chloe Showroom — adaptado del diseño catalogo.html

import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShoppingBag, Search, X,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ChevronDown, ChevronUp, ChevronRight as ChevronRightIcon,
  SlidersHorizontal,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

const PAGE_SIZE = 12;

// ── Color map (nombre → hex) ──────────────────────────────────────────────────
export const COLOR_MAP = {
  negro:       '#111111', black:    '#111111',
  blanco:      '#ffffff', white:    '#ffffff',
  rojo:        '#ef4444', red:      '#ef4444',
  azul:        '#3b82f6', blue:     '#3b82f6',
  verde:       '#22c55e', green:    '#22c55e',
  amarillo:    '#eab308', yellow:   '#eab308',
  naranja:     '#f97316', orange:   '#f97316',
  rosa:        '#f9a8d4', pink:     '#f9a8d4',
  violeta:     '#8b5cf6', purple:   '#8b5cf6',
  lila:        '#c084fc',
  gris:        '#9ca3af', grey:     '#9ca3af', gray: '#9ca3af',
  marron:      '#92400e', marrón:   '#92400e', brown: '#92400e',
  beige:       '#e8ddd4',
  celeste:     '#7dd3fc',
  bordo:       '#9f1239', burdeos:  '#9f1239',
  camel:       '#c9a882',
  chocolate:   '#3d2b1f',
  arena:       '#d2b48c',
  'rosa viejo':'#8b6f6f',
  off_white:   '#f5f0eb',
  crema:       '#faf0e6',
  nude:        '#e8c9a0',
  tostado:     '#b8843f',
  animal:      '#c9a882', // print animal → acento
};

function getColorHex(nombre) {
  if (!nombre) return null;
  return COLOR_MAP[nombre.toLowerCase().trim()] ?? null;
}

// ── Debounce ──────────────────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Slider de precio doble ────────────────────────────────────────────────────
function PriceRange({ min, max, value, onChange }) {
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);

  const fmt = (n) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

  const handleMin = (e) => {
    const v = Math.min(parseInt(e.target.value), local[1] - 1000);
    setLocal([v, local[1]]);
  };
  const handleMax = (e) => {
    const v = Math.max(parseInt(e.target.value), local[0] + 1000);
    setLocal([local[0], v]);
  };
  const commit = () => onChange(local);

  const pctMin = ((local[0] - min) / (max - min)) * 100;
  const pctMax = ((local[1] - min) / (max - min)) * 100;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-head)', fontWeight: 600, color: 'var(--muted)' }}>{fmt(local[0])}</span>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-head)', fontWeight: 600, color: 'var(--muted)' }}>{fmt(local[1])}</span>
      </div>
      <div style={{ position: 'relative', height: 3, borderRadius: 2, background: 'var(--border)', marginBottom: 16 }}>
        <div style={{
          position: 'absolute', height: '100%', borderRadius: 2,
          background: 'var(--primary)',
          left: `${pctMin}%`, right: `${100 - pctMax}%`,
        }} />
        <input type="range" min={min} max={max} step={1000} value={local[0]}
          onChange={handleMin} onMouseUp={commit} onTouchEnd={commit}
          style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 3 }} />
        <input type="range" min={min} max={max} step={1000} value={local[1]}
          onChange={handleMax} onMouseUp={commit} onTouchEnd={commit}
          style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 4 }} />
        {/* Thumbs */}
        {[pctMin, pctMax].map((pct, i) => (
          <div key={i} style={{
            position: 'absolute', width: 14, height: 14, borderRadius: '50%',
            background: 'var(--primary)', border: '2px solid #fff',
            boxShadow: '0 1px 4px rgba(0,0,0,.2)',
            left: `${pct}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2, pointerEvents: 'none',
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Sección colapsable del sidebar ────────────────────────────────────────────
function SidebarSection({ titulo, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 24 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          marginBottom: open ? 14 : 0, padding: 0,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)',
        }}>
          {titulo}
        </span>
        {open
          ? <ChevronUp size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          : <ChevronDown size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
        }
      </button>
      {open && children}
    </div>
  );
}

// ── Dropdown de categorías con subcategorías ──────────────────────────────────
function CategoryAccordion({ categorias, categoriaSeleccionada, onChange }) {
  const [openCats, setOpenCats] = useState({});

  const toggleOpen = (id) => setOpenCats(prev => ({ ...prev, [id]: !prev[id] }));

  const isActive    = (id) => categoriaSeleccionada === String(id);
  const hasChildren = (cat) => cat.hijos?.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Todos */}
      <button
        onClick={() => onChange('')}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px 0', width: '100%', textAlign: 'left',
          fontFamily: 'var(--font-body)', fontSize: 14,
          fontWeight: !categoriaSeleccionada ? 700 : 400,
          color: !categoriaSeleccionada ? 'var(--primary)' : 'var(--muted)',
          borderBottom: !categoriaSeleccionada ? '1.5px solid var(--primary)' : '1px solid transparent',
          transition: 'color .2s',
        }}
      >
        Todos los productos
      </button>

      {categorias.map((cat) => (
        <div key={cat.id}>
          {/* Categoría raíz */}
          <button
            onClick={() => {
              onChange(String(cat.id));
              if (hasChildren(cat)) toggleOpen(cat.id);
            }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 0', width: '100%', textAlign: 'left',
              fontFamily: 'var(--font-body)', fontSize: 14,
              fontWeight: isActive(cat.id) ? 600 : 400,
              color: isActive(cat.id) ? 'var(--primary)' : 'var(--muted)',
              borderBottom: isActive(cat.id) ? '1.5px solid var(--primary)' : '1px solid transparent',
              transition: 'color .2s',
            }}
          >
            <span>{cat.nombre}</span>
            {hasChildren(cat) && (
              <ChevronRightIcon
                size={15}
                style={{
                  color: 'var(--muted)', flexShrink: 0,
                  transform: openCats[cat.id] ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform .3s',
                }}
              />
            )}
          </button>

          {/* Subcategorías */}
          {hasChildren(cat) && (
            <div style={{
              overflow: 'hidden',
              maxHeight: openCats[cat.id] ? 300 : 0,
              transition: 'max-height .3s ease',
              paddingLeft: 12,
              borderLeft: '2px solid var(--border)',
              marginLeft: 4,
            }}>
              {cat.hijos.map((hijo) => (
                <button
                  key={hijo.id}
                  onClick={() => onChange(String(hijo.id))}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '7px 0', width: '100%', textAlign: 'left',
                    fontFamily: 'var(--font-body)', fontSize: 13,
                    fontWeight: isActive(hijo.id) ? 600 : 400,
                    color: isActive(hijo.id) ? 'var(--primary)' : 'var(--muted)',
                    borderBottom: isActive(hijo.id) ? '1px solid var(--primary)' : '1px solid transparent',
                    transition: 'color .2s',
                  }}
                >
                  <span>{hijo.nombre}</span>
                  <span style={{ fontSize: 11, opacity: 0.5 }}>
                    ({hijo._count?.productos ?? 0})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Swatches de color con nombre tooltip ──────────────────────────────────────
function ColorSwatches({ colores, activos, onToggle }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {colores.map((c) => {
        const hex    = getColorHex(c);
        const active = activos.includes(c);
        const isWhite = hex === '#ffffff' || hex === '#f5f0eb' || hex === '#faf0e6';

        return hex ? (
          /* Color con hex conocido → swatch circular */
          <button
            key={c}
            onClick={() => onToggle(c)}
            title={c}
            style={{
              width: 26, height: 26, borderRadius: '50%',
              background: hex,
              border: active
                ? '2px solid var(--primary)'
                : isWhite ? '1.5px solid var(--border)' : '2px solid transparent',
              outline: active ? '2px solid white' : 'none',
              outlineOffset: active ? '-4px' : 0,
              cursor: 'pointer',
              boxShadow: active ? '0 0 0 3px rgba(10,10,10,.15)' : 'none',
              transition: 'all .15s',
              transform: active ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        ) : (
          /* Color sin hex → chip de texto */
          <button
            key={c}
            onClick={() => onToggle(c)}
            style={{
              border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
              background: active ? 'var(--primary)' : 'none',
              color: active ? '#fff' : 'var(--muted)',
              padding: '5px 10px',
              fontFamily: 'var(--font-head)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all .15s',
            }}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}

// ── Talles ────────────────────────────────────────────────────────────────────
function SizeGrid({ talles, activos, onToggle }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
      {talles.map((t) => {
        const active = activos.includes(t);
        return (
          <button
            key={t}
            onClick={() => onToggle(t)}
            style={{
              border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
              background: active ? 'var(--primary)' : 'none',
              color: active ? '#fff' : 'var(--muted)',
              padding: '8px 4px',
              fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all .15s',
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

// ── Paginación estilo Chloe ───────────────────────────────────────────────────
function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total, pageSize } = pagination;
  const desde = (page - 1) * pageSize + 1;
  const hasta = Math.min(page * pageSize, total);

  const getPages = () => {
    const delta = 2, range = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) range.push(i);
    return range;
  };

  const btnBase = {
    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid var(--border)', background: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 600, color: 'var(--muted)',
    transition: 'all .2s',
  };
  const btnActive = { ...btnBase, background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' };
  const btnDisabled = { ...btnBase, opacity: 0.35, cursor: 'not-allowed' };

  return (
    <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-head)', letterSpacing: '0.08em' }}>
        Mostrando {desde}–{hasta} de {total} productos
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button onClick={() => onPageChange(1)} disabled={page === 1}
          style={page === 1 ? btnDisabled : btnBase}>
          <ChevronsLeft size={16} />
        </button>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          style={page === 1 ? btnDisabled : btnBase}>
          <ChevronLeft size={16} />
        </button>

        {getPages()[0] > 1 && (
          <>
            <button onClick={() => onPageChange(1)} style={btnBase}>1</button>
            {getPages()[0] > 2 && <span style={{ padding: '0 4px', color: 'var(--muted)' }}>…</span>}
          </>
        )}
        {getPages().map((p) => (
          <button key={p} onClick={() => onPageChange(p)} style={p === page ? btnActive : btnBase}>{p}</button>
        ))}
        {getPages()[getPages().length - 1] < totalPages && (
          <>
            {getPages()[getPages().length - 1] < totalPages - 1 && <span style={{ padding: '0 4px', color: 'var(--muted)' }}>…</span>}
            <button onClick={() => onPageChange(totalPages)} style={btnBase}>{totalPages}</button>
          </>
        )}

        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
          style={page === totalPages ? btnDisabled : btnBase}>
          <ChevronRight size={16} />
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages}
          style={page === totalPages ? btnDisabled : btnBase}>
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Tag de filtro activo ──────────────────────────────────────────────────────
function FilterTag({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'var(--primary)', color: '#fff',
      padding: '4px 10px',
      fontFamily: 'var(--font-head)', fontSize: 10, fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.7)', display: 'flex', padding: 0 }}>
        <X size={12} />
      </button>
    </span>
  );
}

// ── Contenido principal ───────────────────────────────────────────────────────
function ProductosContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [productos,        setProductos]        = useState([]);
  const [categorias,       setCategorias]       = useState([]);
  const [pagination,       setPagination]       = useState(null);
  const [loading,          setLoading]          = useState(true);
  const [mostrarFiltros,   setMostrarFiltros]   = useState(false);

  const [tallesDisp,   setTallesDisp]   = useState([]);
  const [coloresDisp,  setColoresDisp]  = useState([]);
  const [rangoPrecios, setRangoPrecios] = useState({ min: 0, max: 200000 });

  const [busquedaInput,         setBusquedaInput]         = useState(searchParams.get('busqueda') || '');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(searchParams.get('categoria') || '');
  const [ordenar,               setOrdenar]               = useState('');
  const [tallesActivos,         setTallesActivos]         = useState([]);
  const [coloresActivos,        setColoresActivos]        = useState([]);
  const [precioRange,           setPrecioRange]           = useState([0, 200000]);
  const [page,                  setPage]                  = useState(1);

  const busqueda  = useDebounce(busquedaInput, 400);
  const { addToCart } = useCart();
  const topRef    = useRef(null);

  // Cargar opciones
  useEffect(() => {
    fetch('/api/productos?opciones=true')
      .then(r => r.json())
      .then(({ talles, colores }) => {
        setTallesDisp(talles ?? []);
        setColoresDisp(colores ?? []);
      }).catch(() => {});

    fetch('/api/productos?rangoPrecios=true')
      .then(r => r.json())
      .then(({ min, max }) => {
        const rMin = min ?? 0, rMax = max ?? 200000;
        setRangoPrecios({ min: rMin, max: rMax });
        setPrecioRange([rMin, rMax]);
      }).catch(() => {});
  }, []);

  // Categorías
  useEffect(() => {
    fetch('/api/categorias')
      .then(r => r.json())
      .then(data => setCategorias(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // Fetch productos
  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(PAGE_SIZE));
      if (busqueda)              params.set('busqueda',  busqueda);
      if (categoriaSeleccionada) params.set('categoria', categoriaSeleccionada);
      if (ordenar)               params.set('ordenar',   ordenar);
      if (tallesActivos.length)  params.set('talles',    tallesActivos.join(','));
      if (coloresActivos.length) params.set('colores',   coloresActivos.join(','));
      if (precioRange[0] > rangoPrecios.min) params.set('precioMin', String(precioRange[0]));
      if (precioRange[1] < rangoPrecios.max) params.set('precioMax', String(precioRange[1]));

      const res  = await fetch(`/api/productos?${params.toString()}`);
      const data = await res.json();
      if (data.productos) { setProductos(data.productos); setPagination(data.pagination); }
      else { setProductos(Array.isArray(data) ? data : []); setPagination(null); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, busqueda, categoriaSeleccionada, ordenar, tallesActivos, coloresActivos, precioRange, rangoPrecios]);

  useEffect(() => { fetchProductos(); }, [fetchProductos]);
  useEffect(() => { setPage(1); }, [busqueda, categoriaSeleccionada, ordenar, tallesActivos, coloresActivos, precioRange]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleTalle  = (t) => setTallesActivos(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const toggleColor  = (c) => setColoresActivos(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const limpiarFiltros = () => {
    setBusquedaInput(''); setCategoriaSeleccionada(''); setOrdenar('');
    setTallesActivos([]); setColoresActivos([]);
    setPrecioRange([rangoPrecios.min, rangoPrecios.max]);
    setPage(1);
    router.push('/productos');
  };

  const hayFiltros = busquedaInput || categoriaSeleccionada || ordenar
    || tallesActivos.length || coloresActivos.length
    || precioRange[0] > rangoPrecios.min || precioRange[1] < rangoPrecios.max;

  const cantFiltros = [
    categoriaSeleccionada ? 1 : 0,
    ordenar ? 1 : 0,
    tallesActivos.length,
    coloresActivos.length,
    (precioRange[0] > rangoPrecios.min || precioRange[1] < rangoPrecios.max) ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // ── Sidebar compartido ────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div>
      {/* Header sidebar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <span style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Filtros
        </span>
        {hayFiltros && (
          <button onClick={limpiarFiltros} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-head)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)',
            textDecoration: 'underline',
          }}>
            Limpiar todo
          </button>
        )}
      </div>

      {/* Búsqueda */}
      <SidebarSection titulo="Buscar">
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            type="text" placeholder="Buscar productos..." value={busquedaInput}
            onChange={(e) => setBusquedaInput(e.target.value)}
            style={{
              width: '100%', padding: '10px 36px 10px 34px',
              border: '1px solid var(--border)', background: 'var(--surface)',
              fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--primary)',
              outline: 'none',
            }}
          />
          {busquedaInput && (
            <button onClick={() => setBusquedaInput('')} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex',
            }}>
              <X size={14} />
            </button>
          )}
        </div>
      </SidebarSection>

      {/* Categorías con dropdown de subcategorías */}
      <SidebarSection titulo="Categorías">
        <CategoryAccordion
          categorias={categorias}
          categoriaSeleccionada={categoriaSeleccionada}
          onChange={setCategoriaSeleccionada}
        />
      </SidebarSection>

      {/* Talles */}
      {tallesDisp.length > 0 && (
        <SidebarSection titulo="Talle">
          <SizeGrid talles={tallesDisp} activos={tallesActivos} onToggle={toggleTalle} />
        </SidebarSection>
      )}

      {/* Colores con swatches */}
      {coloresDisp.length > 0 && (
        <SidebarSection titulo="Color">
          <ColorSwatches colores={coloresDisp} activos={coloresActivos} onToggle={toggleColor} />
        </SidebarSection>
      )}

      {/* Precio */}
      <SidebarSection titulo="Precio">
        <PriceRange
          min={rangoPrecios.min} max={rangoPrecios.max}
          value={precioRange} onChange={setPrecioRange}
        />
      </SidebarSection>

      {/* Ordenar */}
      <SidebarSection titulo="Ordenar por" defaultOpen={false}>
        <select
          value={ordenar} onChange={(e) => setOrdenar(e.target.value)}
          style={{
            width: '100%', padding: '9px 28px 9px 12px',
            border: '1px solid var(--border)', background: 'var(--bg)',
            fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer', color: 'var(--primary)',
            WebkitAppearance: 'none', appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230a0a0a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
            outline: 'none',
          }}
        >
          <option value="">Destacados</option>
          <option value="nombre">Nombre A–Z</option>
          <option value="precio-asc">Precio: Menor a Mayor</option>
          <option value="precio-desc">Precio: Mayor a Menor</option>
        </select>
      </SidebarSection>
    </div>
  );

  // ── Skeleton cards ────────────────────────────────────────────────────────
  const SkeletonGrid = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 12px' }}>
      {[...Array(PAGE_SIZE)].map((_, i) => (
        <div key={i} style={{ background: 'var(--surface-low)', animation: 'pulse 1.5s ease-in-out infinite' }}>
          <div style={{ aspectRatio: '3/4', background: '#e8e8e8' }} />
          <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ height: 12, background: '#e8e8e8', width: '70%' }} />
            <div style={{ height: 14, background: '#e8e8e8', width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @media(min-width:768px){
          .chloe-grid { grid-template-columns: repeat(3,1fr) !important; gap: 32px 20px !important; }
          .chloe-skeleton { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media(min-width:1024px){
          .chloe-sidebar { display: block !important; }
          .chloe-mobile-bar { display: none !important; }
          .chloe-sort-row { display: flex !important; }
        }
      `}</style>

      {/* Mobile filter bar */}
      <div className="chloe-mobile-bar" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        margin: '0 -16px 16px', padding: '10px 16px',
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 73, zIndex: 80,
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        <button
          onClick={() => setMostrarFiltros(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            background: cantFiltros > 0 ? 'var(--primary)' : 'none',
            border: '1px solid var(--border)',
            padding: '9px 14px', cursor: 'pointer',
            fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: cantFiltros > 0 ? '#fff' : 'var(--primary)',
            borderColor: cantFiltros > 0 ? 'var(--primary)' : 'var(--border)',
            position: 'relative', whiteSpace: 'nowrap',
          }}
        >
          <SlidersHorizontal size={14} />
          Filtros
          {cantFiltros > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              background: 'var(--accent)', color: 'var(--primary)',
              borderRadius: '50%', width: 18, height: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 800,
            }}>
              {cantFiltros}
            </span>
          )}
        </button>

        {/* Búsqueda móvil inline */}
        <div style={{ position: 'relative', flex: 1, minWidth: 120 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            type="text" placeholder="Buscar..." value={busquedaInput}
            onChange={(e) => setBusquedaInput(e.target.value)}
            style={{
              width: '100%', padding: '9px 32px 9px 30px',
              border: '1px solid var(--border)', background: 'var(--surface)',
              fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--primary)',
              outline: 'none',
            }}
          />
          {busquedaInput && (
            <button onClick={() => setBusquedaInput('')} style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex',
            }}>
              <X size={13} />
            </button>
          )}
        </div>

        <select
          value={ordenar} onChange={(e) => setOrdenar(e.target.value)}
          style={{
            flexShrink: 0, background: 'var(--bg)', border: '1px solid var(--border)',
            padding: '9px 28px 9px 12px', fontFamily: 'var(--font-head)', fontSize: 11,
            fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer', color: 'var(--primary)',
            WebkitAppearance: 'none', appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230a0a0a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
            outline: 'none', marginLeft: 'auto',
          }}
        >
          <option value="">Destacados</option>
          <option value="precio-asc">Precio ↑</option>
          <option value="precio-desc">Precio ↓</option>
          <option value="nombre">A–Z</option>
        </select>
      </div>

      {/* Layout principal */}
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>

        {/* Sidebar desktop */}
        <aside className="chloe-sidebar" style={{ width: 220, flexShrink: 0, display: 'none' }}>
          <SidebarContent />
        </aside>

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }} ref={topRef}>

          {/* Sort row desktop */}
          <div className="chloe-sort-row" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontFamily: 'var(--font-head)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {loading ? '…' : `${pagination?.total ?? productos.length} producto${(pagination?.total ?? productos.length) !== 1 ? 's' : ''}`}
            </p>
            <select
              value={ordenar} onChange={(e) => setOrdenar(e.target.value)}
              style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                padding: '9px 28px 9px 12px', fontFamily: 'var(--font-head)', fontSize: 11,
                fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer', color: 'var(--primary)',
                WebkitAppearance: 'none', appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230a0a0a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
                outline: 'none',
              }}
            >
              <option value="">Destacados</option>
              <option value="nombre">Nombre A–Z</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
            </select>
          </div>

          {/* Tags de filtros activos */}
          {hayFiltros && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {busqueda && <FilterTag label={`"${busqueda}"`} onRemove={() => setBusquedaInput('')} />}
              {categoriaSeleccionada && (
                <FilterTag
                  label={
                    categorias.find(c => String(c.id) === categoriaSeleccionada)?.nombre ??
                    categorias.flatMap(c => c.hijos ?? []).find(h => String(h.id) === categoriaSeleccionada)?.nombre ??
                    'Categoría'
                  }
                  onRemove={() => setCategoriaSeleccionada('')}
                />
              )}
              {tallesActivos.map(t => <FilterTag key={t} label={`T: ${t}`} onRemove={() => toggleTalle(t)} />)}
              {coloresActivos.map(c => <FilterTag key={c} label={c} onRemove={() => toggleColor(c)} />)}
              {(precioRange[0] > rangoPrecios.min || precioRange[1] < rangoPrecios.max) && (
                <FilterTag
                  label={`$${precioRange[0].toLocaleString('es-AR')} – $${precioRange[1].toLocaleString('es-AR')}`}
                  onRemove={() => setPrecioRange([rangoPrecios.min, rangoPrecios.max])}
                />
              )}
            </div>
          )}

          {/* Grid de productos */}
          {loading ? (
            <SkeletonGrid />
          ) : productos.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              background: 'var(--surface)', border: '1px solid var(--border)',
            }}>
              <ShoppingBag size={40} style={{ color: 'var(--border)', margin: '0 auto 16px' }} />
              <p style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                No se encontraron productos
              </p>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Probá con otros filtros</p>
              <button onClick={limpiarFiltros} style={{
                background: 'var(--primary)', color: '#fff', border: 'none',
                padding: '14px 24px', cursor: 'pointer',
                fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
              }}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div
                className="chloe-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px 12px' }}
              >
                {productos.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} onAddToCart={addToCart} />
                ))}
              </div>
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>

      {/* Drawer de filtros móvil */}
      {mostrarFiltros && (
        <>
          <div
            onClick={() => setMostrarFiltros(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)',
              zIndex: 160, display: 'flex', alignItems: 'flex-end',
            }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 161,
            background: 'var(--surface)',
            borderRadius: '16px 16px 0 0',
            maxHeight: '88vh', overflowY: 'auto',
            padding: '0 0 40px',
            animation: 'slideUp .35s cubic-bezier(.25,.46,.45,.94)',
          }}>
            <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
            {/* Header sticky */}
            <div style={{
              position: 'sticky', top: 0, background: 'var(--surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', zIndex: 1,
            }}>
              <span style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Filtros
              </span>
              <button onClick={() => setMostrarFiltros(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--primary)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '0 20px' }}>
              <SidebarContent />
            </div>
            <div style={{ padding: '16px 20px 0', display: 'flex', gap: 10 }}>
              <button onClick={limpiarFiltros} style={{
                background: 'none', border: '1px solid var(--border)',
                padding: '16px 18px', cursor: 'pointer',
                fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)',
              }}>
                Limpiar
              </button>
              <button onClick={() => setMostrarFiltros(false)} style={{
                flex: 1, background: 'var(--primary)', color: '#fff', border: 'none',
                padding: 16, cursor: 'pointer',
                fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                Ver {pagination?.total ?? ''} productos
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function ProductosPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Page header */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 0' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
          <a href="/" style={{ fontSize: 11, fontFamily: 'var(--font-head)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--muted)' }}>Home</a>
          <ChevronRightIcon size={12} style={{ color: 'var(--muted)' }} />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-head)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)' }}>Catálogo</span>
        </nav>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(26px,8vw,52px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8 }}>
          Colección 2024
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>
          Esenciales de temporada con siluetas atemporales y acabados de alta costura.
        </p>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px 80px' }}>
        <Suspense fallback={
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px 12px' }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{ background: 'var(--surface-low)', aspectRatio: '3/4', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        }>
          <ProductosContent />
        </Suspense>
      </div>
    </div>
  );
}