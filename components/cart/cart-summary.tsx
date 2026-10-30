"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Tag, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { computeTotals, useCart } from "@/store/cart";

export function FreeShippingMeter() {
  const { t, f, price } = useI18n();
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const { subtotal, discount } = computeTotals(lines, promo);
  const net = subtotal - discount;
  const goal = siteConfig.freeShippingThreshold;
  const pct = Math.min(100, (net / goal) * 100);
  const unlocked = net >= goal;

  return (
    <div className="rounded-lg bg-surface p-4">
      <p className="text-sm" aria-live="polite">
        {unlocked ? (
          <span className="font-medium">{t.cart.freeShippingUnlocked}</span>
        ) : (
          f(t.cart.freeShippingProgress, { amount: price(goal - net) })
        )}
      </p>
      <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-border" aria-hidden>
        <motion.div
          className={cn("absolute inset-y-0 start-0 rounded-full", unlocked ? "bg-lime" : "bg-violet")}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export function PromoField() {
  const { t, f } = useI18n();
  const promo = useCart((s) => s.promo);
  const applyPromo = useCart((s) => s.applyPromo);
  const removePromo = useCart((s) => s.removePromo);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    const ok = applyPromo(code);
    setError(!ok);
    if (ok) setCode("");
  }

  if (promo) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-lime/60 bg-lime/10 px-4 py-3 text-sm [[data-theme=light]_&]:border-fg/30 [[data-theme=light]_&]:bg-surface">
        <span className="flex items-center gap-2">
          <Tag className="size-4" aria-hidden />
          {f(t.cart.promoApplied, { code: promo.code, percent: Math.round(promo.percentOff * 100) })}
        </span>
        <button
          type="button"
          onClick={removePromo}
          aria-label={t.cart.removePromo}
          className="grid size-7 place-items-center rounded-full hover:bg-surface-2"
        >
          <X className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="promo" className="sr-only">
        {t.cart.promoLabel}
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border bg-surface p-1 ps-4 transition-[border-color,box-shadow] focus-within:border-fg/40 focus-within:shadow-[0_0_0_4px_var(--glow-violet)]",
          error ? "border-danger" : "border-border",
        )}
      >
        <Tag className="size-4 shrink-0 text-muted" aria-hidden />
        <input
          id="promo"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(false);
          }}
          placeholder={t.cart.promoPlaceholder}
          autoComplete="off"
          aria-invalid={error}
          aria-describedby={error ? "promo-error" : undefined}
          className="h-9 min-w-0 flex-1 bg-transparent text-sm uppercase tracking-wide outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-muted focus-visible:outline-none"
        />
        <button
          type="submit"
          className="h-9 shrink-0 rounded-full bg-fg px-4 text-sm font-semibold text-bg transition-transform active:scale-95"
        >
          {t.cart.apply}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id="promo-error"
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ps-4 pt-2 text-sm text-danger"
          >
            {t.cart.promoInvalid}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

export function Totals({ shippingOverride, className }: { shippingOverride?: number; className?: string }) {
  const { t, price } = useI18n();
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const totals = computeTotals(lines, promo, shippingOverride);

  return (
    <dl className={cn("tabular flex flex-col gap-2.5 text-sm", className)}>
      <div className="flex justify-between">
        <dt className="text-muted">{t.cart.subtotal}</dt>
        <dd>{price(totals.subtotal, true)}</dd>
      </div>
      <AnimatePresence initial={false}>
        {totals.discount > 0 && (
          <motion.div
            className="flex justify-between overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <dt className="text-muted">
              {t.cart.discount} ({promo?.code})
            </dt>
            <dd className="font-medium text-violet-text" dir="ltr">
              −{price(totals.discount, true)}
            </dd>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-between">
        <dt className="text-muted">{t.cart.shipping}</dt>
        <dd>{totals.shipping === 0 ? t.cart.free : price(totals.shipping, true)}</dd>
      </div>
      <div className="mt-2 flex items-baseline justify-between border-t border-border pt-4">
        <dt className="font-semibold">{t.cart.total}</dt>
        <dd className="font-wide text-2xl font-extrabold tracking-[-0.02em]">{price(totals.total, true)}</dd>
      </div>
    </dl>
  );
}
