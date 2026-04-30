// // src/app/api/webhooks/stripe/route.ts
// import { NextResponse } from 'next/server';
// import { headers } from 'next/headers';
// import Stripe from 'stripe';
// import { prisma } from '@/lib/prisma';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-12-15.clover',
// });

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// export async function POST(request: Request) {
//   try {
//     const body = await request.text();
//     const headersList = await headers();
//     const signature = headersList.get('stripe-signature');

//     if (!signature) {
//       return NextResponse.json(
//         { error: 'No signature found' },
//         { status: 400 }
//       );
//     }

//     let event: Stripe.Event;

//     try {
//       event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//     } catch (err: any) {
//       console.error('Webhook signature verification failed:', err.message);
//       return NextResponse.json(
//         { error: `Webhook Error: ${err.message}` },
//         { status: 400 }
//       );
//     }

//     // Handle the event
//     switch (event.type) {
//       case 'payment_intent.succeeded':
//         await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
//         break;

//       case 'payment_intent.payment_failed':
//         await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
//         break;

//       case 'charge.refunded':
//         await handleRefund(event.data.object as Stripe.Charge);
//         break;

//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//     }

//     return NextResponse.json({ received: true });
//   } catch (error: any) {
//     console.error('Webhook error:', error);
//     return NextResponse.json(
//       { error: 'Webhook handler failed' },
//       { status: 500 }
//     );
//   }
// }

// async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
//   try {
//     const orderId = paymentIntent.metadata.orderId;

//     if (!orderId) {
//       console.error('No orderId in payment intent metadata');
//       return;
//     }

//     // Update order status
//     const order = await prisma.order.update({
//       where: { id: orderId },
//       data: {
//         status: 'PROCESSING',
//         paymentStatus: 'CAPTURED',
//       },
//       include: {
//         items: {
//           include: {
//             product: {
//               include: {
//                 variants: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     // Reduce stock for each variant
//     for (const item of order.items) {
//       // Find the variant that was ordered
//       const variant = item.product.variants.find((v) =>
//         order.notes?.includes(v.sku)
//       );

//       if (variant) {
//         await prisma.productVariant.update({
//           where: { id: variant.id },
//           data: {
//             stock: {
//               decrement: item.quantity,
//             },
//           },
//         });
//       }
//     }

//     // TODO: Send order confirmation email
//     console.log(`Order ${order.orderNumber} payment succeeded`);

//     // TODO: Trigger fulfillment process
//   } catch (error) {
//     console.error('Error handling payment success:', error);
//   }
// }

// async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
//   try {
//     const orderId = paymentIntent.metadata.orderId;

//     if (!orderId) {
//       console.error('No orderId in payment intent metadata');
//       return;
//     }

//     // Update order status
//     await prisma.order.update({
//       where: { id: orderId },
//       data: {
//         status: 'CANCELLED',
//         paymentStatus: 'FAILED',
//       },
//     });

//     console.log(`Order ${orderId} payment failed`);

//     // TODO: Send payment failure email
//   } catch (error) {
//     console.error('Error handling payment failure:', error);
//   }
// }

// async function handleRefund(charge: Stripe.Charge) {
//   try {
//     const paymentIntent = charge.payment_intent as string;

//     // Find order by payment intent
//     const order = await prisma.order.findFirst({
//       where: {
//         notes: {
//           contains: paymentIntent,
//         },
//       },
//       include: {
//         items: {
//           include: {
//             product: {
//               include: {
//                 variants: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!order) {
//       console.error('Order not found for refund');
//       return;
//     }

//     // Update order status
//     await prisma.order.update({
//       where: { id: order.id },
//       data: {
//         status: 'CANCELLED',
//         paymentStatus: 'REFUNDED',
//       },
//     });

//     // Restore stock
//     for (const item of order.items) {
//       const variant = item.product.variants.find((v) =>
//         order.notes?.includes(v.sku)
//       );

//       if (variant) {
//         await prisma.productVariant.update({
//           where: { id: variant.id },
//           data: {
//             stock: {
//               increment: item.quantity,
//             },
//           },
//         });
//       }
//     }

