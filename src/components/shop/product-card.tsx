import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Droplets, Wind, Scale } from 'lucide-react';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  category: string;
  basePrice: number;
  heroImage: string;
  weightGrams: number;
  hydrostaticMm?: number | null;
  mvtrRating?: number | null;
  isMonomaterial: boolean;
}

export function ProductCard({
  name,
  slug,
  category,
  basePrice,
  heroImage,
  weightGrams,
  hydrostaticMm,
  mvtrRating,
  isMonomaterial,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group block bg-brand-graphite border border-border/80 hover:border-brand-orange transition-all duration-200 overflow-hidden font-mono"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden">
        <Image
          src={heroImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Technical Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {hydrostaticMm && (
            <Badge variant="tech" className="text-[10px] bg-black/80 backdrop-blur-sm gap-1">
              <Droplets className="w-3 h-3 text-brand-cyan" />
              {hydrostaticMm.toLocaleString()}mm
            </Badge>
          )}
          {isMonomaterial && (
            <Badge variant="lime" className="text-[10px] bg-black/80 backdrop-blur-sm">
              Monomaterial
            </Badge>
          )}
        </div>

        <div className="absolute top-2 right-2 z-10">
          <Badge variant="tech" className="text-[10px] bg-black/80 backdrop-blur-sm gap-1">
            <Scale className="w-3 h-3 text-zinc-400" />
            {weightGrams}g
          </Badge>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {category.replace('_', ' ')}
          </span>
          <span className="text-xs font-bold text-brand-white">
            {formatPrice(basePrice)}
          </span>
        </div>

        <h3 className="text-sm font-bold text-foreground group-hover:text-brand-orange transition-colors line-clamp-1">
          {name}
        </h3>

        {/* Tech Micro-Spec Line */}
        <div className="flex items-center gap-3 pt-2 border-t border-border/60 text-[10px] text-zinc-400">
          {mvtrRating && (
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-brand-orange" />
              {mvtrRating.toLocaleString()} MVTR
            </span>
          )}
          <span className="text-zinc-600">•</span>
          <span className="text-brand-lime">ZERO PFAS</span>
        </div>
      </div>
    </Link>
  );
}
