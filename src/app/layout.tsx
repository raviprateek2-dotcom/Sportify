import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/shop/cart-drawer';

export const metadata: Metadata = {
  title: 'SPORTIFY LABS | High-Performance Circular Activewear & Mountain Systems',
  description:
    'Monomaterial closed-loop technical running and mountain endurance systems. Zero PFAS, 25k mm waterproof protection, and verifiable Digital Product Passports.',
  keywords: [
    'technical activewear',
    'trail running jacket',
    'pfas free waterproof',
    'circular outdoor apparel',
    'UTMB mandatory gear',
    'monomaterial polyester',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-brand-black text-brand-white flex flex-col font-sans antialiased selection:bg-brand-orange selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
