'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('admin@sportify.com');
  const [password, setPassword] = React.useState('Sportify2026!');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid credentials. Check your email and password.');
      setLoading(false);
    } else {
      router.push('/products');
      router.refresh();
    }
  };

  return (
    <div className="bg-brand-black text-brand-white min-h-[85vh] flex items-center justify-center py-16 font-mono">
      <div className="container max-w-md">
        <div className="p-8 bg-brand-graphite border border-border shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <Badge variant="orange" className="mb-1 text-[10px]">
              AUTHENTICATED ACCESS
            </Badge>
            <h1 className="text-2xl font-black uppercase text-white tracking-tight">
              Sign In to Sportify
            </h1>
            <p className="text-xs text-zinc-400">
              Access your saved race kits, order tracking, and registered passports.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black border-zinc-800"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black border-zinc-800"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full font-bold uppercase text-xs h-11"
            >
              {loading ? 'Authenticating...' : 'Sign In with Credentials'}
            </Button>
          </form>

          {/* Quick Pre-filled Credentials for Testing */}
          <div className="pt-4 border-t border-zinc-800 text-[11px] space-y-2">
            <p className="text-zinc-500 uppercase tracking-widest text-[10px]">
              Pre-Configured Test Accounts:
            </p>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@sportify.com');
                  setPassword('Sportify2026!');
                }}
                className="p-2 bg-black border border-zinc-800 text-left hover:border-brand-orange transition-colors flex justify-between"
              >
                <span className="text-brand-orange font-bold">Admin: admin@sportify.com</span>
                <span className="text-zinc-500">Sportify2026!</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('runner@trail.org');
                  setPassword('Sportify2026!');
                }}
                className="p-2 bg-black border border-zinc-800 text-left hover:border-brand-lime transition-colors flex justify-between"
              >
                <span className="text-brand-lime font-bold">Athlete: runner@trail.org</span>
                <span className="text-zinc-500">Sportify2026!</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
