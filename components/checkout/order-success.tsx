"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Lottie } from "@/components/ui/lottie";
import { useI18n } from "@/i18n/provider";
import { ORDER_KEY, type PlacedOrder } from "@/lib/checkout";

const ease = [0.16, 1, 0.3, 1] as const;

function readOrder(): string | null {
  try {
    return sessionStorage.getItem(ORDER_KEY);
  } catch {
    return null;
  }
}

async function celebrate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { default: confetti } = await import("canvas-confetti");
  const colors = ["#C6FF3D", "#7C5CFF", "#F5F4F0"];
  const burst = (x: number, angle: number) =>
    confetti({ particleCount: 70, spread: 70, startVelocity: 55, angle, origin: { x, y: 0.7 }, colors, ticks: 220, scalar: 1.05 });
  burst(0.15, 60);
  burst(0.85, 120);
  setTimeout(() => confetti({ particleCount: 90, spread: 120, origin: { y: 0.35 }, colors, ticks: 260 }), 280);
}

export function OrderSuccess() {
  const { t, f, price, locale } = useI18n();
  const raw = useSyncExternalStore(
    () => () => {},
    readOrder,
    () => null,
  );
  const order = raw ? (JSON.parse(raw) as PlacedOrder) : null;

  useEffect(() => {
    if (order) void celebrate();
    // celebrate once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  const eta = order
    ? new Intl.DateTimeFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date(order.eta))
    : "";

  return (
    <div className="relative isolate -mt-(--header-h) overflow-hidden pt-(--header-h)">
      <div aria-hidden className="mesh grain absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]" />
      <div className="container-volt flex min-h-[80dvh] flex-col items-center justify-center py-16 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease }}>
          <Lottie name="success" loop={false} className="w-36 sm:w-44" />
        </motion.div>

        <motion.h1
          className="mt-10 text-display"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
        >
          {t.success.title}
        </motion.h1>

        {order ? (
          <>
            <motion.p
              className="mt-6 max-w-xl text-lg text-muted"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              {f(t.success.body, { name: order.name, order: order.id, email: order.email })}
            </motion.p>

            <motion.div
              className="mt-10 flex w-full max-w-lg flex-col items-center gap-6 rounded-xl border border-border bg-surface/80 p-6 backdrop-blur sm:flex-row sm:text-start"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
            >
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {order.images.map((src, i) => (
                  <span key={src + i} className="plate relative size-14 overflow-hidden rounded-full ring-2 ring-surface">
                    <Image src={src} alt="" fill sizes="56px" className="object-contain p-2" />
                  </span>
                ))}
              </div>
              <dl className="grid flex-1 grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted">{t.success.eta}</dt>
                  <dd className="mt-0.5 font-semibold">{eta}</dd>
                </div>
                <div>
                  <dt className="text-muted">{t.cart.total}</dt>
                  <dd className="tabular mt-0.5 font-semibold">{price(order.total, true)}</dd>
                </div>
              </dl>
            </motion.div>
          </>
        ) : (
          <p className="mt-6 text-muted">{t.success.noOrder}</p>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Button size="lg" asChild className="mt-10">
            <Link href="/shop">{t.success.keepShopping}</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
