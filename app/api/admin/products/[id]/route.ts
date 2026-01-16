// // src/app/api/admin/products/[id]/route.ts
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';
// import { slugify } from '@/lib/utils';

// // GET single product
// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== 'ADMIN') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const product = await prisma.product.findUnique({
//       where: { id: id },
//       include: {
//         category: true,
//         variants: true,
//       },
//     });

//     if (!product) {
//       return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//     }

//     return NextResponse.json(product);
//   } catch (error) {
//     console.error('Product fetch error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch product' },
//       { status: 500 }
//     );
//   }
// }

// // UPDATE product
// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;
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
//       isActive,
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

//     // Check if product exists
//     const existingProduct = await prisma.product.findUnique({
//       where: { id: id },
//       include: { variants: true },
//     });

//     if (!existingProduct) {
//       return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//     }

//     // Generate slug if name changed
//     const slug =
//       name !== existingProduct.name ? slugify(name) : existingProduct.slug;

//     // If slug changed, check uniqueness
//     if (slug !== existingProduct.slug) {
//       const slugExists = await prisma.product.findUnique({
//         where: { slug },
//       });

//       if (slugExists) {
//         return NextResponse.json(
//           { error: 'A product with this name already exists' },
//           { status: 400 }
//         );
//       }
//     }

//     // Validate variant SKUs
//     const skus = variants.map((v: any) => v.sku);
//     const uniqueSkus = new Set(skus);
//     if (skus.length !== uniqueSkus.size) {
//       return NextResponse.json(
//         { error: 'Duplicate SKUs found in variants' },
//         { status: 400 }
//       );
//     }

//     // Check if any new SKU already exists (excluding current product's SKUs)
//     const existingVariantSkus = existingProduct.variants.map((v) => v.sku);
//     const newSkus = skus.filter(
//       (sku: string) => !existingVariantSkus.includes(sku)
//     );

//     if (newSkus.length > 0) {
//       const existingSkus = await prisma.productVariant.findMany({
//         where: {
//           sku: { in: newSkus },
//         },
//       });

//       if (existingSkus.length > 0) {
//         return NextResponse.json(
//           { error: `SKU already exists: ${existingSkus[0].sku}` },
//           { status: 400 }
//         );
//       }
//     }

//     // Delete old variants and create new ones
//     await prisma.productVariant.deleteMany({
//       where: { productId: id },
//     });

//     // Update product with new variants
//     const product = await prisma.product.update({
//       where: { id: id },
//       data: {
//         name,
//         slug,
//         description,
//         price: parseFloat(price),
//         comparePrice: comparePrice ? parseFloat(comparePrice) : null,
//         images,
//         categoryId,
//         featured: featured || false,
//         isActive: isActive !== undefined ? isActive : true,
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

//     return NextResponse.json(product);
//   } catch (error: any) {
//     console.error('Product update error:', error);

//     if (error.code === 'P2002') {
//       return NextResponse.json(
//         { error: 'Product name or SKU already exists' },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Failed to update product' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE product
// export async function DELETE(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== 'ADMIN') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Check if product has orders
//     const product = await prisma.product.findUnique({
//       where: { id: id },
//       include: {
//         orderItems: true,
//       },
//     });

//     if (!product) {
//       return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//     }

//     if (product.orderItems.length > 0) {
//       return NextResponse.json(
//         {
//           error:
//             'Cannot delete product with existing orders. Set it as inactive instead.',
//         },
//         { status: 400 }
//       );
//     }

//     // Delete product (variants will cascade delete)
//     await prisma.product.delete({
//       where: { id: id },
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Product deleted successfully',
//     });
//   } catch (error) {
//     console.error('Product deletion error:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete product' },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/admin/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

// GET single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
      isActive,
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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
      include: { variants: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Generate slug if name changed
    const slug =
      name !== existingProduct.name ? slugify(name) : existingProduct.slug;

    // If slug changed, check uniqueness
    if (slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A product with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Validate variant SKUs
    const skus = variants.map((v: any) => v.sku);
    const uniqueSkus = new Set(skus);
    if (skus.length !== uniqueSkus.size) {
      return NextResponse.json(
        { error: 'Duplicate SKUs found in variants' },
        { status: 400 }
      );
    }

    // Check if any new SKU already exists (excluding current product's SKUs)
    const existingVariantSkus = existingProduct.variants.map((v) => v.sku);
    const newSkus = skus.filter(
      (sku: string) => !existingVariantSkus.includes(sku)
    );

    if (newSkus.length > 0) {
      const existingSkus = await prisma.productVariant.findMany({
        where: {
          sku: { in: newSkus },
        },
      });

      if (existingSkus.length > 0) {
        return NextResponse.json(
          { error: `SKU already exists: ${existingSkus[0].sku}` },
          { status: 400 }
        );
      }
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

    // Delete old variants and create new ones
    await prisma.productVariant.deleteMany({
      where: { productId: id },
    });

    // Update product with new variants
    const product = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        images,
        categoryId,
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true,
        aboutItems: processedAboutItems,
        specifications: processedSpecifications,
        variants: {
          create: variants.map((variant: any) => ({
            color: variant.color || null,
            size: variant.size || null,
            sku: variant.sku,
            stock: parseInt(variant.stock) || 0,
            price: variant.price ? parseFloat(variant.price) : null,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Product update error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Product name or SKU already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if product has orders
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        orderItems: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.orderItems.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete product with existing orders. Set it as inactive instead.',
        },
        { status: 400 }
      );
    }

    // Delete product (variants will cascade delete)
    await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
