// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) {
      console.error('No orderId in payment intent metadata');
      return;
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PROCESSING',
        paymentStatus: 'CAPTURED',
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
        },
      },
    });

    // Reduce stock for each variant
    for (const item of order.items) {
      // Find the variant that was ordered
      const variant = item.product.variants.find((v) =>
        order.notes?.includes(v.sku)
      );

      if (variant) {
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    // TODO: Send order confirmation email
    console.log(`Order ${order.orderNumber} payment succeeded`);

    // TODO: Trigger fulfillment process
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) {
      console.error('No orderId in payment intent metadata');
      return;
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        paymentStatus: 'FAILED',
      },
    });

    console.log(`Order ${orderId} payment failed`);

    // TODO: Send payment failure email
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleRefund(charge: Stripe.Charge) {
  try {
    const paymentIntent = charge.payment_intent as string;

    // Find order by payment intent
    const order = await prisma.order.findFirst({
      where: {
        notes: {
          contains: paymentIntent,
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      console.error('Order not found for refund');
      return;
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED',
      },
    });

    // Restore stock
    for (const item of order.items) {
      const variant = item.product.variants.find((v) =>
        order.notes?.includes(v.sku)
      );

      if (variant) {
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    console.log(`Order ${order.orderNumber} refunded`);

    // TODO: Send refund confirmation email
  } catch (error) {
    console.error('Error handling refund:', error);
  }
}
