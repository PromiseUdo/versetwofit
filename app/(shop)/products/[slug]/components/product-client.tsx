"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconHeart,
  IconMinus,
  IconPlus,
  IconCheck,
  IconShoppingCart,
  IconPackage,
  IconLock,
} from "@tabler/icons-react";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ProductCard } from "@/components/product-card";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";

type ProductVariant = {
  id: string;
  color: string | null;
  size: string | null;
  sku: string;
  stock: number;
  price: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  weight: number | null;
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

type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  category: {
    name: string;
  };
  variants: {
    id: string;
    color: string | null;
    size: string | null;
    stock: number;
    price: number | null;
  }[];
};

export default function ProductClient({
  product,
  relatedProducts = [],
}: {
  product: FormattedProduct;
  relatedProducts?: RelatedProduct[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] || null,
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
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

  // Extract unique colors and sizes from variants
  const availableColors = Array.from(
    new Set(product.variants.map((v) => v.color).filter(Boolean)),
  );
  const availableSizes = Array.from(
    new Set(product.variants.map((v) => v.size).filter(Boolean)),
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(
    availableColors[0] || null,
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    availableSizes[0] || null,
  );

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const variant = product.variants.find(
      (v) => v.color === color && v.size === selectedSize,
    );
    if (variant) setSelectedVariant(variant);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    const variant = product.variants.find(
      (v) => v.color === selectedColor && v.size === size,
    );
    if (variant) setSelectedVariant(variant);
  };

  const finalPrice = selectedVariant?.price ?? product.price;

  const comparePrice = product.comparePrice;

  const hasDiscount = comparePrice !== null && comparePrice > finalPrice;

  const discountPercentage = hasDiscount
    ? Math.round(((comparePrice - finalPrice) / comparePrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    if (selectedVariant.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (quantity > selectedVariant.stock) {
      toast.error(`Only ${selectedVariant.stock} items available`);
      return;
    }

    setIsAddingToCart(true);

    try {
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
        image: product.images[0] || "/placeholder.jpg",
        stock: selectedVariant.stock,
        length: selectedVariant.length,
        width: selectedVariant.width,
        height: selectedVariant.height,
        weight: selectedVariant.weight,
      });

      const variantDesc = [selectedVariant.color, selectedVariant.size]
        .filter(Boolean)
        .join(", ");

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Added to cart!</p>
          <p className="text-sm text-gray-600">
            {product.name} {variantDesc ? `(${variantDesc})` : ""} x {quantity}
          </p>
        </div>,
        { duration: 3000 },
      );

      setQuantity(1);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    if (selectedVariant.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    await handleAddToCart();
    router.push("/checkout");
  };

  const handleAddToWishlist = async () => {
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

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
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
                imageUrl={product.images[activeImage] || "/placeholder.jpg"}
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
                      ? "ring-2 ring-zinc-900"
                      : "border-zinc-200"
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
                  ${product.comparePrice?.toLocaleString()}
                </del>
              )}{" "}
              ${finalPrice.toLocaleString()}
              {hasDiscount && (
                <span className="text-green-400">
                  {" "}
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
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100"
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
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100"
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
                        Math.min(selectedVariant?.stock || 999, quantity + 1),
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
                className="h-11 w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium "
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
                className="h-11 w-full rounded-md border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Buy Now
              </button>

              <button
                onClick={handleAddToWishlist}
                disabled={isWishlistLoading}
                className={`h-11 w-full rounded-md border transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
                  wishlisted
                    ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                <IconHeart
                  size={20}
                  className={wishlisted ? "fill-red-500 text-red-500" : ""}
                />
                {wishlisted ? "In Wishlist" : "Add to Wishlist"}
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
                { title: "Shipping", content: "Free shipping over $50,000." },
                { title: "Returns", content: "30-day return policy." },
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

            {/* Specifications Table */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Specifications
              </h3>
              <table className="w-full text-sm text-gray-700">
                <tbody>
                  {(product.specifications ?? []).map((spec, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-2 pr-4 text-sm font-medium text-gray-900">
                        {spec.key}
                      </td>
                      <td className="py-2 pl-4 text-sm ">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* About This Item */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                About this item
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {(product.aboutItems || []).map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-[#B5844A]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-primary/5 rounded-md p-3 sm:p-8 border border-primary/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">
                Why Shop With Us?
              </h3>
              <div className="space-y-5">
                {[
                  {
                    Icon: IconPackage,
                    title: "Fast & Secure Shipping",
                    desc: "Quick and reliable delivery to your doorstep.",
                  },
                  {
                    Icon: IconHeart,
                    title: "Premium Quality Guarantee",
                    desc: "We use only the finest materials for our collections.",
                  },
                  {
                    Icon: IconLock,
                    title: "100% Secure Checkout",
                    desc: "Your payment information is always protected.",
                  },
                ].map(({ Icon, title, desc }, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon
                        size={24}
                        className="text-primary"
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

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-gray-100 pt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                You May Also Like
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="flex-none w-[280px] snap-start"
                >
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </>
  );
}
