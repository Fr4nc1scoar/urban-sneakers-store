import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alberto Shoes Collection | Calzado Urbano y Exclusivo a Crédito',
  description: 'Catálogo oficial de zapatos y sneakers de las mejores marcas: Nike, Jordan, Adidas, New Balance, Alexander McQueen y más. Compra de contado o llévatelo a crédito en cómodas cuotas quincenales.',
  keywords: ['zapatos', 'sneakers', 'nike', 'jordan', 'adidas', 'calzado a credito', 'venezuela'],
  openGraph: {
    title: 'Alberto Shoes Collection | Calzado Urbano Exclusivo',
    description: 'Catálogo en línea actualizado diariamente. Compra directa por WhatsApp y facilidades de pago en cuotas quincenales.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#08090d] text-slate-100 antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
