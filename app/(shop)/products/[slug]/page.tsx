// src/app/products/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import ProductClient from './components/product-client';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Format product for client component
  const formattedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    comparePrice: product.comparePrice,
    images: product.images,
    aboutItems: product.aboutItems || [],
    specifications: product.specifications || [],
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    variants: product.variants.map((variant) => ({
      id: variant.id,
      color: variant.color,
      size: variant.size,
      sku: variant.sku,
      stock: variant.stock,
      price: variant.price,
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };

  return <ProductClient product={formattedProduct} />;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      images: true,
      price: true,
    },
  });

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0]] : [],
      type: 'website',
    },
  };
}
