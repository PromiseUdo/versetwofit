"use client";

import React, { useState, useRef, useEffect } from "react";
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
} from "@tabler/icons-react";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProductCard } from "@/components/product-card";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";

type VariantOption = {
  name: string;
  value: string;
};

type ProductOptionDef = {
  name: string;
  values: string[];
};

type ProductVariant = {
  id: string;
  options: VariantOption[];
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
  options: ProductOptionDef[];
  category: { id: string; name: string; slug: string };
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
  category: { name: string };
  variants: { id: string; options: VariantOption[]; stock: number; price: number | null }[];
};

function findVariant(
  variants: ProductVariant[],
  selected: Record<string, string>
): ProductVariant | null {
  return (
    variants.find((v) =>
      v.options.every((o) => selected[o.name] === o.value)
    ) ?? null
  );
}

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
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { isInWishlist, toggleItem, fetchWishlist, isLoaded } = useWishlistStore();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const wishlisted = isInWishlist(product.id);

  // Initialize selected options with first value for each option
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => {
      const init: Record<string, string> = {};
      for (const opt of product.options) {
        if (opt.values.length > 0) init[opt.name] = opt.values[0];
      }
      return init;
    }
  );

  const selectedVariant = findVariant(product.variants, selectedOptions);

  useEffect(() => {
    if (session && !isLoaded) fetchWishlist();
  }, [session, isLoaded, fetchWishlist]);

  const finalPrice = selectedVariant?.price ?? product.price;
  const comparePrice = product.comparePrice;
  const hasDiscount = comparePrice !== null && comparePrice > finalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((comparePrice - finalPrice) / comparePrice) * 100)
    : 0;

  const selectOption = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
    setQuantity(1);
  };

  // Returns true if the given option value is available (in-stock) given current selections
  const isValueAvailable = (optionName: string, value: string): boolean => {
    const hypothetical = { ...selectedOptions, [optionName]: value };
    return product.variants.some(
      (v) =>
        v.options.every((o) => hypothetical[o.name] === o.value) && v.stock > 0
    );
  };

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
      // Derive color/size from options for checkout compatibility
      const colorOpt = selectedVariant.options.find(
        (o) => o.name.toLowerCase() === "color"
      );
      const sizeOpt = selectedVariant.options.find(
        (o) => o.name.toLowerCase() === "size"
      );

      addItem({
        id: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantSku: selectedVariant.sku,
        variantOptions: selectedVariant.options,
        color: colorOpt?.value ?? null,
        size: sizeOpt?.value ?? null,
        price: finalPrice,
        quantity,
        image: product.images[0] || "/placeholder.jpg",
        stock: selectedVariant.stock,
        length: selectedVariant.length,
        width: selectedVariant.width,
        height: selectedVariant.height,
        weight: selectedVariant.weight,
      });

      const variantDesc = selectedVariant.options.map((o) => o.value).join(", ");
      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Added to cart!</p>
          <p className="text-sm text-gray-600">
            {product.name}
            {variantDesc ? ` (${variantDesc})` : ""} × {quantity}
          </p>
        </div>,
        { duration: 3000 }
      );
      setQuantity(1);
    } catch {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || selectedVariant.stock === 0) {
      toast.error("Please select an available variant");
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
        action === "added" ? "Added to wishlist!" : "Removed from wishlist"
      );
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
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
                <span className="text-green-400"> - {discountPercentage}% Off</span>
              )}
            </p>

            <p className="mt-4 text-zinc-600 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Dynamic Option Selectors */}
            <div className="flex flex-col mt-6 gap-6">
              {product.options.map((opt) => (
                <div key={opt.name}>
                  <p className="uppercase text-sm text-zinc-600 mb-2">
                    {opt.name}
                    {selectedOptions[opt.name] && (
                      <span className="ml-2 normal-case font-normal text-zinc-500">
                        — {selectedOptions[opt.name]}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {opt.values.map((val) => {
                      const isSelected = selectedOptions[opt.name] === val;
                      const available = isValueAvailable(opt.name, val);
                      return (
                        <button
                          key={val}
                          onClick={() => available && selectOption(opt.name, val)}
                          disabled={!available}
                          className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : available
                              ? "bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100"
                              : "bg-zinc-50 text-zinc-400 border-zinc-200 line-through cursor-not-allowed"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

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
                      selectedVariant ? quantity >= selectedVariant.stock : false
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
                className="h-11 w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
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

            {/* About this item */}
            {product.aboutItems.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-zinc-800 mb-3">
                  About this item
                </h3>
                <ul className="space-y-2">
                  {product.aboutItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                      <span className="text-zinc-400 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-zinc-800 mb-3">
                  Specifications
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {product.specifications.map((spec, i) => (
                    <React.Fragment key={i}>
                      <dt className="text-sm text-zinc-500">
                        {spec.key}
                      </dt>
                      <dd className="text-sm text-zinc-700">
                        {spec.value}
                      </dd>
                    </React.Fragment>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-semibold text-zinc-800 mb-6">
              You may also like
            </h2>
            <div className="relative">
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
              >
                <ChevronLeft size={20} />
              </button>
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
              >
                {relatedProducts.map((related) => (
                  <div key={related.id} className="min-w-60 max-w-60">
                    <ProductCard product={related as any} />
                  </div>
                ))}
              </div>
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </>
  );
}
