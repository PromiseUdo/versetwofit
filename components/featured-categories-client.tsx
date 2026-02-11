// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { motion } from 'framer-motion';
// import Marquee from 'react-fast-marquee';
// import MaxWidthWrapper from './max-width-wrapper';

// const categories = [
//   { name: 'T-Shirts', slug: 't-shirts', image: '/hero1.jpg' },
//   { name: 'Headwears', slug: 'headwears', image: '/hero1.jpg' },
//   { name: 'Accessories', slug: 'accessories', image: '/hero1.jpg' },
//   { name: 'Tops', slug: 'tops', image: '/hero1.jpg' },
//   { name: 'Kicks', slug: 'kicks', image: '/hero1.jpg' },
// ];

// export default function FeaturedCategoriesCarousel() {
//   return (
//     <MaxWidthWrapper className="w-full mt-20">
//       <Marquee
//         gradient={true}
//         gradientColor="black"
//         speed={30}
//         pauseOnHover={true}
//         className="rounded-2xl"
//       >
//         {[...categories, ...categories].map((category, idx) => (
//           <div key={idx} className="flex-none w-64 px-3">
//             <Link href={`/categories/${category.slug}`}>
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ duration: 0.4, ease: 'easeOut' }}
//                 className="group relative aspect-3/4 overflow-hidden rounded-2xl shadow-lg bg-gray-100 dark:bg-gray-800 cursor-pointer"
//               >
//                 <Image
//                   src={category.image}
//                   alt={category.name}
//                   fill
//                   className="object-cover transition-transform duration-700 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                 <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
//                   <h3 className="text-2xl font-semibold">{category.name}</h3>
//                   <p className="text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
//                     Shop Now →
//                   </p>
//                 </div>
//               </motion.div>
//             </Link>
//           </div>
//         ))}
//       </Marquee>
//     </MaxWidthWrapper>
//   );
// }

// src/components/category-carousel-client.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
}

interface CategoryCarouselClientProps {
  categories: Category[];
}

export function CategoryCarouselClient({
  categories,
}: CategoryCarouselClientProps) {
  // Duplicate categories for seamless loop
  const duplicatedCategories = [...categories, ...categories];

  return (
    <Marquee
      gradient={true}
      gradientColor="#181818"
      speed={30}
      gradientWidth={100}
      pauseOnHover={true}
      className="rounded-2xl py-3 border-none overflow-y-hidden bg-white"
    >
      {duplicatedCategories.map((category, idx) => (
        <div
          key={`${category.id}-${idx}`}
          className="flex-none w-64 border-none px-3"
        >
          <Link href={`/category/${category.slug}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg bg-gray-100 dark:bg-gray-800 cursor-pointer"
            >
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-6xl font-bold text-white opacity-50">
                    {category.name.charAt(0)}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-semibold">{category.name}</h3>
                <p className="text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                  Shop Now →
                </p>
              </div>
            </motion.div>
          </Link>
        </div>
      ))}
    </Marquee>
  );
}
