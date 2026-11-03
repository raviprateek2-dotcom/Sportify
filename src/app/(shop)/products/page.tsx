import { prisma } from '@/lib/prisma';
import { FALLBACK_PRODUCTS } from '@/lib/constants';
import { ProductCard } from '@/components/shop/product-card';
import { ProductCategory, Prisma } from '@prisma/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    monomaterial?: string;
    sort?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const currentCategory = searchParams.category as ProductCategory | undefined;
  const isMonomaterial = searchParams.monomaterial === 'true';
  const sort = searchParams.sort || 'newest';

  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (currentCategory && Object.values(ProductCategory).includes(currentCategory)) {
    where.category = currentCategory;
  }

  if (isMonomaterial) {
    where.isMonomaterial = true;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { basePrice: 'asc' };
  if (sort === 'price_desc') orderBy = { basePrice: 'desc' };
  if (sort === 'weight_asc') orderBy = { weightGrams: 'asc' };

  let products = FALLBACK_PRODUCTS;

  try {
    const dbProducts = await prisma.product.findMany({
      where,
      orderBy,
    });
    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts as unknown as typeof FALLBACK_PRODUCTS;
    }
  } catch {
    // Database initializing or offline - filter fallback products in memory
    let filtered = [...FALLBACK_PRODUCTS];
    if (currentCategory) {
      filtered = filtered.filter((p) => p.category === currentCategory);
    }
    if (isMonomaterial) {
      filtered = filtered.filter((p) => p.isMonomaterial);
    }
    products = filtered;
  }

  const categories = [
    { label: 'All Systems', value: '' },
    { label: 'Shells & Storm', value: 'SHELLS' },
    { label: 'Aerobic Midlayers', value: 'MID_LAYERS' },
    { label: 'Trail Bottoms', value: 'BOTTOMS' },
  ];

  return (
    <div className="bg-brand-black text-brand-white min-h-screen py-12 font-mono">
      <div className="container">
        {/* Header & Category Tabs */}
        <div className="border-b border-border pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs text-brand-orange uppercase font-bold tracking-widest">
                // TECHNICAL CATALOG
              </p>
              <h1 className="text-3xl sm:text-4xl font-black uppercase text-white mt-1">
                Active Endurance Systems
              </h1>
              <p className="text-xs text-zinc-400 mt-2">
                All garments engineered with zero PFAS and monomaterial closed-loop chemistry.
              </p>
            </div>
            <div className="text-xs text-zinc-500">
              SHOWING <span className="text-white font-bold">{products.length}</span> SPECIFIED ITEMS
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-4 border-t border-border/40">
            <div className="flex flex-wrap gap-2 text-xs">
              {categories.map((cat) => {
                const isActive = (currentCategory || '') === cat.value;
                const href = cat.value
                  ? `/products?category=${cat.value}${isMonomaterial ? '&monomaterial=true' : ''}`
                  : `/products${isMonomaterial ? '?monomaterial=true' : ''}`;

                return (
                  <Link
                    key={cat.label}
                    href={href}
                    className={cn(
                      'px-3 py-1.5 border transition-colors uppercase',
                      isActive
                        ? 'bg-brand-orange text-white border-brand-orange font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    )}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </div>

            {/* Quick Toggle for Monomaterial Only */}
            <div className="flex items-center gap-3 text-xs">
              <Link
                href={
                  isMonomaterial
                    ? `/products${currentCategory ? `?category=${currentCategory}` : ''}`
                    : `/products?monomaterial=true${currentCategory ? `&category=${currentCategory}` : ''}`
                }
                className={cn(
                  'px-3 py-1.5 border flex items-center gap-1.5 transition-colors',
                  isMonomaterial
                    ? 'border-brand-lime text-brand-lime bg-lime-950/40'
                    : 'border-zinc-800 text-zinc-400 hover:text-white'
                )}
              >
                <span>●</span> 100% Monomaterial Only
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-zinc-800">
            <Filter className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm uppercase text-zinc-400">No technical garments match this filter criteria.</p>
            <Link href="/products" className="text-xs text-brand-orange underline mt-3 inline-block">
              Reset all filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                category={product.category}
                basePrice={Number(product.basePrice)}
                heroImage={product.heroImage}
                weightGrams={product.weightGrams}
                hydrostaticMm={product.hydrostaticMm}
                mvtrRating={product.mvtrRating}
                isMonomaterial={product.isMonomaterial}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
