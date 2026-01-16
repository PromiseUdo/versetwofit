import CategoryPreview from '@/components/category-preview';
import FeaturedCategoriesCarousel from '@/components/featured-categories';
import HeroSlider from '@/components/hero2';
import ProductReel from '@/components/product-reel';

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <FeaturedCategoriesCarousel />
      <ProductReel type="new-arrivals" />
      <CategoryPreview />
      <ProductReel type="featured" />
    </main>
  );
}
