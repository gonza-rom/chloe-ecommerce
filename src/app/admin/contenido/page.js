'use client';
// src/app/admin/contenido/page.js
// Edición de textos, imágenes y videos del Home, Nosotros y Contacto.

import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, GripVertical, Image as ImageIcon, Type, LayoutGrid, MessageSquare } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import VideoUpload  from '@/components/admin/VideoUpload';
import { DEFAULT_HOME, DEFAULT_NOSOTROS, DEFAULT_CONTACTO } from '@/lib/contenido';

const TABS = [
  { id: 'home',     label: 'Home',     icon: LayoutGrid,     defaults: DEFAULT_HOME },
  { id: 'nosotros', label: 'Nosotros', icon: Type,           defaults: DEFAULT_NOSOTROS },
  { id: 'contacto', label: 'Contacto', icon: MessageSquare,  defaults: DEFAULT_CONTACTO },
];

export default function AdminContenidoPage() {
  const [tab,       setTab]       = useState('home');
  const [contenido, setContenido] = useState(null); // { home, nosotros, contacto }
  const [loading,   setLoading]   = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [exito,     setExito]     = useState('');
  const [error,     setError]     = useState('');

  useEffect(() => { fetchContenido(); }, []);

  async function fetchContenido() {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/contenido');
      const data = await res.json();
      if (data.ok) setContenido(data.data);
    } catch {}
    finally { setLoading(false); }
  }

  async function guardar() {
    setGuardando(true); setError(''); setExito('');
    try {
      const res  = await fetch('/api/admin/contenido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pagina: tab, data: contenido[tab] }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error ?? 'Error al guardar'); return; }
      setExito('Contenido guardado correctamente');
      setTimeout(() => setExito(''), 4000);
    } catch { setError('Error de conexión'); }
    finally { setGuardando(false); }
  }

  function set(pagina, updater) {
    setContenido(p => ({ ...p, [pagina]: updater(p[pagina]) }));
  }

  if (loading || !contenido) return (
    <div className="p-12 text-center">
      <Loader2 size={28} className="text-gray-300 animate-spin mx-auto" />
    </div>
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Contenido del sitio</h1>
          <p className="text-sm text-gray-400">Textos, imágenes y videos del Home y páginas institucionales</p>
        </div>
        <BtnGuardar onClick={guardar} loading={guardando} />
      </div>

      {exito && <Aviso tipo="exito">{exito}</Aviso>}
      {error && <Aviso tipo="error">{error}</Aviso>}

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5 border-b border-gray-200 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors -mb-px
              ${tab === t.id ? 'border-[#111] text-[#111]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'home'     && <HomeForm     data={contenido.home}     onChange={u => set('home', u)} />}
      {tab === 'nosotros' && <NosotrosForm data={contenido.nosotros} onChange={u => set('nosotros', u)} />}
      {tab === 'contacto' && <ContactoForm data={contenido.contacto} onChange={u => set('contacto', u)} />}

      <div className="mt-6 flex justify-end">
        <BtnGuardar onClick={guardar} loading={guardando} />
      </div>
    </div>
  );
}

// ── Tab: Home ─────────────────────────────────────────────────────────────────

function HomeForm({ data, onChange }) {
  const setField = (path) => (val) => onChange(p => setPath(p, path, val));

  return (
    <div className="flex flex-col gap-4">
      <Seccion icon={LayoutGrid} titulo="Hero principal">
        <Campo label="Texto pequeño (kicker)">
          <input value={data.hero.kicker} onChange={e => setField('hero.kicker')(e.target.value)} className={inp} />
        </Campo>
        <Campo label="Título" hint="Podés usar un salto de línea para partirlo en dos renglones">
          <textarea value={data.hero.titulo} onChange={e => setField('hero.titulo')(e.target.value)} rows={2} className={`${inp} resize-none`} />
        </Campo>
        <Campo label="Subtítulo">
          <textarea value={data.hero.subtitulo} onChange={e => setField('hero.subtitulo')(e.target.value)} rows={2} className={`${inp} resize-none`} />
        </Campo>
        <Campo label="Texto del botón">
          <input value={data.hero.ctaLabel} onChange={e => setField('hero.ctaLabel')(e.target.value)} className={inp} />
        </Campo>

        <p className="text-xs font-semibold text-gray-500 mt-2">Imágenes del carrusel</p>
        <ListEditor
          items={data.hero.slides}
          onChange={items => setField('hero.slides')(items)}
          nuevo={{ label: '', nombre: '', imagen: '' }}
          renderItem={(item, update) => (
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3">
              <ImageUpload value={item.imagen} onChange={v => update('imagen', v)} folder="chloe/home/hero" aspectRatio="3/4" />
              <div className="flex flex-col gap-2">
                <Campo label="Etiqueta">
                  <input value={item.label} onChange={e => update('label', e.target.value)} placeholder="Ciudad + Noche" className={inp} />
                </Campo>
                <Campo label="Nombre de la prenda">
                  <input value={item.nombre} onChange={e => update('nombre', e.target.value)} placeholder="Vestido Midi Ring" className={inp} />
                </Campo>
              </div>
            </div>
          )}
        />
      </Seccion>

      <Seccion icon={Type} titulo="Beneficios (debajo del hero)">
        <ListEditor
          items={data.valueProps}
          onChange={items => setField('valueProps')(items)}
          nuevo={{ icon: 'star', titulo: '', desc: '' }}
          renderItem={(item, update) => (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Campo label="Ícono (material-symbols)" hint="Ej: payments, credit_card, local_shipping">
                <input value={item.icon} onChange={e => update('icon', e.target.value)} className={inp} />
              </Campo>
              <Campo label="Título">
                <input value={item.titulo} onChange={e => update('titulo', e.target.value)} className={inp} />
              </Campo>
              <Campo label="Descripción">
                <input value={item.desc} onChange={e => update('desc', e.target.value)} className={inp} />
              </Campo>
            </div>
          )}
        />
      </Seccion>

      <Seccion icon={ImageIcon} titulo="Shop the Look (videos)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Campo label="Título de la sección">
            <input value={data.shopTheLook.titulo} onChange={e => setField('shopTheLook.titulo')(e.target.value)} className={inp} />
          </Campo>
          <Campo label="Subtítulo">
            <input value={data.shopTheLook.subtitulo} onChange={e => setField('shopTheLook.subtitulo')(e.target.value)} className={inp} />
          </Campo>
        </div>
        <p className="text-xs font-semibold text-gray-500 mt-2">Videos</p>
        <ListEditor
          items={data.shopTheLook.videos}
          onChange={items => setField('shopTheLook.videos')(items)}
          nuevo={{ src: '', label: '' }}
          renderItem={(item, update) => (
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3">
              <VideoUpload value={item.src} onChange={v => update('src', v)} folder="chloe/home/looks" />
              <Campo label="Etiqueta">
                <input value={item.label} onChange={e => update('label', e.target.value)} placeholder="Look 01" className={inp} />
              </Campo>
            </div>
          )}
        />
      </Seccion>

      <Seccion icon={Type} titulo="Secciones de productos">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Campo label="Favoritos — título">
            <input value={data.favs.titulo} onChange={e => setField('favs.titulo')(e.target.value)} className={inp} />
          </Campo>
          <Campo label="Favoritos — subtítulo">
            <input value={data.favs.subtitulo} onChange={e => setField('favs.subtitulo')(e.target.value)} className={inp} />
          </Campo>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Campo label="Night Collection — kicker">
            <input value={data.night.kicker} onChange={e => setField('night.kicker')(e.target.value)} className={inp} />
          </Campo>
          <Campo label="Night Collection — título">
            <input value={data.night.titulo} onChange={e => setField('night.titulo')(e.target.value)} className={inp} />
          </Campo>
          <Campo label="Night Collection — botón">
            <input value={data.night.ctaLabel} onChange={e => setField('night.ctaLabel')(e.target.value)} className={inp} />
          </Campo>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Campo label="Archive Editions — título">
            <input value={data.archive.titulo} onChange={e => setField('archive.titulo')(e.target.value)} className={inp} />
          </Campo>
          <Campo label="Archive Editions — botón">
            <input value={data.archive.ctaLabel} onChange={e => setField('archive.ctaLabel')(e.target.value)} className={inp} />
          </Campo>
        </div>
        <Campo label="Título — Medios de pago">
          <input value={data.mediosDePago.titulo} onChange={e => setField('mediosDePago.titulo')(e.target.value)} className={inp} />
        </Campo>
      </Seccion>
    </div>
  );
}

// ── Tab: Nosotros ─────────────────────────────────────────────────────────────

function NosotrosForm({ data, onChange }) {
  const setField = (path) => (val) => onChange(p => setPath(p, path, val));

  return (
    <div className="flex flex-col gap-4">
      <Seccion icon={LayoutGrid} titulo="Hero">
        <Campo label="Texto pequeño (kicker)">
          <input value={data.hero.kicker} onChange={e => setField('hero.kicker')(e.target.value)} className={inp} />
        </Campo>
        <Campo label="Título">
          <input value={data.hero.titulo} onChange={e => setField('hero.titulo')(e.target.value)} className={inp} />
        </Campo>
        <Campo label="Subtítulo">
          <textarea value={data.hero.subtitulo} onChange={e => setField('hero.subtitulo')(e.target.value)} rows={2} className={`${inp} resize-none`} />
        </Campo>
      </Seccion>

      <Seccion icon={Type} titulo="Estadísticas">
        <ListEditor
          items={data.stats}
          onChange={items => setField('stats')(items)}
          nuevo={{ num: '', label: '' }}
          renderItem={(item, update) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Campo label="Número / símbolo">
                <input value={item.num} onChange={e => update('num', e.target.value)} className={inp} />
              </Campo>
              <Campo label="Etiqueta">
                <input value={item.label} onChange={e => update('label', e.target.value)} className={inp} />
              </Campo>
            </div>
          )}
        />
      </Seccion>

      <Seccion icon={Type} titulo="Nuestra historia">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Campo label="Texto pequeño (kicker)">
            <input value={data.historia.kicker} onChange={e => setField('historia.kicker')(e.target.value)} className={inp} />
          </Campo>
          <Campo label="Título">
            <input value={data.historia.titulo} onChange={e => setField('historia.titulo')(e.target.value)} className={inp} />
          </Campo>
        </div>
        <Campo label="Imagen">
          <ImageUpload value={data.historia.imagen} onChange={v => setField('historia.imagen')(v)} folder="chloe/nosotros" aspectRatio="3/4" />
        </Campo>
        <p className="text-xs font-semibold text-gray-500 mt-2">Párrafos</p>
        <ListEditor
          items={data.historia.parrafos.map(texto => ({ texto }))}
          onChange={items => setField('historia.parrafos')(items.map(i => i.texto))}
          nuevo={{ texto: '' }}
          renderItem={(item, update) => (
            <textarea value={item.texto} onChange={e => update('texto', e.target.value)} rows={3} className={`${inp} resize-vertical`} />
          )}
        />
      </Seccion>

      <Seccion icon={Type} titulo="Pilares">
        <ListEditor
          items={data.pilares}
          onChange={items => setField('pilares')(items)}
          nuevo={{ icon: 'star', titulo: '', texto: '' }}
          renderItem={(item, update) => (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo label="Ícono (material-symbols)">
                  <input value={item.icon} onChange={e => update('icon', e.target.value)} className={inp} />
                </Campo>
                <Campo label="Título">
                  <input value={item.titulo} onChange={e => update('titulo', e.target.value)} className={inp} />
                </Campo>
              </div>
              <Campo label="Texto">
                <textarea value={item.texto} onChange={e => update('texto', e.target.value)} rows={2} className={`${inp} resize-none`} />
              </Campo>
            </div>
          )}
        />
      </Seccion>

      <Seccion icon={MessageSquare} titulo="CTA — Visitanos">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Campo label="Texto pequeño (kicker)">
            <input value={data.cta.kicker} onChange={e => setField('cta.kicker')(e.target.value)} className={inp} />
          </Campo>
          <Campo label="Título" hint="Podés usar un salto de línea">
            <textarea value={data.cta.titulo} onChange={e => setField('cta.titulo')(e.target.value)} rows={2} className={`${inp} resize-none`} />
          </Campo>
        </div>
        <Campo label="Subtítulo">
          <textarea value={data.cta.subtitulo} onChange={e => setField('cta.subtitulo')(e.target.value)} rows={2} className={`${inp} resize-none`} />
        </Campo>
      </Seccion>
    </div>
  );
}

