import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/account — fetch user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true,
        password: true, // To check if password is set (for Google OAuth users)
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get wishlist count
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            name: true,
            image: true,
            quantity: true,
            price: true,
          },
          take: 3,
        },
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        hasPassword: !!user.password,
        createdAt: user.createdAt,
        orderCount: user._count.orders,
        wishlistCount: wishlist?.productIds?.length || 0,
      },
      recentOrders,
    });
  } catch (error: any) {
    console.error("Account GET error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/account — update user profile (name, phone)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone } = body;

  // Validate
  const updateData: { name?: string; phone?: string | null } = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }
    updateData.name = name.trim();
  }

  if (phone !== undefined) {
    if (phone === "" || phone === null) {
      updateData.phone = null;
    } else {
      const digits = phone.replace(/\D/g, "");
      if (digits.length !== 10) {
        return NextResponse.json(
          { error: "Phone must be a valid 10-digit number" },
          { status: 400 }
        );
      }
      updateData.phone = phone;
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
    },
  });

  return NextResponse.json({ user: updatedUser });
}
