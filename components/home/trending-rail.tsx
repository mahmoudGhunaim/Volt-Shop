"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

/**
 * Native horizontal scroll (touch, trackpad, keyboard all work) with snap,
 * plus mouse drag-to-scroll and arrow buttons on desktop.
 */
export function TrendingRail({ products }: { products: Product[] }) {
  const { t, dir } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [dragging, setDragging] = useState(false);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // scrollLeft is negative in RTL; normalize to 0..max.
    const pos = Math.abs(el.scrollLeft);
    setProgress(max > 0 ? pos / max : 0);
    setEdges({ start: pos <= 4, end: pos >= max - 4 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  function scrollByCard(direction: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 300) + 16;
    el.scrollBy({ left: direction * step * (dir === "rtl" ? -1 : 1), behavior: "smooth" });
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { active: true, startX: e.clientX, startScroll: track.current.scrollLeft, moved: false };
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d.active || !track.current) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      track.current.setPointerCapture(e.pointerId);
    }
    if (d.moved) track.current.scrollLeft = d.startScroll - dx;
  }
  function endDrag() {
    drag.current.active = false;
    // Let the click that ends a drag be swallowed before re-enabling links.
    requestAnimationFrame(() => setDragging(false));
  }

  return (
    <section aria-labelledby="trending-title" className="py-20 sm:py-24">
      <div className="container-volt flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="trending-title" className="text-h1">
            {t.home.trendingTitle}
          </h2>
          <p className="mt-3 text-muted">{t.home.trendingBody}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/shop?sort=featured"
            className="me-2 text-sm font-medium text-violet-text underline-offset-4 hover:underline"
          >
            {t.home.viewAll}
          </Link>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={edges.start}
            aria-label={t.nav.previous}
            className="grid size-11 place-items-center rounded-full border border-border transition-[background-color,transform,opacity] duration-200 hover:bg-surface-2 active:scale-90 disabled:opacity-35"
          >
            <ArrowLeft className="flip-rtl size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={edges.end}
            aria-label={t.nav.next}
            className="grid size-11 place-items-center rounded-full border border-border transition-[background-color,transform,opacity] duration-200 hover:bg-surface-2 active:scale-90 disabled:opacity-35"
          >
            <ArrowRight className="flip-rtl size-4" />
          </button>
        </div>
      </div>

      <div
        ref={track}
        onScroll={measure}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className={cn(
          "no-scrollbar mt-10 flex gap-4 overflow-x-auto overscroll-x-contain scroll-px-(--gutter) px-(--gutter) pb-4",
          dragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory",
        )}
        role="region"
        aria-label={t.home.trendingTitle}
        tabIndex={0}
      >
        {products.map((p, i) => (
          <div key={p.id} data-card className="w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-[30vw] lg:w-[22vw] 2xl:w-[19rem]">
            <ProductCard product={p} priority={i < 2} sizes="(min-width: 1024px) 22vw, 72vw" />
          </div>
        ))}
      </div>

      <div className="container-volt mt-6 flex items-center gap-4">
        <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className="absolute inset-y-0 start-0 rounded-full bg-fg transition-[width] duration-150"
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>
        <span className="text-xs text-muted max-md:hidden">{t.home.dragHint}</span>
      </div>
    </section>
  );
}
