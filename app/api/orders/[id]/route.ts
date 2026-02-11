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

    if (!session?.user?.id) {
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

    // Verify order belongs to user (or user is admin)
    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Format response
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
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
