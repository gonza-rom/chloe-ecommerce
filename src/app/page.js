'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ── Constantes ────────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    label: 'Ciudad + Noche',
    nombre: 'Vestido Midi Ring',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSHQOz5rQcqVMrPcxeg6ii1afPxh3ShCcXMCf65nqg9CpirkkKF_SRjn9a-puDq5co-kfjeOpRYBclk01nU1vu4AuiXwjl5lYTvV_yKTiNz3uVRq5DxAbIEn_xgpUc6vKc260KtQQ73IYGTFBZEFpWEi4gskTOPPUSJ7CAecOp4RDFeOHeKh3AWu9TeTfWwbhHV3LcicS6UMlOb6ct7OEZ_zRVII0OryxebmtUZCw7JElNNLN4EzCX6IbPdKsocvtr7Njpg1MrueE',
  },
  {
    label: 'Favorito de Temporada',
    nombre: 'Cardigan Ruffled Chocolate',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvODIMhnLTK8WyS9NHgRRr3AAdzMAROuCq8GOt1IS90MZUtRb66_NCsLVE-9pTnKb-yb9zq6yObQ7kOlFRlEozxY5Epy7ilMhkNdwcXTQYlSCxPEw3QuHlkv0O7JAdF-5n8xQZk9vw3mhmWobc0MW2rBsPwr7_utQgaY3ZpU7tzFyHZ39D2_IePASGdNSdwxFsfykP8xlTB3CoxZiNhr7y737Qsu3oUMZ1c0f3EEySt4ZPtFsdaqY88p5Tit_lEbpoAx0JlNpbqHc',
  },
  {
    label: 'Color del Momento',
    nombre: 'Vestido Tiedye Dusk',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-0QALhph06IyvtmPjACcKg65PrnHmLdu8y9ZupkSO-gf1D1AR6csd6g0AZyr5h3L8pfBDORsljN3cbBpgLYaJ-u_cUirYFfiIbocYlfj23MHlNZP5BtpsSk97mi-eIeeKa_lmMLhmCfsT3K1HGKkb75ukIEoZ7HAJi32cQVH266ZAWC66ts9X_J8fQYRNvZwl0ofPL8MOcCTl6awYTbW6aVphMTUKdXH6644J3v5HD0fa18sO5EmM7kgHXX09mi_XpJVNAIcXMwQ',
  },
  {
    label: 'Iconic Edition',
    nombre: 'Vestido Cutout Iconic',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuI5L75cqM4NNPu-LQaHSd_Tj8J343xrpzLkximBtMZR2W7iiqS1RWbCShrFIOkjXOXPArQM6BuxnGrLXDq0m4IjBRzf0lGvjfVYA67EHu084kyVlghYG7er1CTWmDzyhSxY8ysc457YENylvgy-23cNeSu03ZGzIpcAcOQW4uQ65vixdE-wMMHXAgYs_MBn1oBqXaIRsXt-wxo43cIG_3tUVtwr9rEVB8JhhwnSuZYu88_SzZ542f-XDxNfJx8Kjfc7Rn7b8O8KQ',
  },
];

const LOOK_VIDEOS = [
  { id: 'vid1', src: '/video.mp4',  label: 'Look 01' },
  { id: 'vid2', src: '/video2.mp4', label: 'Look 02' },
  { id: 'vid3', src: '/video3.mp4', label: 'Look 03' },
  { id: 'vid4', src: '/video4.mp4', label: 'Look 04' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtPrecio(n) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(n);
}

function calcCuotas(precio, n = 3) {
  return fmtPrecio(precio / n);
}

// ── ProductCard ───────────────────────────────────────────────────────────────

function ProductCard({ producto }) {
  const precio       = producto.precio ?? 0;
  const precioTransf = producto.precioTransferencia ?? precio * 0.8;

  return (
    <Link href={`/productos/${producto.id}`} className="group cursor-pointer block">
      <div className="relative overflow-hidden mb-3 md:mb-4 bg-surface-container-low" style={{ aspectRatio: '3/4' }}>
        {producto.imagen ? (
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center">
            <span className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant">Sin imagen</span>
          </div>
        )}
        {producto.destacado && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-white px-2 py-0.5 font-label-md text-[10px] uppercase tracking-widest">Fav ✮</span>
          </div>
        )}
      </div>
      <h3 className="font-body-md text-sm md:text-base mb-1 group-hover:underline line-clamp-1">
        {producto.nombre}
      </h3>
      <p className="font-body-md font-bold text-sm md:text-base">
        {fmtPrecio(precio)}
      </p>
      <p className="font-caption text-[11px] text-on-surface-variant mt-0.5">
        3 x {calcCuotas(precio)} sin interés
      </p>
      <p className="font-caption text-[11px] text-on-surface-variant">
        {fmtPrecio(precioTransf)} con Transferencia
      </p>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-surface-container mb-3" style={{ aspectRatio: '3/4' }} />
      <div className="h-3 bg-surface-container rounded mb-1 w-3/4" />
      <div className="h-3 bg-surface-container rounded w-1/2" />
    </div>
  );
}

