'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/use-cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  Lock,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [form, setForm] = React.useState({
    email: 'runner@trail.org',
    name: 'Elena Rostova',
    phone: '+1-801-555-0144',
    street: '1420 Mountain View Trail',
    city: 'Boulder',
    state: 'CO',
    postalCode: '80302',
    country: 'US',
    paymentMethod: 'CARD',
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [confirmedOrder, setConfirmedOrder] = React.useState<{
    orderNumber: string;
    total: number;
    trackingNumber: string;
  } | null>(null);

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 200 || subtotal === 0 ? 0 : 12;
  const tax = Number((subtotal * 0.0825).toFixed(2));
  const total = Number((subtotal + shippingFee + tax).toFixed(2));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Your kit bag is empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete checkout.');
      }

      setConfirmedOrder(data.data);
      clearCart();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="bg-brand-black text-brand-white min-h-[80vh] flex items-center justify-center py-16 font-mono">
        <div className="container max-w-lg p-8 bg-brand-graphite border border-brand-lime text-center space-y-6">
          <div className="w-12 h-12 bg-lime-950/80 border border-brand-lime rounded-full flex items-center justify-center mx-auto text-brand-lime">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <Badge variant="lime" className="mb-2">
              DISPATCH ORDER CREATED
            </Badge>
            <h1 className="text-2xl font-black uppercase text-white">
              Order Confirmed: {confirmedOrder.orderNumber}
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              Fulfillment routed to domestic 3PL node. Click-to-ship SLA &lt; 12 hours.
            </p>
          </div>

          <div className="p-4 bg-black border border-zinc-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500">CARRIER TRACKING:</span>
              <span className="text-white font-bold">{confirmedOrder.trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">TOTAL CHARGED:</span>
              <span className="text-brand-lime font-bold">{formatPrice(confirmedOrder.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">DPP NFC STATUS:</span>
              <span className="text-white">Serialized & Registered</span>
            </div>
          </div>

          <Link href="/products" className="w-full block">
            <Button variant="default" size="lg" className="w-full font-bold uppercase text-xs">
              Return to Technical Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-black text-brand-white min-h-screen py-12 font-mono">
      <div className="container max-w-5xl">
        <div className="border-b border-border pb-6 mb-8 flex justify-between items-center">
          <div>
            <Badge variant="orange" className="mb-1 text-[10px]">
              256-BIT ENCRYPTED
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white">
              Express Checkout
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Lock className="w-3.5 h-3.5 text-brand-lime" />
            <span>PCI-DSS Level 1</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: SHIPPING & PAYMENT (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Customer Contact */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  01 // Customer Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-zinc-400 block mb-1">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Full Name</label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-zinc-400 block mb-1">Mobile Phone (Delivery SMS)</label>
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  02 // 3PL Destination Node
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="text-zinc-400 block mb-1">Street Address</label>
                    <Input
                      name="street"
                      value={form.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">City</label>
                    <Input
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">State / Province</label>
                    <Input
                      name="state"
                      value={form.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Postal Code</label>
                    <Input
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Country</label>
                    <Input
                      name="country"
                      value={form.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  03 // Payment Settlement
                </h2>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'CARD', label: 'Credit / Debit Card' },
                    { id: 'KLARNA', label: 'Klarna Pay Later' },
                    { id: 'APPLE_PAY', label: 'Apple Pay' },
                    { id: 'PAYPAL', label: 'PayPal' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: p.id })}
                      className={`p-3 border text-left font-bold transition-colors ${
                        form.paymentMethod === p.id
                          ? 'border-brand-orange bg-zinc-900 text-white'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY (5 cols) */}
            <div className="lg:col-span-5">
              <div className="p-6 bg-brand-graphite border border-border sticky top-24 space-y-6 text-xs">
                <h3 className="font-bold uppercase text-white tracking-wider border-b border-zinc-800 pb-3">
                  Kit Bag Summary ({items.length} items)
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3 text-xs">
                      <div className="relative w-12 h-16 bg-zinc-900 border border-zinc-800 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex justify-between">
                        <div>
                          <p className="font-bold text-white text-[11px] line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-zinc-400">Size: {item.size} • Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-white text-[11px]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t border-zinc-800 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>3PL Freight</span>
                    <span className={shippingFee === 0 ? 'text-brand-lime font-bold' : ''}>
                      {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Estimated Sales Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                    <span>Total Due</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || items.length === 0}
                  className="w-full font-bold uppercase text-xs h-12"
                >
                  {loading ? 'Authorizing Dispatch...' : `Authorize Payment (${formatPrice(total)})`}
                </Button>

                <div className="text-[10px] text-zinc-500 text-center space-y-1">
                  <p>✓ Automated Scope 3 carbon offset included</p>
                  <p>✓ 14-day zero-friction returns & exchanges</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
