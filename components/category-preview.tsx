import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "./max-width-wrapper";
import { prisma } from "@/lib/prisma";

async function getCategories() {
  return prisma.category.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });
}

export default async function CategoryPreview() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <MaxWidthWrapper className="mt-20">
      <div className="grid grid-cols-1 gap-2 lg:items-center lg:grid-cols-2">
        {/* Large first category */}
        <div className="relative overflow-hidden group rounded-2xl aspect-square">
          <Image
            src={categories[0].image || "/placeholder.jpg"}
            alt={categories[0].name}
            fill
            className="object-cover group-hover:opacity-75"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50"
          />
          <div className="absolute inset-0 flex items-end justify-center p-6">
            <p className="font-semibold text-white">
              <Link href={`/category/${categories[0].slug}`}>
                <span className="absolute inset-0" />
                {categories[0].name}
              </Link>
            </p>
          </div>
        </div>

        {/* Right Grid */}
        <div className="h-full grid grid-cols-1 gap-2 lg:grid-cols-2">
          {/* Second category */}
          {categories[1] && (
            <div className="relative overflow-hidden group rounded-2xl">
              <Image
                src={categories[1].image || "/placeholder.jpg"}
                alt={categories[1].name}
                fill
                className="object-cover group-hover:opacity-75"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50"
              />
              <div className="absolute inset-0 flex items-end justify-center p-6">
                <p className="font-semibold text-white">
                  <Link href={`/category/${categories[1].slug}`}>
                    <span className="absolute inset-0" />
                    {categories[1].name}
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Remaining categories */}
          <div className="h-full grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {categories.slice(2).map((category: any) => (
              <div
                key={category.id}
                className="relative overflow-hidden group rounded-2xl aspect-square"
              >
                <Image
                  src={category.image || "/placeholder.jpg"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:opacity-75"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50"
                />
                <div className="absolute inset-0 flex items-end justify-center p-6">
                  <p className="font-semibold text-white">
                    <Link href={`/category/${category.slug}`}>
                      <span className="absolute inset-0" />
                      {category.name}
                    </Link>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
