'use client';
// src/app/auth/login/page.js

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// ── Íconos sociales ───────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" style={{ flexShrink: 0 }}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

// ── Imágenes mosaico de fondo ─────────────────────────────────────────────────

const MOSAIC_IMGS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAwvYA3EZxuZvoLLTuLlHB7bIWE0BQemJ1SKLaVdfaQILR9mPYc1q1jekV52ogka6RU6FwwJd4nAvoJ7GqYxIfJYdKSVCLRUtn_JEM_2VfvHrXHVA0Y4feJYYXGf8p8cG_OrUPKQad891mWmRlLAnQm7Licdu3lpBxgXKeU6uqrHAOYDxh1fNb1zYRPJOkAZM79BxyFhYko4BiRM6CB3syjo1mQgFfAcl04pqTAxUEtfjZhy_YIwPgSGxmVWH9ow7Ofzx1SD53Iqm8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDRoyZBxHc6OLPbtumLKq4gDHBCFeRBX0iM6rvPixHd4FlzvPf-XR8QSRc_3qpqeVNCuVTIWzdd5FfIsCA7NM4zM-uExnQnEbEnIcRKP51p32-QDzBPbbov7I2c_5rEsCkiNYsANtr5A7u9ZUJiDT_GvHC2YIS63B_yF3IHiY-pdTpf3-pBmhSevLHfEmrQWa6i5trj9LhLMpVG9_zGO3cip7te6e2tkEmo53do5Gc2THuMTkpaNjmGGuJjbtF5bPywMd4QF5BpgkQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBDFan1vY2o3qmnc92Ng2QU45Dorlu26BBwvqXxuvmchs2mlLtoV5WYZxo6bOpLnFucc26S0SYJYX9FVk3chX0XQp_XDM-m3QrjTqZwrRTAqX4RozyZxxVM5Ak3Ln69dleRsGHJIYHbESjaPTab_38WlLjfOOAcTg0q47ueTSJlPfKXGaiJakuswCIILmlKtvI-TZGqt0jXMQr2fEUbGBxr2JWFdXA_1GZlNjLF4QVWt46sakSEWJqR8v8qB6vmG3DCuQYEaxIjJoc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD5Z3by4i2gsMP62-kQnYyoKv9YsUMropjYG_9Md6RAZXkhUb0fmTg7rLS6xr9yo4HH2Mr7QTRY-qBfD2ctXd4piDgf-0vO8IPBYcirGm-kTEGSheQfUekz04PX_K5Sr6mzw5s944Vm3pf-k6bwzaU8CNFIjdeiWSXNIW5zsE6VuoGCxoov1wT7aFGXHw9d6IAQP41bMYrdodNbaJ-rGdGlGqI07pVn6GRIPQAS0TfDMeH5lHNcJ74TytiV8y2hBKtetsCxret_hNU',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCSHQOz5rQcqVMrPcxeg6ii1afPxh3ShCcXMCf65nqg9CpirkkKF_SRjn9a-puDq5co-kfjeOpRYBclk01nU1vu4AuiXwjl5lYTvV_yKTiNz3uVRq5DxAbIEn_xgpUc6vKc260KtQQ73IYGTFBZEFpWEi4gskTOPPUSJ7CAecOp4RDFeOHeKh3AWu9TeTfWwbhHV3LcicS6UMlOb6ct7OEZ_zRVII0OryxebmtUZCw7JElNNLN4EzCX6IbPdKsocvtr7Njpg1MrueE',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAIA8-1QauW8tnOaYLZ7vzBUhH0J0uUb1pud1prIqhaYFaEWlCnz7DuWQsav4fnnZNSul3CaiwqmWhlessaMc8MMDIh-FAYCtdL9sf5SP6YW5CFDakIxGQ2f4I1u1L8qapGLKNM5LpUN1Q2xES2zrocPPUutON6vC2XdOnc_bOruMwdhKzDWeLs2_N3w-lTKbe_kr8VkfNeqWCbTcs_98FPauDVN1hkOC7eSG9zzAQ2FkOB-MZunJtktixXG8wuzv8PUd11Qfo92ag',
];

