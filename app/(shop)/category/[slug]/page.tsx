import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import SlicedText from '@/components/sliced-text';
import { CategoryProductsContent } from './components/category-products-content';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
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

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const sortBy = search.sort || 'newest';
  const currentPage = parseInt(search.page || '1');

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

      <MaxWidthWrapper className="pt-20 bg-white">
        <div className="container mx-auto">
          <div className="px-8 mb-8">
            <SlicedText text={category.name} />
            {/* {category.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {category.description}
              </p>
            )} */}
          </div>

          <Suspense fallback={<ProductsSkeleton />}>
            <CategoryProductsContent
              categoryId={category.id}
              categorySlug={category.slug}
              sortBy={sortBy}
              page={currentPage}
            />
          </Suspense>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
