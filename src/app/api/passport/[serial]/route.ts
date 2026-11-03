import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { serial: string } }
) {
  try {
    const { serial } = params;

    const passport = await prisma.productPassport.findUnique({
      where: { serialNumber: serial.toUpperCase() },
      include: {
        product: {
          select: {
            name: true,
            slug: true,
            heroImage: true,
            polymerType: true,
            isMonomaterial: true,
            pfasFree: true,
            hydrostaticMm: true,
            mvtrRating: true,
          },
        },
        tradeIns: {
          orderBy: { requestedAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!passport) {
      return NextResponse.json(
        { success: false, error: 'Product Passport not found for this serial number' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: passport,
    });
  } catch (error) {
    console.error('Error querying Product Passport:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify Product Passport' },
      { status: 500 }
    );
  }
}
