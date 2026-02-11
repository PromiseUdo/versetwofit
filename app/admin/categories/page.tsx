// src/app/admin/categories/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your product categories
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
        >
          <Plus size={20} />
          Add Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-12 text-center border border-gray-200 dark:border-gray-800">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No categories yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first category to start organizing products
          </p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            <Plus size={20} />
            Create Category
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/admin/categories/${category.id}`}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden  border-none hover:shadow-xl transition group"
            >
              {category.image ? (
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-6xl font-bold text-white opacity-50">
                    {category.name.charAt(0)}
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-600 transition">
                  {category.name}
                </h3>

                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {category._count.products}{" "}
                    {category._count.products === 1 ? "product" : "products"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {format(new Date(category.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
