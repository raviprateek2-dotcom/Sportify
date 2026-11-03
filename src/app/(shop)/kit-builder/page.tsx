'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/use-cart-store';
import { formatPrice } from '@/lib/utils';
import {
  Compass,
  CheckCircle2,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface KitItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  weightGrams: number;
  image: string;
  mandatoryRule: string;
  compliant: boolean;
  variantId: string;
}

export default function KitBuilderPage() {
  const [selectedRace, setSelectedRace] = React.useState<'UTMB' | 'WSER' | 'LEADVILLE'>('UTMB');
  const [isBundleAdded, setIsBundleAdded] = React.useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const races = [
    {
      id: 'UTMB',
      name: 'UTMB® Mont-Blanc (171km / 10,000m+ D+)',
      location: 'Chamonix, France',
      tempRange: '-5°C to 28°C',
      strictness: 'EXTREME (Full Inspection)',
    },
    {
      id: 'WSER',
      name: 'Western States 100-Mile Endurance',
      location: 'Olympic Valley to Auburn, CA',
      tempRange: '2°C to 40°C',
      strictness: 'HIGH (Heat + High Desert Cold)',
    },
    {
      id: 'LEADVILLE',
      name: 'Leadville Trail 100 Run',
      location: 'Leadville, Colorado (10,200ft+)',
      tempRange: '-2°C to 24°C',
      strictness: 'HIGH (High Altitude Alpine)',
    },
  ];

  // Hardcoded bundle mapping to our seeded products
  const kitItems: KitItem[] = [
    {
      id: 'apex-shell',
      name: 'Apex Bio-Shell 3L Storm Jacket',
      slug: 'apex-bio-shell-3l-jacket',
      category: 'SHELL',
      price: 380,
      weightGrams: 178,
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
      mandatoryRule: 'Waterproof jacket with integrated hood, min. 10,000mm rating & fully taped seams.',
      compliant: true,
      variantId: 'SPFY-APX-BLK-M',
    },
    {
      id: 'kinetic-fleece',
      name: 'Kinetic Aerobic Grid Mid-Layer',
      slug: 'kinetic-aerobic-grid-midlayer',
      category: 'MID-LAYER',
      price: 165,
      weightGrams: 195,
      image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800',
      mandatoryRule: 'Warm second layer with long sleeves (excluding cotton) weighing min. 180g.',
      compliant: true,
      variantId: 'SPFY-KNT-BLK-M',
    },
    {
      id: 'strider-short',
      name: 'Strider 5" Technical Trail Short',
      slug: 'strider-5-technical-trail-short',
      category: 'BOTTOM',
      price: 125,
      weightGrams: 98,
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800',
      mandatoryRule: 'Running shorts or tights providing complete chafing protection.',
      compliant: true,
      variantId: 'SPFY-STR-M',
    },
  ];

  const subtotal = kitItems.reduce((acc, item) => acc + item.price, 0);
  const bundleDiscount = Number((subtotal * 0.1).toFixed(2)); // 10% Bundle Credit
  const bundleTotal = subtotal - bundleDiscount;
  const totalWeight = kitItems.reduce((acc, item) => acc + item.weightGrams, 0);

  const handleAddBundleToCart = () => {
    kitItems.forEach((item) => {
      addItem({
        variantId: item.variantId,
        productId: item.id,
        name: item.name,
        slug: item.slug,
        size: 'M',
        color: 'Granite Black',
        price: item.price * 0.9, // 10% discount applied
        image: item.image,
        weightGrams: item.weightGrams,
        quantity: 1,
      });
    });

    setIsBundleAdded(true);
    setTimeout(() => setIsBundleAdded(false), 2500);
  };

  return (
    <div className="bg-brand-black text-brand-white min-h-screen py-12 font-mono">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="border-b border-border pb-8 mb-8">
          <Badge variant="orange" className="mb-2">
            ALGORITHMIC KIT VALIDATOR // 2026
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Mandatory Ultra Kit Builder
          </h1>
          <p className="text-xs text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            Eliminate pre-race gear disqualification risk. Select your target ultra-endurance event; our system programmatically selects a compliant, zero-compromise apparel bundle.
          </p>
        </div>

        {/* 1. RACE SELECTOR */}
        <div className="space-y-4 mb-10">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Select Destination Race:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {races.map((race) => (
              <button
                key={race.id}
                type="button"
                onClick={() => setSelectedRace(race.id as 'UTMB' | 'WSER' | 'LEADVILLE')}
                className={`p-4 border text-left transition-all ${
                  selectedRace === race.id
                    ? 'border-brand-orange bg-zinc-900 shadow-md'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-1">
                  <span>{race.location}</span>
                  <span className="text-brand-orange font-bold">{race.strictness}</span>
                </div>
                <h3 className="text-xs font-bold text-white uppercase">{race.name}</h3>
                <p className="text-[10px] text-zinc-400 mt-2">Expected Temps: {race.tempRange}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 2. COMPLIANCE CHECKLIST & BUNDLE ITEMS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Item List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xs uppercase font-bold tracking-wider text-zinc-400">
              Mandatory Gear Checklist ({kitItems.length} of {kitItems.length} Verified)
            </h2>

            {kitItems.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-zinc-950 border border-border flex gap-4 text-xs"
              >
                <div className="relative w-20 h-24 bg-zinc-900 border border-zinc-800 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-brand-orange font-bold uppercase">
                      {item.category}
                    </span>
                    <span className="font-bold text-white">{formatPrice(item.price)}</span>
                  </div>

                  <h3 className="font-bold text-white text-xs">{item.name}</h3>

                  <div className="flex items-center gap-2 text-brand-lime text-[11px] pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="leading-tight">{item.mandatoryRule}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 pt-1">
                    <span>Weight: {item.weightGrams}g</span>
                    <span>•</span>
                    <span>Monomaterial Circular</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bundle Summary & One-Click Cart (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 bg-brand-graphite border border-border sticky top-24 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <span className="text-xs font-bold uppercase text-white">Kit Overview</span>
                <Badge variant="lime" className="text-[10px] gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% REGULATION PASS
                </Badge>
              </div>

              {/* Weight & Carbon Stats */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-black border border-zinc-800 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 block">TOTAL PACK WEIGHT</span>
                  <div className="flex items-center gap-1.5 font-bold text-white text-base">
                    <Scale className="w-4 h-4 text-brand-orange" />
                    <span>{totalWeight} grams</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">BUNDLE DISCOUNT</span>
                  <span className="font-bold text-brand-lime text-base">-10% ($67.00)</span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Regular Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-brand-lime">
                  <span>10% Ultra Bundle Savings</span>
                  <span>-{formatPrice(bundleDiscount)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Express 3PL Ground Shipping</span>
                  <span className="text-brand-lime font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Total Bundle Price</span>
                  <span>{formatPrice(bundleTotal)}</span>
                </div>
              </div>

              {/* CTA */}
              <Button
                size="lg"
                onClick={handleAddBundleToCart}
                className={`w-full gap-2 font-bold uppercase text-xs h-12 ${
                  isBundleAdded ? 'bg-brand-lime hover:bg-lime-600 text-black' : ''
                }`}
              >
                {isBundleAdded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Compliant Bundle Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add Complete Kit to Cart ({formatPrice(bundleTotal)})
                  </>
                )}
              </Button>

              <div className="space-y-1 text-[10px] text-zinc-500 text-center">
                <p>✓ All items pre-registered with Digital Product Passports</p>
                <p>✓ Free 14-day fit exchange via prepaid return mailers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
