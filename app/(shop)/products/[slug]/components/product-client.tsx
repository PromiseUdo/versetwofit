// 'use client';

// import { useState } from 'react';
// import Image from 'next/image';
// import MaxWidthWrapper from '@/components/max-width-wrapper';
// import {
//   IconAlertCircle,
//   IconBrandFacebook,
//   IconBrandTwitter,
//   IconBrandWhatsapp,
//   IconHeart,
//   IconLock,
//   IconMinus,
//   IconPackage,
//   IconPlus,
//   IconShoppingCart,
// } from '@tabler/icons-react';
// import { DirectionAwareHover } from '@/components/ui/direction-aware-hover';
// import RelatedProducts from './related-products';
// import { Product } from '@prisma/client';

// type ColorOption = {
//   name: string;
//   ring: string;
//   bg: string;
// };

// const images = ['/hero1.jpg', '/hero1.jpg', '/hero1.jpg', '/hero1.jpg'];

// const colors: ColorOption[] = [
//   { name: 'Black', ring: 'ring-zinc-700', bg: 'bg-zinc-400' },
//   { name: 'Gray', ring: 'ring-zinc-300', bg: 'bg-zinc-200' },
//   { name: 'Purple', ring: 'ring-purple-300', bg: 'bg-purple-200' },
//   { name: 'Pink', ring: 'ring-pink-300', bg: 'bg-pink-200' },
// ];

// const sizes = {
//   US: ['6', '7', '8', '9', '10', '11'],
//   EU: ['39', '40', '41', '42', '43', '44'],
// };

// const about = ['We are good'];

// const specifications = [{ label: 'Material', value: 'Silicone' }];

// const description = 'The content to be rendered inside the component.';

// export default function ProductClient({ product }: { product: Product }) {
//   const [activeImage, setActiveImage] = useState(0);
//   const [activeColor, setActiveColor] = useState<string | null>(null);
//   const [sizeSystem, setSizeSystem] = useState<'US' | 'EU'>('US');
//   const [activeSize, setActiveSize] = useState<string | null>(null);
//   const [quantity, setQuantity] = useState(1);

//   return (
//     <>
//       <div className="fixed top-0 left-0 right-0 h-48 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

//       {/* <div className="fixed top-0 left-0 right-0 h-56 bg-linear-to-b from-black/90 via-black/40 to-transparent pointer-events-none z-10" /> */}

//       <MaxWidthWrapper className="my-24">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-zinc-900">
//           {/* Image Gallery */}
//           <div className="flex flex-col lg:sticky lg:top-24 gap-2">
//             <div className="overflow-hidden aspect-square bg-zinc-100 rounded-2xl relative">
//               <DirectionAwareHover
//                 imageUrl={images[activeImage]}
//                 imageClassName="object-cover"
//               >
//                 <></>
//               </DirectionAwareHover>
//             </div>

//             <div className="grid grid-cols-6 gap-2">
//               {images.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setActiveImage(index)}
//                   className={`overflow-hidden rounded-xl aspect-square bg-zinc-100 relative border ${
//                     activeImage === index
//                       ? 'ring-2 ring-zinc-900'
//                       : 'border-zinc-200'
//                   }`}
//                 >
//                   <Image src={image} alt="" fill className="object-cover" />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Product Details */}
//           <div className="flex flex-col">
//             <h1 className=" text-zinc-600 text-xl md:text-2xl font-semibold">
//               Nike Air Force 1´07 Fresh
//             </h1>
//             <p className="mt-1 font-medium text-zinc-600">
//               <del className="opacity-40">$190</del>
//               $152 -<span className="text-green-400">20% Off</span>
//             </p>

//             <p className="mt-4 text-zinc-600">
//               Hitting the field in the late ’60s, adidas airmaxS quickly became
//               soccer&apos;s “it” shoe.
//             </p>

