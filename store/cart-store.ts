// src/store/cart-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string; // variant ID
  productId: string;
  productName: string;
  productSlug: string;
  variantSku: string;
  variantOptions: { name: string; value: string }[];
  color: string | null; // derived from variantOptions for checkout compatibility
  size: string | null;  // derived from variantOptions for checkout compatibility
  price: number;
  quantity: number;
  image: string;
  stock: number;
  // Shipping dimensions
  length: number | null;
  width: number | null;
  height: number | null;
  weight: number | null;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItem: (variantId: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            // Update quantity if item already exists
            const newQuantity = Math.min(
              existingItem.quantity + item.quantity,
              item.stock,
            );

            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: newQuantity } : i,
              ),
            };
          }

          // Add new item
          return {
            items: [...state.items, item],
          };
        });
      },

      removeItem: (variantId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== variantId),
        }));
      },

      updateQuantity: (variantId: string, quantity: number) => {
        set((state) => {
          const item = state.items.find((i) => i.id === variantId);

          if (!item) return state;

          // Ensure quantity is within valid range
          const validQuantity = Math.max(0, Math.min(quantity, item.stock));

          if (validQuantity === 0) {
            // Remove item if quantity is 0
            return {
              items: state.items.filter((i) => i.id !== variantId),
            };
          }

          return {
            items: state.items.map((i) =>
              i.id === variantId ? { ...i, quantity: validQuantity } : i,
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      getItem: (variantId: string) => {
        return get().items.find((item) => item.id === variantId);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
