import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { FALLBACK_PRODUCTS } from '@/lib/constants';
import { ProductCard } from '@/components/shop/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Droplets,
  Wind,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  let featuredProducts = FALLBACK_PRODUCTS;

  try {
    const dbProducts = await prisma.product.findMany({
      where: { isPublished: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });
    if (dbProducts && dbProducts.length > 0) {
      featuredProducts = dbProducts as unknown as typeof FALLBACK_PRODUCTS;
    }
  } catch {
    // Database initializing or offline during build - fallback cleanly
    featuredProducts = FALLBACK_PRODUCTS;
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-brand-white font-mono">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center border-b border-border overflow-hidden tech-spec-grid">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=2000"
            alt="Alpine Ridgeline Trail Running"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent" />
        </div>

        <div className="container relative z-10 py-24 flex flex-col items-start max-w-4xl space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="orange" className="text-xs">
              SERIES 2026 // MONOMATERIAL
            </Badge>
            <Badge variant="lime" className="text-xs">
              ZERO PERSISTENT CHEMICALS
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
            ENGINEERED <br />
            <span className="text-brand-orange">FOR RADICAL</span> <br />
            MOUNTAIN PURITY.
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed">
            Monomaterial technical endurance apparel engineered with our proprietary bio-polymer waterproof membrane.
            Zero PFAS. 25,000mm hydrostatic protection. 100% circular chemical recyclability.
          </p>

          {/* Metric Bar */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/80 w-full max-w-lg text-left">
            <div>
              <p className="text-2xl font-black text-brand-cyan">25,000</p>
              <p className="text-[10px] text-zinc-400 uppercase">Hydrostatic (mm)</p>
            </div>
            <div>
              <p className="text-2xl font-black text-brand-orange">35,000</p>
              <p className="text-[10px] text-zinc-400 uppercase">MVTR Breathability</p>
            </div>
            <div>
              <p className="text-2xl font-black text-brand-lime">178g</p>
              <p className="text-[10px] text-zinc-400 uppercase">Apex Shell Weight</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/products">
              <Button size="lg" className="gap-2 font-bold uppercase tracking-wider text-xs">
                Explore Technical Systems <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/kit-builder">
              <Button variant="tech" size="lg" className="gap-2 text-xs">
                <Compass className="w-4 h-4 text-brand-orange" />
                Mandatory Ultra Kit Builder
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE THREE ENGINEERING PILLARS */}
      <section className="py-20 border-b border-border bg-zinc-950">
        <div className="container">
          <div className="max-w-xl mb-12">
            <p className="text-xs text-brand-orange uppercase font-bold tracking-widest">
              // ARCHITECTURAL MOATS
            </p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
              No Virgin Synthetics. No Petrochemical Residue.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-brand-graphite border border-border/80 space-y-4">
              <Droplets className="w-8 h-8 text-brand-cyan" />
              <h3 className="text-base font-bold text-white uppercase">
                Zero PFAS Membrane
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Hydrophilic, non-porous bio-polymer matrix delivers impenetrable weatherproofing without forever chemicals (PFAS/PTFE). Completely compliant with California AB 1817 and EU ESPR regulations.
              </p>
            </div>

            <div className="p-6 bg-brand-graphite border border-border/80 space-y-4">
              <Wind className="w-8 h-8 text-brand-orange" />
              <h3 className="text-base font-bold text-white uppercase">
                Aerobic Moisture Vapor
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Solid-state molecular diffusion transports moisture vapor at 35,000 g/m²/24h without micropores that clog with sweat salts, maintaining dry comfort at high aerobic output.
              </p>
            </div>

            <div className="p-6 bg-brand-graphite border border-border/80 space-y-4">
              <ShieldCheck className="w-8 h-8 text-brand-lime" />
              <h3 className="text-base font-bold text-white uppercase">
                Monomaterial Closed-Loop
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Face fabric, membrane, tape, and zips share identical polymer chemistry. Post-consumer garments de-polymerize into virgin-grade feedstock via continuous glycolysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED APEX COLLECTION */}
      <section className="py-20 border-b border-border">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 gap-4">
            <div>
              <p className="text-xs text-brand-orange uppercase font-bold tracking-widest">
                // ACTIVE INVENTORY
              </p>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                Apex Endurance Collection
              </h2>
            </div>
            <Link href="/products" className="text-xs font-bold uppercase text-brand-orange hover:underline flex items-center gap-1">
              View All 30 Systems <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                category={product.category}
                basePrice={Number(product.basePrice)}
                heroImage={product.heroImage}
                weightGrams={product.weightGrams}
                hydrostaticMm={product.hydrostaticMm}
                mvtrRating={product.mvtrRating}
                isMonomaterial={product.isMonomaterial}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. DIGITAL PRODUCT PASSPORT (DPP) CALLOUT */}
      <section className="py-20 bg-zinc-950">
        <div className="container">
          <div className="p-8 sm:p-12 border border-brand-surface bg-brand-graphite/50 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl z-10">
              <Badge variant="lime" className="gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                CIRCULAR BUYBACK GUARANTEE
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                Trace Every Gram. <br />
                Unlock Guaranteed Buyback.
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every Sportify garment carries an embedded passive NFC tag linking to its Digital Product Passport. Verify supply chain Tier 1–4 provenance, audit Scope 3 carbon footprint, and trade in your garment for up to $110 in store credit.
              </p>
              <div className="pt-2">
                <Link href="/passport/SPFY-2026-APEX-008492">
                  <Button variant="default" size="md" className="gap-2 font-bold text-xs uppercase">
                    Scan Sample Passport: APEX-008492 <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="w-full max-w-sm p-6 bg-black border border-zinc-800 font-mono text-xs space-y-3 z-10">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">SERIAL NO.</span>
                <span className="text-brand-orange font-bold">SPFY-2026-APEX-008492</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500">TIER 1 ORIGIN</span>
                <span className="text-white">Porto, Portugal</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500">CARBON FOOTPRINT</span>
                <span className="text-brand-lime font-bold">4.12 kg CO2e</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500">CURRENT BUYBACK</span>
                <span className="text-white font-bold">$110.00 USD</span>
              </div>
              <div className="pt-2 text-[10px] text-zinc-500 text-center border-t border-zinc-800">
                EU DPP & ESPR COMPLIANT
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
