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

// // src/components/featured-categories-carousel.tsx
// import Link from 'next/link';
// import Image from 'next/image';
// import Marquee from 'react-fast-marquee';
// import MaxWidthWrapper from './max-width-wrapper';
// import { prisma } from '@/lib/prisma';
// import { CategoryCarouselClient } from './featured-categories-client';

// export default async function FeaturedCategoriesCarousel() {
//   // Fetch categories from database
//   const categories = await prisma.category.findMany({
//     orderBy: { createdAt: 'desc' },
//     take: 10, // Limit to first 10 categories
//   });

//   // If no categories, show nothing or a message
//   if (categories.length === 0) {
//     return null;
//   }

//   return (
//     <MaxWidthWrapper className="w-full mt-20">
//       <CategoryCarouselClient categories={categories} />
//     </MaxWidthWrapper>
//   );
// }

// src/components/featured-categories-carousel-cached.tsx
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import MaxWidthWrapper from './max-width-wrapper';
import { CategoryCarouselClient } from './featured-categories-client';

// Cache the categories fetch for 1 hour
const getCategories = cache(async () => {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      description: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
});

export default async function FeaturedCategoriesCarousel() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <MaxWidthWrapper className="w-full mt-20">
      <CategoryCarouselClient categories={categories} />
    </MaxWidthWrapper>
  );
}

// Add revalidation in layout or page:
export const revalidate = 3600; // Revalidate every hour
