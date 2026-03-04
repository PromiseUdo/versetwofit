
// src/app/api/checkout/create-payment-intent/route.ts
// CORRECTED VERSION - Uses proper UniUni API field names

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  uniUniClient,
  cartItemsToShipmentLineItems,
  estimatePackageDimensions,
  estimatePackageWeight,
  convertToUniUniAddress, // NEW: Helper to convert address format
  type CreateShipmentRequest,
  type UniUniRecipient,
} from '@/lib/uniuni-client';
import { getUniUniPostageType } from '@/lib/shipping';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-12-18.acacia',
// });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

// Helper function to generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      items,
      shippingAddress,
      billingAddress,
      email,
      phone,
      shippingMethodId,
      selectedRate, // Dynamic rate from UniUni API (if available)
      totals,
      paymentMethod = 'card', // 'card' | 'klarna'
    } = body;

    // Validate request
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress || !email || !phone || !shippingMethodId) {
      return NextResponse.json(
        { error: 'Missing required shipping information' },
        { status: 400 },
      );
    }

    console.log('📦 Processing order with items:', items);

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Prepare order items data for MongoDB
    const orderItemsData = await Promise.all(
      items.map(async (item: any) => {
        console.log('Processing item:', item);

        // Get variant to find the productId
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: {
            product: {
              select: { id: true, name: true, images: true },
            },
          },
        });

        if (!variant) {
          throw new Error(`Variant ${item.variantId} not found`);
        }

        return {
          productId: variant.productId,
          quantity: item.quantity,
          price: item.price,
          name: variant.product.name || item.productName || 'Product',
          image: variant.product.images?.[0] || null,
          variantId: item.variantId,
          color: item.color || null,
          size: item.size || null,
        };
      }),
    );

    console.log('✅ Order items prepared:', orderItemsData);

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,

        // Contact info
        email,
        phone,
        customerEmail: email,
        customerPhone: phone,

        // Shipping address
        shippingFirstName: shippingAddress.firstName,
        shippingLastName: shippingAddress.lastName,
        shippingStreet: shippingAddress.street,
        shippingApartment: shippingAddress.apartment || null,
        shippingCity: shippingAddress.city,
        shippingProvince: shippingAddress.state,
        shippingPostalCode: shippingAddress.zipCode,
        shippingCountry: 'CA',

        // Billing address
        billingFirstName:
          billingAddress?.firstName || shippingAddress.firstName,
        billingLastName: billingAddress?.lastName || shippingAddress.lastName,
        billingStreet: billingAddress?.street || shippingAddress.street,
        billingApartment:
          billingAddress?.apartment || shippingAddress.apartment || null,
        billingCity: billingAddress?.city || shippingAddress.city,
        billingProvince: billingAddress?.state || shippingAddress.state,
        billingPostalCode: billingAddress?.zipCode || shippingAddress.zipCode,
        billingCountry: 'CA',

        // Pricing
        subtotal: totals.subtotal,
        shippingCost: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        totalAmount: totals.total,

        // Shipping
        shippingMethod: shippingMethodId,

        // Status
        status: 'PENDING',
        paymentStatus: 'PENDING',

        // Order items
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    console.log('✅ Order created:', order.id, order.orderNumber);

    // Prepare UniUni shipment data
    const uniUniRecipient: UniUniRecipient = {
      name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      phone: phone,
      email: email,
    };

    // CORRECTED: Use helper to convert address to UniUni format
    const uniUniAddress = convertToUniUniAddress({
      street: shippingAddress.street,
      apartment: shippingAddress.apartment,
      city: shippingAddress.city,
      province: shippingAddress.state,
      postalCode: shippingAddress.zipCode,
    });

    const shipmentLineItems = cartItemsToShipmentLineItems(
      items.map((item: any) => ({
        productName: item.productName || 'Product',
        quantity: item.quantity,
        price: item.price,
        variantSku: item.variantSku,
      })),
    );

    // Fetch variant dimensions from database
    const variantIds = items.map((item: any) => item.variantId).filter(Boolean);
    const variantDimensions = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: {
        id: true,
        length: true,
        width: true,
        height: true,
        weight: true,
      },
    });

    // Create a lookup map for dimensions
    const variantDimensionsMap: Map<string, any> = new Map(
      variantDimensions.map((v: any) => [v.id, { length: v.length, width: v.width, height: v.height, weight: v.weight }])
    );

    // Enrich items with dimension data
    const enrichedItems = items.map((item: any) => {
      const dims = variantDimensionsMap.get(item.variantId);
      return {
        ...item,
        length: dims?.length ?? null,
        width: dims?.width ?? null,
        height: dims?.height ?? null,
        weight: dims?.weight ?? null,
      };
    });

    const dimensions = estimatePackageDimensions(enrichedItems);
    const weight = estimatePackageWeight(enrichedItems);
    
    // Use postageType from selected rate if available, otherwise convert from method ID
    const postageType = selectedRate?.postageType || getUniUniPostageType(shippingMethodId);

    // DEBUG: Log shipping method conversion
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚚 Shipping Method Debug:');
    console.log(`   Received shippingMethodId: "${shippingMethodId}"`);
    console.log(`   Selected rate postageType: "${selectedRate?.postageType || 'N/A'}"`);
    console.log(`   Final postageType: "${postageType}"`);
    console.log(`   Reusing draft order: ${selectedRate?.orderNumber || 'No - will create new'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Reuse existing draft shipment from rate quote, or create new one
    let uniUniShipment: { orderNumber: string; trackingId?: string; status?: string } | undefined;
    
    try {
      if (selectedRate?.orderNumber) {
        // REUSE existing draft shipment created during rate quote
        // No need to call UniUni again — just use the order number directly
        console.log(`📮 Reusing existing draft shipment: ${selectedRate.orderNumber}`);
        
        uniUniShipment = {
          orderNumber: selectedRate.orderNumber,
          status: 'DRAFT',
        };
        
        console.log('✅ Reusing UniUni shipment:', uniUniShipment);
      } else {
        // CREATE new shipment (fallback when no rate quote was created)
        const shipmentRequest: CreateShipmentRequest = {
          recipient: uniUniRecipient,
          address: uniUniAddress,
          dimensions,
          weight,
          postageType,
          note: `Order #${orderNumber}`,
          shipmentLineItems,
        };

        console.log(
          '📮 Creating new UniUni shipment:',
          JSON.stringify(shipmentRequest, null, 2),
        );

        const newShipment = await uniUniClient.createShipment(shipmentRequest);
        // Handle nested data response from UniUni  
        const shipmentData = (newShipment as any).data || newShipment;
        uniUniShipment = {
          orderNumber: shipmentData.orderNumber,
          trackingId: shipmentData.trackingId,
          status: shipmentData.status,
        };

        console.log('✅ UniUni shipment created:', uniUniShipment);
      }

      // Update order with UniUni tracking info
      await prisma.order.update({
        where: { id: order.id },
        data: {
          uniUniOrderNumber: uniUniShipment.orderNumber,
          trackingNumber: uniUniShipment.trackingId || null,
        },
      });
    } catch (uniUniError: any) {
      console.error('❌ UniUni shipment handling failed:', uniUniError);
      console.error('Error details:', {
        message: uniUniError.message,
        response: uniUniError.response?.data,
      });
      // Don't fail the entire checkout, but log the error
      // The shipment can be created manually later in UniUni dashboard
    }

    // Create Stripe payment intent
    // Shipping + customer details are required for Klarna to appear in PaymentElement
    const isKlarna = paymentMethod === 'klarna';
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totals.total * 100),
      currency: 'cad',
      receipt_email: email,
      metadata: {
        orderId: order.id,
        orderNumber: orderNumber,
        userId: session.user.id,
        uniUniOrderNumber: uniUniShipment?.orderNumber || '',
        paymentMethod,
      },
      shipping: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        phone: phone,
        address: {
          line1: shippingAddress.street,
          line2: shippingAddress.apartment || undefined,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zipCode,
          country: 'CA',
        },
      },
      // For Klarna: explicit payment_method_types is required
      // For card: automatic_payment_methods covers all card types
      ...(isKlarna
        ? { payment_method_types: ['klarna'] }
        : { automatic_payment_methods: { enabled: true } }
      ),
    });

    // Update order with Stripe payment ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentId: paymentIntent.id,
      },
    });

    console.log('✅ Payment intent created:', paymentIntent.id);

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      orderNumber: orderNumber,
      uniUniOrderNumber: uniUniShipment?.orderNumber,
      trackingNumber: uniUniShipment?.trackingId,
    });
  } catch (error: any) {
    console.error('❌ Error creating payment intent:', error);
    return NextResponse.json(
      {
        error: 'Failed to create payment intent',
        message: error.message,
      },
      { status: 500 },
    );
  }
}
