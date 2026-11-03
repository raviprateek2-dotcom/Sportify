import Link from 'next/link';
import { ShieldCheck, RotateCcw, Droplets, Wind } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-brand-black text-brand-white font-mono">
      {/* Technical Feature Trust Banners */}
      <div className="border-b border-border/60 py-8">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="flex items-center gap-3">
            <Droplets className="w-5 h-5 text-brand-cyan" />
            <div>
              <p className="font-bold uppercase tracking-wider text-foreground">25,000mm Waterproof</p>
              <p className="text-muted-foreground text-[11px]">Zero PFAS or Fluorine</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wind className="w-5 h-5 text-brand-orange" />
            <div>
              <p className="font-bold uppercase tracking-wider text-foreground">35,000 g/m² MVTR</p>
              <p className="text-muted-foreground text-[11px]">Ultra-High Aerobic Breathability</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-brand-lime" />
            <div>
              <p className="font-bold uppercase tracking-wider text-foreground">Monomaterial Circular</p>
              <p className="text-muted-foreground text-[11px]">100% Chemical Recyclability</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-bold uppercase tracking-wider text-foreground">Guaranteed Buyback</p>
              <p className="text-muted-foreground text-[11px]">Digital Product Passport Enforced</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Sitemap */}
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        <div>
          <span className="font-mono text-lg font-black tracking-tighter text-white uppercase">
            SPORTIFY<span className="text-brand-orange text-xs font-normal">.LABS</span>
          </span>
          <p className="mt-3 text-muted-foreground leading-relaxed text-[11px]">
            Engineering zero-compromise, monomaterial technical endurance systems for alpine and ultra-trail athletes. Born in Boulder & Keswick.
          </p>
          <p className="mt-4 text-[10px] text-zinc-500">
            COMPLIANT: California AB 1817 • EU ESPR • UTMB Mandatory Kit
          </p>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider text-white mb-3">Technical Systems</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/products?category=SHELLS" className="hover:text-brand-orange">Storm Shells & Outerwear</Link></li>
            <li><Link href="/products?category=MID_LAYERS" className="hover:text-brand-orange">Aerobic Mid-Layers</Link></li>
            <li><Link href="/products?category=BOTTOMS" className="hover:text-brand-orange">Strider Shorts & Tights</Link></li>
            <li><Link href="/kit-builder" className="hover:text-brand-orange text-brand-orange">Mandatory Ultra Kit Builder</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider text-white mb-3">Circularity & Trace</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/passport" className="hover:text-brand-lime">Digital Product Passport</Link></li>
            <li><Link href="/passport/SPFY-2026-APEX-008492" className="hover:text-brand-lime">Sample Garment Batch Trace</Link></li>
            <li><Link href="/passport" className="hover:text-brand-lime">Request Trade-In Credit</Link></li>
            <li><Link href="/technology" className="hover:text-brand-lime">Glycolysis De-Polymerization</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider text-white mb-3">Global Hubs</h4>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            Fulfillment via bi-coastal US (PA & NV) and UK Midlands nodes. Sub-48h dispatch with localized reverse logistics.
          </p>
          <div className="mt-4 p-3 bg-zinc-900 border border-zinc-800 text-[10px]">
            <span className="text-brand-lime">● SYSTEMS ONLINE</span>
            <span className="text-zinc-500 block mt-0.5">Global Edge P95: 38ms</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 py-6 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} SPORTIFY LABS INC. ALL RIGHTS RESERVED. MONOMATERIAL PERFORMANCE SYSTEMS.
      </div>
    </footer>
  );
}
