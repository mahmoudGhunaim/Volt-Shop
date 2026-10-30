"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { QtyStepper } from "@/components/product/qty-stepper";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import type { CartLine as Line } from "@/types/cart";

export function CartLine({ line, compact, onNavigate }: { line: Line; compact?: boolean; onNavigate?: () => void }) {
  const { t, f, price } = useI18n();
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const restore = useCart((s) => s.restore);

  function onRemove() {
    const removed = remove(line.key);
    if (!removed) return;
    toast(t.cart.itemRemoved, {
      description: removed.name,
      action: { label: t.cart.undo, onClick: () => restore(removed) },
    });
  }

  const variant = [line.colorName, line.size].filter(Boolean).join(" · ");

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 py-5"
    >
      <Link
        href={`/product/${line.slug}`}
        onClick={onNavigate}
        className={cn("plate relative shrink-0 overflow-hidden rounded-lg", compact ? "size-20" : "size-24 sm:size-28")}
      >
        <Image src={line.image} alt={line.name} fill sizes="112px" className="object-contain p-2" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/product/${line.slug}`}
              onClick={onNavigate}
              className="line-clamp-2 text-[0.9375rem] font-medium leading-snug hover:text-violet-text"
            >
              {line.name}
            </Link>
            {variant && <p className="mt-0.5 text-sm text-muted">{variant}</p>}
          </div>
          <p className="tabular shrink-0 font-semibold">{price(line.price * line.qty)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QtyStepper size="sm" value={line.qty} max={line.stock} onChange={(q) => setQty(line.key, q)} />
          <button
            type="button"
            onClick={onRemove}
            aria-label={f(t.cart.remove, { name: line.name })}
            className="grid size-9 place-items-center rounded-full text-muted transition-[background-color,color,transform] duration-200 hover:bg-danger/10 hover:text-danger active:scale-90"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </motion.li>
  );
}
