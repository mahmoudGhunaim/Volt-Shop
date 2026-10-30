"use client";

import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { useI18n } from "@/i18n/provider";
import { useHydrated } from "@/lib/hooks";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { CartEmpty } from "./cart-empty";
import { CartLine } from "./cart-line";
import { FreeShippingMeter, PromoField, Totals } from "./cart-summary";

export function CartDrawer() {
  const { t, f } = useI18n();
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCartOpen);
  const lines = useCart((s) => s.lines);
  const hydrated = useHydrated();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const close = () => setOpen(false);
  const empty = !hydrated || lines.length === 0;

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      title={t.cart.title}
      description={empty ? undefined : f(t.cart.items, { count })}
      footer={
        empty ? undefined : (
          <div className="flex flex-col gap-4">
            <PromoField />
            <Totals />
            <div className="grid grid-cols-[1fr_1.4fr] gap-3">
              <Button variant="outline" asChild>
                <Link href="/cart" onClick={close}>
                  {t.cart.viewCart}
                </Link>
              </Button>
              <Button asChild>
                <Link href="/checkout" onClick={close}>
                  {t.cart.checkout}
                </Link>
              </Button>
            </div>
          </div>
        )
      }
    >
      {empty ? (
        <CartEmpty onNavigate={close} />
      ) : (
        <>
          <FreeShippingMeter />
          <ul className="divide-y divide-border">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <CartLine key={line.key} line={line} compact onNavigate={close} />
              ))}
            </AnimatePresence>
          </ul>
        </>
      )}
    </Sheet>
  );
}
