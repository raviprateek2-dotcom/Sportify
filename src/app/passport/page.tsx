'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Search, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PassportSearchPage() {
  const router = useRouter();
  const [serial, setSerial] = React.useState('');
  const [error, setError] = React.useState('');

  const sampleSerials = ['SPFY-2026-APEX-008492', 'SPFY-2026-APEX-008493'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim()) {
      setError('Please input or scan a garment serial number.');
      return;
    }
    router.push(`/passport/${serial.trim().toUpperCase()}`);
  };

  return (
    <div className="bg-brand-black text-brand-white min-h-screen py-16 font-mono">
      <div className="container max-w-3xl">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="lime" className="gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            EU ESPR & DPP DECENTRALIZED PROTOCOL
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Digital Product Passport
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Enter the unique serial number found on your internal garment NFC tag to audit Tier 1–4 supply chain origin, verified carbon footprint, and unlock guaranteed buyback value.
          </p>
        </div>

        {/* Search Card */}
        <div className="p-8 bg-brand-graphite border border-border shadow-2xl space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-zinc-300">
                Garment Serial Number / NFC Identifier
              </label>
              <div className="flex gap-2">
                <Input
                  value={serial}
                  onChange={(e) => {
                    setSerial(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. SPFY-2026-APEX-008492"
                  className="bg-black border-zinc-800 text-sm font-bold text-white uppercase"
                />
                <Button type="submit" variant="default" className="gap-2 px-6">
                  <Search className="w-4 h-4" /> Verify
                </Button>
              </div>
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </div>
          </form>

          {/* Quick Click Samples */}
          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Or inspect verified active production batches:
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleSerials.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => router.push(`/passport/${sample}`)}
                  className="px-3 py-1.5 bg-black border border-zinc-800 text-xs text-brand-orange hover:border-brand-orange transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-brand-lime" />
                  <span>{sample}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Information Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-xs">
          <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="text-brand-orange font-bold uppercase block text-[10px]">
              01 // PROVENANCE
            </span>
            <h4 className="text-white font-bold">Audited Tier 1-4</h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Every facility from agricultural bio-feedstock to ultrasonic garment assembly is permanently certified.
            </p>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="text-brand-lime font-bold uppercase block text-[10px]">
              02 // CIRCULAR BUYBACK
            </span>
            <h4 className="text-white font-bold">Guaranteed Store Credit</h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Trade in your shell at any point for 35–100% of guaranteed residual credit towards your next kit.
            </p>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="text-brand-cyan font-bold uppercase block text-[10px]">
              03 // CHEMICAL RECYCLING
            </span>
            <h4 className="text-white font-bold">Zero Landfill Fate</h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Returned monomaterials are de-polymerized via chemical glycolysis into virgin-grade resin pellets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
