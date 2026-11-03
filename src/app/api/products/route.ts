import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductCategory, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category') as ProductCategory | null;
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minHydrostatic = searchParams.get('minHydrostatic');
    const minMvtr = searchParams.get('minMvtr');
    const monomaterialOnly = searchParams.get('monomaterial') === 'true';
    const sort = searchParams.get('sort') || 'createdAt_desc';

    const where: Prisma.ProductWhereInput = {
      isPublished: true,
    };

    if (category && Object.values(ProductCategory).includes(category)) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
    }

    if (minHydrostatic) {
      where.hydrostaticMm = { gte: parseInt(minHydrostatic, 10) };
    }

    if (minMvtr) {
      where.mvtrRating = { gte: parseInt(minMvtr, 10) };
    }

    if (monomaterialOnly) {
      where.isMonomaterial = true;
    }

    // Sort order definition
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { basePrice: 'asc' };
    if (sort === 'price_desc') orderBy = { basePrice: 'desc' };
    if (sort === 'weight_asc') orderBy = { weightGrams: 'asc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        variants: {
          select: {
            id: true,
            sku: true,
            size: true,
            color: true,
            colorHex: true,
            stockQuantity: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve products' },
      { status: 500 }
    );
  }
}
