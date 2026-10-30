"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUI } from "@/store/ui";
import type { Locale } from "@/types/product";

// Overlays are not needed for first paint, so their code (Radix Dialog, sonner, drawer
// contents) loads only when first opened, keeping the initial bundle lean.
const CartDrawer = dynamic(() => import("@/components/cart/cart-drawer").then((m) => m.CartDrawer), { ssr: false });
const QuickView = dynamic(() => import("@/components/shop/quick-view").then((m) => m.QuickView), { ssr: false });
const Toasts = dynamic(() => import("./toasts").then((m) => m.Toasts), { ssr: false });

export function DeferredUI({ locale }: { locale: Locale }) {
  const cartOpen = useUI((s) => s.cartOpen);
  const quickView = useUI((s) => s.quickView);
  const [cartUsed, setCartUsed] = useState(false);
  const [quickUsed, setQuickUsed] = useState(false);
  const [idle, setIdle] = useState(false);

  // Once mounted, keep overlays mounted so their exit animations can play.
  if (cartOpen && !cartUsed) setCartUsed(true);
  if (quickView && !quickUsed) setQuickUsed(true);

  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const id = ric(() => setIdle(true));
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id);
  }, []);

  return (
    <>
      {cartUsed && <CartDrawer />}
      {quickUsed && <QuickView />}
      {idle && <Toasts locale={locale} />}
    </>
  );
}
