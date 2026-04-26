import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(slides);
  } catch (error) {
    console.error('Hero slides fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, subtitle, image, ctaText, ctaLink, alignment, order, isActive } = body;

    if (!title || title.trim().length < 2) {
      return NextResponse.json({ error: 'Title must be at least 2 characters' }, { status: 400 });
    }
    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const slide = await prisma.heroSlide.create({
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        image,
        ctaText: ctaText?.trim() || null,
        ctaLink: ctaLink?.trim() || null,
        alignment: alignment || 'center',
        order: typeof order === 'number' ? order : 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error('Hero slide creation error:', error);
    return NextResponse.json({ error: 'Failed to create hero slide' }, { status: 500 });
  }
}
