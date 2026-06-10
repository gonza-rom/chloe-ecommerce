'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';
import Cart from './Cart';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '';

// ── Threshold con histéresis ──────────────────────────────────────────────────
// Scroll hacia ABAJO: se activa a los 60px
// Scroll hacia ARRIBA: se desactiva a los 40px
// Esa diferencia de 20px evita el loop cuando el navbar cambia de tamaño
// y mueve el scroll exactamente al valor del threshold.
const SCROLL_DOWN_THRESHOLD = 60;
const SCROLL_UP_THRESHOLD   = 40;

export default function Navbar() {
  const [menuAbierto,     setMenuAbierto]     = useState(false);
  const [userMenuAbierto, setUserMenuAbierto] = useState(false);
  const [user,            setUser]            = useState(null);
  const [loadingUser,     setLoadingUser]     = useState(true);
  const [scrolled,        setScrolled]        = useState(false);

  const { toggleCart, getItemCount } = useCart();
  const itemCount   = getItemCount();
  const userMenuRef = useRef(null);
  const supabase    = useMemo(() => createClient(), []);

  const links = [
    { href: '/',         label: 'Inicio'   },
    { href: '/productos', label: 'Catálogo' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/nosotros', label: 'Nosotros' },
  ];

  // ── Scroll con histéresis ─────────────────────────────────────────────────
  useEffect(() => {
    // Usamos una ref para leer el estado actual dentro del listener
    // sin necesidad de re-registrar el evento cada render.
    const scrolledRef = { current: false };

    function handleScroll() {
      const y = window.scrollY;

      if (!scrolledRef.current && y > SCROLL_DOWN_THRESHOLD) {
        // Estaba sin scroll → ahora con scroll
        scrolledRef.current = true;
        setScrolled(true);
      } else if (scrolledRef.current && y < SCROLL_UP_THRESHOLD) {
        // Estaba con scroll → ahora sin scroll
        scrolledRef.current = false;
        setScrolled(false);
      }
      // Si está en la zona intermedia (40–60px) no hace nada → no hay loop
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // sin dependencias → se registra una sola vez

  // ── Auth ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoadingUser(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  // ── Cerrar user menu al click afuera ─────────────────────────────────────
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuAbierto(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserMenuAbierto(false);
    window.location.href = '/';
  }

  const esAdmin = user?.email === ADMIN_EMAIL;
  const nombre  = user?.user_metadata?.nombre ?? user?.email?.split('@')[0] ?? 'Mi cuenta';

  return (
    <>
      {/* ── Promo Ticker ── */}
      <div className="bg-primary text-white overflow-hidden py-2 border-b border-platinum-grey">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-[11px] tracking-[0.2em] uppercase px-12 font-label-md">
              CITY ICONS ⋆˙⟡ new collection &nbsp;·&nbsp; 20% OFF con transferencia &nbsp;·&nbsp; 3 cuotas sin interés &nbsp;·&nbsp; Envíos a todo el país proximamente
            </span>
          ))}
        </div>
      </div>

      {/* ── Navbar ── */}
      <header
        className="bg-white sticky top-0 z-50 border-b border-[#E5E5E5]"
        style={{
          boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.07)' : 'none',
          // Transición SOLO en box-shadow, nunca en padding ni tamaño
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <div
          className="flex justify-between items-center px-5 md:px-16 w-full max-w-[1280px] mx-auto"
          style={{
            paddingTop:    scrolled ? 12 : 16,
            paddingBottom: scrolled ? 12 : 16,
            // Transición SOLO en padding, separada del resto
            transition: 'padding-top 0.25s ease, padding-bottom 0.25s ease',
          }}
        >
          {/* ── Izquierda ── */}
          <div className="flex-1 hidden md:flex items-center gap-6">
            {links.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary"
                style={{ transition: 'color 0.2s ease' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Logo centro ── */}
          <div className="flex-none text-center">
            <Link href="/">
              <div
                className="relative mx-auto"
                style={{
                  // Cambia dimensiones con transición suave independiente
                  height: scrolled ? 40  : 48,
                  width:  scrolled ? 112 : 128,
                  transition: 'height 0.25s ease, width 0.25s ease',
                }}
              >
                <Image
                  src="/logo.jpg"
                  alt="CHLOE SHOWROOM"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* ── Derecha ── */}
          <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-6 mr-4">
              {links.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary"
                  style={{ transition: 'color 0.2s ease' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 md:gap-4">

              {/* Usuario */}
              {!loadingUser && (
                user ? (
                  <div ref={userMenuRef} className="relative">
                    <button
                      onClick={() => setUserMenuAbierto(!userMenuAbierto)}
                      className="flex items-center gap-1 text-primary hover:opacity-60"
                      style={{ transition: 'opacity 0.2s ease', minHeight: 'unset', minWidth: 'unset' }}
                      aria-label="Mi cuenta"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                        <User size={13} color="#fff" />
                      </div>
                      <ChevronDown size={11} className="hidden md:block text-on-surface-variant" />
                    </button>

                    {userMenuAbierto && (
                      <div className="absolute right-0 top-[calc(100%+10px)] bg-white border border-platinum-grey shadow-xl min-w-[200px] z-50">
                        <div className="px-4 py-3 border-b border-platinum-grey">
                          <p className="font-label-md text-[13px] text-primary truncate max-w-[160px]">{nombre}</p>
                          <p className="font-caption text-[11px] text-on-surface-variant truncate max-w-[160px]">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link href="/cuenta" onClick={() => setUserMenuAbierto(false)}
                            className="flex items-center gap-2 px-4 py-2.5 font-body-md text-[13px] text-on-surface-variant hover:bg-surface-container-low transition-colors">
                            <User size={14} /> Mi cuenta
                          </Link>
                          {esAdmin && (
                            <Link href="/admin" onClick={() => setUserMenuAbierto(false)}
                              className="flex items-center gap-2 px-4 py-2.5 font-label-md text-[13px] font-bold text-primary hover:bg-surface-container-low transition-colors">
                              <LayoutDashboard size={14} /> Panel Admin
                            </Link>
                          )}
                        </div>
                        <div className="py-1 border-t border-platinum-grey">
                          <button onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 font-body-md text-[13px] text-red-500 hover:bg-red-50 w-full text-left"
                            style={{ transition: 'background-color 0.2s ease', minHeight: 'unset' }}>
                            <LogOut size={14} /> Cerrar sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/login"
                    className="hidden md:flex items-center gap-1.5 font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary"
                    style={{ transition: 'color 0.2s ease', minHeight: 'unset' }}>
                    <User size={15} />
                  </Link>
                )
              )}

              {/* Carrito */}
              <button
                onClick={toggleCart}
                className="relative text-primary hover:opacity-60"
                style={{ transition: 'opacity 0.2s ease', minHeight: 'unset', minWidth: 'unset' }}
                aria-label="Carrito"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none cart-badge">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Hamburguesa */}
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="md:hidden text-primary hover:opacity-60"
                style={{ transition: 'opacity 0.2s ease', minHeight: 'unset', minWidth: 'unset' }}
                aria-label="Menú"
              >
                {menuAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Menú mobile ── */}
        {menuAbierto && (
          <div className="md:hidden bg-white border-t border-[#E5E5E5]">
            <div className="px-5 py-4 flex flex-col gap-0">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuAbierto(false)}
                  className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary py-3 border-b border-platinum-grey"
                  style={{ transition: 'color 0.2s ease' }}
                >
                  {link.label}
                </Link>
              ))}

              {!loadingUser && (
                user ? (
                  <>
                    <Link href="/cuenta" onClick={() => setMenuAbierto(false)}
                      className="flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary py-3 border-b border-platinum-grey"
                      style={{ transition: 'color 0.2s ease' }}>
                      <User size={14} /> Mi cuenta
                    </Link>
                    {esAdmin && (
                      <Link href="/admin" onClick={() => setMenuAbierto(false)}
                        className="flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-primary font-bold py-3 border-b border-platinum-grey">
                        <LayoutDashboard size={14} /> Panel Admin
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-red-400 py-3 w-full text-left"
                      style={{ minHeight: 'unset' }}>
                      <LogOut size={14} /> Cerrar sesión
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login" onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary py-3"
                    style={{ transition: 'color 0.2s ease' }}>
                    <User size={14} /> Iniciar sesión
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </header>

      <Cart />
    </>
  );
}