// ── VideoCard — lazy load + play/pause ───────────────────────────────────────

function VideoCard({ src, label }) {
  const containerRef = useRef(null);
  const videoRef     = useRef(null);
  const [visible,  setVisible]  = useState(false);
  const [playing,  setPlaying]  = useState(false);

  // Observar cuando el componente entra al viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // ya no necesitamos seguir observando
        }
      },
      { rootMargin: '300px' }, // empieza a cargar 300px antes de que entre
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Cuando se monta el video en el DOM, lo reproducimos
  useEffect(() => {
    if (!visible || !videoRef.current) return;
    videoRef.current.play()
      .then(() => setPlaying(true))
      .catch(() => {}); // el browser puede bloquear autoplay, no pasa nada
  }, [visible]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play();  setPlaying(true);  }
    else          { v.pause(); setPlaying(false); }
  }

  return (
    <div ref={containerRef} className="relative" style={{ aspectRatio: '9/16' }}>
      <div className="w-full h-full overflow-hidden bg-surface-container">

        {/* Placeholder oscuro mientras el video no cargó */}
        {!visible && (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
            <span className="material-symbols-outlined text-white/20 text-5xl">play_circle</span>
          </div>
        )}

        {/* Video — solo se monta cuando está cerca del viewport */}
        {visible && (
          <video
            ref={videoRef}
            src={src}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(15%)', transition: 'filter 0.7s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0%)';   }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(15%)';  }}
          />
        )}

        {/* Overlay play/pause — siempre visible para poder interactuar */}
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pausar video' : 'Reproducir video'}
          className="absolute inset-0 flex items-center justify-center transition-colors duration-200"
          style={{
            background: playing ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.25)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <span
            className="material-symbols-outlined text-white drop-shadow-lg"
            style={{
              fontSize: 'clamp(2rem,6vw,3.5rem)',
              opacity: playing ? 0 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            play_arrow
          </span>
        </button>

        {/* Icono pausa en hover cuando está reproduciendo */}
        {playing && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span
              className="material-symbols-outlined text-white drop-shadow-lg"
              style={{ fontSize: 'clamp(2rem,6vw,3.5rem)' }}
            >
              pause
            </span>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="absolute bottom-3 left-3 right-3">
        <span className="bg-white px-2 py-0.5 font-label-md text-[10px] uppercase tracking-widest">
          {label}
        </span>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function Home() {
  const [slideActual,    setSlideActual]    = useState(0);
  const [favs,           setFavs]           = useState([]);
  const [nightProds,     setNightProds]     = useState([]);
  const [archiveProds,   setArchiveProds]   = useState([]);
  const [loadingFavs,    setLoadingFavs]    = useState(true);
  const [loadingNight,   setLoadingNight]   = useState(true);
  const [loadingArchive, setLoadingArchive] = useState(true);

  const autoTimer = useRef(null);

  // ── Hero auto-slide ───────────────────────────────────────────────────────
  const startAuto = useCallback(() => {
    clearInterval(autoTimer.current);
    autoTimer.current = setInterval(
      () => setSlideActual((s) => (s + 1) % HERO_SLIDES.length),
      4500,
    );
  }, []);

  useEffect(() => {
    startAuto();
    return () => clearInterval(autoTimer.current);
  }, [startAuto]);

  const goTo = (n) => {
    setSlideActual((n + HERO_SLIDES.length) % HERO_SLIDES.length);
    startAuto();
  };

  // ── Fetch productos ───────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/productos?destacado=true&pageSize=4')
      .then((r) => r.json())
      .then((data) => setFavs(data?.productos ?? (Array.isArray(data) ? data : [])))
      .catch(() => setFavs([]))
      .finally(() => setLoadingFavs(false));
  }, []);

  useEffect(() => {
    fetch('/api/productos?categoria=cat_noche&pageSize=2')
      .then((r) => r.json())
      .then((data) => setNightProds(data?.productos ?? (Array.isArray(data) ? data : [])))
      .catch(() => setNightProds([]))
      .finally(() => setLoadingNight(false));
  }, []);

  useEffect(() => {
    fetch('/api/productos?categoria=cat_archive&pageSize=2')
      .then((r) => r.json())
      .then((data) => setArchiveProds(data?.productos ?? (Array.isArray(data) ? data : [])))
      .catch(() => setArchiveProds([]))
      .finally(() => setLoadingArchive(false));
  }, []);

  const slide = HERO_SLIDES[slideActual];

  return (
    <main>

      {/* ══════════════════════════════════════════════════════
          HERO — Split text | carousel
      ══════════════════════════════════════════════════════ */}
      <section
        className="bg-onyx-black grid grid-cols-1 md:grid-cols-2 overflow-hidden"
        style={{ minHeight: '85vh' }}
      >
        {/* Izquierda: imagen */}
        <div className="relative overflow-hidden" style={{ minHeight: '60vw', maxHeight: '100vh' }}>
          {HERO_SLIDES.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === slideActual ? 1 : 0 }}
            >
              <Image
                src={s.src}
                alt={s.nombre}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                priority={i === 0}
              />
              <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-sm px-4 py-2">
                <p className="font-label-md text-[11px] uppercase tracking-widest text-white/70">{s.label}</p>
                <p className="font-body-md text-white text-sm font-bold">{s.nombre}</p>
              </div>
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-onyx-black/20 pointer-events-none" />
        </div>

        {/* Derecha: texto */}
        <div className="flex flex-col justify-center px-6 py-10 md:px-16 md:py-0">
          <p className="font-label-md text-[11px] md:text-label-md uppercase tracking-[0.3em] mb-5 text-white/50">
            Archive Editions — Autumn Winter ´26
          </p>
          <h1
            className="font-display-lg text-white leading-none mb-3"
            style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)', letterSpacing: '-0.03em', fontWeight: 300 }}
          >
            CITY<br />
            IC<span style={{ display: 'inline-block', verticalAlign: 'middle', lineHeight: 0, marginBottom: '0.12em' }}>★</span>NS
          </h1>
          <p
            className="font-body-lg text-white/50 mt-4 mb-8 max-w-xs"
            style={{ fontSize: 'clamp(14px, 2vw, 18px)', lineHeight: 1.7 }}
          >
            Prendas que definen una ciudad. Diseñadas para mujeres que escriben su propio relato.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link href="/productos"
              className="bg-white text-onyx-black px-8 py-3.5 font-label-md text-label-md uppercase tracking-widest hover:bg-platinum-grey transition-colors text-center">
              Shop Collection
            </Link>
            <Link href="/productos"
              className="border border-white/40 text-white px-8 py-3.5 font-label-md text-label-md uppercase tracking-widest hover:bg-white/10 transition-colors text-center">
              Lookbook
            </Link>
          </div>

          {/* Controles carrusel */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => goTo(slideActual - 1)}
              className="w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Anterior"
              style={{ minHeight: 'unset', minWidth: 'unset' }}
            >
              ←
            </button>
            <div className="flex gap-2">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === slideActual ? 24 : 8,
                    height: 2,
                    background: i === slideActual ? '#fff' : 'rgba(255,255,255,0.3)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    minHeight: 'unset', minWidth: 'unset',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => goTo(slideActual + 1)}
              className="w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Siguiente"
              style={{ minHeight: 'unset', minWidth: 'unset' }}
            >
              →
            </button>
            <span className="font-label-md text-[11px] text-white/40 ml-2">
              {String(slideActual + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          VALUE PROPS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-surface py-12 border-y border-platinum-grey">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: 'payments',       title: '20% OFF',               desc: 'Abonando con transferencia bancaria' },
            { icon: 'credit_card',    title: '3 & 6 CUOTAS',          desc: 'Sin interés con todas las tarjetas' },
            { icon: 'local_shipping', title: 'ENVÍOS A TODO EL PAÍS', desc: 'Llegamos a cada rincón de Argentina' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center">
              <span className="material-symbols-outlined text-4xl mb-3">{item.icon}</span>
              <h3 className="font-label-md text-label-md uppercase tracking-wider mb-1">{item.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SHOP THE LOOK — Videos
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-surface border-y border-platinum-grey">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">

          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-headline-lg text-headline-lg uppercase tracking-[0.2em] mb-2">
              SHOP THE LOOK
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant uppercase tracking-widest">
              Mirá nuestras prendas en movimiento
            </p>
            <div className="w-24 h-px bg-primary mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {LOOK_VIDEOS.map((v) => (
              <VideoCard key={v.id} src={v.src} label={v.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAVS
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 max-w-[1280px] mx-auto px-5 md:px-16">
        <div className="flex justify-between items-end mb-12 md:mb-16">
          <div>
            <h2 className="font-headline-lg text-headline-lg uppercase tracking-tighter">FAVS ⋆˙⟡</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Nuestros artículos más deseados de la temporada.
            </p>
          </div>
          <Link href="/productos"
            className="font-label-md text-label-md uppercase underline tracking-widest hover:text-on-surface-variant transition-colors whitespace-nowrap ml-4">
            Ver Todo
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loadingFavs
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : favs.length > 0
              ? favs.map((p) => <ProductCard key={p.id} producto={p} />)
              : [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          }
        </div>
      </section>
      {/* ══════════════════════════════════════════════════════
          NIGHT COLLECTION
      ══════════════════════════════════════════════════════ */}
      <section className="bg-onyx-black text-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="text-center mb-12 md:mb-16">
            <p className="font-label-md text-label-md uppercase tracking-[0.3em] mb-4 text-white/40">
              The After Hours Edit
            </p>
            <h2
              className="font-headline-lg uppercase tracking-widest"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}
            >
              NIGHT COLLECTION
            </h2>
            <div className="w-24 h-px bg-white/20 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {loadingNight
              ? [...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-zinc-800 mb-6" style={{ aspectRatio: '4/5' }} />
                    <div className="h-4 bg-zinc-800 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-zinc-800 rounded w-1/3" />
                  </div>
                ))
              : nightProds.length > 0
                ? nightProds.map((p) => (
                    <Link key={p.id} href={`/productos/${p.id}`} className="group cursor-pointer block">
                      <div className="relative overflow-hidden mb-6 md:mb-8 bg-zinc-900" style={{ aspectRatio: '4/5' }}>
                        {p.imagen ? (
                          <Image
                            src={p.imagen} alt={p.nombre} fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                            <span className="font-label-md text-[11px] uppercase tracking-widest text-white/30">{p.nombre}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-headline-lg uppercase mb-1" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.6rem)' }}>
                            {p.nombre}
                          </h3>
                          <p className="font-body-lg text-white/50">{fmtPrecio(p.precio)}</p>
                          <p className="font-caption text-[11px] text-white/30 mt-0.5">
                            3 x {calcCuotas(p.precio)} sin interés
                          </p>
                        </div>
                        <span className="border border-white/30 px-5 py-2.5 font-label-md text-label-md uppercase tracking-widest hover:bg-white hover:text-onyx-black transition-colors whitespace-nowrap shrink-0 text-white text-sm">
                          Ver Más
                        </span>
                      </div>
                    </Link>
                  ))
                : (
                  <p className="text-white/30 font-label-md text-label-md uppercase tracking-widest col-span-2 text-center py-8">
                    Próximamente...
                  </p>
                )
            }
          </div>

          <div className="text-center mt-12">
            <Link href="/productos?categoria=cat_noche"
              className="border border-white/30 px-10 py-4 font-label-md text-label-md uppercase tracking-widest text-white hover:bg-white hover:text-onyx-black transition-colors inline-block">
              Ver Night Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ARCHIVE EDITIONS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-surface-container-low py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="text-center mb-14 md:mb-20">
            <h2 className="font-headline-lg text-headline-lg uppercase tracking-[0.2em]">
              ⟡˙⋆ archive editions ⋆˙⟡
            </h2>
            <div className="w-24 h-px bg-primary mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {loadingArchive
              ? [...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-surface-container mb-4" style={{ aspectRatio: '3/4' }} />
                    <div className="h-3 bg-surface-container rounded w-2/3 mb-2" />
                    <div className="h-3 bg-surface-container rounded w-1/3" />
                  </div>
                ))
              : archiveProds.length > 0
                ? archiveProds.map((p) => (
                    <Link key={p.id} href={`/productos/${p.id}`} className="group cursor-pointer block">
                      <div className="relative overflow-hidden mb-5" style={{ aspectRatio: '3/4' }}>
                        {p.imagen ? (
                          <Image
                            src={p.imagen} alt={p.nombre} fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface-container flex items-center justify-center">
                            <span className="font-label-md text-[11px] uppercase tracking-widest text-on-surface-variant">{p.nombre}</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="bg-tertiary-fixed text-primary px-2 py-0.5 font-label-md text-[10px] uppercase tracking-widest">
                            Archive
                          </span>
                        </div>
                      </div>
                      <h3 className="font-headline-lg text-headline-lg uppercase mb-1 group-hover:underline">
                        {p.nombre}
                      </h3>
                      <p className="font-body-md font-bold">{fmtPrecio(p.precio)}</p>
                      <p className="font-caption text-[11px] text-on-surface-variant mt-0.5">
                        3 x {calcCuotas(p.precio)} sin interés &nbsp;·&nbsp;{' '}
                        {fmtPrecio(p.precioTransferencia ?? p.precio * 0.8)} con Transferencia
                      </p>
                    </Link>
                  ))
                : (
                  <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant text-center py-8 col-span-2">
                    Próximamente...
                  </p>
                )
            }
          </div>

          <div className="text-center mt-12">
            <Link href="/productos?categoria=cat_archive"
              className="border border-primary px-10 py-4 font-label-md text-label-md uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-colors inline-block">
              Ver Archive Editions
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MEDIOS DE PAGO
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-headline-lg text-headline-lg uppercase tracking-[0.2em] mb-4">MEDIOS DE PAGO</h2>
            <div className="w-24 h-px bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">

            {/* Transferencia */}
            <div className="flex flex-col items-center text-center p-6 md:p-8 border border-platinum-grey bg-white hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-platinum-grey flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
              <h3 className="font-label-md text-label-md uppercase tracking-widest mb-3">Transferencia / Efectivo</h3>
              <p className="font-headline-lg text-2xl font-bold text-primary mb-1">
                20% <span className="text-sm font-normal uppercase tracking-widest">de descuento</span>
              </p>
              <p className="font-caption text-on-surface-variant text-sm">Válido para compras en el showroom y tienda online</p>
            </div>

            {/* Crédito */}
            <div className="flex flex-col items-center text-center p-6 md:p-8 border border-platinum-grey bg-white hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-platinum-grey flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-2xl">credit_card</span>
              </div>
              <h3 className="font-label-md text-label-md uppercase tracking-widest mb-5">Tarjeta de Crédito</h3>
              <div className="space-y-3 w-full text-left">
                {[
                  { banco: 'Visa / Mastercard', plan: '3 CUOTAS SIN INTERÉS' },
                  { banco: 'Naranja X',         plan: 'Plan Z y 5 SIN INTERÉS' },
                  { banco: 'Centrocard',         plan: 'Plan Oxígeno SIN INTERÉS' },
                ].map((item) => (
                  <div key={item.banco} className="pb-3 border-b border-platinum-grey last:border-0">
                    <p className="font-body-md text-[12px] uppercase tracking-wider text-on-surface-variant mb-0.5">{item.banco}</p>
                    <p className="font-label-md text-[12px] font-bold uppercase tracking-widest">{item.plan}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Débito */}
            <div className="flex flex-col items-center text-center p-6 md:p-8 border border-platinum-grey bg-white hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-platinum-grey flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <h3 className="font-label-md text-label-md uppercase tracking-widest mb-5">Tarjeta de Débito</h3>
              <div className="bg-surface-container-low p-6 w-full flex flex-col items-center">
                <p className="font-body-md text-[12px] uppercase tracking-wider text-on-surface-variant mb-1">GO Cuotas</p>
                <p className="font-headline-lg text-xl font-bold uppercase tracking-widest">3 CUOTAS</p>
                <p className="font-caption text-on-surface-variant mt-1 text-sm">con tu tarjeta de débito habitual</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}