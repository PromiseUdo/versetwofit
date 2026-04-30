import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  if (!q || q.length < 1) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      slug: true,
      name: true,
      images: true,
      price: true,
      comparePrice: true,
      category: {
        select: { name: true },
      },
      variants: {
        select: { stock: true },
      },
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  const formatted = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    images: p.images,
    price: p.price,
    comparePrice: p.comparePrice,
    category: p.category,
    stock: p.variants.reduce((sum, v) => sum + v.stock, 0),
  }));

  return NextResponse.json({ products: formatted });
}
