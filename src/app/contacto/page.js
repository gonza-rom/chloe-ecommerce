'use client';

import Link from 'next/link';
import { useState } from 'react';

const WHATSAPP  = '5493834615992';
const INSTAGRAM = 'https://www.instagram.com/_chloe.showroom/';
const MAPS      = 'https://www.google.com/maps/place/CHLOE+SHOWROOM/@-28.4506353,-65.7785153,20.56z/data=!4m15!1m8!3m7!1s0x942428a6b444e9df:0xb1208f9979278142!2sAlpatauca+870,+K4700+San+Fernando+del+Valle+de+Catamarca,+Catamarca!3b1!8m2!3d-28.450718!4d-65.7785373!16s%2Fg%2F11lmqd_d1_!3m5!1s0x9424297b1d2bf14d:0xdc52f50b8071aee9!8m2!3d-28.4506923!4d-65.7785747!16s%2Fg%2F11k9p2q35c';

const HORARIOS = [
  { dia: 'Lunes a Viernes',       hora: '18:00 – 22:00 hs' },
  { dia: 'Sábados (Mañana)',      hora: '10:00 – 13:00 hs' },
  { dia: 'Sábados (Tarde/Noche)', hora: '18:00 – 22:00 hs' },
];

const MOTIVOS = [
  { value: 'pedido',  label: 'Consulta sobre un pedido'       },
  { value: 'tallas',  label: 'Tallas y disponibilidad'        },
  { value: 'envio',   label: 'Información de envíos'          },
  { value: 'turno',   label: 'Reserva de turno en el showroom'},
  { value: 'cambio',  label: 'Cambios y devoluciones'         },
  { value: 'otro',    label: 'Otro'                           },
];

// ── SVG íconos inline ────────────────────────────────────────────────────────

