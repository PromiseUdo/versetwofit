// src/app/cart/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Lock,
  Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  formatCurrency,
  qualifiesForFreeShipping,
  amountUntilFreeShipping,
  FREE_SHIPPING_THRESHOLD,
} from '@/lib/shipping';
import MaxWidthWrapper from '@/components/max-width-wrapper';

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const subtotal = getTotalPrice();
  const totalItems = getTotalItems();
  const freeShipping = qualifiesForFreeShipping(subtotal);
  const amountNeeded = amountUntilFreeShipping(subtotal);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }

    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    removeItem(itemId);
    toast.success(`${item?.productName} removed from cart`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-sm p-12">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Start Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-48 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="min-h-screen bg-gray-50  my-24">
        <MaxWidthWrapper className="">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {/* Free Shipping Progress Bar */}
          {!freeShipping && (
            <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium text-gray-900">
                    You're {formatCurrency(amountNeeded)} away from FREE
                    shipping!
                  </span>
                </div>
                <span className="text-sm text-indigo-600 font-semibold">
                  Free over {formatCurrency(FREE_SHIPPING_THRESHOLD)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {freeShipping && (
            <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">
                    Congratulations! You qualify for FREE shipping
                  </p>
                  <p className="text-sm text-green-700">
                    Your order will be shipped at no additional cost
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden group"
                    >
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-2">
                        <div className="flex-1">
                          <Link
                            href={`/products/${item.productSlug}`}
                            className="font-semibold text-gray-900 hover:text-indigo-600 transition line-clamp-2"
                          >
                            {item.productName}
                          </Link>

                          {/* Variant Info */}
                          {(item.color || item.size) && (
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                              {item.color && (
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">Color:</span>
                                  <span className="font-medium">
                                    {item.color}
                                  </span>
                                </div>
                              )}
                              {item.size && (
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">Size:</span>
                                  <span className="font-medium">
                                    {item.size}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* SKU */}
                          <p className="text-xs text-gray-500 mt-1">
                            SKU: {item.variantSku}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition p-2 h-fit"
                          aria-label="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {/* Stock Warning */}
                      {item.stock < 5 && item.stock > 0 && (
                        <p className="text-xs text-orange-600 font-medium mb-2">
                          Only {item.stock} left in stock
                        </p>
                      )}

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Qty:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-3 py-2 hover:bg-gray-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-4 py-2 font-medium text-sm min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                              className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Link */}
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition mt-4"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Subtotal */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">
                      {freeShipping ? 'FREE' : 'Calculated at checkout'}
                    </span>
                  </div>

                  <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                    <span>Estimated Total</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    Tax calculated at checkout
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                {/* Security Badges */}
                <div className="space-y-3 pt-6 border-t">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Lock size={16} className="text-green-600 flex-shrink-0" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck
                      size={16}
                      className="text-indigo-600 flex-shrink-0"
                    />
                    <span>Free shipping on orders over $75</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Tag size={16} className="text-purple-600 flex-shrink-0" />
                    <span>30-day return policy</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-500 text-center mb-3">
                    We accept
                  </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-xs font-medium">
                      Visa
                    </div>
                    <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-xs font-medium">
                      Mastercard
                    </div>
                    <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-xs font-medium">
                      Amex
                    </div>
                    <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-xs font-medium">
                      Discover
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
