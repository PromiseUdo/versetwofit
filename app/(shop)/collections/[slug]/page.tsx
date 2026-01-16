// 'use client';
// import MaxWidthWrapper from '@/components/max-width-wrapper';
// import SlicedText from '@/components/sliced-text';
// import React from 'react';
// import { motion } from 'framer-motion';
// import { IconChevronRight } from '@tabler/icons-react';
// import useEmblaCarousel from 'embla-carousel-react';
// import Autoplay from 'embla-carousel-autoplay';
// import FloatingFilterPanel from '../../components/floating-filter-panel';
// import { ProductCard } from '@/components/product-card';

// const products = [
//   {
//     id: 1,
//     name: 'Oversized Graphic Tee',
//     price: 89,
//     originalPrice: 120,
//     rating: 4.8,
//     reviews: 124,
//     isNew: true,
//     isSale: true,
//     image:
//       'https://www.shutterstock.com/image-photo/oversized-t-shirt-front-back-260nw-2621324773.jpg',
//   },
//   {
//     id: 2,
//     name: 'Street Snapback Cap',
//     price: 45,
//     rating: 4.6,
//     reviews: 89,
//     isNew: true,
//     image:
//       'https://imageio.forbes.com/specials-images/imageserve/6685d34e7a42c457b2a8a229/0x0.jpg?format=jpg&crop=2256,1270,x0,y65,safe&height=600&width=1200&fit=bounds',
//   },
//   {
//     id: 3,
//     name: 'Layered Chain Necklace',
//     price: 68,
//     originalPrice: 95,
//     rating: 4.9,
//     reviews: 201,
//     isSale: true,
//     image: 'https://m.media-amazon.com/images/I/61xoXE2ZLnL._AC_UY1000_.jpg',
//   },
//   {
//     id: 4,
//     name: 'Patchwork Hoodie',
//     price: 129,
//     rating: 5.0,
//     reviews: 156,
//     isNew: true,
//     image: 'https://m.media-amazon.com/images/I/513+AsXC4KL._AC_UY1000_.jpg',
//   },
//   {
//     id: 5,
//     name: 'Retro High-Top Sneakers',
//     price: 179,
//     originalPrice: 220,
//     rating: 4.7,
//     reviews: 312,
//     isSale: true,
//     image:
//       'https://cdn.runrepeat.com/storage/gallery/buying_guide_primary/78/78-best-nike-sneakers-16286817-main.jpg',
//   },
//   {
//     id: 6,
//     name: 'Minimal Crewneck Tee',
//     price: 75,
//     rating: 4.5,
//     reviews: 98,
//     image:
//       'https://www.shutterstock.com/image-photo/beige-dark-t-shirt-mockup-260nw-2516714529.jpg',
//   },
//   {
//     id: 7,
//     name: 'Embroidered Dad Hat',
//     price: 42,
//     rating: 4.8,
//     reviews: 67,
//     isNew: true,
//     image:
//       'https://content.api.news/v3/images/bin/d19d1ac4f79b7e87db9b4d2eaa1759b8',
//   },
//   {
//     id: 8,
//     name: 'Bold Statement Bracelet',
//     price: 55,
//     originalPrice: 80,
//     rating: 4.6,
//     reviews: 145,
//     isSale: true,
//     image:
//       'https://i2f9m2t2.rocketcdn.me/wp-content/uploads/2023/02/Streetwear-Brand-Jewelry_Ft-Img_1200x661_FA.jpg',
//   },
// ];

// const page = () => {
//   const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
//     Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
//   ]);

//   const handleFilterChange = (filters: any) => {
//     console.log('Applied filters:', filters);
//   };
//   return (
//     <>
//       <div className="fixed top-0 left-0 right-0 h-48 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
//       <FloatingFilterPanel onFilterChange={handleFilterChange} />

//       <MaxWidthWrapper className="pt-20  bg-white">
//         <div className="container mx-auto">
//           <div className="px-8 mb-4">
//             <SlicedText text="New Arrivals" />
//           </div>

//           {/* Desktop Grid */}
//           <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>

//           {/* Mobile Carousel */}
//           <div className="md:hidden overflow-hidden" ref={emblaRef}>
//             <div className="flex">
//               {products.map((product) => (
//                 <div key={product.id} className="flex-none w-72 px-3">
//                   <ProductCard product={product} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </MaxWidthWrapper>
//     </>
//   );
// };

// export default page;

import React from 'react';

const page = () => {
  return <div>page</div>;
};

export default page;
