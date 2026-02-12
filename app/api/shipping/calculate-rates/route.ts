// src/app/api/shipping/calculate-rates/route.ts
// Returns live shipping rates from UniUni API

import { NextRequest, NextResponse } from 'next/server';
import {
  uniUniClient,
  estimatePackageDimensions,
  estimatePackageWeight,
  cartItemsToShipmentLineItems,
  type UniUniAddress,
  type UniUniRecipient,
} from '@/lib/uniuni-client';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, items, email, phone, name } = body;

    if (!address || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Address and items are required' },
        { status: 400 },
      );
    }

    // Convert to UniUni address format
    const uniUniAddress: UniUniAddress = {
      address1: address.street,
      address2: address.apartment || undefined,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: 'CA',
    };

    // Create a placeholder recipient for rate quotes
    const recipient: UniUniRecipient = {
      name: name || 'Rate Quote',
      phone: phone || '+1-000-000-0000',
      email: email || 'quote@example.com',
    };

    // Fetch variant dimensions from database
    const variantIds = items.map((item: any) => item.variantId).filter(Boolean);
    console.log('📦 Fetching dimensions for variant IDs:', variantIds);
    
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: {
        id: true,
        length: true,
        width: true,
        height: true,
        weight: true,
      },
    });

    console.log('📦 Fetched variant dimensions from DB:', variants);

    // Create a lookup map for dimensions
    const variantDimensionsMap: Map<string, any> = new Map(
      variants.map((v: any) => [v.id, { length: v.length, width: v.width, height: v.height, weight: v.weight }])
    );

    // Enrich items with dimension data
    const enrichedItems = items.map((item: any) => {
      const dimensions = variantDimensionsMap.get(item.variantId);
      return {
        ...item,
        length: dimensions?.length ?? null,
        width: dimensions?.width ?? null,
        height: dimensions?.height ?? null,
        weight: dimensions?.weight ?? null,
      };
    });

    console.log('📦 Enriched items with dimensions:', enrichedItems);

    const dimensions = estimatePackageDimensions(enrichedItems);
    const weight = estimatePackageWeight(enrichedItems);

    // Create shipment line items for the quote
    const shipmentLineItems = cartItemsToShipmentLineItems(
      items.map((item: any) => ({
        productName: item.productName || 'Product',
        quantity: item.quantity,
        price: item.price,
        variantSku: item.variantSku,
      })),
    );

    console.log('🚀 Fetching live rates from UniUni API...');

    // Get live quoted rates from UniUni
    const rates = await uniUniClient.getQuotedRates(
      recipient,
      uniUniAddress,
      dimensions,
      weight,
      shipmentLineItems,
    );

    console.log('✅ Live rates received:', rates);

    // If no rates were returned (all API calls failed), fall back to estimates
    if (rates.length === 0) {
      console.log('⚠️ No live rates available, falling back to estimates');
      const fallbackRates = await uniUniClient.getShippingRates(
        uniUniAddress,
        dimensions,
        weight,
      );
      
      return NextResponse.json({
        success: true,
        rates: fallbackRates.map(rate => ({
          postageType: rate.postageType,
          postageFee: rate.estimatedCost,
          tax: 0, // Estimate doesn't include tax
          total: rate.estimatedCost,
          currency: 'CAD',
          orderNumber: null,
          estimatedDays: rate.estimatedDays,
          name: rate.description,
          isEstimate: true,
        })),
        dimensions,
        weight,
        isEstimate: true,
      });
    }

    return NextResponse.json({
      success: true,
      rates,
      dimensions,
      weight,
      isEstimate: false,
    });
  } catch (error: any) {
    console.error('Error calculating shipping rates:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate shipping rates',
        message: error.message,
      },
      { status: 500 },
    );
  }
}
