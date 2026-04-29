import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// POST /api/auth/forgot-password
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 },
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Always return the same response to prevent email enumeration
  const ok = NextResponse.json({
    message: "If that email is registered, a reset link has been sent.",
  });

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, name: true, email: true },
  });

  if (!user) return ok;

  // Remove any existing token for this email before creating a new one
  await prisma.passwordResetToken.deleteMany({
    where: { email: normalizedEmail },
  });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(rawToken, 10);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      email: normalizedEmail,
      token: hashedToken,
      expiresAt,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(normalizedEmail)}`;

  await sendPasswordResetEmail(normalizedEmail, user.name ?? "", resetUrl);

  return ok;
}