//     console.log(`Order ${order.orderNumber} refunded`);

//     // TODO: Send refund confirmation email
//   } catch (error) {
//     console.error('Error handling refund:', error);
//   }
// }



// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { uniUniClient } from '@/lib/uniuni-client';
import { sendOrderConfirmationEmail } from '@/lib/mailer';

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
    const { orderId, uniUniOrderNumber } = paymentIntent.metadata;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💰 Payment Success Webhook Received');
    console.log('   All Metadata:', JSON.stringify(paymentIntent.metadata));
    console.log(`   orderId: ${orderId || 'NOT FOUND'}`);
    console.log(`   uniUniOrderNumber: ${uniUniOrderNumber || 'NOT FOUND (empty or missing)'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!orderId) {
      console.error('No orderId in payment intent metadata');
      return;
    }

    // 1. Update order status in database
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PROCESSING',
        paymentStatus: 'CAPTURED',
      },
      include: {
        items: true,
      },
    });

    // 2. Convert UniUni Draft to a Live Order
    if (uniUniOrderNumber) {
      try {
        console.log(`🚀 Finalizing UniUni Shipment: ${uniUniOrderNumber}`);
        await uniUniClient.confirmShipment(uniUniOrderNumber);
        console.log(`✅ UniUni Shipment ${uniUniOrderNumber} confirmed successfully.`);

        // Fetch the shipment to get its trackingId and persist it so the
        // UniUni webhook can look up orders by tracking number later.
        try {
          const shipmentDetails = await uniUniClient.getShipment(uniUniOrderNumber);
          const trackingId =
            shipmentDetails?.data?.trackingId ?? shipmentDetails?.trackingId;
          if (trackingId) {
            await prisma.order.update({
              where: { id: orderId },
              data: { trackingNumber: trackingId },
            });
            console.log(`📦 Tracking number saved: ${trackingId}`);
          }
        } catch (trackingError) {
          console.error('⚠️ Could not fetch/save tracking number:', trackingError);
        }
      } catch (uniError) {
        // Log error but don't fail the webhook; admin can fix manually if balance was low.
        console.error('❌ UniUni confirmation failed:', uniError);
      }
    }

    // 3. Reduce stock for each variant using stored variantId
    for (const item of order.items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    // 4. Send order confirmation email
    const recipientEmail = order.email || order.customerEmail;
    if (recipientEmail) {
      try {
        await sendOrderConfirmationEmail({
          to: recipientEmail,
          orderNumber: order.orderNumber,
          firstName: order.shippingFirstName,
          items: order.items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            color: item.color,
            size: item.size,
          })),
          subtotal: order.subtotal,
          shippingCost: order.shippingCost,
          tax: order.tax,
          total: order.total,
          shippingAddress: {
            street: order.shippingStreet,
            apartment: order.shippingApartment,
            city: order.shippingCity,
            province: order.shippingProvince,
            postalCode: order.shippingPostalCode,
            country: order.shippingCountry,
          },
        });
        console.log(`📧 Confirmation email sent to ${recipientEmail}`);
      } catch (emailError) {
        // Never fail the webhook because of email — log and move on
        console.error('❌ Failed to send confirmation email:', emailError);
      }
    }

    console.log(`✅ Order ${order.orderNumber} successfully processed.`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) return;

    // Update order status to CANCELLED/FAILED
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        paymentStatus: 'FAILED',
      },
    });

    console.log(`❌ Order ${orderId} payment failed.`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleRefund(charge: Stripe.Charge) {
  try {
    const paymentIntentId = charge.payment_intent as string;

    // Find order by Stripe payment ID
    const order = await prisma.order.findFirst({
      where: { stripePaymentId: paymentIntentId },
      include: { items: true },
    });

    if (!order) {
      console.error('Order not found for refund');
      return;
    }

    // Update order status to REFUNDED
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED',
      },
    });

    // Restore stock for variants
    for (const item of order.items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    console.log(`⏪ Order ${order.orderNumber} refunded and stock restored.`);
  } catch (error) {
    console.error('Error handling refund:', error);
  }
}