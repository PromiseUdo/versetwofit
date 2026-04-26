import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/wishlist — return the user's wishlist with populated products
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
  });

  if (!wishlist || wishlist.productIds.length === 0) {
    return NextResponse.json({ productIds: [], products: [] });
  }

  // Fetch full product data for all wishlisted products
  const products = await prisma.product.findMany({
    where: {
      id: { in: wishlist.productIds },
    },
    include: {
      category: true,
      variants: true,
    },
  });

  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    comparePrice: p.comparePrice,
    images: p.images,
    category: {
      name: p.category.name,
    },
    variants: p.variants.map((v) => ({
      id: v.id,
      options: v.options,
      sku: v.sku,
      stock: v.stock,
      price: v.price,
      length: v.length,
      width: v.width,
      height: v.height,
      weight: v.weight,
    })),
  }));

  return NextResponse.json({
    productIds: wishlist.productIds,
    products: formattedProducts,
  });
}

// POST /api/wishlist — toggle a product in the wishlist
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { productId } = body;

  if (!productId) {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }

  // Verify the product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Find or create the wishlist
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
  });

  if (!wishlist) {
    // Create a new wishlist with this product
    wishlist = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productIds: [productId],
      },
    });

    return NextResponse.json({
      productIds: wishlist.productIds,
      action: "added",
    });
  }

  // Toggle: remove if present, add if not
  const isInWishlist = wishlist.productIds.includes(productId);

  if (isInWishlist) {
    // Remove the product
    wishlist = await prisma.wishlist.update({
      where: { userId: session.user.id },
      data: {
        productIds: wishlist.productIds.filter((id) => id !== productId),
      },
    });

    return NextResponse.json({
      productIds: wishlist.productIds,
      action: "removed",
    });
  } else {
    // Add the product
    wishlist = await prisma.wishlist.update({
      where: { userId: session.user.id },
      data: {
        productIds: [...wishlist.productIds, productId],
      },
    });

    return NextResponse.json({
      productIds: wishlist.productIds,
      action: "added",
    });
  }
}

// DELETE /api/wishlist?productId=xxx — remove a product from the wishlist
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "productId query param is required" },
      { status: 400 }
    );
  }

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
  });

  if (!wishlist) {
    return NextResponse.json({ error: "Wishlist not found" }, { status: 404 });
  }

  const updatedWishlist = await prisma.wishlist.update({
    where: { userId: session.user.id },
    data: {
      productIds: wishlist.productIds.filter((id) => id !== productId),
    },
  });

  return NextResponse.json({
    productIds: updatedWishlist.productIds,
  });
}