function IconWhatsApp({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function IconInstagram({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function ContactoPage() {
  const [formState, setFormState] = useState('idle'); // idle | sending | sent
  const [focusedField, setFocusedField] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setFormState('sending');
    // Simulación — reemplazá con tu lógica real (email, webhook, etc.)
    await new Promise((r) => setTimeout(r, 1500));
    setFormState('sent');
    setTimeout(() => {
      setFormState('idle');
      e.target.reset();
    }, 3000);
  }

  const inputBase =
    'w-full bg-transparent border-0 border-b border-platinum-grey px-0 py-2.5 ' +
    'focus:ring-0 focus:border-primary focus:outline-none transition-colors ' +
    'font-body-lg text-body-lg placeholder:text-outline-variant';

  const labelBase =
    'block font-label-md text-[10px] uppercase tracking-[0.2em] mb-2 transition-colors';

  return (
    <div className="min-h-screen bg-surface">

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section className="bg-onyx-black text-white py-24 md:py-32 px-5 md:px-16">
        <div className="max-w-[1280px] mx-auto">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-8">
              <Link
                href="/"
                className="font-label-md text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors"
              >
                Inicio
              </Link>
              <span className="text-white/20 text-[10px]">›</span>
              <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-white/60">
                Contacto
              </span>
            </nav>

            <p className="font-label-md text-[11px] uppercase tracking-[0.3em] text-white/50 mb-6">
              Chloe Showroom — Catamarca, Argentina
            </p>
            <h1
              className="font-display-lg text-white leading-none mb-6"
              style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.03em', fontWeight: 300 }}
            >
              Hablemos.
            </h1>
            <p
              className="font-body-lg text-white/60 max-w-xl mb-10"
              style={{ fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.8 }}
            >
              Estamos para ayudarte con consultas de pedidos, tallas, envíos o simplemente para coordinar tu visita al showroom.
            </p>
            <div className="inline-flex items-center gap-3 border border-white/20 px-5 py-2.5">
              <span className="material-symbols-outlined text-[18px] text-white/60">local_shipping</span>
              <span className="font-label-md text-[11px] uppercase tracking-[0.2em] text-white/70">
                Realizamos envíos a todo el país
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CONTACT GRID — info + form
      ════════════════════════════════ */}
      <section className="py-20 md:py-28 px-5 md:px-16 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* ── LEFT: Info ── */}
          <div className="lg:col-span-5 space-y-14">

            {/* Showroom */}
            <div className="space-y-4">
              <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">
                Nuestro Showroom
              </p>
              <h2 className="font-headline-lg text-headline-lg leading-snug">
                Alpatauca 870,<br />San Fernando del Valle<br />de Catamarca
              </h2>
              <a
                href={MAPS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-label-md text-[11px] uppercase tracking-widest text-primary underline underline-offset-4 hover:opacity-60 transition-opacity"
              >
                Ver en el mapa
                <span className="material-symbols-outlined text-[15px]">north_east</span>
              </a>
            </div>

            {/* Horarios */}
            <div className="space-y-4">
              <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">
                Horarios de Atención
              </p>
              <div>
                {HORARIOS.map((h) => (
                  <div key={h.dia} className="flex justify-between py-3 border-b border-platinum-grey">
                    <span className="font-body-md text-body-md">{h.dia}</span>
                    <span className="font-body-md font-bold">{h.hora}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Canales directos */}
            <div className="space-y-5">
              <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">
                Contacto Directo
              </p>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full py-5 px-6 bg-onyx-black text-white hover:opacity-90 transition-opacity group"
              >
                <div className="flex items-center gap-4">
                  <IconWhatsApp className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-label-md text-[11px] uppercase tracking-widest">WhatsApp</p>
                    <p className="font-body-md text-white/60 text-sm mt-0.5">Respuesta inmediata</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full py-5 px-6 border border-platinum-grey bg-white hover:border-on-surface-variant transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <IconInstagram className="w-5 h-5 shrink-0 text-on-surface" />
                  <div>
                    <p className="font-label-md text-[11px] uppercase tracking-widest">Instagram</p>
                    <p className="font-body-md text-on-surface-variant text-sm mt-0.5">@_chloe.showroom</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant transition-transform group-hover:translate-x-1">
                  north_east
                </span>
              </a>
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-low p-8 md:p-14">
              <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-on-surface-variant mb-3">
                Formulario de Contacto
              </p>
              <h2 className="font-headline-lg text-headline-lg mb-12">
                Envianos un mensaje
              </h2>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Nombre */}
                <div>
                  <label
                    htmlFor="nombre"
                    className={`${labelBase} ${focusedField === 'nombre' ? 'text-primary' : 'text-on-surface-variant'}`}
                  >
                    Nombre y Apellido
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    placeholder="Tu nombre completo"
                    className={inputBase}
                    onFocus={() => setFocusedField('nombre')}
                    onBlur={() => setFocusedField('')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className={`${labelBase} ${focusedField === 'email' ? 'text-primary' : 'text-on-surface-variant'}`}
                  >
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    className={inputBase}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                  />
                </div>

                {/* Motivo */}
                <div>
                  <label
                    htmlFor="asunto"
                    className={`${labelBase} ${focusedField === 'asunto' ? 'text-primary' : 'text-on-surface-variant'}`}
                  >
                    Motivo de Consulta
                  </label>
                  <select
                    id="asunto"
                    name="asunto"
                    className={`${inputBase} appearance-none cursor-pointer`}
                    onFocus={() => setFocusedField('asunto')}
                    onBlur={() => setFocusedField('')}
                    defaultValue=""
                  >
                    <option value="" disabled>Seleccioná una opción</option>
                    {MOTIVOS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                {/* Mensaje */}
                <div>
                  <label
                    htmlFor="mensaje"
                    className={`${labelBase} ${focusedField === 'mensaje' ? 'text-primary' : 'text-on-surface-variant'}`}
                  >
                    Tu Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={4}
                    required
                    placeholder="¿En qué podemos ayudarte?"
                    className={`${inputBase} resize-none`}
                    onFocus={() => setFocusedField('mensaje')}
                    onBlur={() => setFocusedField('')}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formState === 'sending' || formState === 'sent'}
                  className="group relative inline-flex items-center justify-between min-w-[260px] w-full md:w-auto px-8 py-5 bg-primary text-on-primary font-label-md uppercase tracking-widest overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed transition-opacity"
                  style={{ minHeight: 'unset' }}
                >
                  <span className="relative z-10">
                    {formState === 'sending' ? 'Enviando...' : formState === 'sent' ? '¡Mensaje enviado!' : 'Enviar Consulta'}
                  </span>
                  <span className="material-symbols-outlined relative z-10 transition-transform group-hover:translate-x-2">
                    {formState === 'sent' ? 'check' : 'arrow_right_alt'}
                  </span>
                  {/* Hover fill */}
                  <div className="absolute inset-0 bg-onyx-black transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 pointer-events-none" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          INSTAGRAM SECTION
      ════════════════════════════════ */}
      <section className="border-t border-platinum-grey py-20 md:py-28 bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-on-surface-variant mb-3">
                Seguinos
              </p>
              <h2 className="font-headline-lg text-headline-lg uppercase">⋆˙⟡ Instagram</h2>
            </div>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border-b border-onyx-black pb-1 font-label-md text-[11px] uppercase tracking-widest hover:opacity-60 transition-opacity self-start md:self-auto"
            >
              @_chloe.showroom
              <span className="material-symbols-outlined text-[16px]">north_east</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile card */}
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-platinum-grey bg-white p-8 md:p-10 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 rounded-full bg-onyx-black flex items-center justify-center shrink-0">
                  <span className="text-white font-headline-lg" style={{ fontSize: 22, fontWeight: 300 }}>C</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-label-md uppercase tracking-widest mb-0.5">_chloe.showroom</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">Chloe Showroom</p>
                </div>
                <IconInstagram className="w-5 h-5 text-on-surface shrink-0 mt-1" />
              </div>

              <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
                Showroom de moda femenina en Catamarca. City Icons, Archive Editions &amp; Night Collection. Envíos a todo el país. ✨
              </p>

              <div className="grid grid-cols-3 gap-4 border-t border-platinum-grey pt-6">
                {['City Icons', 'Night Edit', 'Archive'].map((col, i) => (
                  <div key={col} className={`text-center ${i === 1 ? 'border-x border-platinum-grey' : ''}`}>
                    <p className="font-body-md font-bold text-on-surface text-base leading-tight">{col}</p>
                    <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mt-1">Colección</p>
                  </div>
                ))}
              </div>
            </a>

            {/* CTA block */}
            <div className="flex flex-col gap-4">
              <div className="flex-1 bg-onyx-black p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4">
                    Novedades &amp; Drops
                  </p>
                  <h3
                    className="font-headline-lg text-white mb-4"
                    style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}
                  >
                    Mirá las últimas tendencias antes que nadie
                  </h3>
                  <p className="font-body-md text-white/60 text-sm leading-relaxed">
                    Seguinos en Instagram para ver looks completos, videos en el showroom, lanzamientos exclusivos y promociones especiales.
                  </p>
                </div>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-3 border border-white/20 px-6 py-3 text-white font-label-md text-[11px] uppercase tracking-widest hover:bg-white hover:text-onyx-black transition-all duration-300 w-fit"
                >
                  Seguir en Instagram
                  <span className="material-symbols-outlined text-[18px]">north_east</span>
                </a>
              </div>

              <div className="border border-platinum-grey bg-white p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-on-surface-variant mb-1">
                    Mensaje directo
                  </p>
                  <p className="font-body-md text-body-md">También podés escribirnos por DM</p>
                </div>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-10 h-10 border border-platinum-grey flex items-center justify-center hover:bg-onyx-black hover:border-onyx-black group transition-all"
                  style={{ minHeight: 'unset', minWidth: 'unset' }}
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:text-white transition-colors">
                    send
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          VISITANOS
      ════════════════════════════════ */}
      <section className="py-20 md:py-28 px-5 md:px-16 max-w-[1280px] mx-auto">
        <div className="border border-platinum-grey p-10 md:p-20 text-center space-y-6">
          <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">
            Vení a vernos
          </p>
          <h2 className="font-headline-lg text-headline-lg uppercase">
            Visitanos en el Showroom
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Nuestro espacio en San Fernando del Valle de Catamarca está diseñado para que te sientas en casa mientras descubrís tu próximo look favorito.
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center pt-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <span className="font-label-md text-[12px] uppercase tracking-widest">Alpatauca 870, Catamarca</span>
            </div>
            <div className="hidden md:block w-px h-5 bg-platinum-grey" />
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">schedule</span>
              <span className="font-label-md text-[11px] uppercase tracking-widest">
                Lun–Vie 18–22 hs &nbsp;|&nbsp; Sáb 10–13 &amp; 18–22 hs
              </span>
            </div>
          </div>

          <div className="pt-6">
            <a
              href={MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-onyx-black text-white px-10 py-4 font-label-md text-label-md uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Cómo llegar
              <span className="material-symbols-outlined text-[20px]">directions</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}