// ── Tab: Contacto ─────────────────────────────────────────────────────────────

function ContactoForm({ data, onChange }) {
  const setField = (path) => (val) => onChange(p => setPath(p, path, val));

  return (
    <div className="flex flex-col gap-4">
      <Seccion icon={LayoutGrid} titulo="Hero">
        <Campo label="Texto pequeño (kicker)">
          <input value={data.hero.kicker} onChange={e => setField('hero.kicker')(e.target.value)} className={inp} />
        </Campo>
        <Campo label="Título">
          <input value={data.hero.titulo} onChange={e => setField('hero.titulo')(e.target.value)} className={inp} />
        </Campo>
        <Campo label="Subtítulo">
          <textarea value={data.hero.subtitulo} onChange={e => setField('hero.subtitulo')(e.target.value)} rows={2} className={`${inp} resize-none`} />
        </Campo>
        <Campo label="Texto del badge">
          <input value={data.hero.badge} onChange={e => setField('hero.badge')(e.target.value)} className={inp} />
        </Campo>
      </Seccion>

      <Seccion icon={Type} titulo="Horarios de atención">
        <ListEditor
          items={data.horarios}
          onChange={items => setField('horarios')(items)}
          nuevo={{ dia: '', hora: '' }}
          renderItem={(item, update) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Campo label="Día">
                <input value={item.dia} onChange={e => update('dia', e.target.value)} className={inp} />
              </Campo>
              <Campo label="Horario">
                <input value={item.hora} onChange={e => update('hora', e.target.value)} className={inp} />
              </Campo>
            </div>
          )}
        />
      </Seccion>

      <Seccion icon={Type} titulo="Showroom">
        <Campo label="Texto pequeño (kicker)">
          <input value={data.showroom.kicker} onChange={e => setField('showroom.kicker')(e.target.value)} className={inp} />
        </Campo>
        <Campo label="Dirección" hint="Podés usar saltos de línea">
          <textarea value={data.showroom.direccion} onChange={e => setField('showroom.direccion')(e.target.value)} rows={3} className={`${inp} resize-none`} />
        </Campo>
      </Seccion>
    </div>
  );
}

