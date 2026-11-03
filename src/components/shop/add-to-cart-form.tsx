'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/use-cart-store';
import { ShoppingBag, Check, ShieldCheck, Scale } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

export interface VariantData {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  additionalPrice: number | string;
  stockQuantity: number;
}

export interface AddToCartFormProps {
  productId: string;
  name: string;
  slug: string;
  basePrice: number;
  weightGrams: number;
  heroImage: string;
  variants: VariantData[];
}

export function AddToCartForm({
  productId,
  name,
  slug,
  basePrice,
  weightGrams,
  heroImage,
  variants,
}: AddToCartFormProps) {
  const [selectedVariantId, setSelectedVariantId] = React.useState<string>(
    variants[0]?.id || ''
  );
  const [isAdded, setIsAdded] = React.useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];

  // Distinct colors and sizes
  const colors = Array.from(new Set(variants.map((v) => v.color)));
  const sizes = Array.from(new Set(variants.map((v) => v.size)));

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const finalPrice =
      basePrice + Number(selectedVariant.additionalPrice || 0);

    addItem({
      variantId: selectedVariant.id,
      productId,
      name,
      slug,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: finalPrice,
      image: heroImage,
      weightGrams,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* 1. COLOR SELECTION */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 uppercase">COLOR SPEC</span>
          <span className="text-white font-bold">{selectedVariant?.color}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map((colorName) => {
            const vForColor = variants.find((v) => v.color === colorName);
            const isSelected = selectedVariant?.color === colorName;

            return (
              <button
                key={colorName}
                type="button"
                onClick={() => {
                  if (vForColor) setSelectedVariantId(vForColor.id);
                }}
                className={cn(
                  'px-3 py-2 border transition-all text-left flex items-center gap-2',
                  isSelected
                    ? 'border-brand-orange bg-zinc-900 text-white font-bold'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                )}
              >
                <span
                  className="w-3 h-3 rounded-full border border-zinc-700"
                  style={{ backgroundColor: vForColor?.colorHex || '#18181b' }}
                />
                <span>{colorName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SIZE SELECTION */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 uppercase">ATHLETIC FIT SIZING</span>
          <button className="text-[10px] text-brand-orange underline">
            3D Biometric Size Guide
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((sizeName) => {
            const vForSize = variants.find(
              (v) =>
                v.size === sizeName &&
                v.color === (selectedVariant?.color || variants[0]?.color)
            );
            const isSelected = selectedVariant?.size === sizeName;
            const isOutOfStock = !vForSize || vForSize.stockQuantity <= 0;

            return (
              <button
                key={sizeName}
                type="button"
                disabled={isOutOfStock}
                onClick={() => {
                  if (vForSize) setSelectedVariantId(vForSize.id);
                }}
                className={cn(
                  'py-2.5 border text-center font-bold uppercase transition-all',
                  isSelected
                    ? 'border-brand-orange bg-brand-orange text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700',
                  isOutOfStock && 'opacity-40 cursor-not-allowed line-through'
                )}
              >
                {sizeName}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. STOCK & PACK WEIGHT STATUS */}
      <div className="flex justify-between items-center p-3 bg-zinc-950 border border-zinc-800 text-[11px]">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              (selectedVariant?.stockQuantity || 0) > 10
                ? 'bg-brand-lime'
                : 'bg-brand-orange animate-pulse'
            )}
          />
          <span className="text-zinc-300">
            {(selectedVariant?.stockQuantity || 0) > 0
              ? `${selectedVariant?.stockQuantity} Units In Stock (Bi-Coastal 3PL)`
              : 'Backorder Queue (45-Day Postponement Cycle)'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400">
          <Scale className="w-3.5 h-3.5" />
          <span>{weightGrams}g</span>
        </div>
      </div>

      {/* 4. ADD TO CART CTA */}
      <Button
        size="lg"
        onClick={handleAddToCart}
        disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
        className={cn(
          'w-full gap-2 font-bold uppercase tracking-wider text-xs h-12',
          isAdded && 'bg-brand-lime hover:bg-lime-600 text-black'
        )}
      >
        {isAdded ? (
          <>
            <Check className="w-4 h-4" /> Added to Kit Bag
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" /> Add System to Kit Bag —{' '}
            {formatPrice(basePrice + Number(selectedVariant?.additionalPrice || 0))}
          </>
        )}
      </Button>

      {/* Trust reassurance */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-lime" />
        <span>Pre-registered Digital Product Passport & $110 Buyback Eligible</span>
      </div>
    </div>
  );
}
