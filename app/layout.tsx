import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Announcement } from "@/components/announcement";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Verse Two Fit | Canadian Fashion & Clothing Store",
  description:
    "Verse Two Fit is a Canadian clothing brand offering contemporary fashion for everyone. Shop our latest collections and elevate your style.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Verse Two Fit | Canadian Fashion & Clothing Store",
    description:
      "Verse Two Fit is a Canadian clothing brand offering contemporary fashion for everyone. Shop our latest collections and elevate your style.",
    images: ["/hero1-bg.webp"],
    url: "https://www.versetwofit.com/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const user = session?.user || null;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Providers>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
