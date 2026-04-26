// // src/components/product-reel-client.tsx
// // ============================================
// 'use client';

// import Autoplay from 'embla-carousel-autoplay';
// import useEmblaCarousel from 'embla-carousel-react';
// import { motion } from 'framer-motion';
// import { IconChevronRight } from '@tabler/icons-react';
// import { ProductCard } from './product-card';

// interface Variant {
//   id: string;
//   color: string | null;
//   size: string | null;
//   stock: number;
//   price: number | null;
// }

// interface Product {
//   id: string;
//   name: string;
//   slug: string;
//   price: number;
//   comparePrice: number | null;
//   images: string[];
//   category: {
//     name: string;
//   };
//   variants: Variant[];
// }

// interface ProductReelClientProps {
//   products: Product[];
// }

// export function ProductReelClient({ products }: ProductReelClientProps) {
//   const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
//     Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
//   ]);

//   return (
//     <>
//       {/* Desktop Grid */}
//       <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 px-8">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>

//       <div className="mt-10 w-full mx-auto flex justify-center px-6">
//         <motion.a
//           href="/products"
//           className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#B5844A] transition-colors duration-300"
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           viewport={{ once: true }}
//         >
//           See all
//           <IconChevronRight
//             size={16}
//             className="transition-transform duration-300 group-hover:translate-x-0.5"
//           />
//         </motion.a>
//       </div>

//       {/* Mobile Carousel */}
//       <div className="md:hidden overflow-hidden px-4" ref={emblaRef}>
//         <div className="flex">
//           {products.map((product) => (
//             <div key={product.id} className="flex-none w-72 px-3">
//               <ProductCard product={product} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// src/components/product-reel-client.tsx
// ============================================
'use client';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { IconChevronRight } from '@tabler/icons-react';
import { ProductCard } from './product-card';
import Link from 'next/link';

interface Variant {
  id: string;
  options: { name: string; value: string }[];
  stock: number;
  price: number | null;
}

interface Product {
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
}

interface ProductReelClientProps {
  products: Product[];
  type: 'new-arrivals' | 'featured';
}

export function ProductReelClient({ products, type }: ProductReelClientProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  return (
    <>
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 px-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-10 w-full mx-auto flex justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link
            href={`/products?filter=${type}`}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#B5844A] transition-colors duration-300"
          >
            See all
            <IconChevronRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden overflow-hidden px-4" ref={emblaRef}>
        <div className="flex">
          {products.map((product) => (
            <div key={product.id} className="flex-none w-72 px-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
