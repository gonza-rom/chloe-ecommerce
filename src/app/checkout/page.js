'use client';
// src/app/checkout/page.js

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ShoppingBag, CheckCircle,
  Loader2, AlertCircle, Store,
  Truck, Banknote, Building2, Tag, X, QrCode,
  CreditCard, ChevronDown, ChevronRight, Check,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';
import { calcularEnvio, PROVINCIAS_AR } from '@/lib/envio';
import PaywayForm from '@/components/PaywayForm';
import MapaEntregaLocal from '@/components/MapaEntregaLocal';

const DESCUENTO_DEFAULT = 20;

function getPrecioItem(item, metodoPago) {
  if (metodoPago === 'efectivo' || metodoPago === 'transferencia') {
    if (item.precioEfectivo) return item.precioEfectivo;
    const descuento = item.descuentoEfectivo ?? DESCUENTO_DEFAULT;
    return Math.round(item.precio * (1 - descuento / 100));
  }
  return item.precio;
}

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', minimumFractionDigits: 0,
  }).format(n ?? 0);

// ── Ícono Naranja ──────────────────────────────────────────────────────────
function IconoNaranja({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="0" fill="#FF6200" />
      <text x="18" y="25" textAnchor="middle" fontSize="17" fontWeight="900"
        fontFamily="Arial, sans-serif" fill="white" letterSpacing="-1">N</text>
    </svg>
  );
}

