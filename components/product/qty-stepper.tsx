"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function QtyStepper({
  value,
  onChange,
  max = 99,
  size = "md",
  className,
}: {
  value: number;
  onChange: (qty: number) => void;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const { t } = useI18n();
  const btn = cn(
    "grid place-items-center rounded-full transition-[background-color,transform] duration-200 hover:bg-surface-2 active:scale-90 disabled:opacity-35",
    size === "sm" ? "size-8" : "size-10",
  );
  return (
    <div
      role="group"
      aria-label={t.product.quantity}
      className={cn("inline-flex items-center rounded-full border border-border p-0.5", className)}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={t.product.decrease}>
        <Minus className="size-3.5" />
      </button>
      <span
        className={cn("tabular relative grid overflow-hidden text-center font-semibold", size === "sm" ? "w-7 text-sm" : "w-9")}
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={t.product.increase}>
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
