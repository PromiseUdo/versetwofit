import { create } from "zustand";
import axios from "axios";

interface WishlistStore {
  productIds: string[];
  isLoaded: boolean;
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleItem: (productId: string) => Promise<"added" | "removed">;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearLocal: () => void;
}

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  productIds: [],
  isLoaded: false,
  isLoading: false,

  fetchWishlist: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });

    try {
      const { data } = await axios.get("/api/wishlist");
      set({ productIds: data.productIds || [], isLoaded: true });
    } catch {
      // User might not be logged in — silently ignore
      set({ productIds: [], isLoaded: true });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleItem: async (productId: string) => {
    // Optimistic update
    const current = get().productIds;
    const isIn = current.includes(productId);

    if (isIn) {
      set({ productIds: current.filter((id) => id !== productId) });
    } else {
      set({ productIds: [...current, productId] });
    }

    try {
      const { data } = await axios.post("/api/wishlist", { productId });
      set({ productIds: data.productIds });
      return data.action as "added" | "removed";
    } catch {
      // Revert on error
      set({ productIds: current });
      throw new Error("Failed to update wishlist");
    }
  },

  removeItem: async (productId: string) => {
    const current = get().productIds;

    // Optimistic update
    set({ productIds: current.filter((id) => id !== productId) });

    try {
      const { data } = await axios.delete(
        `/api/wishlist?productId=${productId}`
      );
      set({ productIds: data.productIds });
    } catch {
      // Revert on error
      set({ productIds: current });
      throw new Error("Failed to remove from wishlist");
    }
  },

  isInWishlist: (productId: string) => {
    return get().productIds.includes(productId);
  },

  clearLocal: () => {
    set({ productIds: [], isLoaded: false });
  },
}));
