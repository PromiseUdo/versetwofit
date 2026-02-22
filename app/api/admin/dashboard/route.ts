import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays, startOfDay, format } from 'date-fns';

export async function GET() {
  try {
    // 1. Total KPI Metrics
    const [totalOrders, activeProducts, totalCustomers] = await Promise.all([
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ]);

    // Calculate total revenue (only PAID or CAPTURED orders)
    const revenueResult = await prisma.order.aggregate({
      where: {
        paymentStatus: {
          in: ['CAPTURED'],
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    // We'll also consider PAID if it exists (schema currently has PENDING, AUTHORIZED, CAPTURED, FAILED, REFUNDED)
    // The previous prompt referenced "PAID" but the schema enum PaymentStatus doesn't have it, we use CAPTURED.
    const totalRevenue = revenueResult._sum.totalAmount || 0;

    // 2. Recent Orders (Top 5)
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        createdAt: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        shippingFirstName: true,
        shippingLastName: true,
        user: {
          select: { name: true, email: true }
        }
      },
    });

    // 3. Revenue Trend (Last 7 Days)
    const sevenDaysAgo = startOfDay(subDays(new Date(), 6));
    const recentRevenueOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        paymentStatus: 'CAPTURED'
      },
      select: {
        createdAt: true,
        totalAmount: true,
      }
    });

    // Initialize the last 7 days array
    const revenueTrendData = Array.from({ length: 7 }).map((_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i));
      return {
        date: format(date, 'MMM dd'),
        revenue: 0,
        rawDate: date.getTime(),
      };
    });

    // Populate revenue trend
    recentRevenueOrders.forEach(order => {
      const orderDate = startOfDay(new Date(order.createdAt)).getTime();
      const dayIndex = revenueTrendData.findIndex(d => d.rawDate === orderDate);
      if (dayIndex !== -1) {
        revenueTrendData[dayIndex].revenue += order.totalAmount;
      }
    });

    // Clean up rawDate for client
    const chartData = revenueTrendData.map(({ date, revenue }) => ({ date, revenue }));


    // 4. Orders by Status
    const ordersByStatusRaw = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const orderStatusData = ordersByStatusRaw.map(item => ({
      name: item.status,
      value: item._count.id,
    }));

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalOrders,
        activeProducts,
        totalCustomers,
      },
      recentOrders,
      revenueTrend: chartData,
      orderStatus: orderStatusData,
    });

  } catch (error) {
    console.error('[ADMIN_DASHBOARD_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
