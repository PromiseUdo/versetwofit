import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";
import { Pagination } from "@/app/(shop)/products/components/pagination";

interface CategoryProductsContentProps {
  categoryId: string;
  categorySlug: string;
  sortBy: string;
  page: number;
}

export async function CategoryProductsContent({
  categoryId,
  categorySlug,
  sortBy,
  page,
}: CategoryProductsContentProps) {
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    categoryId,
  };

  // Build orderBy clause
  let orderBy: any = { createdAt: "desc" };

  if (sortBy === "price-asc") {
    orderBy = { price: "asc" };
  } else if (sortBy === "price-desc") {
    orderBy = { price: "desc" };
  } else if (sortBy === "name") {
    orderBy = { name: "asc" };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: { name: true },
        },
        variants: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  if (products.length === 0) {
    return (
      <div className="px-8 py-20 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No products found in this category.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-8">
        {(products as any[]).map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl={`/category/${categorySlug}`}
        />
      )}
    </>
  );
}
