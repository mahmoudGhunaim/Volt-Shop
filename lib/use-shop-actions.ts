"use client";

import { toast } from "sonner";
import { useI18n } from "@/i18n/provider";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";
import type { Product } from "@/types/product";

export interface VariantChoice {
  colorId?: string;
  size?: string;
  qty?: number;
}

/** Cart + wishlist actions with consistent toast feedback, shared by cards, quick view and PDP. */
export function useShopActions() {
  const { t, l } = useI18n();
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const setCartOpen = useUI((s) => s.setCartOpen);

  function addToCart(product: Product, choice: VariantChoice = {}) {
    const color = product.colors.find((c) => c.id === choice.colorId) ?? product.colors[0];
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0]?.src ?? "",
        colorId: color?.id,
        colorName: color ? l(color.name) : undefined,
        size: choice.size ?? product.sizes[0],
        stock: product.stock,
      },
      choice.qty ?? 1,
    );
    toast.success(t.cart.itemAdded, {
      description: product.name,
      action: { label: t.cart.viewCart, onClick: () => setCartOpen(true) },
    });
  }

  function toggleWishlist(product: Product) {
    const saved = toggleWish(product.slug);
    toast(saved ? t.wishlist.added : t.wishlist.removed, { description: product.name });
    return saved;
  }

  return { addToCart, toggleWishlist };
}
