'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export interface TradeInClientModalProps {
  serialNumber: string;
  guaranteedBuyback: number;
  currentStatus: string;
  existingRMA?: string | null;
}

export function TradeInClientModal({
  serialNumber,
  guaranteedBuyback,
  currentStatus,
  existingRMA,
}: TradeInClientModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [condition, setCondition] = React.useState<'MINT' | 'EXCELLENT' | 'GOOD' | 'END_OF_LIFE'>('EXCELLENT');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{
    trackingCode: string;
    estimatedCredit: number;
    instructions: string;
  } | null>(null);
  const [error, setError] = React.useState('');

  const multipliers = {
    MINT: 1.0,
    EXCELLENT: 0.9,
    GOOD: 0.75,
    END_OF_LIFE: 0.35,
  };

  const estimatedValue = guaranteedBuyback * multipliers[condition];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your account email to receive store credit.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/trade-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serialNumber,
          email,
          declaredCondition: condition,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit trade-in request.');
      }

      setResult(data.data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === 'TRADE_IN_REQUESTED' || existingRMA) {
    return (
      <div className="p-3 bg-zinc-900 border border-brand-lime text-xs text-brand-lime flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        <span>Trade-In Active (RMA: {existingRMA || 'INSPECTION_PENDING'})</span>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="default"
        size="md"
        onClick={() => setIsOpen(true)}
        className="gap-2 font-bold uppercase text-xs"
      >
        <RotateCcw className="w-4 h-4" /> Claim Circular Credit
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg bg-brand-black border border-border p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-brand-orange" />
                <h3 className="text-sm font-bold uppercase text-white">
                  Circular Take-Back Submission
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {result ? (
              <div className="space-y-4 text-xs py-2">
                <div className="p-4 bg-lime-950/40 border border-brand-lime text-brand-lime space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>TRADE-IN AUTHORIZED</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    RMA Tracking Identifier: <strong className="text-white">{result.trackingCode}</strong>
                  </p>
                  <p className="text-[11px] text-zinc-300">
                    Authorized Credit: <strong className="text-white">{formatPrice(result.estimatedCredit)}</strong>
                  </p>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {result.instructions}
                </p>
                <Button
                  variant="tech"
                  size="md"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Close & Print Prepaid Mailer
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1">REGISTERED EMAIL</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="runner@trail.org"
                    className="bg-zinc-950 border-zinc-800 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">GARMENT CONDITION</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'MINT', label: 'Mint / As New (100%)' },
                      { id: 'EXCELLENT', label: 'Excellent / Normal Wear (90%)' },
                      { id: 'GOOD', label: 'Good / High Mileage (75%)' },
                      { id: 'END_OF_LIFE', label: 'End of Life / Recyclable (35%)' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCondition(opt.id as 'MINT' | 'EXCELLENT' | 'GOOD' | 'END_OF_LIFE')}
                        className={`p-2.5 border text-left text-[11px] transition-colors ${
                          condition === opt.id
                            ? 'border-brand-orange bg-zinc-900 text-white font-bold'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-500">ESTIMATED STORE CREDIT:</span>
                  <span className="text-sm font-bold text-brand-lime">
                    {formatPrice(estimatedValue)}
                  </span>
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <Button
                  type="submit"
                  size="md"
                  disabled={loading}
                  className="w-full font-bold uppercase text-xs"
                >
                  {loading ? 'Generating RMA...' : 'Generate Prepaid 3PL Return Mailer'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