// ── Step Bar estilo Chloe ──────────────────────────────────────────────────
function StepBar({ paso }) {
  const pasos = ['Contacto', 'Entrega', 'Pago'];
  return (
    <div className="flex items-end mb-12">
      {pasos.map((label, i) => {
        const num    = i + 1;
        const activo = paso === num;
        const hecho  = paso > num;
        return (
          <div key={label} className="flex items-end" style={{ flex: i < pasos.length - 1 ? 1 : 'none' }}>
            <div className="flex flex-col items-center">
              {/* Círculo cuadrado estilo Chloe */}
              <div className={`w-7 h-7 flex items-center justify-center border transition-all duration-300
                ${hecho || activo
                  ? 'bg-onyx-black border-onyx-black text-white'
                  : 'bg-white border-platinum-grey text-on-surface-variant'
                }`}
                style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }}
              >
                {hecho
                  ? <Check size={12} strokeWidth={2.5} />
                  : num
                }
              </div>
              <span className="mt-1.5"
                style={{
                  fontFamily: 'var(--font-hanken)', fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: activo || hecho ? '#0A0A0A' : '#7e7576',
                }}>
                {label}
              </span>
            </div>
            {/* Conector */}
            {i < pasos.length - 1 && (
              <div className="flex-1 mb-5 mx-2" style={{ height: 1, background: paso > num ? '#0A0A0A' : '#E5E5E5' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Input con estilo underline Chloe ───────────────────────────────────────
function ChloeInput({ label, error, className = '', ...props }) {
  return (
    <div className={`group ${className}`}>
      {label && (
        <label style={{
          display: 'block', fontFamily: 'var(--font-hanken)', fontSize: 10,
          fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#4c4546', marginBottom: 6, transition: 'color 0.2s',
        }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: '100%', background: 'transparent', border: 0,
          borderBottom: `1.5px solid ${error ? '#ba1a1a' : '#E5E5E5'}`,
          padding: '10px 0', fontFamily: 'var(--font-karla)', fontSize: 15,
          color: '#1a1c1c', outline: 'none', transition: 'border-color 0.2s',
        }}
        onFocus={e => { e.target.style.borderBottomColor = '#0A0A0A'; }}
        onBlur={e => { e.target.style.borderBottomColor = error ? '#ba1a1a' : '#E5E5E5'; }}
      />
      {error && (
        <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#ba1a1a', marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}

function ChloeSelect({ label, error, children, ...props }) {
  return (
    <div>
      {label && (
        <label style={{
          display: 'block', fontFamily: 'var(--font-hanken)', fontSize: 10,
          fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#4c4546', marginBottom: 6,
        }}>
          {label}
        </label>
      )}
      <select
        {...props}
        style={{
          width: '100%', background: 'transparent', border: 0,
          borderBottom: `1.5px solid ${error ? '#ba1a1a' : '#E5E5E5'}`,
          padding: '10px 0', fontFamily: 'var(--font-karla)', fontSize: 15,
          color: '#1a1c1c', appearance: 'none', outline: 'none', cursor: 'pointer',
        }}
      >
        {children}
      </select>
      {error && <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#ba1a1a', marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// ── Método card estilo Chloe ───────────────────────────────────────────────
function MethodCard({ selected, children, ...props }) {
  return (
    <label
      {...props}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px',
        border: `1.5px solid ${selected ? '#0A0A0A' : '#E5E5E5'}`,
        background: selected ? '#fafafa' : 'white',
        cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      {children}
    </label>
  );
}

// ── Botón primario Chloe ───────────────────────────────────────────────────
function ChloeButton({ children, loading, icon, ...props }) {
  return (
    <button
      {...props}
      style={{
        position: 'relative', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '16px 32px',
        background: props.disabled ? '#ccc' : '#0A0A0A', color: 'white',
        border: 'none', cursor: props.disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.15em', textTransform: 'uppercase',
        width: '100%', overflow: 'hidden', transition: 'opacity 0.2s',
      }}
    >
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </span>
      {!loading && (
        <span style={{ position: 'relative', zIndex: 1 }}>
          {icon ?? <ChevronRight size={16} />}
        </span>
      )}
    </button>
  );
}

// ── Info box (datos confirmados de pasos anteriores) ───────────────────────
function InfoBox({ icon: Icon, label, value, onCambiar }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      border: '1.5px solid #E5E5E5', padding: '14px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon size={16} color="#7e7576" />
        <div>
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7e7576', marginBottom: 2 }}>
            {label}
          </p>
          <p style={{ fontFamily: 'var(--font-karla)', fontSize: 14, color: '#1a1c1c' }}>{value}</p>
        </div>
      </div>
      <button onClick={onCambiar} style={{
        fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: '#4c4546', textDecoration: 'underline',
        textUnderlineOffset: 4, background: 'none', border: 'none', cursor: 'pointer',
      }}>
        Cambiar
      </button>
    </div>
  );
}

// ── Resumen lateral ────────────────────────────────────────────────────────
function ResumenLateral({ cart, subtotal, costoEnvio, total, tipoEnvio, infoEnvio, metodoPago, ahorroTotal, tieneDescuento }) {
  const [cuponInput,   setCuponInput]   = useState('');
  const [mostrarCupon, setMostrarCupon] = useState(false);

  return (
    <div style={{ border: '1.5px solid #E5E5E5', background: 'white' }}>

      {/* Items */}
      <div style={{ padding: '20px 24px', maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {cart.map(item => {
          const precioFinal = getPrecioItem(item, metodoPago);
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {item.imagen
                  ? <img src={item.imagen} alt={item.nombre} style={{ width: 52, height: 64, objectFit: 'cover', border: '1px solid #E5E5E5' }} />
                  : <div style={{ width: 52, height: 64, background: '#eeeeee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingBag size={14} color="#7e7576" />
                    </div>
                }
                <span style={{
                  position: 'absolute', top: -6, right: -6, width: 18, height: 18,
                  background: '#0A0A0A', color: 'white', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-hanken)', fontSize: 9, fontWeight: 700,
                }}>
                  {item.cantidad}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
                  {item.nombre}
                </p>
                {(item.talle || item.color) && (
                  <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#7e7576' }}>
                    {[item.talle && `T: ${item.talle}`, item.color].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                {fmt(precioFinal * item.cantidad)}
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ borderTop: '1px solid #E5E5E5' }} />

      {/* Cupón */}
      <div style={{ padding: '14px 24px' }}>
        {!mostrarCupon ? (
          <button onClick={() => setMostrarCupon(true)} style={{
            display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#7e7576',
          }}>
            <Tag size={12} />
            Agregar cupón de descuento
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={cuponInput}
              onChange={e => setCuponInput(e.target.value)}
              placeholder="CÓDIGO DE CUPÓN"
              autoFocus
              style={{
                flex: 1, border: 0, borderBottom: '1.5px solid #E5E5E5',
                padding: '6px 0', background: 'transparent',
                fontFamily: 'var(--font-hanken)', fontSize: 10, letterSpacing: '0.1em',
                outline: 'none', color: '#1a1c1c',
              }}
            />
            <button style={{
              padding: '6px 14px', background: '#0A0A0A', color: 'white', border: 'none',
              fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.12em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}>
              Aplicar
            </button>
            <button onClick={() => setMostrarCupon(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7e7576' }}>
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid #E5E5E5' }} />

      {/* Totales */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-karla)', fontSize: 14, color: '#4c4546' }}>Subtotal</span>
          <span style={{ fontFamily: 'var(--font-karla)', fontSize: 14 }}>{fmt(subtotal)}</span>
        </div>

        {tieneDescuento && metodoPago && metodoPago !== 'payway' && metodoPago !== 'mercadopago' && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-karla)', fontSize: 13, color: '#2d7a3a' }}>Descuento ({metodoPago})</span>
            <span style={{ fontFamily: 'var(--font-karla)', fontSize: 13, color: '#2d7a3a' }}>- {fmt(ahorroTotal)}</span>
          </div>
        )}

        {metodoPago === 'mercadopago' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#eff6ff', padding: '8px 10px' }}>
            <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 10, letterSpacing: '0.1em', color: '#1d4ed8' }}>Reintegro BNA+ estimado (20%)*</span>
            <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 10, fontWeight: 700, color: '#1d4ed8' }}>+ {fmt(subtotal * 0.20)}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-karla)', fontSize: 14, color: '#4c4546' }}>Envío</span>
          <span style={{ fontFamily: 'var(--font-karla)', fontSize: 14, color: costoEnvio === 0 && tipoEnvio ? '#2d7a3a' : '#1a1c1c' }}>
            {!tipoEnvio ? 'Calculando...' :
             tipoEnvio === 'retiro' ? 'Retiro gratis' :
             tipoEnvio === 'local' ? 'A coordinar por WA' :
             infoEnvio?.gratis ? '¡Gratis!' :
             infoEnvio?.disponible ? fmt(infoEnvio.precio) :
             'A calcular'}
          </span>
        </div>

        <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Total</span>
          <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 22, fontWeight: 400 }}>{fmt(total)}</span>
        </div>

        {metodoPago === 'mercadopago' && (
          <p style={{ fontFamily: 'var(--font-karla)', fontSize: 10, color: '#7e7576', lineHeight: 1.5 }}>
            * El reintegro lo acredita el BNA en tu resumen. Tope $80.000/mes. Válido lun, mar y mié.
          </p>
        )}
      </div>

      {/* Trust badges */}
      <div style={{ borderTop: '1px solid #E5E5E5', padding: '16px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
        {[
          { icon: '🔒', label: 'Pago Seguro' },
          { icon: '🚚', label: 'Envío al País' },
          { icon: '💬', label: 'Soporte WA' },
        ].map(({ icon, label }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7e7576' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Checkout principal ─────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router   = useRouter();
  const { cart, clearCart } = useCart();
  const supabase = createClient();
  const pedidoConfirmado = useRef(false);

  const [paso,               setPaso]               = useState(1);
  const [loading,            setLoading]            = useState(false);
  const [error,              setError]              = useState('');
  const [infoEnvio,          setInfoEnvio]          = useState(null);
  const [tipoEnvio,          setTipoEnvio]          = useState('');
  const [metodoPago,         setMetodoPago]         = useState('');
  const [errores,            setErrores]            = useState({});
  const [copiado,            setCopiado]            = useState('');
  const [pedidoIdConfirmado, setPedidoIdConfirmado] = useState('');
  const [configPago,         setConfigPago]         = useState({
    titular: 'CHLOE SHOWROOM',
    banco:   'Banco Galicia',
    cbu:     '0000000000000000000000',
    alias:   'CHLOE.SHOWROOM',
  });
  const [localDetalles, setLocalDetalles] = useState({ calle: '', numero: '', barrio: '' });
  const [direccionLocal, setDireccionLocal] = useState('');
  const [coordsLocal,    setCoordsLocal]    = useState(null);

  const [form, setForm] = useState({
    nombre: '', email: '', telefono: '',
    calle: '', numero: '', piso: '', depto: '',
    ciudad: '', provincia: '', codigoPostal: '',
    notas: '',
  });

  useEffect(() => {
    fetch('/api/admin/config')
      .then(r => r.json())
      .then(data => {
        if (data.ok && data.data) {
          const c = data.data;
          setConfigPago({
            titular: c.transferenciaTitular || 'CHLOE SHOWROOM',
            banco:   c.transferenciaBanco   || 'Banco Galicia',
            cbu:     c.transferenciaCbu     || '0000000000000000000000',
            alias:   c.transferenciaAlias   || 'CHLOE.SHOWROOM',
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setForm(prev => ({
        ...prev,
        nombre: user.user_metadata?.nombre ?? user.user_metadata?.full_name ?? '',
        email:  user.email ?? '',
      }));
    });
  }, []);

  useEffect(() => {
    if (cart.length === 0 && !pedidoConfirmado.current) router.replace('/productos');
  }, [cart, router]);

  const { subtotal, ahorroTotal, tieneDescuento } = useMemo(() => {
    const sub     = cart.reduce((acc, item) => acc + getPrecioItem(item, metodoPago) * item.cantidad, 0);
    const sinDesc = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    return { subtotal: sub, ahorroTotal: sinDesc - sub, tieneDescuento: sinDesc - sub > 0 };
  }, [cart, metodoPago]);

  useEffect(() => {
    if (tipoEnvio === 'envio' && form.provincia) {
      setInfoEnvio(calcularEnvio(form.provincia, subtotal));
    } else {
      setInfoEnvio(null);
    }
  }, [form.provincia, tipoEnvio, subtotal]);

  const costoEnvio = tipoEnvio === 'retiro' ? 0 : tipoEnvio === 'local' ? 0 : (infoEnvio?.disponible ? infoEnvio.precio : 0);
  const total      = subtotal + costoEnvio;

  function copiar(campo) {
    const valor = campo === 'cbu' ? configPago.cbu : configPago.alias;
    navigator.clipboard.writeText(valor).then(() => {
      setCopiado(campo);
      setTimeout(() => setCopiado(''), 2000);
    });
  }

  function validarPaso1() {
    const e = {};
    if (!form.email.trim()) e.email = 'Requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.codigoPostal.trim()) e.codigoPostal = 'Requerido';
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function validarPaso2() {
    const e = {};
    if (!tipoEnvio)            e.tipoEnvio = 'Seleccioná una opción de entrega';
    if (!form.nombre.trim())   e.nombre    = 'Requerido';
    if (!form.telefono.trim()) e.telefono  = 'Requerido';
    if (tipoEnvio === 'envio') {
      if (!form.calle.trim())  e.calle     = 'Requerido';
      if (!form.ciudad.trim()) e.ciudad    = 'Requerido';
      if (!form.provincia)     e.provincia = 'Requerido';
    }
    if (tipoEnvio === 'local' && !direccionLocal.trim()) {
      e.direccionLocal = 'Ingresá tu calle y número';
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function validarPaso3() {
    const e = {};
    if (!metodoPago) e.metodoPago = 'Seleccioná un método de pago';
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function irAPaso2() { if (validarPaso1()) { setTipoEnvio(''); setPaso(2); window.scrollTo({ top: 0, behavior: 'smooth' }); } }
  function irAPaso3() { if (validarPaso2()) { setPaso(3); window.scrollTo({ top: 0, behavior: 'smooth' }); } }

async function confirmar() {

    if (!validarPaso3()) return;
    setLoading(true);
    setError('');

    try {
      const payload = {
        items: cart.map(item => {
          const precioFinal = getPrecioItem(item, metodoPago);
          return {
            productoId: item.id.includes('-') ? item.id.split('-')[0] : item.id,
            varianteId: item.varianteId ?? null,
            nombre:     item.nombre,
            precio:     precioFinal,
            cantidad:   item.cantidad,
            subtotal:   precioFinal * item.cantidad,
            talle:      item.talle  ?? null,
            color:      item.color  ?? null,
            imagen:     item.imagen ?? null,
          };
        }),
        subtotal, costoEnvio, total,
        metodoPago, tipoEnvio,
        compradorNombre:   form.nombre.trim(),
        compradorEmail:    form.email.trim(),
        compradorTelefono: form.telefono.trim(),
        notas: form.notas.trim() || null,
        ...(tipoEnvio === 'envio' && {
          direccion: {
            calle: form.calle.trim(), numero: form.numero.trim() || null,
            piso: form.piso.trim() || null, departamento: form.depto.trim() || null,
            ciudad: form.ciudad.trim(), provincia: form.provincia,
            codigoPostal: form.codigoPostal.trim(),
          },
        }),
        ...(tipoEnvio === 'local' && {
          entregaLocal: {
            direccion: direccionLocal, calle: localDetalles.calle,
            numero: localDetalles.numero, barrio: localDetalles.barrio,
            lat: coordsLocal?.lat ?? null, lng: coordsLocal?.lng ?? null,
          },
        }),
      };

      // ── DÉBITO: crear pedido → redirigir a Go Cuotas ──────────────────
      if (metodoPago === 'debito') {
        const resPedido = await fetch('/api/checkout', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        const dataPedido = await resPedido.json();
        if (!dataPedido.ok) { setError(dataPedido.error ?? 'Error al crear el pedido'); return; }

        const resGC = await fetch('/api/gocuotas/create', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pedidoId:       dataPedido.pedidoId,
            total,
            compradorEmail: form.email.trim(),
          }),
        });
        const dataGC = await resGC.json();
        if (!dataGC.ok) { setError(dataGC.error ?? 'Error al conectar con Go Cuotas'); return; }

        window.open(dataGC.checkoutUrl, '_blank');
        return;
      }

      // ── RESTO DE MÉTODOS ───────────────────────────────────────────────
      const res  = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error ?? 'Error al procesar el pedido'); return; }
      pedidoConfirmado.current = true;
      if (metodoPago === 'payway') { setPedidoIdConfirmado(data.pedidoId); return; }
      clearCart();
      router.push(`/checkout/exito?pedido=${data.pedidoId}&metodo=${metodoPago}&total=${total}`);
    } catch { setError('Error de conexión. Intentá de nuevo.'); }
    finally  { setLoading(false); }
  }

  if (cart.length === 0 && !pedidoConfirmado.current) return null;

  const maxDescuento = cart.length > 0 ? Math.max(...cart.map(i => i.descuentoEfectivo ?? DESCUENTO_DEFAULT)) : DESCUENTO_DEFAULT;

  const metodosPago = [
    {
      id: 'mercadopago', label: 'MARCATON BNA+',
      desc: '20% de reintegro · Hasta 3 cuotas sin interés',
      badge: '20% Reintegro', badgeColor: '#1d4ed8',
      iconCustom: <QrCode size={16} color="#1d4ed8" />,
    },
    {
      id: 'credito', label: 'Visa / Mastercard',
      desc: '3 cuotas sin interés con todas las tarjetas',
      badge: '3 cuotas', badgeColor: '#4c4546',
      iconCustom: <CreditCard size={16} color="#4c4546" />,
    },
    {
      id: 'debito', label: 'Débito · GO Cuotas',
      desc: '3 cuotas con tu tarjeta de débito habitual',
      badge: '3 cuotas', badgeColor: '#4c4546',
      iconCustom: <CreditCard size={16} color="#4c4546" />,
    },
    {
      id: 'transferencia', label: 'Transferencia Bancaria',
      desc: 'Transferí y envianos el comprobante por WhatsApp',
      badge: `${maxDescuento}% OFF`, badgeColor: '#2d7a3a',
      iconCustom: <Building2 size={16} color="#4c4546" />,
    },
    {
      id: 'efectivo', label: 'Efectivo',
      desc: tipoEnvio === 'retiro' ? 'Al retirar en el local' : 'Al recibir el pedido',
      badge: `${maxDescuento}% OFF`, badgeColor: '#2d7a3a',
      iconCustom: <Banknote size={16} color="#4c4546" />,
    },
  ];

  // ── Label del botón confirmar
  function labelBoton() {
    if (metodoPago === 'payway') return `Continuar con Naranja · ${fmt(total)}`;
    return `Confirmar Pedido · ${fmt(total)}`;
  }

  // ── Estilo inline compartido para sección heading ──────────────────────
  const sectionHeading = {
    fontFamily: 'var(--font-hanken)', fontSize: 10, fontWeight: 600,
    letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7e7576', marginBottom: 16,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>

      {/* ── Header ── */}
      <header style={{ borderBottom: '1px solid #E5E5E5', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/productos" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#7e7576', textDecoration: 'none', fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            <ArrowLeft size={14} />
            Volver
          </Link>
          {/* Logo — reemplazar con tu <Image> de logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 16, fontWeight: 800, letterSpacing: '0.2em', color: '#0A0A0A' }}>
              CHLOE SHOWROOM
            </span>
          </Link>
          <div style={{ width: 80 }} />
        </div>
      </header>

      <style>{`
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .checkout-grid {
            grid-template-columns: 1fr 420px;
            gap: 64px;
          }
        }
        .resumen-sticky {
          position: static;
        }
        @media (min-width: 1024px) {
          .resumen-sticky {
            position: sticky;
            top: 32px;
            align-self: start;
          }
        }
        /* En mobile: resumen va PRIMERO (orden 1), stepper después (orden 2) */
        .col-stepper  { order: 2; }
        .col-resumen  { order: 1; }
        @media (min-width: 1024px) {
          .col-stepper  { order: 1; }
          .col-resumen  { order: 2; }
        }
      `}</style>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 80px' }}>
        <div className="checkout-grid">

          {/* ════════════════ COLUMNA IZQUIERDA ════════════════ */}
          <div className="col-stepper">
            <StepBar paso={paso} />

            {/* ═══ PASO 1: Contacto ═══ */}
            {paso === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                  <p style={{ ...sectionHeading, marginBottom: 4 }}>Paso 1 de 3</p>
                  <h2 style={{ fontFamily: 'var(--font-hanken)', fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 400, letterSpacing: '-0.01em' }}>
                    Datos de Contacto
                  </h2>
                </div>

                <ChloeInput
                  label="Correo Electrónico *"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="tu@email.com"
                  error={errores.email}
                />

                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: 16, height: 16, accentColor: '#0A0A0A' }} />
                  <span style={{ fontFamily: 'var(--font-karla)', fontSize: 14, color: '#4c4546' }}>
                    Quiero recibir novedades y ofertas por e-mail
                  </span>
                </label>

                <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: 28 }}>
                  <p style={sectionHeading}>Código Postal</p>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
                    <ChloeInput
                      label="Código Postal *"
                      value={form.codigoPostal}
                      onChange={e => setForm(p => ({ ...p, codigoPostal: e.target.value }))}
                      placeholder="4700"
                      error={errores.codigoPostal}
                      className="max-w-[160px]"
                      style={{ maxWidth: 160 }}
                    />
                    <button style={{
                      fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.15em',
                      textTransform: 'uppercase', color: '#4c4546', background: 'none',
                      border: 'none', cursor: 'pointer', textDecoration: 'underline',
                      textUnderlineOffset: 4, paddingBottom: 10,
                    }}>
                      No sé mi CP
                    </button>
                  </div>
                </div>

                <ChloeButton onClick={irAPaso2}>
                  Continuar
                </ChloeButton>
              </div>
            )}

            {/* ═══ PASO 2: Entrega ═══ */}
            {paso === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div>
                  <p style={{ ...sectionHeading, marginBottom: 4 }}>Paso 2 de 3</p>
                  <h2 style={{ fontFamily: 'var(--font-hanken)', fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 400, letterSpacing: '-0.01em' }}>
                    Entrega
                  </h2>
                </div>

                {/* Info confirmada paso 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <InfoBox icon={Store} label="Contacto" value={form.email} onCambiar={() => setPaso(1)} />
                  <InfoBox icon={Store} label="Enviar a" value={`CP ${form.codigoPostal}`} onCambiar={() => setPaso(1)} />
                </div>

                <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: 24 }}>
                  <p style={sectionHeading}>Datos Personales</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <ChloeInput label="Nombre Completo *" value={form.nombre}
                      onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                      placeholder="Tu nombre y apellido" error={errores.nombre} />
                    <ChloeInput label="Teléfono / WhatsApp *" value={form.telefono}
                      onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
                      placeholder="+54 9 383 000 0000" error={errores.telefono} />
                  </div>
                </div>

                {/* Método entrega */}
                <div>
                  <p style={sectionHeading}>Método de Entrega</p>
                  {errores.tipoEnvio && (
                    <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#ba1a1a', marginBottom: 8 }}>{errores.tipoEnvio}</p>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      {
                        value: 'retiro',
                        label: 'Retirar en local',
                        desc: 'Alpatauca 870, Catamarca · Lun–Sáb 18–22 hs & Sáb 10–13 hs',
                        precio: 'Gratis',
                        icon: Store,
                      },
                      {
                        value: 'local',
                        label: 'Envío Local',
                        desc: 'Capital · Valle Viejo y Valle Chico.',
                        precio: 'A convenir',
                        icon: Truck,
                      },
                      {
                        value: 'envio',
                        label: 'Envío a Domicilio',
                        desc: 'Se calcula según tu provincia',
                        precio: infoEnvio?.disponible ? (infoEnvio.gratis ? 'Gratis' : fmt(infoEnvio.precio)) : 'Según provincia',
                        icon: Truck,
                      },
                    ].map(({ value, label, desc, precio, icon: Icon }) => (
                      <MethodCard key={value} selected={tipoEnvio === value}>
                        <input type="radio" name="entrega" value={value} checked={tipoEnvio === value}
                          onChange={() => setTipoEnvio(value)}
                          style={{ marginTop: 3, accentColor: '#0A0A0A', flexShrink: 0 }} />
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                          <Icon size={15} color="#7e7576" style={{ marginTop: 2 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
                              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 12, fontWeight: 600, flexShrink: 0, color: value === 'retiro' ? '#2d7a3a' : '#1a1c1c' }}>{precio}</p>
                            </div>
                            <p style={{ fontFamily: 'var(--font-karla)', fontSize: 12, color: '#7e7576', marginTop: 3 }}>{desc}</p>
                          </div>
                        </div>
                      </MethodCard>
                    ))}
                  </div>
                </div>

                {/* Mapa envío local */}
                {tipoEnvio === 'local' && (
                  <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: 20 }}>
                    <p style={sectionHeading}>Ubicación de Entrega</p>
                    <MapaEntregaLocal
                      onCoordsChange={setCoordsLocal}
                      onDireccionChange={(data) => {
                        setDireccionLocal(data.direccion);
                        setLocalDetalles({ calle: data.calle, numero: data.numero, barrio: data.barrio });
                      }}
                    />
                    {errores.direccionLocal && (
                      <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#ba1a1a', marginTop: 6 }}>{errores.direccionLocal}</p>
                    )}
                  </div>
                )}

                {/* Dirección domicilio */}
                {tipoEnvio === 'envio' && (
                  <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <p style={sectionHeading}>Dirección de Entrega</p>
                    <ChloeInput label="Calle *" value={form.calle}
                      onChange={e => setForm(p => ({ ...p, calle: e.target.value }))}
                      placeholder="Av. San Martín" error={errores.calle} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <ChloeInput label="Número" value={form.numero}
                        onChange={e => setForm(p => ({ ...p, numero: e.target.value }))} placeholder="1234" />
                      <ChloeInput label="Piso / Depto" value={form.piso}
                        onChange={e => setForm(p => ({ ...p, piso: e.target.value }))} placeholder="3° B" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <ChloeInput label="Ciudad *" value={form.ciudad}
                        onChange={e => setForm(p => ({ ...p, ciudad: e.target.value }))}
                        placeholder="San Fernando del V. C." error={errores.ciudad} />
                      <ChloeSelect label="Provincia *" value={form.provincia}
                        onChange={e => setForm(p => ({ ...p, provincia: e.target.value }))}
                        error={errores.provincia}>
                        <option value="">Seleccioná</option>
                        {PROVINCIAS_AR.map(p => <option key={p} value={p}>{p}</option>)}
                      </ChloeSelect>
                    </div>

                    {infoEnvio && (
                      <div style={{
                        padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10,
                        border: `1.5px solid ${infoEnvio.gratis ? '#bbf7d0' : infoEnvio.disponible ? '#bfdbfe' : '#fecaca'}`,
                        background: infoEnvio.gratis ? '#f0fdf4' : infoEnvio.disponible ? '#eff6ff' : '#fef2f2',
                      }}>
                        <span>{infoEnvio.gratis ? '🎉' : infoEnvio.disponible ? '🚚' : '❌'}</span>
                        <div>
                          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, letterSpacing: '0.1em', color: infoEnvio.gratis ? '#2d7a3a' : infoEnvio.disponible ? '#1d4ed8' : '#ba1a1a' }}>
                            {infoEnvio.gratis ? `¡Envío gratis a ${infoEnvio.zona?.nombre}!` :
                             infoEnvio.disponible ? `Envío a ${infoEnvio.zona?.nombre}: ${fmt(infoEnvio.precio)}` :
                             'Provincia no disponible por el momento'}
                          </p>
                          {infoEnvio.disponible && (
                            <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#7e7576', marginTop: 2 }}>
                              {infoEnvio.diasMin}–{infoEnvio.diasMax} días hábiles
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Notas */}
                <div>
                  <p style={{ ...sectionHeading, marginBottom: 8 }}>Notas del Pedido (Opcional)</p>
                  <textarea
                    value={form.notas}
                    onChange={e => setForm(p => ({ ...p, notas: e.target.value }))}
                    rows={3}
                    placeholder="Algún detalle extra..."
                    style={{
                      width: '100%', background: 'transparent', border: 0,
                      borderBottom: '1.5px solid #E5E5E5', padding: '10px 0',
                      fontFamily: 'var(--font-karla)', fontSize: 15, color: '#1a1c1c',
                      outline: 'none', resize: 'none',
                    }}
                  />
                </div>

                <ChloeButton onClick={irAPaso3}>
                  Continuar al Pago
                </ChloeButton>
              </div>
            )}

            {/* ═══ PASO 3: Pago ═══ */}
            {paso === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div>
                  <p style={{ ...sectionHeading, marginBottom: 4 }}>Paso 3 de 3</p>
                  <h2 style={{ fontFamily: 'var(--font-hanken)', fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 400, letterSpacing: '-0.01em' }}>
                    Método de Pago
                  </h2>
                </div>

                {/* Info confirmada */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <InfoBox icon={Store} label="Contacto" value={form.email} onCambiar={() => setPaso(1)} />
                  <InfoBox
                    icon={tipoEnvio === 'retiro' ? Store : Truck}
                    label={tipoEnvio === 'retiro' ? 'Retiro en local' : tipoEnvio === 'local' ? 'Envío local' : 'Envío a domicilio'}
                    value={tipoEnvio === 'retiro' ? 'Alpatauca 870, Catamarca' : tipoEnvio === 'local' ? direccionLocal : `${form.calle} ${form.numero}, ${form.ciudad}`}
                    onCambiar={() => setPaso(2)}
                  />
                </div>

                {/* Payway form */}
                {metodoPago === 'payway' && pedidoIdConfirmado ? (
                  <>
                    <p style={sectionHeading}>Datos de Tarjeta</p>
                    <PaywayForm
                      total={total} pedidoId={pedidoIdConfirmado}
                      compradorEmail={form.email} compradorNombre={form.nombre}
                      tipoEnvio={tipoEnvio}
                      direccion={tipoEnvio === 'envio' ? { calle: form.calle, ciudad: form.ciudad, codigoPostal: form.codigoPostal } : null}
                      items={cart.map(item => ({ nombre: item.nombre, cantidad: item.cantidad, precio: item.precio }))}
                      onSuccess={() => { clearCart(); router.push(`/checkout/exito?pedido=${pedidoIdConfirmado}&metodo=payway`); }}
                      onError={(data) => setError(data?.error || 'El pago fue rechazado')}
                    />
                  </>
                ) : (
                  <>
                    {errores.metodoPago && (
                      <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#ba1a1a' }}>{errores.metodoPago}</p>
                    )}

                    {/* Cards de pago */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {metodosPago.map(({ id, label, desc, badge, badgeColor, iconCustom }) => (
                        <MethodCard key={id} selected={metodoPago === id}>
                          <input type="radio" name="pago" value={id} checked={metodoPago === id}
                            onChange={() => setMetodoPago(id)}
                            style={{ marginTop: 3, accentColor: '#0A0A0A', flexShrink: 0 }} />
                          <div style={{ width: 32, height: 32, background: '#f3f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {iconCustom}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
                              <span style={{
                                fontFamily: 'var(--font-hanken)', fontSize: 8, letterSpacing: '0.12em',
                                textTransform: 'uppercase', padding: '2px 8px',
                                border: `1px solid ${badgeColor}`, color: badgeColor,
                              }}>
                                {badge}
                              </span>
                            </div>
                            <p style={{ fontFamily: 'var(--font-karla)', fontSize: 12, color: '#7e7576', marginTop: 3 }}>{desc}</p>
                          </div>
                        </MethodCard>
                      ))}
                    </div>

                    {/* QR BNA */}
                    {metodoPago === 'mercadopago' && (
                      <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                        <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1d4ed8' }}>
                          Pagá con MARCATON BNA+
                        </p>
                        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                          {[
                            { valor: '20%', sub: 'de reintegro', detalle: 'en tu resumen de tarjeta' },
                            { valor: '3', sub: 'cuotas sin interés', detalle: `${fmt(total / 3)} / cuota` },
                          ].map(({ valor, sub, detalle }) => (
                            <div key={sub} style={{ flex: 1, background: 'white', border: '1px solid #bfdbfe', padding: '12px 16px', textAlign: 'center' }}>
                              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 24, fontWeight: 800, color: '#1d4ed8' }}>{valor}</p>
                              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1d4ed8' }}>{sub}</p>
                              <p style={{ fontFamily: 'var(--font-karla)', fontSize: 10, color: '#60a5fa', marginTop: 2 }}>{detalle}</p>
                            </div>
                          ))}
                        </div>
                        <div style={{ background: 'white', border: '1px solid #bfdbfe', padding: 12 }}>
                          <img src="/qr-bna.jpeg" alt="QR BNA+" style={{ width: 180, height: 180, objectFit: 'contain', display: 'block' }} />
                        </div>
                        <div style={{ width: '100%', background: 'white', border: '1px solid #bfdbfe', padding: '14px 18px' }}>
                          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1d4ed8', marginBottom: 10 }}>¿Cómo pagar?</p>
                          {[
                            'Abrí la app BNA+ y tocá Escanear QR',
                            `Ingresá el monto: ${fmt(total)}`,
                            'Seleccioná tu tarjeta de crédito BNA y elegí las cuotas',
                            'Confirmá el pedido acá abajo y envianos el comprobante por WhatsApp',
                          ].map((step, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                              <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 9, fontWeight: 700, color: '#93c5fd', flexShrink: 0 }}>{i + 1}.</span>
                              <p style={{ fontFamily: 'var(--font-karla)', fontSize: 12, color: '#1d4ed8', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: step }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Datos transferencia */}
                    {metodoPago === 'transferencia' && (
                      <div style={{ background: '#e8e2d4', border: '1.5px solid #E5E5E5', padding: '20px 24px' }}>
                        <p style={{ ...sectionHeading, marginBottom: 16 }}>Datos Bancarios</p>
                        {[
                          { label: 'Titular', value: configPago.titular },
                          { label: 'Banco',   value: configPago.banco },
                          { label: 'CBU',     value: configPago.cbu,   campo: 'cbu' },
                          { label: 'Alias',   value: configPago.alias, campo: 'alias' },
                        ].map(({ label, value, campo }) => (
                          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid #cfc4c5' }}>
                            <div>
                              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7e7576' }}>{label}</p>
                              <p style={{ fontFamily: 'var(--font-karla)', fontSize: 14, fontWeight: 700, color: '#1a1c1c', fontVariantNumeric: 'tabular-nums' }}>{value}</p>
                            </div>
                            {campo && (
                              <button onClick={() => copiar(campo)} style={{
                                padding: '5px 14px', background: copiado === campo ? '#0A0A0A' : 'white',
                                color: copiado === campo ? 'white' : '#0A0A0A',
                                border: '1.5px solid #0A0A0A', cursor: 'pointer',
                                fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                                transition: 'all 0.2s', flexShrink: 0,
                              }}>
                                {copiado === campo ? '✓ Copiado' : 'Copiar'}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Ahorro efectivo/transferencia */}
                    {tieneDescuento && metodoPago && metodoPago !== 'payway' && metodoPago !== 'mercadopago' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f0fdf4', border: '1.5px solid #bbf7d0', padding: '12px 16px' }}>
                        <Tag size={13} color="#2d7a3a" />
                        <p style={{ fontFamily: 'var(--font-karla)', fontSize: 14, color: '#2d7a3a' }}>
                          Ahorrás <strong>{fmt(ahorroTotal)}</strong> pagando con {metodoPago}
                        </p>
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fef2f2', border: '1.5px solid #fecaca', padding: '12px 16px' }}>
                        <AlertCircle size={15} color="#ba1a1a" />
                        <p style={{ fontFamily: 'var(--font-karla)', fontSize: 13, color: '#ba1a1a' }}>{error}</p>
                      </div>
                    )}

                    <ChloeButton onClick={confirmar} loading={loading} icon={loading ? undefined : <Check size={16} />}>
                      {loading ? 'Procesando...' : labelBoton()}
                    </ChloeButton>

                    <p style={{ fontFamily: 'var(--font-karla)', fontSize: 11, color: '#7e7576', textAlign: 'center' }}>
                      Al confirmar aceptás los{' '}
                      <a href="#" style={{ color: '#4c4546', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                        términos y condiciones
                      </a>{' '}
                      de compra.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ════════════════ RESUMEN LATERAL ════════════════ */}
          <div className="col-resumen resumen-sticky">
            <ResumenLateral
              cart={cart} subtotal={subtotal} costoEnvio={costoEnvio}
              total={total} tipoEnvio={tipoEnvio} infoEnvio={infoEnvio}
              metodoPago={metodoPago} ahorroTotal={ahorroTotal} tieneDescuento={tieneDescuento}
            />
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid #E5E5E5', marginTop: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7e7576' }}>
            © 2026 CHLOE SHOWROOM · TODOS LOS DERECHOS RESERVADOS
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Términos y Condiciones', 'Política de Privacidad'].map(label => (
              <a key={label} href="#" style={{ fontFamily: 'var(--font-hanken)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7e7576', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}