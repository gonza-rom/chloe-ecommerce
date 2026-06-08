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
  title: 'Chloe Showroom | City Icons',
  description: 'Showroom de moda femenina en Catamarca. Envíos a todo el país.',
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