import CategoryPreview from '@/components/category-preview';
import FeaturedCategoriesCarousel from '@/components/featured-categories';
import HeroSlider from '@/components/hero2';
import ProductReel from '@/components/product-reel';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  });

  return (
    <main>
      <HeroSlider categories={categories} />
      <FeaturedCategoriesCarousel />
      <ProductReel type="new-arrivals" />
      <CategoryPreview />
      <ProductReel type="featured" />
    </main>
  );
}
