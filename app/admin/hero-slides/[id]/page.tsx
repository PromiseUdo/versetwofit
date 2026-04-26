import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import HeroSlideForm from '../hero-slide-form';

interface EditHeroSlidePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHeroSlidePage({ params }: EditHeroSlidePageProps) {
  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({ where: { id } });

  if (!slide) {
    notFound();
  }

  return (
    <HeroSlideForm
      mode="edit"
      slideId={slide.id}
      defaultValues={{
        title: slide.title,
        subtitle: slide.subtitle ?? '',
        image: slide.image,
        ctaText: slide.ctaText ?? '',
        ctaLink: slide.ctaLink ?? '',
        alignment: (slide.alignment as 'left' | 'center' | 'right') ?? 'center',
        order: slide.order,
        isActive: slide.isActive,
      }}
    />
  );
}
