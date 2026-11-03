import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { tradeInRequestSchema } from '@/lib/validations/passport.schema';
import { PassportStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = tradeInRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { serialNumber, email, declaredCondition } = validation.data;

    // Verify passport exists
    const passport = await prisma.productPassport.findUnique({
      where: { serialNumber: serialNumber.toUpperCase() },
      include: { product: true },
    });

    if (!passport) {
      return NextResponse.json(
        { success: false, error: 'Product Passport does not exist for this garment' },
        { status: 404 }
      );
    }

    if (passport.status === PassportStatus.TRADE_IN_REQUESTED) {
      return NextResponse.json(
        { success: false, error: 'A trade-in request is already pending for this garment.' },
        { status: 409 }
      );
    }

    // Find or create customer
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name: email.split('@')[0],
        },
      });
    }

    // Condition multiplier on guaranteed buyback
    const multipliers: Record<string, number> = {
      MINT: 1.0,
      EXCELLENT: 0.9,
      GOOD: 0.75,
      END_OF_LIFE: 0.35, // Recycled feedstock credit
    };

    const multiplier = multipliers[declaredCondition] || 0.75;
    const estimatedCredit = Number(
      (Number(passport.guaranteedBuybackUSD) * multiplier).toFixed(2)
    );

    const trackingCode = `RMA-RET-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Execute atomic update
    const record = await prisma.$transaction(async (tx) => {
      const tradeIn = await tx.tradeInRecord.create({
        data: {
          passportId: passport.id,
          userId: user.id,
          estimatedCredit,
          trackingCode,
          status: 'PENDING_FACILITY_INSPECTION',
        },
      });

      await tx.productPassport.update({
        where: { id: passport.id },
        data: {
          status: PassportStatus.TRADE_IN_REQUESTED,
        },
      });

      return tradeIn;
    });

    return NextResponse.json({
      success: true,
      data: {
        tradeInId: record.id,
        trackingCode: record.trackingCode,
        estimatedCredit: record.estimatedCredit,
        garmentName: passport.product.name,
        instructions:
          'Affix the generated return QR code to any standard envelope. Drop off at any regional 3PL partner or USPS location. Credit will be deposited to your wallet immediately upon carrier scan.',
      },
    });
  } catch (error) {
    console.error('Trade-in request failure:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process trade-in submission' },
      { status: 500 }
    );
  }
}
