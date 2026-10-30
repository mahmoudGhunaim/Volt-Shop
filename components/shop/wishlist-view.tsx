"use client";

import { AnimatePresence, motion } from "framer-motion";
import { EmptyState } from "@/components/cart/cart-empty";
import { useI18n } from "@/i18n/provider";
import { useHydrated } from "@/lib/hooks";
import { useWishlist } from "@/store/wishlist";
import type { Product } from "@/types/product";
import { ProductCard, ProductCardSkeleton } from "./product-card";

export function WishlistView({ products }: { products: Product[] }) {
  const { t, f } = useI18n();
  const hydrated = useHydrated();
  const slugs = useWishlist((s) => s.slugs);
  const saved = slugs.flatMap((slug) => products.find((p) => p.slug === slug) ?? []);

  return (
    <div className="container-volt py-10 sm:py-14">
      <h1 className="text-h1">{t.wishlist.title}</h1>
      {hydrated && saved.length > 0 && (
        <p className="mt-3 text-muted">{f(t.shop.resultsCount, { count: saved.length })}</p>
      )}

      {!hydrated ? (
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <EmptyState
          animation="empty-wishlist"
          title={t.wishlist.empty}
          body={t.wishlist.emptyBody}
          cta={t.cart.startShopping}
        />
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {saved.map((p) => (
              <motion.li
                key={p.id}
                layout
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
