// src/components/products-content.tsx
// ============================================
import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";
import { Pagination } from "./pagination";

interface ProductsContentProps {
  filterType?: "new-arrivals" | "featured";
  categorySlug?: string;
  sortBy: string;
  page: number;
}

export async function ProductsContent({
  filterType,
  categorySlug,
  sortBy,
  page,
}: ProductsContentProps) {
  const limit = 20;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    isActive: true,
  };

  if (filterType === "featured") {
    where.featured = true;
  }

  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (category) {
      where.categoryId = category.id;
    }
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: "desc" }; // Default: newest first

  if (filterType === "new-arrivals") {
    orderBy = { createdAt: "desc" };
  } else if (sortBy === "price-asc") {
    orderBy = { price: "asc" };
  } else if (sortBy === "price-desc") {
    orderBy = { price: "desc" };
  } else if (sortBy === "name") {
    orderBy = { name: "asc" };
  }

  // Fetch products
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
          No products found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-8">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/products"
        />
      )}
    </>
  );
}
