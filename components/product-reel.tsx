// src/components/product-reel.tsx
// ============================================
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import MaxWidthWrapper from './max-width-wrapper';
import SlicedText from './sliced-text';
import { ProductReelClient } from './product-reel-client';
import { Loader2 } from 'lucide-react';

async function ProductReelContent({
  type,
}: {
  type: 'new-arrivals' | 'featured';
}) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(type === 'featured' && { featured: true }),
    },
    include: {
      category: {
        select: { name: true },
      },
      variants: {
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy:
      type === 'new-arrivals' ? { createdAt: 'desc' } : { updatedAt: 'desc' },
    take: 8,
  });

  if (products.length === 0) return null;

  return <ProductReelClient products={products} type={type} />;
}

function ProductReelSkeleton() {
  return (
    <>
      {/* Desktop Grid Skeleton */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="max-w-xs w-full">
            <div className="h-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden flex gap-3 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex-none w-72">
            <div className="h-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md"></div>
          </div>
        ))}
      </div>
    </>
  );
}

interface ProductReelProps {
  type: 'new-arrivals' | 'featured';
}

export default function ProductReel({ type }: ProductReelProps) {
  return (
    <MaxWidthWrapper className="pt-20">
      <div className="container mx-auto">
        <div className="px-8 mb-8">
          <SlicedText
            text={
              type === 'new-arrivals' ? 'New Arrivals' : 'Featured Products'
            }
          />
        </div>

        <Suspense fallback={<ProductReelSkeleton />}>
          <ProductReelContent type={type} />
        </Suspense>
      </div>
    </MaxWidthWrapper>
  );
}
