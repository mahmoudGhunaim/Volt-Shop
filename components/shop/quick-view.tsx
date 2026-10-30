"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ColorPicker, SizePicker } from "@/components/product/variant-picker";
import { QtyStepper } from "@/components/product/qty-stepper";
import { useI18n } from "@/i18n/provider";
import { useShopActions } from "@/lib/use-shop-actions";
import { cn } from "@/lib/utils";
import { useUI } from "@/store/ui";
import type { Product } from "@/types/product";
import { Price } from "./price";
import { Stars } from "./stars";

export function QuickView() {
  const product = useUI((s) => s.quickView);
  const close = useUI((s) => s.closeQuickView);

  return (
    <Dialog.Root open={!!product} onOpenChange={(o) => !o && close()}>
      <AnimatePresence>
        {product && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-(--z-overlay) bg-black/60 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <div className="pointer-events-none fixed inset-0 z-(--z-modal) grid place-items-end p-0 sm:place-items-center sm:p-6">
              <Dialog.Content asChild forceMount>
                <motion.div
                  className="pointer-events-auto relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-xl border border-border bg-bg outline-none sm:rounded-xl"
                  initial={{ opacity: 0, y: 40, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 24, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* key resets variant state when a different product opens */}
                  <QuickViewBody key={product.id} product={product} onDone={close} />
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function QuickViewBody({ product, onDone }: { product: Product; onDone: () => void }) {
  const { t, f, l } = useI18n();
  const { addToCart } = useShopActions();
  const [image, setImage] = useState(0);
  const [color, setColor] = useState(product.colors[0]?.id);
  const [size, setSize] = useState<string | undefined>(product.sizes.length === 1 ? product.sizes[0] : undefined);
  const [qty, setQty] = useState(1);
  const soldOut = product.stock <= 0;
  const needsSize = product.sizes.length > 0 && !size;

  return (
    <div className="grid md:grid-cols-[1.05fr_1fr]">
      <div className="plate relative aspect-square md:aspect-auto md:min-h-[32rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={image}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {product.images[image] && (
              <Image
                src={product.images[image].src}
                alt={product.images[image].alt}
                fill
                sizes="(min-width: 768px) 460px, 100vw"
                className="object-contain p-[10%]"
              />
            )}
          </motion.div>
        </AnimatePresence>
        {product.images.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            {product.images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setImage(i)}
                aria-label={f(t.product.imageOf, { index: i + 1, total: product.images.length })}
                aria-current={i === image}
                className={cn(
                  "h-1.5 rounded-full transition-[width,background-color] duration-300",
                  i === image ? "w-6 bg-lime" : "w-1.5 bg-white/35 hover:bg-white/60",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">{f(t.product.by, { brand: product.brand })}</p>
            <Dialog.Title className="mt-1 font-wide text-2xl font-extrabold leading-tight tracking-[-0.025em]">
              {product.name}
            </Dialog.Title>
          </div>
          <Dialog.Close
            className="grid size-10 shrink-0 place-items-center rounded-full border border-border transition-[background-color,transform] hover:bg-surface-2 active:scale-90"
            aria-label={t.nav.close}
          >
            <X className="size-4" />
          </Dialog.Close>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Price price={product.price} compareAt={product.compareAtPrice} size="lg" />
          <span className="flex items-center gap-2 text-sm text-muted">
            <Stars rating={product.rating} />
            {f(t.product.reviewsCount, { count: product.reviewCount })}
          </span>
        </div>

        <Dialog.Description className="line-clamp-3 text-muted">{l(product.description)}</Dialog.Description>

        <ColorPicker colors={product.colors} value={color} onChange={setColor} />
        <SizePicker sizes={product.sizes} value={size} onChange={setSize} />

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <div className="flex gap-3">
            <QtyStepper value={qty} onChange={setQty} max={Math.max(1, product.stock)} />
            <Button
              size="md"
              className="h-auto flex-1"
              disabled={soldOut || needsSize}
              onClick={() => {
                addToCart(product, { colorId: color, size, qty });
                onDone();
              }}
            >
              {soldOut ? t.product.soldOut : needsSize ? t.product.selectSize : t.product.addToCart}
            </Button>
          </div>
          <Link
            href={`/product/${product.slug}`}
            onClick={onDone}
            className="group inline-flex items-center gap-1.5 self-start text-sm font-medium text-violet-text"
          >
            {t.product.viewDetails}
            <ArrowRight className="flip-rtl size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
