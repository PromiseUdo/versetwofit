// FILE 3: Dynamic All Products Page
// src/app/products/page.tsx
// ============================================
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import SlicedText from '@/components/sliced-text';
import { ProductCard } from '@/components/product-card';
import FloatingFilterPanel from '../components/floating-filter-panel';
import { ProductsContent } from './components/products-content';

interface PageProps {
  searchParams: Promise<{
    filter?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-8">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="max-w-xs w-full">
          <div className="h-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md"></div>
        </div>
      ))}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filterType = params.filter as 'new-arrivals' | 'featured' | undefined;
  const categorySlug = params.category;
  const sortBy = params.sort || 'newest';
  const currentPage = parseInt(params.page || '1');
  console.log(params, 'searchparams');

  const title =
    filterType === 'new-arrivals'
      ? 'New Arrivals'
      : filterType === 'featured'
      ? 'Featured Products'
      : 'All Products';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

      <FloatingFilterPanel />

      <MaxWidthWrapper className="pt-20 bg-white ">
        <div className="container mx-auto">
          <div className="px-8 mb-8">
            <SlicedText text={title} />
            {filterType && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Showing {filterType === 'new-arrivals' ? 'newest' : 'featured'}{' '}
                products
              </p>
            )}
          </div>

          <Suspense fallback={<ProductsSkeleton />}>
            <ProductsContent
              filterType={filterType}
              categorySlug={categorySlug}
              sortBy={sortBy}
              page={currentPage}
            />
          </Suspense>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
