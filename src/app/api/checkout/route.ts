import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkoutSchema } from '@/lib/validations/checkout.schema';
import { PaymentStatus, OrderStatus, PaymentMethod } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 }
      );
    }

    const {
      email,
      name,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      paymentMethod,
      items,
    } = validation.data;

    // Execute atomic transaction for inventory lock and order placement
    const order = await prisma.$transaction(async (tx) => {
      // 1. Fetch and lock variants to verify real-time stock and prices
      const variantIds = items.map((i) => i.variantId);
      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true },
      });

      if (variants.length !== items.length) {
        throw new Error('One or more selected items no longer exist.');
      }

      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const variant = variants.find((v) => v.id === item.variantId);
        if (!variant) throw new Error(`Variant not found: ${item.variantId}`);

        if (variant.stockQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for ${variant.product.name} (${variant.size} - ${variant.color}). Available: ${variant.stockQuantity}`
          );
        }

        const unitPrice =
          Number(variant.product.basePrice) + Number(variant.additionalPrice);
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        orderItemsData.push({
          variantId: variant.id,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });

        // Decrement stock
        await tx.productVariant.update({
          where: { id: variant.id },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 2. Shipping calculation ($0 if subtotal >= $200, else $12)
      const shippingFee = subtotal >= 200 ? 0 : 12.0;
      const tax = Number((subtotal * 0.0825).toFixed(2)); // Estimated 8.25%
      const total = Number((subtotal + shippingFee + tax).toFixed(2));

      // 3. Find or create guest / registered user
      let user = await tx.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            email: email.toLowerCase(),
            name,
            phone,
          },
        });
      }

      // 4. Create shipping address
      const address = await tx.address.create({
        data: {
          userId: user.id,
          street,
          city,
          state,
          postalCode,
          country,
        },
      });

      // 5. Generate unique trackable order number (e.g. ORD-2026-X8491)
      const orderNumber = `ORD-${new Date().getFullYear()}-${Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()}`;

      // 6. Create Order and items
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          shippingAddressId: address.id,
          status: OrderStatus.PROCESSING,
          paymentStatus: PaymentStatus.PAID,
          paymentMethod: paymentMethod as PaymentMethod,
          subtotal,
          shippingFee,
          tax,
          total,
          currency: 'USD',
          trackingNumber: `3PL-US-${Math.floor(100000000 + Math.random() * 900000000)}`,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
          shippingAddress: true,
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        trackingNumber: order.trackingNumber,
        status: order.status,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Checkout error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Transaction could not be completed' },
      { status: 400 }
    );
  }
}
