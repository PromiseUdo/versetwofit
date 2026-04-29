// src/app/api/orders/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const guestEmail = searchParams.get('email')?.toLowerCase().trim() ?? null;

    // At least one of: active session OR guest email must be present
    if (!session?.user?.id && !guestEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (session?.user?.id) {
      // Logged-in path: must own the order or be admin (unchanged)
      if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    } else {
      // Guest path: email must match the order's email
      const orderEmail = (order.email ?? order.customerEmail ?? '').toLowerCase().trim();
      if (!guestEmail || guestEmail !== orderEmail) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Format response
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      shippingFirstName: order.shippingFirstName,
      shippingLastName: order.shippingLastName,
      shippingStreet: order.shippingStreet,
      shippingApartment: order.shippingApartment,
      shippingCity: order.shippingCity,
      shippingProvince: order.shippingProvince,
      shippingPostalCode: order.shippingPostalCode,
      shippingCountry: order.shippingCountry,
      billingAddress: order.billingAddress,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        productId: item.productId,
        productSlug: item.product.slug,
      })),
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
