import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/mailer';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const recipientEmail = order.email || order.customerEmail;
  if (!recipientEmail) {
    return NextResponse.json({ error: 'No email on order' }, { status: 400 });
  }

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

  return NextResponse.json({ success: true });
}
