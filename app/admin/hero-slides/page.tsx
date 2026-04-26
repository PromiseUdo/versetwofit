import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import HeroSlidesList from './hero-slides-list';

export default async function HeroSlidesPage() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hero Slides</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage the homepage hero slider images and content
          </p>
        </div>
        <Link
          href="/admin/hero-slides/new"
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
        >
          <Plus size={20} />
          Add Slide
        </Link>
      </div>

      <HeroSlidesList initialSlides={slides} />
    </div>
  );
}
