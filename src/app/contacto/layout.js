// src/app/contacto/layout.js

export const metadata = {
  title:       'Contacto — Chloe Showroom',
  description: 'Contactate con Chloe Showroom. WhatsApp, Instagram y showroom en Alpatauca 870, San Fernando del Valle de Catamarca.',
  keywords:    'chloe showroom contacto, whatsapp chloe showroom, showroom catamarca, instagram chloe showroom',
  openGraph: {
    title:       'Contacto — Chloe Showroom',
    description: 'Escribinos por WhatsApp o visitanos en Alpatauca 870, Catamarca.',
    type:        'website',
    locale:      'es_AR',
    siteName:    'Chloe Showroom',
    images: [{
      url:    '/logo.jpg',
      width:  800,
      height: 800,
      alt:    'Chloe Showroom',
    }],
  },
  twitter: {
    card:        'summary',
    title:       'Contacto — Chloe Showroom',
    description: 'Escribinos por WhatsApp o visitanos en Alpatauca 870, Catamarca.',
    images:      ['/logo.jpg'],
  },
};

export default function ContactoLayout({ children }) {
  return children;
}