//             {/* Options */}
//             <div className="flex flex-col mt-6 gap-6">
//               {/* Color */}
//               <div>
//                 <p className="uppercase text-sm text-zinc-600">Color</p>
//                 <div className="mt-2 flex flex-wrap gap-3">
//                   {colors.map((color) => (
//                     <button
//                       key={color.name}
//                       onClick={() => setActiveColor(color.name)}
//                       className={`rounded-full p-0.5 ${
//                         activeColor === color.name
//                           ? 'ring-2 ring-offset-2 ring-zinc-900'
//                           : ''
//                       }`}
//                     >
//                       <span
//                         className={`block size-6 rounded-full ring-1 ${color.ring} ${color.bg}`}
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Size */}
//               <div>
//                 <div className="flex items-center justify-between">
//                   <p className="uppercase text-sm text-zinc-600">Shoe size</p>
//                   <select
//                     value={sizeSystem}
//                     onChange={(e) => {
//                       setSizeSystem(e.target.value as 'US' | 'EU');
//                       setActiveSize(null);
//                     }}
//                     className="h-8 px-2 bg-white border border-zinc-300 rounded-md text-sm"
//                   >
//                     <option value="US">US</option>
//                     <option value="EU">EU</option>
//                   </select>
//                 </div>

//                 <div className="mt-2 grid grid-cols-4 gap-2">
//                   {sizes[sizeSystem].map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => setActiveSize(size)}
//                       className={`px-3 py-2 rounded-md border text-sm font-medium ${
//                         activeSize === size
//                           ? 'bg-zinc-900 text-white border-zinc-900'
//                           : 'bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100'
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex flex-col items-start gap-1.5">
//                 <p className="uppercase text-sm text-zinc-600">Units</p>
//                 <div className="flex items-center  border border-gray-300 rounded-lg overflow-hidden">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="p-2 hover:bg-gray-100 transition-colors"
//                     aria-label="Decrease"
//                   >
//                     <IconMinus size={16} />
//                   </button>
//                   <span className="px-4 py-1 text-sm font-medium min-w-12 text-center">
//                     {quantity}
//                   </span>
//                   <button
//                     onClick={() => setQuantity(quantity + 1)}
//                     className="p-2 hover:bg-gray-100 transition-colors"
//                     aria-label="Increase"
//                   >
//                     <IconPlus size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex mt-8 gap-2">
//               <button className="h-9 w-full rounded-md bg-zinc-900 text-white hover:bg-zinc-800">
//                 Add to Cart
//               </button>
//               <button className="h-9 w-full rounded-md border border-zinc-300 hover:bg-zinc-100">
//                 Buy Now
//               </button>
//             </div>

//             {/* <p className="mt-2 text-sm text-zinc-600">Free shipping over $50</p> */}
//             <div className="mt-3 flex items-center gap-3">
//               <a href="#" aria-label="Share on Facebook">
//                 <IconBrandFacebook size={18} strokeWidth={1.5} />
//               </a>

//               <a href="#" aria-label="Share on Twitter">
//                 <IconBrandTwitter size={18} strokeWidth={1.5} />
//               </a>

//               <a href="#" aria-label="Share on WhatsApp">
//                 <IconBrandWhatsapp size={18} strokeWidth={1.5} />
//               </a>
//             </div>

//             {/* Accordions */}
//             <div className="mt-8 divide-y divide-zinc-200">
//               {[
//                 // {
//                 //   title: 'Details',
//                 //   content: 'High-quality materials and comfort.',
//                 // },
//                 { title: 'Shipping', content: 'Free shipping over $50.' },
//                 { title: 'Returns', content: '30-day return policy.' },
//               ].map((section) => (
//                 <details key={section.title} className="py-4">
//                   <summary className="cursor-pointer font-medium">
//                     {section.title}
//                   </summary>
//                   <p className="mt-2 text-zinc-600">{section.content}</p>
//                 </details>
//               ))}
//             </div>

//             {/* social media icons here */}

//             {/* Social Share */}
//           </div>
//         </div>

