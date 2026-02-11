// API endpoint to create a single shipment quote
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  uniUniClient,
  estimatePackageDimensions,
  estimatePackageWeight,
  type UniUniRecipient,
  type UniUniAddress,
  type ShipmentLineItem,
  type PostageType,
} from '@/lib/uniuni-client';

interface RequestItem {
  variantId: string;
  quantity: number;
  price: number;
  productName?: string;
  variantSku?: string;
}

interface VariantWithDimensions {
  id: string;
  length: number | null;
  width: number | null;
  height: number | null;
  weight: number | null;
  sku: string;
  product: { name: string };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, items, recipient, postageType } = body;

    // Validate required fields
    if (!address || !items || !recipient || !postageType) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('📊 Creating shipping quote for postage type:', postageType);

    // Prepare UniUni recipient
    const uniUniRecipient: UniUniRecipient = {
      name: recipient.name,
      phone: recipient.phone || '000-000-0000',
      email: recipient.email,
    };

    // Prepare UniUni address
    const uniUniAddress: UniUniAddress = {
      address1: address.street,
      address2: address.apartment || '',
      city: address.city,
      province: address.province,
      postalCode: address.postalCode.replace(/\s+/g, ''),
      country: 'CA',
    };

    // Get product dimensions from database
    const variantIds = (items as RequestItem[]).map((item) => item.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: {
        id: true,
        length: true,
        width: true,
        height: true,
        weight: true,
        sku: true,
        product: { select: { name: true } },
      },
    });

    const variantMap = new Map<string, VariantWithDimensions>(
      variants.map((v: any) => [v.id, v as VariantWithDimensions])
    );

    // Build enriched items with dimensions
    const enrichedItems = (items as RequestItem[]).map((item) => {
      const variant = variantMap.get(item.variantId);
      return {
        quantity: item.quantity,
        price: item.price,
        length: variant?.length ?? null,
        width: variant?.width ?? null,
        height: variant?.height ?? null,
        weight: variant?.weight ?? null,
      };
    });

    // Build shipment line items
    const shipmentLineItems: ShipmentLineItem[] = items.map((item: any) => {
      const variant = variantMap.get(item.variantId);
      return {
        description: item.productName || variant?.product?.name || 'Product',
        quantity: item.quantity,
        sku: variant?.sku || item.variantSku || 'SKU-UNKNOWN',
        hsCode: '6211.42.90.00',
        originCountry: 'CA',
        unitPrice: item.price || 0,
        unitValue: item.price || 0,
        currency: 'CAD',
      };
    });

    // Calculate package dimensions and weight
    const dimensions = estimatePackageDimensions(enrichedItems);
    const weight = estimatePackageWeight(enrichedItems);

    console.log('📦 Package dimensions:', dimensions);
    console.log('⚖️ Package weight:', weight);

    // Create shipment to get actual rate
    const shipmentResponse = await uniUniClient.createShipment({
      recipient: uniUniRecipient,
      address: uniUniAddress,
      dimensions,
      weight,
      postageType: postageType as PostageType,
      note: 'Rate Quote',
      shipmentLineItems,
    });

    console.log('✅ Shipment response:', JSON.stringify(shipmentResponse, null, 2));

    // UniUni response wraps data under a `data` property
    const shipmentData = (shipmentResponse as any).data || shipmentResponse;
    const rates = shipmentData.rates;

    if (!rates) {
      throw new Error('No rates returned from UniUni API');
    }

    console.log('✅ Shipment created for quote:', {
      orderNumber: shipmentData.orderNumber,
      rates,
    });

    // Return the rate information
    const rate = {
      postageType: postageType,
      postageFee: rates.postageFee,
      tax: rates.tax,
      total: rates.total,
      currency: rates.currency || 'CAD',
      orderNumber: shipmentData.orderNumber,
      estimatedDays: postageType === 'STANDARD' ? '3-5 business days' 
        : postageType === 'NEXT DAY' ? '1 business day' 
        : 'Same day',
      name: postageType === 'STANDARD' ? 'Standard Shipping'
        : postageType === 'NEXT DAY' ? 'Next Day Shipping'
        : 'Same Day Shipping',
    };

    return NextResponse.json({
      success: true,
      rate,
      dimensions,
      weight,
    });
  } catch (error: any) {
    console.error('❌ Error creating shipping quote:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create shipping quote',
        details: error.response?.data,
      },
      { status: 500 }
    );
  }
}
