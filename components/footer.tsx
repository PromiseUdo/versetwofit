import Link from "next/link";
import Image from "next/image";
import MaxWidthWrapper from "./max-width-wrapper";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-500 pt-16 mt-4 border-t border-gray-100">
      <MaxWidthWrapper>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/logo.png"
                alt="Verse Two Fit"
                width={120}
                height={36}
                className=""
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-xs">
              Fashion for those who move with purpose. Quality pieces,
              thoughtfully made.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/versetwofit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@versetwofit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "New Arrivals", href: "/products?filter=new-arrivals" },
                { label: "T-Shirts", href: "/products?category=t-shirts" },
                { label: "Headwear", href: "/products?category=headwear" },
                { label: "Accessories", href: "/products?category=accessories" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">
              Help
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "My Orders", href: "/orders" },
                { label: "My Account", href: "/account" },
                { label: "Wishlist", href: "/wishlist" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-8">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5 text-sm text-gray-400">
            <p>© {currentYear} Verse Two Fit. All rights reserved.</p>
            <span className="hidden sm:block text-gray-200">|</span>
            <div className="flex items-center gap-4">
              {[
                { label: "About", href: "/about" },
                { label: "Shipping & Delivery", href: "/shipping" },
                { label: "Privacy Policy", href: "/privacy" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-gray-700 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {/* Visa */}
            <div className="bg-white rounded px-2 py-1 flex items-center">
              <svg
                className="h-5 w-auto"
                viewBox="0 0 48 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="0"
                  y="13"
                  fontFamily="Arial"
                  fontWeight="bold"
                  fontSize="14"
                  fill="#1A1F71"
                >
                  VISA
                </text>
              </svg>
            </div>
            {/* Mastercard */}
            <div className="bg-white rounded px-2 py-1 flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-[#EB001B]" />
              <div className="w-5 h-5 rounded-full bg-[#F79E1B] -ml-3 opacity-90" />
            </div>
            {/* Klarna */}
            <div className="bg-[#FFB3D1] rounded px-2 py-1 flex items-center">
              <img src="/klarna.png" alt="Klarna" className="h-4 w-auto" />
            </div>
            {/* Stripe */}
            <div className="bg-white rounded px-2 py-1 flex items-center">
              <svg
                className="h-4 w-auto"
                viewBox="0 0 60 25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="0"
                  y="18"
                  fontFamily="Arial"
                  fontWeight="bold"
                  fontSize="16"
                  fill="#635BFF"
                >
                  stripe
                </text>
              </svg>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
