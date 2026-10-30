"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";
import { useHydrated } from "@/lib/hooks";
import { useCart } from "@/store/cart";
import { CartEmpty } from "./cart-empty";
import { CartLine } from "./cart-line";
import { FreeShippingMeter, PromoField, Totals } from "./cart-summary";

export function CartView() {
  const { t, f } = useI18n();
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const count = lines.reduce((n, l) => n + l.qty, 0);

  if (!hydrated) {
    return (
      <div className="container-volt py-12" aria-busy="true">
        <div className="skeleton h-14 w-56 rounded-lg" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="flex flex-col gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="skeleton h-28 rounded-lg" />
            ))}
          </div>
          <div className="skeleton h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-volt py-12">
        <h1 className="text-h1">{t.cart.title}</h1>
        <CartEmpty />
      </div>
    );
  }

  return (
    <div className="container-volt py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1">{t.cart.title}</h1>
          <p className="mt-3 text-muted">{f(t.cart.items, { count })}</p>
        </div>
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-text hover:underline">
          <ArrowLeft className="flip-rtl size-4" />
          {t.cart.continueShopping}
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-14">
        <section aria-label={t.cart.title}>
          <FreeShippingMeter />
          <ul className="divide-y divide-border border-b border-border">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <CartLine key={line.key} line={line} />
              ))}
            </AnimatePresence>
          </ul>
        </section>

        <aside
          aria-label={t.checkout.orderSummary}
          className="mesh-soft flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]"
        >
          <h2 className="text-h3">{t.checkout.orderSummary}</h2>
          <PromoField />
          <Totals />
          <Button size="lg" asChild>
            <Link href="/checkout">
              <Lock />
              {t.cart.checkout}
            </Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
