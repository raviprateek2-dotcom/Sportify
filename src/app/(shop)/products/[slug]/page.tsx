import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { AddToCartForm } from '@/components/shop/add-to-cart-form';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { FALLBACK_PRODUCTS } from '@/lib/constants';
import {
  Droplets,
  Wind,
  ShieldCheck,
  Scale,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = params;

  let product: any = null;

  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          orderBy: { size: 'asc' },
        },
        reviews: {
          include: { user: { select: { name: true } } },
        },
      },
    });
  } catch {
    // Database connection fallback
    const fallbackMatch = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    if (fallbackMatch) {
      product = {
        ...fallbackMatch,
        variants: [
          { id: `${fallbackMatch.id}-s`, sku: `${fallbackMatch.slug}-s`, size: 'S', color: 'Granite Black', colorHex: '#18181b', additionalPrice: 0, stockQuantity: 25 },
          { id: `${fallbackMatch.id}-m`, sku: `${fallbackMatch.slug}-m`, size: 'M', color: 'Granite Black', colorHex: '#18181b', additionalPrice: 0, stockQuantity: 50 },
          { id: `${fallbackMatch.id}-l`, sku: `${fallbackMatch.slug}-l`, size: 'L', color: 'Granite Black', colorHex: '#18181b', additionalPrice: 0, stockQuantity: 30 },
        ],
        reviews: [],
      };
    }
  }

  if (!product) {
    notFound();
  }

  const variantsData = (product.variants || []).map((v: any) => ({
    id: v.id,
    sku: v.sku,
    size: v.size,
    color: v.color,
    colorHex: v.colorHex,
    additionalPrice: Number(v.additionalPrice),
    stockQuantity: v.stockQuantity,
  }));

  return (
    <div className="bg-brand-black text-brand-white min-h-screen py-12 font-mono">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: IMAGE GALLERY (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/5] bg-zinc-950 border border-border overflow-hidden">
              <Image
                src={product.heroImage}
                alt={product.name}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.hydrostaticMm && (
                  <Badge variant="tech" className="gap-1 bg-black/80 backdrop-blur-sm">
                    <Droplets className="w-3.5 h-3.5 text-brand-cyan" />
                    {product.hydrostaticMm.toLocaleString()}mm Hydrostatic
                  </Badge>
                )}
                {product.isMonomaterial && (
                  <Badge variant="lime" className="bg-black/80 backdrop-blur-sm">
                    100% Monomaterial Circular
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Array */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images?.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="relative aspect-square border border-zinc-800 bg-zinc-950 overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} detail ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: SPECS, ADD TO CART & COMPLIANCE (5 COLS) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex justify-between items-center text-xs text-muted-foreground uppercase tracking-widest mb-1">
                <span>{product.category.replace('_', ' ')}</span>
                <span className="text-brand-orange font-bold">IN PRODUCTION</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                {product.name}
              </h1>
              <p className="text-xl font-bold text-white mt-2">
                {formatPrice(Number(product.basePrice))}
              </p>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {product.description}
            </p>

            {/* Technical Specifications Table */}
            <div className="border border-border bg-zinc-950 p-4 space-y-3">
              <p className="text-[10px] text-brand-orange uppercase font-bold tracking-widest">
                // CERTIFIED TECHNICAL SPECIFICATIONS
              </p>
              <div className="grid grid-cols-2 gap-y-3 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px]">HYDROSTATIC HEAD</span>
                  <span className="text-white font-bold">
                    {product.hydrostaticMm ? `${product.hydrostaticMm.toLocaleString()} mm` : 'N/A (Air-Permeable)'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">BREATHABILITY (MVTR)</span>
                  <span className="text-white font-bold">
                    {product.mvtrRating ? `${product.mvtrRating.toLocaleString()} g/m²/24h` : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">TOTAL WEIGHT (SIZE M)</span>
                  <span className="text-white font-bold">{product.weightGrams} grams</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">CHEMICAL COMPOSITION</span>
                  <span className="text-brand-lime font-bold">Zero PFAS / C0 DWR</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">POLYMER MATRIX</span>
                  <span className="text-zinc-200 text-[11px]">{product.polymerType}</span>
                </div>
              </div>
            </div>

            {/* Add to Cart Form */}
            <AddToCartForm
              productId={product.id}
              name={product.name}
              slug={product.slug}
              basePrice={Number(product.basePrice)}
              weightGrams={product.weightGrams}
              heroImage={product.heroImage}
              variants={variantsData}
            />

            {/* Mandatory Gear Regulatory Clearance */}
            <div className="p-4 border border-zinc-800 bg-brand-graphite text-xs space-y-2">
              <div className="flex items-center gap-2 text-brand-lime font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>RACE COMPLIANCE CLEARANCE</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Meets and exceeds mandatory equipment kit regulations for:
              </p>
              <ul className="grid grid-cols-2 gap-1 text-[10px] text-zinc-300">
                <li>• UTMB Mont-Blanc (100M)</li>
                <li>• Western States 100</li>
                <li>• Hardrock 100</li>
                <li>• Tor des Géants 330K</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
