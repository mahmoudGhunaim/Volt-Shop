"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WishlistState {
  /** Product slugs. Full product data is looked up from the catalog when rendering. */
  slugs: string[];
  toggle: (slug: string) => boolean;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const saved = !get().slugs.includes(slug);
        set((s) => ({ slugs: saved ? [slug, ...s.slugs] : s.slugs.filter((x) => x !== slug) }));
        return saved;
      },
      remove: (slug) => set((s) => ({ slugs: s.slugs.filter((x) => x !== slug) })),
      has: (slug) => get().slugs.includes(slug),
    }),
    { name: "volt-wishlist", storage: createJSONStorage(() => localStorage) },
  ),
);
