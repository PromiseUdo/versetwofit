// // src/components/product-card.tsx
// // ============================================
// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { cn } from '@/lib/utils';
// import { Heart, ShoppingCart } from 'lucide-react';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// interface Variant {
//   id: string;
//   color: string | null;
//   size: string | null;
//   stock: number;
//   price: number | null;
// }

// interface ProductCardProps {
//   product: {
//     id: string;
//     name: string;
//     slug: string;
//     price: number;
//     comparePrice: number | null;
//     images: string[];
//     category: {
//       name: string;
//     };
//     variants: Variant[];
//   };
// }

// export function ProductCard({ product }: ProductCardProps) {
//   const [isHovered, setIsHovered] = useState(false);
//   const { data: session } = useSession();
//   const router = useRouter();

//   // Get images
//   const mainImage = product.images[0] || '/hero1.jpg';
//   const hoverImage = product.images[1] || product.images[0] || '/hero2.jpg';

//   // Calculate discount
//   const discount = product.comparePrice
//     ? Math.round(
//         ((product.comparePrice - product.price) / product.comparePrice) * 100
//       )
//     : 0;

//   // Get total stock
//   const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

//   // Get unique colors and sizes
//   const colors = [
//     ...new Set(product.variants.filter((v) => v.color).map((v) => v.color)),
//   ];
//   const sizes = [
//     ...new Set(product.variants.filter((v) => v.size).map((v) => v.size)),
//   ];

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (totalStock === 0) {
//       toast.error('Product out of stock');
//       return;
//     }

//     // addItem({
//     //   id: product.id,
//     //   name: product.name,
//     //   price: product.price,
//     //   quantity: 1,
//     //   image: product.images[0],
//     //   stock: totalStock,
//     // });

//     toast.success('Added to cart!');
//   };

//   const handleAddToWishlist = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!session) {
//       router.push('/login');
//       toast.error('Please sign in to add to wishlist');
//       return;
//     }

//     try {
//       await axios.post('/api/wishlist', { productId: product.id });
//       toast.success('Added to wishlist!');
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || 'Failed to add to wishlist');
//     }
//   };

//   return (
//     <Link href={`/products/${product.slug}`}>
//       <div className="max-w-xs w-full">
//         <div
//           className={cn(
//             'group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800',
//             'transition-all duration-500'
//           )}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           style={{
//             backgroundImage: `url(${isHovered ? hoverImage : mainImage})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//           }}
//         >
//           {/* Hover Overlay */}
//           <div
//             className={cn(
//               'absolute inset-0 bg-black transition-opacity duration-500',
//               isHovered ? 'opacity-50' : 'opacity-0'
//             )}
//           />

//           {/* Gradient Overlay */}
//           <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>

//           {/* Badges */}
//           <div className="absolute top-3 left-3 flex flex-col gap-2 z-30">
//             {/* {discount > 0 && (
//               <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
//                 -{discount}%
//               </span>
//             )} */}
//             {totalStock === 0 && (
//               <span className="px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded">
//                 Out of Stock
//               </span>
//             )}
//             {totalStock > 0 && totalStock < 10 && (
//               <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
//                 Low Stock
//               </span>
//             )}
//           </div>

//           {/* Card Content */}
//           <div className="relative z-30 flex flex-col justify-end space-y-3">
//             {/* Category */}
//             {/* <p className="text-xs text-gray-300 uppercase tracking-wide">
//               {product.category.name}
//             </p> */}

//             {/* Product Title */}
//             <h2 className="text-xl md:text-2xl font-bold text-gray-50 line-clamp-1">
//               {product.name}
//             </h2>

//             {/* Variants Display */}
//             {/* {(colors.length > 0 || sizes.length > 0) && (
//               <div className="flex items-center gap-3 text-xs text-gray-300">
//                 {colors.length > 0 && (
//                   <div className="flex items-center gap-1">
//                     <span className="opacity-75">Colors:</span>
//                     <div className="flex gap-1">
//                       {colors.slice(0, 4).map((color, idx) => (
//                         <div
//                           key={idx}
//                           className="w-4 h-4 rounded-full border border-white/30"
//                           style={{
//                             backgroundColor: color?.toLowerCase() || '#ccc',
//                           }}
//                           title={color || 'Color'}
//                         />
//                       ))}
//                       {colors.length > 4 && (
//                         <span className="text-[10px] text-gray-400">
//                           +{colors.length - 4}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {sizes.length > 0 && (
//                   <div className="flex items-center gap-1">
//                     <span className="opacity-75">Sizes:</span>
//                     <span className="font-medium">
//                       {sizes.slice(0, 3).join(', ')}
//                       {sizes.length > 3 && ` +${sizes.length - 3}`}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )} */}

//             {/* Prices */}
//             <div className="flex items-center space-x-2">
//               {product.comparePrice && (
//                 <span className="text-sm text-gray-400 line-through">
//                   ${product.comparePrice.toLocaleString()}
//                 </span>
//               )}
//               <span className="text-lg font-semibold text-gray-50">
//                 ${product.price.toLocaleString()}
//               </span>
//             </div>