// ── Helpers de estado ────────────────────────────────────────────────────────

function setPath(obj, path, value) {
  const keys = path.split('.');
  const clone = structuredClone(obj);
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
  cur[keys[keys.length - 1]] = value;
  return clone;
}

// ── Componentes de UI compartidos ───────────────────────────────────────────

function ListEditor({ items, onChange, nuevo, renderItem }) {
  function update(index, campo, valor) {
    const copia = items.map((it, i) => i === index
      ? (typeof it === 'object' ? { ...it, [campo]: valor } : valor)
      : it);
    onChange(copia);
  }
  function agregar() { onChange([...items, nuevo]); }
  function eliminar(index) { onChange(items.filter((_, i) => i !== index)); }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start border border-gray-100 rounded-lg p-3 bg-gray-50">
          <GripVertical size={14} className="text-gray-300 mt-2 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            {renderItem(item, (campo, valor) => update(i, campo, valor))}
          </div>
          <button type="button" onClick={() => eliminar(i)} title="Eliminar"
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={agregar}
        className="flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-gray-300 rounded-lg text-xs font-semibold text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors">
        <Plus size={13} /> Agregar
      </button>
    </div>
  );
}

function BtnGuardar({ onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="flex items-center gap-2 bg-[#111] text-white px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60 hover:bg-gray-800 transition-colors flex-shrink-0">
      {loading
        ? <><Loader2 size={13} className="animate-spin" /> Guardando...</>
        : <><Save size={13} /> Guardar cambios</>
      }
    </button>
  );
}

function Seccion({ icon: Icon, titulo, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <Icon size={14} className="text-gray-400" />
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{titulo}</span>
      </div>
      <div className="p-4 flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Campo({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

function Aviso({ tipo, children }) {
  const estilos = tipo === 'exito'
    ? 'bg-green-50 border-green-200 text-green-700'
    : 'bg-red-50 border-red-200 text-red-600';
  return (
    <div className={`${estilos} border rounded-xl px-4 py-3 mb-4 text-sm font-semibold`}>
      {children}
    </div>
  );
}

const inp = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 bg-white text-[#111] box-border';
