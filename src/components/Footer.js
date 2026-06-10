'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Truck, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-onyx-black text-white">

      {/* ── Main grid ── */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-16 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

        {/* Marca */}
        <div className="flex flex-col gap-6">
          <div className="relative h-14 w-40">
            <Image
              src="/logo-white-remove.png"
              alt="CHLOE SHOWROOM"
              fill
              className="object-contain object-left"
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="flex items-start gap-2 font-body-md text-[14px] text-white/50">
              <MapPin size={16} className="shrink-0 mt-0.5" />
              Alpatauca 870, San Fernando del Valle de Catamarca
            </p>
            <p className="flex items-start gap-2 font-body-md text-[14px] text-white/50">
              <Clock size={16} className="shrink-0 mt-0.5" />
              Lun-Vie 18-22h &nbsp;·&nbsp; Sáb 10-13h &amp; 18-22h
            </p>
            <p className="flex items-start gap-2 font-body-md text-[14px] text-white/50">
              <Truck size={16} className="shrink-0 mt-0.5" />
              Realizamos Envíos a todo el país
            </p>
          </div>
        </div>

        {/* Navegación */}
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h5 className="font-label-md text-label-md uppercase tracking-widest text-white/40">
              Colecciones
            </h5>
            <ul className="flex flex-col gap-2">
              {['City Icons', 'Archive Editions', 'Night Collection'].map((item) => (
                <li key={item}>
                  <Link href="#" className="font-body-md text-[14px] text-white/60 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="font-label-md text-label-md uppercase tracking-widest text-white/40">
              Ayuda
            </h5>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'Contacto',  href: '/contacto' },
                { label: 'Cambios',   href: '#' },
                { label: 'Políticas', href: '#' },
                { label: 'Nosotros',  href: '/nosotros' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="font-body-md text-[14px] text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-6 md:items-end">
          <div className="flex flex-col gap-3">
            <h5 className="font-label-md text-label-md uppercase tracking-widest text-white/40">
              Seguinos
            </h5>
            <a
              href="https://www.instagram.com/_chloe.showroom/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-body-md text-[14px] text-white/60 hover:text-white transition-colors"
            >
              <Instagram size={16} />
              @_chloe.showroom
            </a>
          </div>

          {/* Medios de pago mini */}
          <div className="flex flex-col gap-3 md:items-end">
            <h5 className="font-label-md text-label-md uppercase tracking-widest text-white/40">
              Medios de Pago
            </h5>
            <div className="flex flex-wrap gap-2">
              {['Visa', 'Mastercard', 'Naranja X', 'Débito'].map((m) => (
                <span key={m} className="border border-white/20 px-3 py-1 font-label-md text-[10px] uppercase tracking-wider text-white/50">
                  {m}
                </span>
              ))}
            </div>
            <p className="font-caption text-[11px] text-white/30 uppercase tracking-wider">
              3 cuotas sin interés
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-5 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-caption text-[11px] text-white/30 uppercase tracking-wider">
            © {new Date().getFullYear()} CHLOE SHOWROOM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4 font-caption text-[11px] text-white/30 uppercase tracking-wider">
            <Link href="#" className="hover:text-white/60 transition-colors">Envíos y cambios</Link>
            <span>·</span>
            <Link href="#" className="hover:text-white/60 transition-colors">Políticas</Link>
          </div>
        </div>
      </div>  
    </footer>
  );
}