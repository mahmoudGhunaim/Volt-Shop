"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lottie } from "@/components/ui/lottie";
import { useI18n } from "@/i18n/provider";

const ease = [0.16, 1, 0.3, 1] as const;

/** "Signal lost": a flickering 404 and an unplugged cable. */
export function NotFoundView() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <div className="relative isolate overflow-hidden">
      <div aria-hidden className="mesh-soft absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_50%,transparent)]" />
      <div className="container-volt grid min-h-[78dvh] items-center gap-12 py-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <motion.p
            aria-hidden
            dir="ltr"
            className="font-wide text-[clamp(7rem,26vw,18rem)] font-extrabold leading-[0.8] tracking-[-0.05em] text-transparent [-webkit-text-stroke:2px_var(--fg)]"
            animate={reduce ? undefined : { opacity: [1, 0.35, 1, 1, 0.6, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, times: [0, 0.05, 0.1, 0.6, 0.63, 0.68] }}
          >
            404
          </motion.p>
          <motion.h1
            className="mt-8 text-h1"
            initial={reduce ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease }}
          >
            {t.notFound.title}
          </motion.h1>
          <p className="mt-4 max-w-md text-lg text-muted">{t.notFound.body}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/">{t.notFound.home}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/shop">{t.notFound.shop}</Link>
            </Button>
          </div>
        </div>
        <Lottie name="not-found" className="mx-auto w-full max-w-[22rem] lg:max-w-[26rem]" />
      </div>
    </div>
  );
}
