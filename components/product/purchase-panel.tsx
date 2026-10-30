"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/shop/price";
import { Stars } from "@/components/shop/stars";
import { WishlistButton } from "@/components/shop/wishlist-button";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/provider";
import { useShopActions } from "@/lib/use-shop-actions";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { QtyStepper } from "./qty-stepper";
import { ColorPicker, SizePicker } from "./variant-picker";

export function PurchasePanel({ product }: { product: Product }) {
  const { t, f, l, price } = useI18n();
  const { addToCart } = useShopActions();
  const [color, setColor] = useState(product.colors[0]?.id);
  const [size, setSize] = useState<string | undefined>(product.sizes.length === 1 ? product.sizes[0] : undefined);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const soldOut = product.stock <= 0;
  const needsSize = product.sizes.length > 0 && !size;
  const label = soldOut ? t.product.soldOut : needsSize ? t.product.selectSize : justAdded ? t.product.added : t.product.addToCart;

  // Sticky mobile bar appears once the main button has scrolled away.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShowSticky(!entry!.isIntersecting && entry!.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function add() {
    if (needsSize) {
      document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    addToCart(product, { colorId: color, size, qty });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="text-sm text-muted">{f(t.product.by, { brand: product.brand })}</p>
        <h1 className="mt-2 text-h1">{product.name}</h1>
        <p className="mt-3 text-lg text-muted">{l(product.tagline)}</p>
        <a href="#details" className="mt-4 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
          <Stars rating={product.rating} />
          <span className="tabular font-medium text-fg">{product.rating.toFixed(1)}</span>
          <span className="underline underline-offset-4">{f(t.product.reviewsCount, { count: product.reviewCount })}</span>
        </a>
      </div>

      <Price price={product.price} compareAt={product.compareAtPrice} size="lg" />

      <ColorPicker colors={product.colors} value={color} onChange={setColor} />
      <div id="size-picker">
        <SizePicker sizes={product.sizes} value={size} onChange={setSize} />
      </div>

      <div ref={ctaRef} className="flex flex-col gap-3">
        <div className="flex gap-3">
          <QtyStepper value={qty} onChange={setQty} max={Math.max(1, product.stock)} />
          <Button size="lg" className="relative flex-1 overflow-hidden" disabled={soldOut} onClick={add}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={label}
                initial={{ y: 22, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -22, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {label}
              </motion.span>
            </AnimatePresence>
          </Button>
          <WishlistButton product={product} className="size-14 shrink-0 border border-border bg-transparent backdrop-blur-none" />
        </div>
        <p className={cn("text-sm", product.stock > 0 && product.stock <= 5 ? "font-medium text-danger" : "text-muted")}>
          {soldOut
            ? t.product.soldOut
            : product.stock <= 5
              ? f(t.product.lowStock, { count: product.stock })
              : t.product.inStock}
        </p>
      </div>

      <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border text-sm sm:grid-cols-3">
        {[
          { icon: Truck, text: f(t.product.freeShippingNote, { amount: price(siteConfig.freeShippingThreshold) }) },
          { icon: ShieldCheck, text: product.specs.warranty ?? "" },
          { icon: RotateCcw, text: product.specs.returns ?? "" },
        ].map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 bg-bg p-4 sm:flex-col sm:items-start sm:gap-2">
            <Icon className="size-4 shrink-0 text-violet-text" aria-hidden />
            <span className="text-muted" dir="auto">
              {text}
            </span>
          </li>
        ))}
      </ul>

      {/* Mobile sticky add-to-cart */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-(--z-sticky) border-t border-border bg-bg/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="plate relative size-12 shrink-0 overflow-hidden rounded-md">
                {product.images[0] && <Image src={product.images[0].src} alt="" fill sizes="48px" className="object-contain p-1" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <Price price={product.price} className="text-sm" />
              </div>
              <Button disabled={soldOut} onClick={add} className="shrink-0">
                {label}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