//             {/* Actions - Show on hover */}
//             <motion.div
//               initial={{ opacity: 0, y: 12 }}
//               animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
//               transition={{ duration: 0.3 }}
//               className="flex space-x-2"
//             >
//               <button
//                 onClick={handleAddToCart}
//                 disabled={totalStock === 0}
//                 className={cn(
//                   'px-4 py-2 flex-1 flex items-center gap-2 justify-center rounded-md border border-[#f3f3f3] text-[#f3f3f3] text-sm transition duration-200',
//                   totalStock > 0
//                     ? 'hover:border-black hover:bg-[#f3f3f3] hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
//                     : 'opacity-50 cursor-not-allowed'
//                 )}
//               >
//                 <ShoppingCart size={18} />
//                 {totalStock > 0 ? 'Add to Cart' : 'Out of Stock'}
//               </button>

//               <button
//                 onClick={handleAddToWishlist}
//                 className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-200 transition-colors dark:border-neutral-700 dark:hover:bg-neutral-800"
//               >
//                 <Heart size={18} className="text-red-500" />
//               </button>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

// src/components/product-card.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

interface Variant {
  id: string;
  color: string | null;
  size: string | null;
  stock: number;
  price: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  weight?: number | null;
  // sku: string;
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    category: {
      name: string;
    };
    variants: Variant[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleItem, fetchWishlist, isLoaded } =
    useWishlistStore();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const wishlisted = isInWishlist(product.id);

  // Fetch wishlist on mount if logged in and not yet loaded
  useEffect(() => {
    if (session && !isLoaded) {
      fetchWishlist();
    }
  }, [session, isLoaded, fetchWishlist]);

  // Get images
  const mainImage = product.images[0] || "/hero1.jpg";
  const hoverImage = product.images[1] || product.images[0] || "/hero2.jpg";

  // Calculate discount
  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100,
      )
    : 0;

  // Get total stock
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  // Get unique colors and sizes
  const colors = [
    ...new Set(product.variants.filter((v) => v.color).map((v) => v.color)),
  ];
  const sizes = [
    ...new Set(product.variants.filter((v) => v.size).map((v) => v.size)),
  ];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (totalStock === 0) {
      toast.error("Product out of stock");
      return;
    }

    // Find the first available variant
    const availableVariant = product.variants.find((v) => v.stock > 0);

    if (!availableVariant) {
      toast.error("No available variants");
      return;
    }

    // Determine the price to use
    const itemPrice = availableVariant.price ?? product.price;

    // Add to cart
    addItem({
      id: availableVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantSku: "",
      color: availableVariant.color,
      size: availableVariant.size,
      price: itemPrice,
      quantity: 1,
      image: product.images[0] || "/hero1.jpg",
      stock: availableVariant.stock,
      length: availableVariant.length ?? null,
      width: availableVariant.width ?? null,
      height: availableVariant.height ?? null,
      weight: availableVariant.weight ?? null,
    });

    toast.success(
      `${product.name} added to cart${
        availableVariant.color || availableVariant.size
          ? ` (${[availableVariant.color, availableVariant.size]
              .filter(Boolean)
              .join(", ")})`
          : ""
      }`,
    );
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/login");
      toast.error("Please sign in to add to wishlist");
      return;
    }

    if (isWishlistLoading) return;
    setIsWishlistLoading(true);

    try {
      const action = await toggleItem(product.id);
      toast.success(
        action === "added" ? "Added to wishlist!" : "Removed from wishlist",
      );
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="max-w-xs w-full">
        <div
          className={cn(
            "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
            "transition-all duration-500",
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundImage: `url(${isHovered ? hoverImage : mainImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Hover Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-black transition-opacity duration-500",
              isHovered ? "opacity-50" : "opacity-0",
            )}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-30">
            {totalStock === 0 && (
              <span className="px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded">
                Out of Stock
              </span>
            )}
            {totalStock > 0 && totalStock < 10 && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
                Low Stock
              </span>
            )}
          </div>

          {/* Card Content */}
          <div className="relative z-30 flex flex-col justify-end space-y-3">
            {/* Product Title */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-50 line-clamp-1">
              {product.name}
            </h2>

            {/* Prices */}
            <div className="flex items-center space-x-2">
              {product.comparePrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.comparePrice.toLocaleString()}
                </span>
              )}
              <span className="text-lg font-semibold text-gray-50">
                ${product.price.toLocaleString()}
              </span>
            </div>

            {/* Actions - Show on hover */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
              className="flex space-x-2"
            >
              <button
                onClick={handleAddToCart}
                disabled={totalStock === 0}
                className={cn(
                  "px-4 py-2 flex-1 flex items-center gap-2 justify-center rounded-md border border-[#f3f3f3] text-[#f3f3f3] text-sm transition duration-200",
                  totalStock > 0
                    ? "hover:border-primary hover:bg-[#f3f3f3] hover:text-primary hover:shadow-[4px_4px_0px_0px_var(--color-primary)]"
                    : "opacity-50 cursor-not-allowed",
                )}
              >
                <ShoppingCart size={18} />
                {totalStock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

              <button
                onClick={handleAddToWishlist}
                disabled={isWishlistLoading}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200",
                  wishlisted
                    ? "bg-red-50 border border-red-200 hover:bg-red-100"
                    : "border border-gray-300 hover:bg-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800",
                )}
              >
                <Heart
                  size={18}
                  className={cn(
                    "transition-colors",
                    wishlisted ? "text-red-500 fill-red-500" : "text-red-500",
                  )}
                />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </Link>
  );
}
