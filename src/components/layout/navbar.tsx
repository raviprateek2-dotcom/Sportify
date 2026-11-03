'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, ShieldCheck, Menu, X, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/use-cart-store';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);

  const navLinks = [
    { name: 'Apparel & Gear', href: '/products' },
    { name: 'Race Kit Builder', href: '/kit-builder', highlight: true },
    { name: 'Digital Passport', href: '/passport' },
    { name: 'Technology & ESG', href: '/technology' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-mono text-xl font-black tracking-tighter text-foreground uppercase group-hover:text-brand-orange transition-colors">
              SPORTIFY<span className="text-brand-orange text-xs font-normal">.LABS</span>
            </span>
            <Badge variant="lime" className="hidden sm:inline-flex text-[10px] py-0 px-1.5">
              100% CIRCULAR
            </Badge>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-xs font-mono uppercase tracking-wider transition-colors hover:text-brand-orange',
                    isActive ? 'text-brand-orange font-bold' : 'text-muted-foreground',
                    link.highlight && 'text-brand-orange flex items-center gap-1'
                  )}
                >
                  {link.highlight && <Compass className="w-3.5 h-3.5" />}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link href="/passport" className="hidden sm:flex">
            <Button variant="tech" size="sm" className="gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-lime" />
              <span>Verify DPP</span>
            </Button>
          </Link>

          {/* Cart Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={openCart}
            className="relative font-mono text-xs gap-2 border-border/80 hover:border-brand-orange"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-foreground" />
            <span className="hidden sm:inline">CART</span>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center bg-brand-orange text-white text-[10px] font-bold px-1.5 py-0.2 rounded-none">
                {totalItems}
              </span>
            )}
          </Button>

          {/* Mobile Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background p-6 space-y-4">
          <div className="flex flex-col space-y-3 font-mono text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-muted-foreground hover:text-brand-orange uppercase tracking-wider border-b border-border/40"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/passport"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-brand-lime uppercase tracking-wider flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify Garment Passport
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
