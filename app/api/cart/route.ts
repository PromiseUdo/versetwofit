// src/app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch user's cart (for logged-in users)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // You can store cart in database for logged-in users if needed
    // For now, we'll use client-side storage with Zustand

    return NextResponse.json({ message: 'Cart data stored client-side' });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Validate cart items and stock
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    // Extract variant IDs from cart items
    const variantIds = items.map((item: any) => item.id);

    // Fetch variants with stock information
    const variants = await prisma.productVariant.findMany({
      where: {
        id: {
          in: variantIds,
        },
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

    // Validate each item
    const validatedItems = items.map((item: any) => {
      const variant = variants.find((v) => v.id === item.id);

      if (!variant) {
        return {
          ...item,
          isValid: false,
          error: 'Product variant not found',
        };
      }

      if (!variant.product.isActive) {
        return {
          ...item,
          isValid: false,
          error: 'Product is no longer available',
        };
      }

      if (variant.stock === 0) {
        return {
          ...item,
          isValid: false,
          error: 'Out of stock',
        };
      }

      if (item.quantity > variant.stock) {
        return {
          ...item,
          isValid: false,
          error: `Only ${variant.stock} items available`,
          availableStock: variant.stock,
        };
      }

      // Check if price has changed
      const currentPrice = variant.price || variant.product.price;
      const priceChanged = currentPrice !== item.price;

      return {
        ...item,
        isValid: true,
        priceChanged,
        currentPrice,
        currentStock: variant.stock,
      };
    });

    return NextResponse.json({
      items: validatedItems,
      hasInvalidItems: validatedItems.some((item: any) => !item.isValid),
    });
  } catch (error) {
    console.error('Cart validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate cart' },
      { status: 500 }
    );
  }
}
