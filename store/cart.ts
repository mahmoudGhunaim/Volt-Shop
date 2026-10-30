"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { siteConfig } from "@/config/site";
import type { CartLine, CartTotals, PromoCode } from "@/types/cart";

type NewLine = Omit<CartLine, "key" | "qty">;

interface CartState {
  lines: CartLine[];
  promo: PromoCode | null;
  /** Bumps on every add so the header badge can replay its pop animation. */
  addPulse: number;
  add: (line: NewLine, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => CartLine | undefined;
  restore: (line: CartLine) => void;
  clear: () => void;
  applyPromo: (code: string) => PromoCode | null;
  removePromo: () => void;
}

export const lineKey = (productId: string, colorId?: string, size?: string) =>
  [productId, colorId ?? "-", size ?? "-"].join(":");

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      promo: null,
      addPulse: 0,
      add: (line, qty = 1) =>
        set((state) => {
          const key = lineKey(line.productId, line.colorId, line.size);
          const existing = state.lines.find((l) => l.key === key);
          const lines = existing
            ? state.lines.map((l) =>
                l.key === key ? { ...l, qty: Math.min(l.qty + qty, l.stock) } : l,
              )
            : [...state.lines, { ...line, key, qty: Math.min(qty, line.stock) }];
          return { lines, addPulse: state.addPulse + 1 };
        }),
      setQty: (key, qty) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.key === key ? { ...l, qty: Math.max(1, Math.min(qty, l.stock)) } : l,
          ),
        })),
      remove: (key) => {
        const line = get().lines.find((l) => l.key === key);
        set((state) => ({ lines: state.lines.filter((l) => l.key !== key) }));
        return line;
      },
      restore: (line) =>
        set((state) =>
          state.lines.some((l) => l.key === line.key) ? state : { lines: [...state.lines, line] },
        ),
      clear: () => set({ lines: [], promo: null }),
      applyPromo: (code) => {
        const match = siteConfig.promoCodes.find(
          (p) => p.code.toLowerCase() === code.trim().toLowerCase(),
        );
        const promo = match ? { code: match.code, percentOff: match.percentOff } : null;
        if (promo) set({ promo });
        return promo;
      },
      removePromo: () => set({ promo: null }),
    }),
    {
      name: "volt-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines, promo: s.promo }),
    },
  ),
);

export function computeTotals(
  lines: CartLine[],
  promo: PromoCode | null,
  shippingOverride?: number,
): CartTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const discount = promo ? Math.round(subtotal * promo.percentOff * 100) / 100 : 0;
  const afterDiscount = subtotal - discount;
  const shipping =
    shippingOverride ??
    (lines.length === 0 || afterDiscount >= siteConfig.freeShippingThreshold
      ? 0
      : siteConfig.shippingFlatRate);
  return {
    subtotal,
    discount,
    shipping,
    total: Math.max(0, afterDiscount + shipping),
    itemCount: lines.reduce((n, l) => n + l.qty, 0),
  };
}
