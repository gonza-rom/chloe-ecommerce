// src/app/productos/layout.js

export const metadata = {
  title:       'Catálogo — Chloe Showroom',
  description: 'Explorá nuestra colección de moda femenina. Vestidos, tops, camperas, jeans y más. Envíos a todo el país desde Catamarca.',
  keywords:    'chloe showroom, moda femenina, vestidos, tops, camperas, jeans, catamarca, ropa mujer',
  openGraph: {
    title:       'Catálogo — Chloe Showroom',
    description: 'Moda femenina con siluetas atemporales y acabados de alta costura. Envíos a todo el país.',
    type:        'website',
    locale:      'es_AR',
    siteName:    'Chloe Showroom',
    images: [{
      url:    '/logo.jpg',
      width:  800,
      height: 800,
      alt:    'Chloe Showroom — Catálogo',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Catálogo — Chloe Showroom',
    description: 'Moda femenina con siluetas atemporales. Envíos a todo el país.',
    images:      ['/logo.jpg'],
  },
};

export default function ProductosLayout({ children }) {
  return children;
}