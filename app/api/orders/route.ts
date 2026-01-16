import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // adjust path if needed
import { OrderStatus } from '@prisma/client';

/**
 * GET /api/admin/orders
 * Admin-only endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Awaiting params (important for new Next.js versions)
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 20);
    const search = searchParams.get('search') ?? '';
    const status = searchParams.get('status') as OrderStatus | null;

    const skip = (page - 1) * limit;

    /**
     * WHERE CLAUSE
     */
    const where: any = {};

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Search by order number or customer email
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    /**
     * QUERY
     */
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          status: true,
          paymentStatus: true,
          customerEmail: true,
          customerPhone: true,
          createdAt: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        page,
      },
    });
  } catch (error) {
    console.error('[ADMIN_ORDERS_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
