// src/app/api/checkout/create-payment-intent/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      items,
      shippingAddress,
      billingAddress,
      email,
      phone,
      shippingMethodId,
      totals,
    } = body;

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate all required fields
    if (!shippingAddress || !email || !phone || !totals) {
      return NextResponse.json(
        { error: 'Missing required information' },
        { status: 400 }
      );
    }

    // Fetch variant details from database to validate prices and stock
    const variantIds = items.map((item: any) => item.variantId);
    const variants = await prisma.productVariant.findMany({
      where: {
        id: { in: variantIds },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            isActive: true,
          },
        },
      },
    });

    // Validate stock and prices
    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variantId);

      if (!variant) {
        return NextResponse.json(
          { error: `Variant ${item.variantId} not found` },
          { status: 400 }
        );
      }

      if (!variant.product.isActive) {
        return NextResponse.json(
          { error: `Product ${variant.product.name} is no longer available` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${variant.product.name}. Only ${variant.stock} available`,
          },
          { status: 400 }
        );
      }

      // Verify price matches
      const expectedPrice = variant.price || variant.product.price;
      if (Math.abs(expectedPrice - item.price) > 0.01) {
        return NextResponse.json(
          { error: `Price mismatch for ${variant.product.name}` },
          { status: 400 }
        );
      }
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)
      .toUpperCase()}`;

    // Create order in database with PENDING status
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        totalAmount: totals.total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          street: shippingAddress.street,
          apartment: shippingAddress.apartment || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: 'US',
        },
        billingAddress: billingAddress || shippingAddress,
        items: {
          create: items.map((item: any) => {
            const variant = variants.find((v) => v.id === item.variantId)!;
            return {
              productId: variant.product.id,
              quantity: item.quantity,
              price: item.price,
              name: variant.product.name,
              image: variant.product.images[0] || null,
            };
          }),
        },
      },
      include: {
        items: true,
      },
    });

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totals.total * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: session.user.id,
        shippingMethodId,
      },
      description: `Order ${orderNumber}`,
      receipt_email: email,
      shipping: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        phone: phone,
        address: {
          line1: shippingAddress.street,
          line2: shippingAddress.apartment || undefined,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zipCode,
          country: 'US',
        },
      },
    });

    // Update order with Stripe payment intent ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        notes: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          shippingMethodId,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          tax: totals.tax,
        }),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
