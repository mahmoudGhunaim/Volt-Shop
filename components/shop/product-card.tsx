"use client";

import { Eye, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { useShopActions } from "@/lib/use-shop-actions";
import { cn, discountPercent } from "@/lib/utils";
import { useUI } from "@/store/ui";
import type { Product } from "@/types/product";
import { Price } from "./price";
import { Stars } from "./stars";
import { WishlistButton } from "./wishlist-button";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function ProductCard({
  product,
  priority,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw",
  className,
}: ProductCardProps) {
  const { t, f, l } = useI18n();
  const { addToCart } = useShopActions();
  const openQuickView = useUI((s) => s.openQuickView);
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock <= 0;
  const [primary, secondary] = product.images;
  const needsChoice = product.sizes.length > 1;

  return (
    <article className={cn("group/card relative flex flex-col", className)}>
      <div className="plate relative aspect-[4/5] overflow-hidden rounded-xl">
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 z-(--z-base) rounded-xl"
          aria-label={product.name}
          draggable={false}
        >
          {primary && (
            <Image
              src={primary.src}
              alt={primary.alt}
              fill
              sizes={sizes}
              priority={priority}
              draggable={false}
              className={cn(
                "object-contain p-[12%] transition-[transform,opacity] duration-700 ease-expo",
                secondary
                  ? "group-hover/card:scale-[0.96] group-hover/card:opacity-0"
                  : "group-hover/card:scale-[1.07] group-hover/card:-rotate-2",
              )}
            />
          )}
          {secondary && (
            <Image
              src={secondary.src}
              alt=""
              fill
              sizes={sizes}
              draggable={false}
              className="scale-[1.04] object-contain p-[12%] opacity-0 transition-[transform,opacity] duration-700 ease-expo group-hover/card:scale-100 group-hover/card:opacity-100"
            />
          )}
        </Link>

        {/* Soft violet glow that wakes up on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[15%] bottom-0 h-1/2 translate-y-1/2 rounded-full bg-violet/0 blur-3xl transition-colors duration-700 group-hover/card:bg-violet/35"
        />

        <div className="pointer-events-none absolute inset-x-3 top-3 z-(--z-dropdown) flex items-start justify-between gap-2">
          <div className="flex flex-col items-start gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-fg px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-bg [[data-theme=light]_&]:bg-white [[data-theme=light]_&]:text-plate">
                {t.product.new}
              </span>
            )}
            {off > 0 && (
              <span className="tabular rounded-full bg-lime px-2.5 py-1 text-[0.6875rem] font-bold text-on-lime">
                −{off}%
              </span>
            )}
          </div>
          <WishlistButton product={product} className="pointer-events-auto" />
        </div>

        <div className="absolute inset-x-3 bottom-3 z-(--z-dropdown) flex gap-2 transition-[transform,opacity] duration-500 ease-expo md:translate-y-3 md:opacity-0 md:group-focus-within/card:translate-y-0 md:group-focus-within/card:opacity-100 md:group-hover/card:translate-y-0 md:group-hover/card:opacity-100">
          <button
            type="button"
            disabled={soldOut}
            onClick={() => (needsChoice ? openQuickView(product) : addToCart(product))}
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-lime text-sm font-semibold text-on-lime transition-[transform,box-shadow] duration-200 hover:shadow-[0_0_0_4px_var(--glow-lime)] active:scale-95 disabled:bg-surface-2 disabled:text-muted"
            aria-label={`${soldOut ? t.product.soldOut : t.product.quickAdd}: ${product.name}`}
          >
            <Plus className="size-4" aria-hidden />
            <span className="max-sm:sr-only">{soldOut ? t.product.soldOut : t.product.quickAdd}</span>
          </button>
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-white/90 text-plate backdrop-blur transition-transform duration-200 hover:bg-white active:scale-95"
            aria-label={`${t.product.quickView}: ${product.name}`}
          >
            <Eye className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-3.5 flex flex-col gap-1 px-0.5">
        <div className="flex items-center justify-between gap-2 text-xs text-muted">
          <span className="truncate">{product.brand}</span>
          <span className="flex shrink-0 items-center gap-1.5">
            <Stars rating={product.rating} size={11} />
            <span className="tabular">{product.rating.toFixed(1)}</span>
          </span>
        </div>
        <h3 className="font-sans text-[0.9375rem] font-medium leading-snug tracking-normal [font-stretch:100%]">
          <Link href={`/product/${product.slug}`} className="line-clamp-2 transition-colors hover:text-violet-text">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-between gap-2">
          <Price price={product.price} compareAt={product.compareAtPrice} />
          {product.colors.length > 1 && (
            <span role="img" className="flex -space-x-1 rtl:space-x-reverse" aria-label={product.colors.map((c) => l(c.name)).join(", ")}>
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c.id}
                  className="size-3 rounded-full ring-2 ring-bg"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </span>
          )}
        </div>
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs font-medium text-danger">{f(t.product.lowStock, { count: product.stock })}</p>
        )}
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden>
      <div className="skeleton aspect-[4/5] rounded-xl" />
      <div className="skeleton mt-4 h-3 w-1/3 rounded" />
      <div className="skeleton mt-2 h-4 w-4/5 rounded" />
      <div className="skeleton mt-2 h-4 w-1/4 rounded" />
    </div>
  );
}
