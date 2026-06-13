import { Karla, Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import ConditionalWhatsApp from '@/components/ConditionalWhatsApp';
import ConditionalFooter from '@/components/ConditionalFooter';

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.chloeshowroom.com.ar'),
  title: 'Chloe Showroom | Moda Femenina en Catamarca · City Icons',
  description: 'Showroom de moda femenina en Catamarca. Descubrí las últimas tendencias y recibí tu pedido en todo el país. Envíos rápidos y seguros.',
  openGraph: {
    title: 'Chloe Showroom | Moda Femenina · City Icons',
    description: 'Showroom de moda femenina en Catamarca. Descubrí las últimas tendencias y recibí tu pedido en todo el país. Envíos rápidos y seguros.',
    url: 'https://www.chloeshowroom.com.ar',
    siteName: 'Chloe Showroom',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Chloe Showroom · Moda Femenina Catamarca',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chloe Showroom | Moda Femenina · City Icons',
    description: 'Showroom de moda femenina en Catamarca. Descubrí las últimas tendencias y recibí tu pedido en todo el país.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-AR" className={`${karla.variable} ${hanken.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <CartProvider>
          <ConditionalNavbar />
          {children}
          <ConditionalFooter />
          <ConditionalWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}