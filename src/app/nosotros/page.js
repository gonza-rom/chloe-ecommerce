'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

const MAPS = 'https://www.google.com/maps/place/CHLOE+SHOWROOM/@-28.4506353,-65.7785153,20.56z/data=!4m15!1m8!3m7!1s0x942428a6b444e9df:0xb1208f9979278142!2sAlpatauca+870,+K4700+San+Fernando+del+Valle+de+Catamarca,+Catamarca!3b1!8m2!3d-28.450718!4d-65.7785373!16s%2Fg%2F11lmqd_d1_!3m5!1s0x9424297b1d2bf14d:0xdc52f50b8071aee9!8m2!3d-28.4506923!4d-65.7785747!16s%2Fg%2F11k9p2q35c';

const STATS = [
  { num: '3+',  label: 'Años en Catamarca'       },
  { num: '3',   label: 'Colecciones Activas'      },
  { num: '∞',   label: 'Envíos a todo el país'    },
  { num: '★',   label: 'Atención Personalizada'   },
];

const PILARES = [
  {
    icon: 'gallery_thumbnail',
    titulo: 'Curaduría Exclusiva',
    texto: 'No traemos cantidades, traemos calidad. Cada prenda es una pieza elegida bajo los estándares más altos del Urban Chic. Tu próximo favorito ya nos está esperando.',
  },
  {
    icon: 'star_rate',
    titulo: 'Preppy Moderno',
    texto: 'Reinterpretamos los clásicos. Siluetas estructuradas y tejidos premium que definen un look atemporal pero siempre vigente, adaptado a la mujer de hoy.',
  },
  {
    icon: 'local_shipping',
    titulo: 'Alcance Nacional',
    texto: 'Desde Catamarca para todo el país. Enviamos con cuidado cada detalle del packaging para que tu experiencia sea premium de principio a fin.',
  },
];

const COLECCIONES = [
  {
    nombre: 'City Icons',
    href: '/catalogo?categoria=cat_vestidos',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSHQOz5rQcqVMrPcxeg6ii1afPxh3ShCcXMCf65nqg9CpirkkKF_SRjn9a-puDq5co-kfjeOpRYBclk01nU1vu4AuiXwjl5lYTvV_yKTiNz3uVRq5DxAbIEn_xgpUc6vKc260KtQQ73IYGTFBZEFpWEi4gskTOPPUSJ7CAecOp4RDFeOHeKh3AWu9TeTfWwbhHV3LcicS6UMlOb6ct7OEZ_zRVII0OryxebmtUZCw7JElNNLN4EzCX6IbPdKsocvtr7Njpg1MrueE',
  },
  {
    nombre: 'Night Collection',
    href: '/catalogo?categoria=cat_noche',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIA8-1QauW8tnOaYLZ7vzBUhH0J0uUb1pud1prIqhaYFaEWlCnz7DuWQsav4fnnZNSul3CaiwqmWhlessaMc8MMDIh-FAYCtdL9sf5SP6YW5CFDakIxGQ2f4I1u1L8qapGLKNM5LpUN1Q2xES2zrocPPUutON6vC2XdOnc_bOruMwdhKzDWeLs2_N3w-lTKbe_kr8VkfNeqWCbTcs_98FPauDVN1hkOC7eSG9zzAQ2FkOB-MZunJtktixXG8wuzv8PUd11Qfo92ag',
  },
  {
    nombre: 'Archive Editions',
    href: '/catalogo?categoria=cat_archive',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQWU4k7BfvCIIdDrTJaMMi6mF41LEzfw1I7uqY9rzk8Uyy55Q-_gvqo4M85v3dARUKiZYaAcO2l5EQJThIeFcpJ_DQlkJdW19vYoNfZsqKjx4ums7kZidm9-lruVSyHX-mLiFT6C1oPNCQoO7s6WlXfHHfs-HHWIGVaQELjsA7hr2rH7XkKMDOEya8hldp8jzCvZlz4ggXzyQArru5tA98B9cK9UxAdZWK7zW2M9FWHsQfyXA4fvEj6XN_sKOCk1pu_R7sIcU82DE',
  },
];

