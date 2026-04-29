import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST /api/auth/reset-password
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, email, password, confirmPassword } = body;

  if (!token || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 },
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 },
    );
  }

  const normalizedEmail = (email as string).toLowerCase().trim();

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: { email: normalizedEmail },
  });

  if (!resetToken) {
    return NextResponse.json(
      { error: "Invalid or expired reset link" },
      { status: 400 },
    );
  }

  const isValidToken = await bcrypt.compare(token as string, resetToken.token);
  if (!isValidToken) {
    return NextResponse.json(
      { error: "Invalid or expired reset link" },
      { status: 400 },
    );
  }

  if (new Date() > resetToken.expiresAt) {
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    return NextResponse.json(
      { error: "Reset link has expired. Please request a new one." },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password as string, 12);

  await prisma.user.update({
    where: { email: normalizedEmail },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

  return NextResponse.json({ message: "Password updated successfully" });
}
