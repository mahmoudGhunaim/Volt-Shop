"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import type { Product, Testimonial } from "@/types/product";

const ROTATE_MS = 7000;

/** One big quote at a time, people as tabs. Auto-advances until the visitor interacts. */
export function Testimonials({ items, products }: { items: Testimonial[]; products: Product[] }) {
  const { t, l, dir } = useI18n();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = items[active];
  const product = products.find((p) => p.slug === current?.productSlug);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % items.length), ROTATE_MS);
    return () => clearTimeout(id);
  }, [active, paused, items.length]);

  function onKeyDown(e: KeyboardEvent) {
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    const keys = [forward, back, "ArrowDown", "ArrowUp"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const delta = e.key === forward || e.key === "ArrowDown" ? 1 : -1;
    const next = (active + delta + items.length) % items.length;
    setActive(next);
    setPaused(true);
    tabs.current[next]?.focus();
  }

  if (!current) return null;

  return (
    <section aria-labelledby="testimonials-title" className="mesh-soft py-20 sm:py-28">
      <div className="container-volt grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
        <div>
          <h2 id="testimonials-title" className="text-h2">
            {t.home.testimonialsTitle}
          </h2>
          <div role="tablist" aria-orientation="vertical" className="mt-8 flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible" onKeyDown={onKeyDown}>
            {items.map((item, i) => {
              const selected = i === active;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`testimonial-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls="testimonial-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => {
                    setActive(i);
                    setPaused(true);
                  }}
                  className={cn(
                    "relative shrink-0 overflow-hidden rounded-lg border px-4 py-3 text-start transition-[border-color,background-color] duration-300",
                    selected ? "border-fg/20 bg-surface" : "border-transparent hover:bg-surface/60",
                  )}
                >
                  <span className="block text-sm font-semibold">{item.author}</span>
                  <span className="block text-xs text-muted">{l(item.role)}</span>
                  {selected && !paused && (
                    <motion.span
                      key={`bar-${active}`}
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-lime rtl:origin-right [[data-theme=light]_&]:bg-violet"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="testimonial-panel"
          role="tabpanel"
          aria-labelledby={`testimonial-tab-${current.id}`}
          className="relative grid min-h-[22rem] grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]"
          onMouseEnter={() => setPaused(true)}
        >
          <AnimatePresence mode="wait">
            <motion.figure
              key={current.id}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span aria-hidden className="block font-wide text-7xl leading-none text-violet">
                “
              </span>
              <blockquote className="mt-2 font-wide text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] [:root[lang=ar]_&]:font-semibold [:root[lang=ar]_&]:leading-normal [:root[lang=ar]_&]:tracking-normal">
                {l(current.quote)}
              </blockquote>
              <figcaption className="mt-8 text-sm text-muted">
                <span className="font-semibold text-fg">{current.author}</span> · {l(current.role)}
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          {product?.images[0] && (
            <Link
              href={`/product/${product.slug}`}
              className="plate group relative hidden size-48 shrink-0 overflow-hidden rounded-full md:block lg:size-56"
              aria-label={product.name}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.id}
                  className="absolute inset-[14%]"
                  initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={product.images[0].src}
                    alt=""
                    fill
                    sizes="224px"
                    className="object-contain transition-transform duration-700 ease-expo group-hover:scale-110"
                  />
                </motion.div>
              </AnimatePresence>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