function IconInstagram({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function IconWhatsApp({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// ── Scroll reveal hook ────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('reveal-visible'); observer.unobserve(el); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ── Sub-componente con reveal individual ─────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; observer.unobserve(el); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(28px)',
        transition: `opacity 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-surface">

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section className="bg-onyx-black text-white py-24 md:py-32 px-5 md:px-16">
        <div className="max-w-[1280px] mx-auto">
          {/* Breadcrumb */}
          <Reveal>
            <nav className="flex items-center gap-2 mb-10">
              <Link href="/" className="font-label-md text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors">
                Inicio
              </Link>
              <span className="text-white/20 text-[10px]">›</span>
              <span className="font-label-md text-[10px] uppercase tracking-[0.2em] text-white/60">Nosotros</span>
            </nav>
          </Reveal>

          <Reveal delay={50}>
            <p className="font-label-md text-[11px] uppercase tracking-[0.3em] text-white/40 mb-6">
              Catamarca, Argentina — Desde el primer día
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1
              className="text-white leading-none mb-6"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', letterSpacing: '-0.03em', fontWeight: 300 }}
            >
              NOSOTROS.
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p
              className="font-body-lg text-white/60 max-w-sm mb-10"
              style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', lineHeight: 1.8 }}
            >
              Una boutique pensada para la mujer que transita la ciudad con confianza, estilo y autenticidad.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/catalogo"
                className="bg-white text-onyx-black px-8 py-3.5 font-label-md text-label-md uppercase tracking-widest hover:bg-platinum-grey transition-all duration-300 text-center"
              >
                Ver Colección
              </Link>
              <Link
                href="/contacto"
                className="border border-white/30 text-white px-8 py-3.5 font-label-md text-label-md uppercase tracking-widest hover:bg-white/10 transition-all duration-300 text-center"
              >
                Contacto
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          STATS
      ════════════════════════════════ */}
      <section className="border-b border-platinum-grey">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-platinum-grey">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80} className="py-10 md:py-14 px-4 md:px-10 text-center">
                <p
                  className="font-display-lg text-primary mb-1"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300 }}
                >
                  {s.num}
                </p>
                <p className="font-label-md text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          HISTORIA
      ════════════════════════════════ */}
      <section className="py-20 md:py-28 px-5 md:px-16 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">

          {/* Texto */}
          <Reveal className="md:col-span-5 space-y-8">
            <div>
              <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-on-surface-variant mb-4">
                Nuestra Historia
              </p>
              <h2
                className="font-headline-lg uppercase leading-tight mb-6"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
              >
                La Boutique
              </h2>
              <div className="w-12 h-px bg-primary mb-8" />
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Situada en el corazón de San Fernando del Valle de Catamarca, Alpatauca 870 no es solo una dirección — es el refugio de la mujer moderna.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              En <strong className="text-primary font-bold">Chloe Showroom</strong> creemos que el estilo Urban Chic y la sofisticación Preppy no son opuestos, sino complementos de una identidad versátil y auténtica.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Nuestra historia comenzó con la visión de curar prendas que hablen de calidad, durabilidad y tendencia. Cada pieza fue seleccionada personalmente, pensando en la mujer que transita la ciudad con confianza y elegancia.
            </p>
            <div className="pt-4">
              <Link
                href="/catalogo"
                className="group relative inline-flex items-center justify-between min-w-[220px] px-8 py-4 bg-primary text-on-primary font-label-md uppercase tracking-widest overflow-hidden"
              >
                <span className="relative z-10">Ver Colección</span>
                <span className="material-symbols-outlined relative z-10 transition-transform group-hover:translate-x-2">arrow_right_alt</span>
                <div className="absolute inset-0 bg-onyx-black transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 pointer-events-none" />
              </Link>
            </div>
          </Reveal>

          {/* Imagen */}
          <Reveal delay={200} className="md:col-span-6 md:col-start-7 relative">
            <div className="relative overflow-hidden bg-surface-container" style={{ aspectRatio: '3/4' }}>
              <Image
                src="https://lh3.googleusercontent.com/aida/ADBb0uj-xNipEI3TX-LtSWJ0hWIsTIeKr7EZ2k72YI0pE1fUbck3TENSwYa-8awYoEwG4GtsVEGvPj76_tp8VbJasEQ0hwfPfUr86M_UqEWdswVH4iCpc1PViFtYk7E6EA4yJA40_iJCpJ9ZM_pppYkRCDfg5FWGj5eJZtn9i1o4y2g4wi8Y_93raOscXNCC5lqndrigEIi2c7tFqgqS_dWBuQ9L2MicShZwnPJxtMLHe9HSkeozg2RMIp6lymQ"
                alt="Experiencia Chloe Showroom"
                fill
                className="object-cover hover:scale-[1.03] transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Tarjeta flotante */}
            <div className="absolute -bottom-8 -left-8 hidden lg:block bg-tertiary-fixed p-7 w-60 border border-platinum-grey">
              <span className="material-symbols-outlined text-primary text-3xl block mb-3">auto_awesome</span>
              <p className="font-label-md text-[11px] uppercase tracking-widest text-on-surface-variant mb-2">
                Atención Personalizada
              </p>
              <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                Asesoramiento de imagen para potenciar tu mejor versión.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          PILARES
      ════════════════════════════════ */}
      <section className="bg-surface-container-low py-20 md:py-28 border-y border-platinum-grey">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <Reveal className="text-center mb-16">
            <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-on-surface-variant mb-4">
              Lo que nos define
            </p>
            <h2 className="font-headline-lg text-headline-lg uppercase">Nuestros Pilares</h2>
            <div className="w-16 h-px bg-primary mx-auto mt-6" />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-platinum-grey">
            {PILARES.map((p, i) => (
              <Reveal key={p.titulo} delay={i * 100} className="py-10 px-8 md:px-12 space-y-5">
                <div className="w-10 h-10 border border-platinum-grey flex items-center justify-center mb-6"
                  style={{ minHeight: 'unset', minWidth: 'unset' }}>
                  <span className="material-symbols-outlined text-primary text-[22px]">{p.icon}</span>
                </div>
                <h3 className="font-label-md text-[11px] uppercase tracking-[0.2em] text-primary">{p.titulo}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{p.texto}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          COLECCIONES
      ════════════════════════════════ */}
      <section className="py-20 md:py-28 px-5 md:px-16 max-w-[1280px] mx-auto">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-on-surface-variant mb-3">
              Temporada Actual
            </p>
            <h2 className="font-headline-lg text-headline-lg uppercase">⋆˙⟡ Nuestras Colecciones</h2>
          </div>
          <Link
            href="/catalogo"
            className="font-label-md text-[11px] uppercase tracking-widest underline underline-offset-4 hover:opacity-60 transition-opacity self-start md:self-auto"
          >
            Ver todo el catálogo
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {COLECCIONES.map((col, i) => (
            <Reveal key={col.nombre} delay={i * 100}>
              <Link href={col.href} className="group relative block overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <Image
                  src={col.src}
                  alt={col.nombre}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-label-md text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1">Colección</p>
                  <h3 className="font-headline-lg text-white text-xl mb-3">{col.nombre}</h3>
                  <span className="inline-flex items-center gap-2 text-white font-label-md text-[10px] uppercase tracking-widest border-b border-white/40 pb-0.5 group-hover:border-white transition-colors">
                    Explorar
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          CTA VISITANOS
      ════════════════════════════════ */}
      <section className="bg-onyx-black text-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

            {/* Info */}
            <Reveal className="space-y-6">
              <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-white/40">Vení a vernos</p>
              <h2
                className="text-white leading-tight"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.02em' }}
              >
                Visitanos en<br />el Showroom
              </h2>
              <p
                className="font-body-lg text-white/60 max-w-sm leading-relaxed"
                style={{ fontSize: 'clamp(14px, 1.8vw, 18px)' }}
              >
                Nuestro espacio está diseñado para que te sientas en casa mientras descubrís tu próximo look favorito.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-white/40 text-[20px]">location_on</span>
                  <span className="font-label-md text-[11px] uppercase tracking-widest text-white/70">Alpatauca 870, Catamarca</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-white/40 text-[20px]">schedule</span>
                  <span className="font-label-md text-[11px] uppercase tracking-widest text-white/70">
                    Lun–Vie 18–22 hs &nbsp;|&nbsp; Sáb 10–13 &amp; 18–22 hs
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-onyx-black px-8 py-4 font-label-md text-label-md uppercase tracking-widest hover:bg-platinum-grey transition-all duration-300"
                >
                  Cómo llegar
                  <span className="material-symbols-outlined text-[20px]">directions</span>
                </a>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 font-label-md text-label-md uppercase tracking-widest hover:bg-white/10 transition-all duration-300"
                >
                  Contactarnos
                </Link>
              </div>
            </Reveal>

            {/* Redes */}
            <Reveal delay={200} className="space-y-4">
              <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-white/40 mb-6">Seguinos</p>

              <a
                href="https://www.instagram.com/_chloe.showroom/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full py-5 px-6 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <IconInstagram className="w-5 h-5 text-white shrink-0" />
                  <div>
                    <p className="font-label-md text-[11px] uppercase tracking-widest text-white">Instagram</p>
                    <p className="font-body-md text-white/40 text-sm mt-0.5">@_chloe.showroom</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-white/40 text-[20px] transition-transform group-hover:translate-x-1 group-hover:text-white">north_east</span>
              </a>

              <a
                href="https://wa.me/5493834615992"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full py-5 px-6 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <IconWhatsApp className="w-5 h-5 text-white shrink-0" />
                  <div>
                    <p className="font-label-md text-[11px] uppercase tracking-widest text-white">WhatsApp</p>
                    <p className="font-body-md text-white/40 text-sm mt-0.5">Respuesta inmediata</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-white/40 text-[20px] transition-transform group-hover:translate-x-1 group-hover:text-white">arrow_forward</span>
              </a>
            </Reveal>

          </div>
        </div>
      </section>

    </div>
  );
}