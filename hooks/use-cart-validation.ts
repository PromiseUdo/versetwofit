// src/hooks/use-cart-validation.ts
import { useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cart-store';

interface ValidationResult {
  isValid: boolean;
  priceChanged: boolean;
  error?: string;
  currentPrice?: number;
  currentStock?: number;
  availableStock?: number;
}

interface ValidatedCart {
  items: (ValidationResult & { id: string })[];
  hasInvalidItems: boolean;
}

export function useCartValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const validateCart = useCallback(async (): Promise<ValidatedCart | null> => {
    if (items.length === 0) {
      return { items: [], hasInvalidItems: false };
    }

    setIsValidating(true);

    try {
      const response = await axios.post('/api/cart', { items });
      const validatedCart: ValidatedCart = response.data;

      // Handle validation results
      validatedCart.items.forEach((validatedItem) => {
        const cartItem = items.find((item) => item.id === validatedItem.id);

        if (!cartItem) return;

        if (!validatedItem.isValid) {
          // Show error and handle based on error type
          if (validatedItem.error === 'Out of stock') {
            toast.error(
              `${cartItem.productName} is out of stock and has been removed from your cart`
            );
            removeItem(validatedItem.id);
          } else if (validatedItem.availableStock) {
            // Adjust quantity to available stock
            toast.error(
              `Only ${validatedItem.availableStock} ${cartItem.productName} available. Quantity adjusted.`
            );
            updateQuantity(validatedItem.id, validatedItem.availableStock);
          } else {
            toast.error(
              `${cartItem.productName}: ${validatedItem.error}. Item removed from cart.`
            );
            removeItem(validatedItem.id);
          }
        } else if (validatedItem.priceChanged) {
          // Notify about price change
          toast.success(
            `Price updated for ${
              cartItem.productName
            }: ₦${validatedItem.currentPrice?.toLocaleString()}`
          );
        }
      });

      return validatedCart;
    } catch (error) {
      console.error('Cart validation error:', error);
      toast.error('Failed to validate cart. Please try again.');
      return null;
    } finally {
      setIsValidating(false);
    }
  }, [items, updateQuantity, removeItem]);

  return {
    validateCart,
    isValidating,
  };
}