// ── Helpers de UI ─────────────────────────────────────────────────────────────

function PasswordStrength({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8)           score++;
  if (password.length >= 12)          score++;
  if (/[A-Z]/.test(password))         score++;
  if (/[0-9]/.test(password))         score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: 'Muy débil',     color: '#ef4444' },
    { label: 'Débil',         color: '#f97316' },
    { label: 'Regular',       color: '#eab308' },
    { label: 'Fuerte',        color: '#22c55e' },
    { label: 'Muy fuerte 💪', color: '#16a34a' },
  ];
  const lvl = levels[Math.max(0, score - 1)] ?? levels[0];

  return (
    <div className="mt-2">
      <div className="h-0.5 bg-white/20 overflow-hidden">
        <div className="h-full transition-all duration-300"
          style={{ width: `${(score / 5) * 100}%`, background: lvl.color }} />
      </div>
      <p className="font-caption text-caption mt-1" style={{ color: lvl.color }}>{lvl.label}</p>
    </div>
  );
}

function Field({ label, id, type = 'text', placeholder, autoComplete, value, onChange, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block font-label-md text-[11px] uppercase tracking-widest text-white/60 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id} type={type} placeholder={placeholder}
          autoComplete={autoComplete} value={value} onChange={onChange}
          className={[
            'w-full px-4 py-3 font-body-md text-body-md text-white',
            'border outline-none transition-all duration-200',
            'placeholder:text-white/30',
            'focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]',
            'bg-white/10 backdrop-blur-sm',
            error
              ? 'border-red-400 focus:border-red-400'
              : 'border-white/20 focus:border-white/60',
          ].join(' ')}
        />
        {children}
      </div>
      {error && <p className="font-caption text-caption text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function SocialBtn({ onClick, loading, children }) {
  return (
    <button
      type="button" onClick={onClick} disabled={loading}
      className="group relative w-full flex items-center justify-center gap-2.5 px-5 py-3 overflow-hidden bg-white/10 border border-white/20 font-label-md text-[13px] tracking-wider text-white backdrop-blur-sm hover:bg-white hover:text-onyx-black hover:border-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading
        ? <Loader2 size={16} className="animate-spin" />
        : children
      }
    </button>
  );
}

// ── Contenido ─────────────────────────────────────────────────────────────────

