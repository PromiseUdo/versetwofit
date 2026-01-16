// 'use client';

// import { useRef, useState, useEffect } from 'react';
// import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
// import MatrixText from '@/components/glitch-text';
// import SlicedText from '@/components/sliced-text';
// import { ProductCard } from '@/components/product-card';

// interface RelatedProduct {
//   id: string;
//   title: string;
//   slug: string;
//   price: number;
//   finalPrice: number;
//   discountAmount: number;
//   hasDiscount: boolean;
//   images: string[];
//   inStock: boolean;
//   isFeatured: boolean;
//   discountType?: 'AMOUNT' | 'PERCENTAGE';
//   discountValue?: number;
//   stockQuantity: number;
//   lowStockThreshold: number;
// }

// interface RelatedProductsProps {
//   productSlug: string;
// }
// const products = [1, 2, 3, 4];
// export default function RelatedProducts() {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);
//   //   const [products, setProducts] = useState<RelatedProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch related products
//   //   useEffect(() => {
//   //     const fetchRelatedProducts = async () => {
//   //       try {
//   //         setLoading(true);
//   //         setError(null);

//   //         const response = await fetch(`/api/products/${productSlug}/related`);
//   //         const data = await response.json();

//   //         if (!response.ok) {
//   //           throw new Error(data.error || 'Failed to fetch related products');
//   //         }

//   //         setProducts(data.products || []);
//   //       } catch (err: any) {
//   //         console.error('Error fetching related products:', err);
//   //         setError(err.message);
//   //       } finally {
//   //         setLoading(false);
//   //       }
//   //     };

//   //     if (productSlug) {
//   //       fetchRelatedProducts();
//   //     }
//   //   }, [productSlug]);

//   // Check scroll position
//   const checkScroll = () => {
//     if (!scrollRef.current) return;
//     const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
//     setCanScrollLeft(scrollLeft > 0);
//     setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
//   };

//   // Setup scroll listeners
//   useEffect(() => {
//     checkScroll();
//     const el = scrollRef.current;
//     if (el) {
//       el.addEventListener('scroll', checkScroll);
//       window.addEventListener('resize', checkScroll);
//       return () => {
//         el.removeEventListener('scroll', checkScroll);
//         window.removeEventListener('resize', checkScroll);
//       };
//     }
//   }, [products]);

//   // Scroll function
//   const scroll = (direction: 'left' | 'right') => {
//     if (!scrollRef.current) return;
//     const cardWidth = 272; // w-64 + gap-6 = 256 + 16
//     const scrollAmount = cardWidth * 2; // scroll 2 cards at a time
//     scrollRef.current.scrollBy({
//       left: direction === 'left' ? -scrollAmount : scrollAmount,
//       behavior: 'smooth',
//     });
//   };

//   // Don't render if no products or error
//   if (error) {
//     console.error('Related products error:', error);
//     return null;
//   }

//   if (loading) {
//     return (
//       <section className="mt-16 overflow-hidden">
//         <div className="mb-8">
//           <SlicedText className="text-left" text="Related Products" />
//           <div className="mt-1.5 h-0.5 w-20 bg-[#B5844A] rounded-full" />
//         </div>
//         <div className="flex gap-6 overflow-hidden">
//           {[1, 2, 3, 4].map((i) => (
//             <div
//               key={i}
//               className="w-64 h-96 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
//             />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   if (!products.length) {
//     return null;
//   }

//   return (
//     <section className="mt-16 overflow-hidden">
//       <div className="mb-8 bg-red-500">
//         {/* <h2 className="text-2xl font-bold text-gray-900">Related Products</h2> */}

//         <SlicedText className="text-left" text="Related Products" />
//         <div className="mt-1.5 h-0.5 w-20 bg-[#B5844A] rounded-full" />
//       </div>

//       <div className="relative">
//         {/* Scrollable Container */}
//         <div
//           ref={scrollRef}
//           className="overflow-x-auto scrollbar-hide -mx-6 px-6"
//           onScroll={checkScroll}
//         >
//           <div className="flex gap-6 min-w-max pb-4">
//             {products.map((product, index) => (
//               <ProductCard
//                 key={index}
//                 product={{
//                   id: product.id,
//                   title: product.title,
//                   slug: product.slug,
//                   price: product.price,
//                   finalPrice: product.finalPrice,
//                   image: product.images[0] || '/placeholder.jpg',
//                   images: product.images,
//                   inStock: product.inStock,
//                   isFeatured: product.isFeatured,
//                   hasDiscount: product.hasDiscount,
//                   discountType: product.discountType,
//                   discountValue: product.discountValue,
//                   stockQuantity: product.stockQuantity,
//                   lowStockThreshold: product.lowStockThreshold,
//                 }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Left Arrow */}
//         {canScrollLeft && (
//           <button
//             onClick={() => scroll('left')}
//             className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all z-10 border border-gray-200"
//             aria-label="Scroll left"
//           >
//             <IconChevronLeft size={20} className="text-gray-700" />
//           </button>
//         )}

//         {/* Right Arrow */}
//         {canScrollRight && (
//           <button
//             onClick={() => scroll('right')}
//             className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all z-10 border border-gray-200"
//             aria-label="Scroll right"
//           >
//             <IconChevronRight size={20} className="text-gray-700" />
//           </button>
//         )}
//       </div>
//     </section>
//   );
// }

import React from 'react';

const RelatedProducts = () => {
  return <div>RelatedProducts</div>;
};

export default RelatedProducts;
