"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/shop/price";
import { useI18n } from "@/i18n/provider";
import type { Product } from "@/types/product";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ product, backdrop }: { product: Product; backdrop: string | null }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  // Pointer position in [-0.5, 0.5], springed for a weighty feel.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.6 });

  // Layers move at different depths: object > ring > glow (opposite direction).
  const objX = useTransform(sx, (v) => v * 46);
  const objY = useTransform(sy, (v) => v * 36);
  const objRotY = useTransform(sx, (v) => v * 18);
  const objRotX = useTransform(sy, (v) => v * -14);
  const ringX = useTransform(sx, (v) => v * 18);
  const ringY = useTransform(sy, (v) => v * 14);
  const glowX = useTransform(sx, (v) => v * -40);
  const glowY = useTransform(sy, (v) => v * -30);
  const shadowScale = useTransform(sy, (v) => 1 - v * 0.25);
  const glowTransform = useMotionTemplate`translate(${glowX}px, ${glowY}px)`;

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  const [before, after] = t.home.heroTitle.split(t.home.heroAccent);
  const image = product.images[0];

  return (
    <section
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="relative isolate -mt-(--header-h) overflow-hidden pt-(--header-h)"
      aria-labelledby="hero-title"
    >
      {/* Background: optional generated backdrop + mesh that fades out at the bottom */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {backdrop && (
          <Image src={backdrop} alt="" fill priority sizes="100vw" className="object-cover opacity-70" />
        )}
        <div className="mesh grain absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" />
      </div>

      <div className="container-volt grid min-h-[min(calc(100svh-var(--header-h)),58rem)] items-center gap-6 pb-16 pt-6 lg:grid-cols-[1.08fr_1fr] lg:gap-4 lg:pb-20">
        <div className="relative z-(--z-base) max-w-2xl">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-border bg-bg/50 py-1.5 pe-4 ps-3 text-sm text-muted backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-lime" />
            </span>
            {t.home.heroKicker}
          </p>

          <h1 id="hero-title" className="mt-6 min-h-[2.8em] text-display">
            {before}
            <span className="relative inline-block whitespace-nowrap">
              {t.home.heroAccent}
              <svg
                aria-hidden
                viewBox="0 0 300 24"
                preserveAspectRatio="none"
                className="absolute -bottom-[0.12em] start-0 h-[0.2em] w-full overflow-visible text-violet"
              >
                <motion.path
                  d="M3 16 C 60 4, 110 22, 160 12 S 260 6, 297 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.35, ease }}
                />
              </svg>
            </span>
            {after}
          </h1>

          <p className="mt-7 max-w-[44ch] text-lg text-muted sm:text-xl">{t.home.heroBody}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/shop">
                {t.home.heroPrimary}
                <ArrowUpRight className="flip-rtl" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#categories">{t.home.heroSecondary}</a>
            </Button>
          </div>
        </div>

        {/* Product stage */}
        <div className="relative mx-auto aspect-square w-full max-w-[min(36rem,88vw)] [perspective:1200px]">
          <motion.div
            aria-hidden
            style={{ transform: glowTransform }}
            className="absolute inset-[12%] rounded-full bg-violet/40 blur-[70px]"
          />
          <motion.div
            aria-hidden
            style={{ x: ringX, y: ringY }}
            className="plate absolute inset-[6%] rounded-full shadow-[inset_0_1px_0_oklch(1_0_0/0.08),0_40px_120px_-40px_var(--glow-violet)]"
          >
            {/* Orbiting signal dot */}
            <div className="absolute inset-[-3%] animate-[spin_14s_linear_infinite] rounded-full border border-white/10 motion-reduce:animate-none">
              <span className="absolute start-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_16px_4px_var(--glow-lime)]" />
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-[14%]"
            style={{ x: objX, y: objY, rotateY: objRotY, rotateX: objRotX }}
            // Transform only: the hero image is the LCP element, so it must paint at full opacity.
            initial={reduce ? false : { y: 40, scale: 0.92 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease }}
          >
            <motion.div
              className="relative size-full"
              animate={reduce ? undefined : { y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {image && (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 34vw, 75vw"
                  className="object-contain drop-shadow-[0_30px_40px_rgb(0_0_0/0.45)]"
                />
              )}
            </motion.div>
          </motion.div>

          <motion.div
            aria-hidden
            style={{ scaleX: shadowScale }}
            className="absolute inset-x-[30%] bottom-[9%] h-[4%] rounded-[50%] bg-black/50 blur-xl"
          />

          {/* Floating product chip */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease }}
            className="absolute bottom-[4%] end-0 sm:end-[2%]"
          >
            <Link
              href={`/product/${product.slug}`}
              className="group flex items-center gap-3 rounded-full border border-border bg-bg/75 py-2 pe-2 ps-4 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-fg/30"
            >
              <span className="flex flex-col leading-tight">
                <span className="text-xs text-muted">{t.home.heroFloatingLabel}</span>
                <span className="text-sm font-semibold">{product.name}</span>
              </span>
              <Price price={product.price} className="text-sm" />
              <span className="grid size-9 place-items-center rounded-full bg-lime text-on-lime transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      <a
        href="#categories"
        className="absolute bottom-6 start-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs text-muted transition-colors hover:text-fg lg:flex rtl:translate-x-1/2"
      >
        <ArrowDown className="size-3.5 animate-nudge motion-reduce:animate-none" />
        {t.home.heroScroll}
      </a>
    </section>
  );
}
