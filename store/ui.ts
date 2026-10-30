"use client";

import { create } from "zustand";
import type { Product } from "@/types/product";

interface UIState {
  cartOpen: boolean;
  quickView: Product | null;
  setCartOpen: (open: boolean) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

export const useUI = create<UIState>()((set) => ({
  cartOpen: false,
  quickView: null,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  openQuickView: (quickView) => set({ quickView }),
  closeQuickView: () => set({ quickView: null }),
}));
