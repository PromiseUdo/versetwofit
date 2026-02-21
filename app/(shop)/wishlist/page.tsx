"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, HeartPulse } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useWishlistStore } from "@/store/wishlist-store";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ProductCard } from "@/components/product-card";
import { IconHeart } from "@tabler/icons-react";

interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  category: {
    name: string;
  };
  variants: any[];
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const productIds = useWishlistStore((state) => state.productIds);
  const { clearLocal } = useWishlistStore();

  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch wishlist products
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      setIsLoading(false);
      return;
    }

    const loadWishlist = async () => {
      try {
        const { data } = await axios.get("/api/wishlist");
        setProducts(data.products || []);
        // Ensure the global store is in sync so visibleProducts filter works
        useWishlistStore.setState({
          productIds: data.productIds || [],
          isLoaded: true,
        });
      } catch {
        toast.error("Failed to load wishlist");
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [session, status]);

  const handleClearAll = async () => {
    if (!session) return;
    try {
      await Promise.all(
        products.map((p) => axios.delete(`/api/wishlist?productId=${p.id}`)),
      );
      setProducts([]);
      clearLocal();
      toast.success("Wishlist cleared");
    } catch {
      toast.error("Failed to clear wishlist");
    }
  };

  // Auth check and loading states
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24">
        <MaxWidthWrapper>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
            <div className="space-y-3">
              <div className="h-8 w-48 bg-gray-100 animate-pulse rounded-lg" />
              <div className="h-4 w-32 bg-gray-100 animate-pulse rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full aspect-3/4 bg-gray-100 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        </MaxWidthWrapper>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <MaxWidthWrapper>
          <div className="max-w-md mx-auto text-center px-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconHeart size={40} className="text-primary" stroke={1.5} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sign in to view your wishlist
            </h1>
            <p className="text-gray-500 mb-8">
              Save your favorite items and access them from any device.
            </p>
            <button
              onClick={() => router.push("/login?callbackUrl=/wishlist")}
              className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 text-base font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Sign In
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </MaxWidthWrapper>
      </div>
    );
  }

  // Filter visible products based on the global store
  const visibleProducts = products.filter((p) => productIds.includes(p.id));

  if (visibleProducts.length === 0) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 h-48 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
        <div className="min-h-screen pt-32 pb-24">
          <MaxWidthWrapper>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg mx-auto text-center px-4 py-16"
            >
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <HeartPulse
                  size={48}
                  className="text-primary/40 -mt-1"
                  strokeWidth={1.5}
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center"
                >
                  <span className="text-xs font-bold text-gray-400">0</span>
                </motion.div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                Your Wishlist is Empty
              </h1>
              <p className="text-gray-500 mb-10 text-lg">
                Explore our collection and find something you love. Tap the
                heart icon to save items for later.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                Discover Products
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          </MaxWidthWrapper>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-48 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="min-h-screen pt-32 pb-24 relative z-20">
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-6"
          >
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                My Wishlist
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                {visibleProducts.length}{" "}
                {visibleProducts.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleClearAll}
                className="px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-xl transition-colors duration-200"
              >
                Clear All
              </button>
              <Link
                href="/products"
                className="px-5 py-2.5 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors duration-200 flex items-center gap-2"
              >
                Continue Shopping
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
          >
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product as any} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
