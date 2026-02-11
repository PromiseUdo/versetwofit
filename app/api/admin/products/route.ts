// src/app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

// export async function POST(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== 'ADMIN') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await request.json();
//     const {
//       name,
//       description,
//       price,
//       comparePrice,
//       images,
//       categoryId,
//       featured,
//       variants,
//     } = body;

//     // Validation
//     if (!name || !description || !price || !categoryId) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     if (!Array.isArray(images) || images.length === 0) {
//       return NextResponse.json(
//         { error: 'At least one image is required' },
//         { status: 400 }
//       );
//     }

//     if (!Array.isArray(variants) || variants.length === 0) {
//       return NextResponse.json(
//         { error: 'At least one variant is required' },
//         { status: 400 }
//       );
//     }

//     // Generate slug
//     const slug = slugify(name);

//     // Check if slug already exists
//     const existingProduct = await prisma.product.findUnique({
//       where: { slug },
//     });

//     if (existingProduct) {
//       return NextResponse.json(
//         { error: 'A product with this name already exists' },
//         { status: 400 }
//       );
//     }

//     // Validate all variant SKUs are unique
//     const skus = variants.map((v: any) => v.sku);
//     const uniqueSkus = new Set(skus);
//     if (skus.length !== uniqueSkus.size) {
//       return NextResponse.json(
//         { error: 'Duplicate SKUs found in variants' },
//         { status: 400 }
//       );
//     }

//     // Check if any SKU already exists in database
//     const existingSkus = await prisma.productVariant.findMany({
//       where: {
//         sku: {
//           in: skus,
//         },
//       },
//     });

//     if (existingSkus.length > 0) {
//       return NextResponse.json(
//         { error: `SKU already exists: ${existingSkus[0].sku}` },
//         { status: 400 }
//       );
//     }

//     // Create product with variants
//     const product = await prisma.product.create({
//       data: {
//         name,
//         slug,
//         description,
//         price: parseFloat(price),
//         comparePrice: comparePrice ? parseFloat(comparePrice) : null,
//         images,
//         categoryId,
//         featured: featured || false,
//         variants: {
//           create: variants.map((variant: any) => ({
//             color: variant.color || null,
//             size: variant.size || null,
//             sku: variant.sku,
//             stock: parseInt(variant.stock) || 0,
//             price: variant.price ? parseFloat(variant.price) : null,
//           })),
//         },
//       },
//       include: {
//         category: true,
//         variants: true,
//       },
//     });

//     return NextResponse.json(product, { status: 201 });
//   } catch (error: any) {
//     console.error('Product creation error:', error);

//     if (error.code === 'P2002') {
//       return NextResponse.json(
//         { error: 'Product or SKU already exists' },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Failed to create product' },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      comparePrice,
      images,
      categoryId,
      featured,
      variants,
      aboutItems,
      specifications,
    } = body;

    // Validation
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json(
        { error: 'At least one variant is required' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = slugify(name);

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this name already exists' },
        { status: 400 }
      );
    }

    // Validate all variant SKUs are unique
    const skus = variants.map((v: any) => v.sku);
    const uniqueSkus = new Set(skus);
    if (skus.length !== uniqueSkus.size) {
      return NextResponse.json(
        { error: 'Duplicate SKUs found in variants' },
        { status: 400 }
      );
    }

    // Check if any SKU already exists in database
    const existingSkus = await prisma.productVariant.findMany({
      where: {
        sku: {
          in: skus,
        },
      },
    });

    if (existingSkus.length > 0) {
      return NextResponse.json(
        { error: `SKU already exists: ${existingSkus[0].sku}` },
        { status: 400 }
      );
    }

    // Process specifications - ensure they have the correct structure
    const processedSpecifications = Array.isArray(specifications)
      ? specifications
          .filter((spec: any) => spec.key && spec.value)
          .map((spec: any) => ({
            key: spec.key.trim(),
            value: spec.value.trim(),
          }))
      : [];

    // Process about items - extract the value from each object
    const processedAboutItems = Array.isArray(aboutItems)
      ? aboutItems
          .filter((item: any) => item.value && item.value.trim().length > 0)
          .map((item: any) => item.value.trim())
      : [];

    // Create product with variants
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        images,
        categoryId,
        featured: featured || false,
        aboutItems: processedAboutItems,
        specifications: processedSpecifications,
        variants: {
          create: variants.map((variant: any) => ({
            color: variant.color || null,
            size: variant.size || null,
            sku: variant.sku,
            stock: parseInt(variant.stock) || 0,
            price: variant.price ? parseFloat(variant.price) : null,
            length: variant.length ? parseFloat(variant.length) : null,
            width: variant.width ? parseFloat(variant.width) : null,
            height: variant.height ? parseFloat(variant.height) : null,
            weight: variant.weight ? parseFloat(variant.weight) : null,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Product creation error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Product or SKU already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// GET all products for admin
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
