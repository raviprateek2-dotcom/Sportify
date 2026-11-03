'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ArrowRight, ShieldCheck, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/use-cart-store';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotalWeightGrams,
  } = useCartStore();

  const subtotal = getSubtotal();
  const totalWeight = getTotalWeightGrams();
  const freeShippingThreshold = 200;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Slide-over panel */}
      <div className="relative z-10 w-full max-w-md bg-brand-black border-l border-border h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-white">
              Kit Bag / Cart
            </h2>
            <span className="text-xs text-muted-foreground">({items.length} items)</span>
          </div>
          <button
            onClick={closeCart}
            className="p-1 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping & Pack Weight Bar */}
        <div className="bg-zinc-900/90 border-b border-border p-3 text-xs space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">
              {subtotal >= freeShippingThreshold ? (
                <span className="text-brand-lime font-bold">✓ Free Express 3PL Ground Unlocked</span>
              ) : (
                `Add ${formatPrice(freeShippingThreshold - subtotal)} for Free 3PL Shipping`
              )}
            </span>
            <div className="flex items-center gap-1 text-zinc-400">
              <Scale className="w-3.5 h-3.5" />
              <span>Pack: {totalWeight}g</span>
            </div>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 overflow-hidden">
            <div
              className="bg-brand-orange h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Your kit bag is empty.</p>
              <Button
                variant="tech"
                size="sm"
                className="mt-4"
                onClick={closeCart}
              >
                Browse Technical Shells
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-3 p-3 bg-zinc-900/60 border border-zinc-800/80 text-xs"
              >
                <div className="relative w-16 h-20 bg-zinc-950 flex-shrink-0 border border-zinc-800">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-brand-white text-xs leading-tight line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {item.color} • Size {item.size}
                    </p>
                    {item.weightGrams && (
                      <p className="text-[10px] text-zinc-500 font-mono">
                        Weight: {item.weightGrams}g
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center border border-zinc-700">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="px-2 py-0.5 text-zinc-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-zinc-200">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="px-2 py-0.5 text-zinc-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-zinc-950/90 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-brand-white font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated 3PL Freight</span>
                <span className="text-zinc-400">
                  {subtotal >= freeShippingThreshold ? 'FREE' : '$12.00'}
                </span>
              </div>
              <div className="flex justify-between text-brand-lime text-[11px] items-center pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Circular Buyback Guaranteed
                </span>
                <span>Active</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/checkout" onClick={closeCart} className="w-full block">
                <Button variant="default" size="lg" className="w-full gap-2 text-xs uppercase font-bold tracking-wider">
                  Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <p className="text-[10px] text-zinc-500 text-center">
              Encrypted 256-bit checkout • 14-day zero-friction returns
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
