import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartStore } from "./types";

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      isActionLoading: false,
      error: null,
      actionError: null,

      setCart: (cart) => set({ cart }),
      setLoading: (isLoading) => set({ isLoading }),
      setActionLoading: (isActionLoading) => set({ isActionLoading }),
      setError: (error) => set({ error }),
      setActionError: (actionError) => set({ actionError }),

      setCartLoading: (isLoading) => set({ isLoading }),
      setCartError: (error) => set({ error }),
      setActionLoadingAndError: (isActionLoading, actionError) =>
        set({ isActionLoading, actionError }),

      clearErrors: () => set({ error: null, actionError: null }),
      clearActionError: () => set({ actionError: null }),
    }),
    {
      name: "cart-store",
    }
  )
);
