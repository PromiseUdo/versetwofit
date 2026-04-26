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
    const slide = await prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }
    return NextResponse.json(slide);
  } catch (error) {
    console.error('Hero slide fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch slide' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const slide = await prisma.heroSlide.update({
      where: { id },
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

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Hero slide update error:', error);
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const slide = await prisma.heroSlide.update({ where: { id }, data: body });
    return NextResponse.json(slide);
  } catch (error) {
    console.error('Hero slide patch error:', error);
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.heroSlide.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hero slide delete error:', error);
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}