//         <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* LEFT: Description + Specs (9 cols on desktop) */}
//           <div className="bg-white  rounded-md border border-[#B5844A]/20  p-3 sm:p-8 lg:col-span-9 space-y-8">
//             {/* Product Description */}
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900 mb-3">
//                 Product Description
//               </h2>
//               <div className="prose prose-sm max-w-none text-gray-700  text-sm leading-relaxed">
//                 {description}
//               </div>
//             </div>

//             {/* Specifications Table */}
//             <div className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Specifications
//               </h3>
//               <table className="w-full text-sm text-gray-700">
//                 <tbody>
//                   {(specifications ?? []).map(
//                     (spec: { label: string; value: string }, idx: number) => (
//                       <tr
//                         key={idx}
//                         className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
//                       >
//                         <td className="py-2 pr-4 text-sm font-medium text-gray-900">
//                           {spec.label}
//                         </td>
//                         <td className="py-2 pl-4 text-sm ">{spec.value}</td>
//                       </tr>
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* About This Item */}
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-3">
//                 About this item
//               </h3>
//               <ul className="space-y-2 text-sm text-gray-700">
//                 {about.map((item: string, idx: number) => (
//                   <li key={idx} className="flex items-start">
//                     <span className="mr-2 text-[#B5844A]">•</span>
//                     <span>{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div className="lg:col-span-3 space-y-6">
//             <div className="bg-gradient-to-br rounded-md from-[#B5844A]/5 to-[#d4a574]/5 p-3 sm:p-8  border border-[#B5844A]/20">
//               <h3 className="text-lg font-semibold text-gray-900 mb-5">
//                 Why Shop With Us?
//               </h3>
//               <div className="space-y-5">
//                 {[
//                   {
//                     Icon: IconPackage,
//                     title: 'Discreet Packaging',
//                     desc: 'Plain box, no product name or branding visible.',
//                   },
//                   {
//                     Icon: IconHeart,
//                     title: 'Pleasure Guarantee',
//                     desc: 'Love it or we’ll make it right — no returns needed.',
//                   },
//                   {
//                     Icon: IconLock,
//                     title: 'Secure Payment',
//                     desc: 'Encrypted checkout, 100% safe.',
//                   },
//                 ].map(({ Icon, title, desc }, idx) => (
//                   <div key={idx} className="flex gap-3">
//                     <div className="flex-shrink-0 mt-0.5">
//                       <Icon
//                         size={24}
//                         className="text-[#B5844A]"
//                         strokeWidth={1.5}
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">{title}</p>
//                       <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ===========RELATED PRODUCT REEL - use product card */}
//         <RelatedProducts />
//       </MaxWidthWrapper>
//     </>
//   );
// }

'use client';

import { useState } from 'react';
import Image from 'next/image';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconHeart,
  IconLock,
  IconMinus,
  IconPackage,
  IconPlus,
  IconCheck,
  IconShoppingCart,
} from '@tabler/icons-react';
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover';
import RelatedProducts from './related-products';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cart-store';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';

type ProductVariant = {
  id: string;
  color: string | null;
  size: string | null;
  sku: string;
  stock: number;
  price: number | null;
};

type ProductSpecification = {
  key: string;
  value: string;
};

type FormattedProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  aboutItems: string[];
  specifications: ProductSpecification[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
};