function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get('redirect') ?? '/cuenta';

  const [tab,       setTab]       = useState('login');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [nombre,    setNombre]    = useState('');
  const [apellido,  setApellido]  = useState('');
  const [password2, setPassword2] = useState('');
  const [verPass,   setVerPass]   = useState(false);
  const [verPass2,  setVerPass2]  = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [loading,   setLoading]   = useState(false);
  const [loadingG,  setLoadingG]  = useState(false);
  const [errors,    setErrors]    = useState({});
  const [exito,     setExito]     = useState('');
  const [showForgot,     setShowForgot]     = useState(false);
  const [forgotEmail,    setForgotEmail]    = useState('');
  const [forgotSent,     setForgotSent]     = useState(false);
  const [loadingForgot,  setLoadingForgot]  = useState(false);

  const supabase = createClient();

  function switchTab(t) {
    setTab(t); setErrors({}); setExito('');
    setEmail(''); setPassword(''); setNombre(''); setApellido(''); setPassword2('');
  }

  function validate() {
    const e = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) e.email    = 'Ingresá un email válido';
    if (!password)            e.password = 'Ingresá tu contraseña';
    if (password && password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (tab === 'registro') {
      if (!nombre.trim())             e.nombre    = 'Campo requerido';
      if (password2 !== password)     e.password2 = 'Las contraseñas no coinciden';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setExito('');
    if (!validate()) return;
    setLoading(true);
    try {
      if (tab === 'registro') {
        const { error: err } = await supabase.auth.signUp({
          email: email.trim(), password,
          options: {
            data: { nombre: `${nombre.trim()} ${apellido.trim()}`.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (err) {
          if (err.message.includes('already registered'))
            setErrors({ email: 'Ya existe una cuenta con ese email.' });
          else setErrors({ general: err.message });
          return;
        }
        setExito('¡Cuenta creada! Revisá tu email para confirmarla.');
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (err) {
          if (err.message.includes('Invalid login credentials'))
            setErrors({ general: 'Email o contraseña incorrectos' });
          else if (err.message.includes('Email not confirmed'))
            setErrors({ general: 'Confirmá tu email antes de ingresar.' });
          else setErrors({ general: err.message });
          return;
        }
        try { await fetch('/api/auth/sync', { method: 'POST' }); } catch {}
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      setErrors({ general: 'Error de conexión. Intentá de nuevo.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setErrors({}); setLoadingG(true);
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (err) setErrors({ general: err.message });
    } catch {
      setErrors({ general: 'Error al conectar con Google' });
    } finally {
      setLoadingG(false);
    }
  }

  async function handleForgot(e) {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setLoadingForgot(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (!err) setForgotSent(true);
    } catch {}
    finally { setLoadingForgot(false); }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-onyx-black">

      {/* ── FONDO — mosaico de 6 imágenes ── */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-0.5 pointer-events-none">
        {MOSAIC_IMGS.map((src, i) => (
          <div key={i} className="relative overflow-hidden">
            <Image src={src} alt="" fill className="object-cover" sizes="33vw" />
          </div>
        ))}
      </div>

      {/* ── Overlay gradiente — oscurece el fondo para que el card resalte ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.72) 50%, rgba(10,10,10,0.82) 100%)' }}
      />

      {/* ── Volver ── */}
      <Link
        href="/catalogo"
        className="absolute top-5 left-5 z-20 flex items-center gap-1.5 font-label-md text-[11px] uppercase tracking-widest text-white/60 hover:text-white transition-colors"
        style={{ minHeight: 'unset' }}
      >
        <ArrowLeft size={13} />
        Volver
      </Link>

      {/* ── Logo arriba centro ── */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
        <Link href="/">
          <div className="relative h-10 w-28">
            <Image
              src="/logo-white-remove.png"
              alt="Chloe Showroom"
              fill
              className="object-contain"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
            />
          </div>
        </Link>
      </div>

      {/* ── Badge "tienda activa" arriba derecha ── */}
      <div
        className="absolute top-5 right-5 z-20 hidden sm:flex items-center gap-2 px-4 py-2"
        style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', backdropFilter: 'blur(12px)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: 'pulse-dot 2s infinite' }} />
        <span className="font-label-md text-[11px] uppercase tracking-widest text-white/60">Tienda activa</span>
      </div>

      {/* ── CARD central ── */}
      <div
        className="relative z-10 w-full max-w-[420px] mx-4 my-20 p-8 md:p-10"
        style={{
          background: 'rgba(10,10,10,0.75)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Tabs */}
        <div className="flex border-b border-white/15 mb-7">
          {[
            { key: 'login',    label: 'Ingresar'     },
            { key: 'registro', label: 'Crear cuenta' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={[
                'flex-1 pb-3 font-label-md text-[12px] uppercase tracking-widest relative transition-colors duration-200',
                tab === key ? 'text-white' : 'text-white/40 hover:text-white/70',
              ].join(' ')}
              style={{ minHeight: 'unset', minWidth: 'unset', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {label}
              <span
                className="absolute bottom-0 left-0 right-0 h-px bg-white transition-transform duration-300 origin-left"
                style={{ transform: tab === key ? 'scaleX(1)' : 'scaleX(0)' }}
              />
            </button>
          ))}
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="font-headline-lg text-white text-[24px] font-light tracking-tight leading-snug mb-1">
            {tab === 'login' ? 'Bienvenida de nuevo' : 'Crear cuenta'}
          </h1>
          <p className="font-body-md text-[13px] text-white/50">
            {tab === 'login'
              ? 'Ingresá para ver tus pedidos y favoritos.'
              : 'Unite y accedé a beneficios exclusivos.'}
          </p>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-2 mb-5">
          <SocialBtn onClick={handleGoogle} loading={loadingG}>
            <GoogleIcon />
            {tab === 'login' ? 'Continuar con Google' : 'Registrarme con Google'}
          </SocialBtn>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/15" />
          <span className="font-label-md text-[10px] uppercase tracking-widest text-white/40">
            {tab === 'login' ? 'o con email' : 'o con email'}
          </span>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

          {tab === 'registro' && (
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Nombre" id="reg-nombre" placeholder="Nombre"
                autoComplete="given-name" value={nombre}
                onChange={e => setNombre(e.target.value)} error={errors.nombre}
              />
              <Field
                label="Apellido" id="reg-apellido" placeholder="Apellido"
                autoComplete="family-name" value={apellido}
                onChange={e => setApellido(e.target.value)}
              />
            </div>
          )}

          <Field
            label="Email" id="email" type="email" placeholder="tu@email.com"
            autoComplete="email" value={email}
            onChange={e => setEmail(e.target.value)} error={errors.email}
          />

          {/* Contraseña */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="font-label-md text-[11px] uppercase tracking-widest text-white/60">
                Contraseña
              </label>
              {tab === 'login' && (
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="font-caption text-[11px] text-white/40 hover:text-white transition-colors"
                  style={{ minHeight: 'unset', minWidth: 'unset', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                id="password"
                type={verPass ? 'text' : 'password'}
                placeholder={tab === 'registro' ? 'Mínimo 8 caracteres' : '••••••••'}
                autoComplete={tab === 'registro' ? 'new-password' : 'current-password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={[
                  'w-full pl-4 pr-12 py-3 font-body-md text-body-md text-white',
                  'border outline-none transition-all duration-200',
                  'placeholder:text-white/30 bg-white/10 backdrop-blur-sm',
                  'focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]',
                  errors.password ? 'border-red-400' : 'border-white/20 focus:border-white/60',
                ].join(' ')}
              />
              <button
                type="button" onClick={() => setVerPass(!verPass)} tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                style={{ minHeight: 'unset', minWidth: 'unset' }}
              >
                {verPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="font-caption text-caption text-red-400 mt-1">{errors.password}</p>}
            {tab === 'registro' && <PasswordStrength password={password} />}
          </div>

          {/* Confirmar contraseña */}
          {tab === 'registro' && (
            <div>
              <label htmlFor="password2" className="block font-label-md text-[11px] uppercase tracking-widest text-white/60 mb-1.5">
                Repetir contraseña
              </label>
              <div className="relative">
                <input
                  id="password2"
                  type={verPass2 ? 'text' : 'password'}
                  placeholder="Repetí tu contraseña"
                  autoComplete="new-password"
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                  className={[
                    'w-full pl-4 pr-12 py-3 font-body-md text-body-md text-white',
                    'border outline-none transition-all duration-200',
                    'placeholder:text-white/30 bg-white/10 backdrop-blur-sm',
                    'focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]',
                    errors.password2 ? 'border-red-400' : 'border-white/20 focus:border-white/60',
                  ].join(' ')}
                />
                <button
                  type="button" onClick={() => setVerPass2(!verPass2)} tabIndex={-1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  style={{ minHeight: 'unset', minWidth: 'unset' }}
                >
                  {verPass2 ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password2 && <p className="font-caption text-caption text-red-400 mt-1">{errors.password2}</p>}
            </div>
          )}

          {/* Newsletter */}
          {tab === 'registro' && (
            <label className="flex items-start gap-3 cursor-pointer select-none mt-0.5">
              <div className="relative mt-0.5 flex-shrink-0">
                <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} className="sr-only" />
                <div className={['w-4 h-4 border flex items-center justify-center transition-colors duration-150',
                  newsletter ? 'bg-white border-white' : 'bg-white/10 border-white/30'].join(' ')}>
                  {newsletter && (
                    <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                      <path d="M1 3.5L3.5 6L9 1" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="square"/>
                    </svg>
                  )}
                </div>
              </div>
              <span className="font-body-md text-[12px] text-white/50 leading-snug">
                Quiero recibir novedades y descuentos exclusivos
              </span>
            </label>
          )}

          {/* Error general */}
          {errors.general && (
            <p className="font-caption text-caption text-red-400 text-center">{errors.general}</p>
          )}

          {/* Éxito */}
          {exito && (
            <div className="flex flex-col items-center gap-2 py-3 text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e' }}>✓</div>
              <p className="font-label-md text-[12px] text-white">{exito}</p>
            </div>
          )}

          {/* Submit */}
          {!exito && (
            <button
              type="submit"
              disabled={loading || loadingG}
              className="w-full py-4 mt-1 bg-white text-onyx-black font-label-md text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-platinum-grey transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <Loader2 size={16} className="animate-spin" />
                : tab === 'login' ? 'Ingresar' : 'Crear mi cuenta'
              }
            </button>
          )}
        </form>

        {/* Switch tabs */}
        <p className="font-body-md text-[12px] text-white/40 text-center mt-5">
          {tab === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button
            onClick={() => switchTab(tab === 'login' ? 'registro' : 'login')}
            className="text-white/80 underline hover:text-white transition-colors"
            style={{ minHeight: 'unset', minWidth: 'unset', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {tab === 'login' ? 'Crear una gratis' : 'Iniciá sesión'}
          </button>
        </p>

        {/* Términos */}
        <p className="font-caption text-[10px] text-white/30 text-center mt-5 pt-4 border-t border-white/10 leading-relaxed">
          Al continuar aceptás nuestros{' '}
          <Link href="/terminos" className="underline hover:text-white/60 transition-colors">Términos de uso</Link>
          {' '}y{' '}
          <Link href="/privacidad" className="underline hover:text-white/60 transition-colors">Política de privacidad</Link>.
        </p>
      </div>

      {/* ── MODAL RECUPERAR CONTRASEÑA ── */}
      {showForgot && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[380px] mx-4 p-8"
            style={{
              background: 'rgba(10,10,10,0.92)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(24px)',
              animation: 'fadeUp .3s ease both',
            }}
          >
            <button
              onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              style={{ minHeight: 'unset', minWidth: 'unset', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>

            {forgotSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-4"
                  style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e' }}>✓</div>
                <h2 className="font-headline-lg text-white text-[20px] font-light mb-2">Email enviado</h2>
                <p className="font-body-md text-[13px] text-white/50">
                  Revisá tu bandeja de entrada y seguí las instrucciones.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-headline-lg text-white text-[20px] font-light mb-2">Recuperar contraseña</h2>
                <p className="font-body-md text-[13px] text-white/50 mb-6">
                  Te enviaremos un link para restablecer tu contraseña.
                </p>
                <form onSubmit={handleForgot} className="flex flex-col gap-4">
                  <Field
                    label="Email de tu cuenta" id="forgot-email" type="email"
                    placeholder="tu@email.com" autoComplete="email"
                    value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={loadingForgot || !forgotEmail.trim()}
                    className="w-full py-4 bg-white text-onyx-black font-label-md text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-platinum-grey transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingForgot ? <Loader2 size={16} className="animate-spin" /> : 'Enviar link'}
                  </button>
                </form>
              </>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.85)} }
        @keyframes fadeUp {
          from { opacity:0; transform:translate(-50%,calc(-50% + 16px)); }
          to   { opacity:1; transform:translate(-50%,-50%); }
        }
      `}</style>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}