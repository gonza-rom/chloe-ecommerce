// src/app/nosotros/layout.js

export const metadata = {
  title:       'Nosotros — Chloe Showroom',
  description: 'Conocé la historia de Chloe Showroom. Boutique de moda femenina nacida en Catamarca, pensada para la mujer que transita la ciudad con estilo.',
  keywords:    'chloe showroom, quienes somos, historia, catamarca, moda femenina, boutique catamarca',
  openGraph: {
    title:       'Nosotros — Chloe Showroom',
    description: 'Boutique de moda femenina nacida en Catamarca. City Icons, Archive Editions & Night Collection.',
    type:        'website',
    locale:      'es_AR',
    siteName:    'Chloe Showroom',
    images: [{ url: '/logo.jpg', width: 800, height: 800, alt: 'Chloe Showroom' }],
  },
  twitter: {
    card:        'summary',
    title:       'Nosotros — Chloe Showroom',
    description: 'Boutique de moda femenina nacida en Catamarca. City Icons, Archive Editions & Night Collection.',
    images:      ['/logo.jpg'],
  },
};

export default function NosotrosLayout({ children }) {
  return children;
}