export default function ProductClient({
  product,
}: {
  product: FormattedProduct;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const addItem = useCartStore((state) => state.addItem);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Extract unique colors and sizes from variants
  const availableColors = Array.from(
    new Set(product.variants.map((v) => v.color).filter(Boolean))
  );
  const availableSizes = Array.from(
    new Set(product.variants.map((v) => v.size).filter(Boolean))
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(
    availableColors[0] || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    availableSizes[0] || null
  );

  // Update selected variant when color/size changes
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const variant = product.variants.find(
      (v) => v.color === color && v.size === selectedSize
    );
    if (variant) setSelectedVariant(variant);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    const variant = product.variants.find(
      (v) => v.color === selectedColor && v.size === size
    );
    if (variant) setSelectedVariant(variant);
  };

  const finalPrice = selectedVariant?.price ?? product.price;

  const comparePrice = product.comparePrice;

  const hasDiscount = comparePrice !== null && comparePrice > finalPrice;

  const discountPercentage = hasDiscount
    ? Math.round(((comparePrice - finalPrice) / comparePrice) * 100)
    : 0;

  // Add to Cart Handler
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    if (selectedVariant.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    if (quantity > selectedVariant.stock) {
      toast.error(`Only ${selectedVariant.stock} items available`);
      return;
    }

    setIsAddingToCart(true);

    try {
      // Add to cart store
      addItem({
        id: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantSku: selectedVariant.sku,
        color: selectedVariant.color,
        size: selectedVariant.size,
        price: finalPrice,
        quantity: quantity,
        image: product.images[0] || '/placeholder.jpg',
        stock: selectedVariant.stock,
      });

      // Build variant description
      const variantDesc = [selectedVariant.color, selectedVariant.size]
        .filter(Boolean)
        .join(', ');

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Added to cart!</p>
          <p className="text-sm text-gray-600">
            {product.name} {variantDesc ? `(${variantDesc})` : ''} x {quantity}
          </p>
        </div>,
        { duration: 3000 }
      );

      // Reset quantity to 1 after adding
      setQuantity(1);
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Buy Now Handler
  const handleBuyNow = async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    if (selectedVariant.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    // Add to cart first
    await handleAddToCart();

    // Then redirect to checkout
    router.push('/checkout');
  };

  // Add to Wishlist Handler
  const handleAddToWishlist = async () => {
    if (!session) {
      router.push('/login');
      toast.error('Please sign in to add to wishlist');
      return;
    }

    try {
      await axios.post('/api/wishlist', { productId: product.id });
      toast.success('Added to wishlist!');
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Already in wishlist');
      } else {
        toast.error(error.response?.data?.error || 'Failed to add to wishlist');
      }
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-48 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

      <MaxWidthWrapper className="my-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-zinc-900">
          {/* Image Gallery */}
          <div className="flex flex-col lg:sticky lg:top-24 gap-2 h-fit">
            <div className="overflow-hidden aspect-square bg-zinc-100 rounded-2xl relative">
              <DirectionAwareHover
                imageUrl={product.images[activeImage] || '/placeholder.jpg'}
                imageClassName="object-cover"
              >
                <></>
              </DirectionAwareHover>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-xl aspect-square bg-zinc-100 relative border ${
                    activeImage === index
                      ? 'ring-2 ring-zinc-900'
                      : 'border-zinc-200'
                  }`}
                >
                  <Image src={image} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-zinc-600 text-xl md:text-2xl font-semibold">
              {product.name}
            </h1>
            <p className="mt-1 font-medium text-zinc-600">
              {hasDiscount && (
                <del className="opacity-40">
                  ₦{product.comparePrice?.toLocaleString()}
                </del>
              )}{' '}
              ₦{finalPrice.toLocaleString()}
              {hasDiscount && (
                <span className="text-green-400">
                  {' '}
                  - {discountPercentage}% Off
                </span>
              )}
            </p>

            <p className="mt-4 text-zinc-600 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Options */}
            <div className="flex flex-col mt-6 gap-6">
              {/* Color */}
              {availableColors.length > 0 && (
                <div>
                  <p className="uppercase text-sm text-zinc-600 mb-2">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color!)}
                        className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                          selectedColor === color
                            ? 'bg-zinc-900 text-white border-zinc-900'
                            : 'bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              {availableSizes.length > 0 && (
                <div>
                  <p className="uppercase text-sm text-zinc-600 mb-2">Size</p>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size!)}
                        className={`px-3 py-2 rounded-md border text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-zinc-900 text-white border-zinc-900'
                            : 'bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              {selectedVariant && (
                <div className="flex items-center gap-2">
                  {selectedVariant.stock > 0 ? (
                    <>
                      <IconCheck size={18} className="text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        In Stock ({selectedVariant.stock} available)
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-red-600 font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="flex flex-col items-start gap-1.5">
                <p className="uppercase text-sm text-zinc-600">Quantity</p>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease"
                  >
                    <IconMinus size={16} />
                  </button>
                  <span className="px-4 py-1 text-sm font-medium min-w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(selectedVariant?.stock || 999, quantity + 1)
                      )
                    }
                    className="p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Increase"
                    disabled={
                      selectedVariant
                        ? quantity >= selectedVariant.stock
                        : false
                    }
                  >
                    <IconPlus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex mt-8 gap-2">
              <button
                onClick={handleAddToCart}
                disabled={
                  !selectedVariant ||
                  selectedVariant.stock === 0 ||
                  isAddingToCart
                }
                className="h-11 w-full rounded-md bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
                // disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <IconShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={
                  !selectedVariant ||
                  selectedVariant.stock === 0 ||
                  isAddingToCart
                }
                className="h-11 w-full rounded-md border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                // disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                Buy Now
              </button>

              <button
                onClick={handleAddToWishlist}
                className="h-11 w-full rounded-md border border-zinc-300 hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 font-medium text-zinc-700"
              >
                <IconHeart size={20} />
                Add to Wishlist
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <a href="#" aria-label="Share on Facebook">
                <IconBrandFacebook size={18} strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="Share on Twitter">
                <IconBrandTwitter size={18} strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="Share on WhatsApp">
                <IconBrandWhatsapp size={18} strokeWidth={1.5} />
              </a>
            </div>

            {/* Accordions */}
            <div className="mt-8 divide-y divide-zinc-200">
              {[
                { title: 'Shipping', content: 'Free shipping over ₦50,000.' },
                { title: 'Returns', content: '30-day return policy.' },
              ].map((section) => (
                <details key={section.title} className="py-4">
                  <summary className="cursor-pointer font-medium">
                    {section.title}
                  </summary>
                  <p className="mt-2 text-zinc-600 text-sm">
                    {section.content}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Description, Specs, and About Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Description + Specs + About (9 cols on desktop) */}
          <div className="bg-white rounded-md border border-[#B5844A]/20 p-3 sm:p-8 lg:col-span-9 space-y-8">
            {/* Product Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Product Description
              </h2>
              <div className="prose prose-sm max-w-none text-gray-700 text-sm leading-relaxed">
                {product.description}
              </div>
            </div>

            {/* About This Item */}
            {product.aboutItems && product.aboutItems.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  {/* <span className="w-1 h-6 bg-[#B5844A] rounded-full"></span> */}
                  About this item
                </h3>
                <ul className="space-y-3">
                  {product.aboutItems.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-[#B5844A]"></span>
                      <span className="text-sm text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications Table */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  {/* <span className="w-1 h-6 bg-[#B5844A] rounded-full"></span> */}
                  Specifications
                </h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-200">
                      {product.specifications.map(
                        (spec: ProductSpecification, idx: number) => (
                          <tr
                            key={idx}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50 w-1/3">
                              {spec.key}
                            </td>
                            <td className="py-3 px-4 text-gray-700 bg-white">
                              {spec.value}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Why Shop With Us (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gradient-to-br rounded-md from-[#B5844A]/5 to-[#d4a574]/5 p-3 sm:p-8  border border-[#B5844A]/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">
                Why Shop With Us?
              </h3>
              <div className="space-y-5">
                {[
                  {
                    Icon: IconPackage,
                    title: 'Discreet Packaging',
                    desc: 'Plain box, no product name or branding visible.',
                  },
                  {
                    Icon: IconHeart,
                    title: 'Pleasure Guarantee',
                    desc: 'Love it or we’ll make it right — no returns needed.',
                  },
                  {
                    Icon: IconLock,
                    title: 'Secure Payment',
                    desc: 'Encrypted checkout, 100% safe.',
                  },
                ].map(({ Icon, title, desc }, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon
                        size={24}
                        className="text-[#B5844A]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {/* <RelatedProducts categoryId={product.category.id} currentProductId={product.id} /> */}
      </MaxWidthWrapper>
    </>
  );
}
