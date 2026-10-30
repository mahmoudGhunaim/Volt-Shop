"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { useHydrated } from "@/lib/hooks";
import { useShopActions } from "@/lib/use-shop-actions";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/store/wishlist";
import type { Product } from "@/types/product";

const burst = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2);

export function WishlistButton({ product, className }: { product: Product; className?: string }) {
  const { t } = useI18n();
  const hydrated = useHydrated();
  const saved = useWishlist((s) => s.slugs.includes(product.slug)) && hydrated;
  const { toggleWishlist } = useShopActions();

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? t.product.removeFromWishlist : t.product.addToWishlist}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      className={cn(
        "relative grid size-10 place-items-center rounded-full bg-bg/70 text-fg backdrop-blur-md transition-[transform,background-color] duration-200 hover:bg-bg active:scale-90",
        className,
      )}
    >
      <motion.span
        key={saved ? "on" : "off"}
        initial={saved ? { scale: 0.4 } : false}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 14 }}
        className="inline-flex"
      >
        <Heart className={cn("size-[18px]", saved && "fill-violet text-violet")} />
      </motion.span>
      <AnimatePresence>
        {saved &&
          burst.map((angle) => (
            <motion.span
              key={angle}
              aria-hidden
              className="absolute size-1 rounded-full bg-violet"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos(angle) * 18, y: Math.sin(angle) * 18, opacity: 0, scale: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
      </AnimatePresence>
    </button>
  );
}
