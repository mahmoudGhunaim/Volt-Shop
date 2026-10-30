"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

/**
 * Desktop: thumbnails + main plate with cursor-following zoom.
 * Mobile: swipeable scroll-snap strip with dot indicators.
 */
export function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const { t, f } = useI18n();
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const current = images[active] ?? images[0];

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }

  function goTo(i: number) {
    setActive(i);
    const el = strip.current;
    if (el) el.scrollTo({ left: (el.scrollWidth / images.length) * i * (getComputedStyle(el).direction === "rtl" ? -1 : 1), behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:items-start">
      {/* Mobile swipe strip */}
      <div className="relative lg:hidden">
        <div
          ref={strip}
          className="no-scrollbar -mx-(--gutter) flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
          }}
          aria-label={name}
          role="region"
        >
          {images.map((img, i) => (
            <div key={img.src} className="w-full shrink-0 snap-center px-(--gutter)">
              <div className="plate relative aspect-square overflow-hidden rounded-xl">
                <Image src={img.src} alt={img.alt} fill priority={i === 0} sizes="100vw" className="object-contain p-[10%]" />
              </div>
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-1">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={f(t.product.imageOf, { index: i + 1, total: images.length })}
                aria-current={i === active}
                className="grid h-6 min-w-6 place-items-center"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-[width,background-color] duration-300",
                    i === active ? "w-6 bg-fg" : "w-1.5 bg-border",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop main image with zoom */}
      <div
        className="plate group relative hidden aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-xl lg:block"
        onPointerMove={onMove}
        onPointerLeave={() => setZoom(null)}
      >
        {current && (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain p-[9%] transition-transform duration-300 ease-out"
            style={
              zoom
                ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                : { transform: "scale(1)" }
            }
          />
        )}
        <span className="pointer-events-none absolute bottom-4 end-4 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur transition-opacity duration-300 group-hover:opacity-0">
          {t.product.zoomHint}
        </span>
      </div>

      {images.length > 1 && (
        <div className="hidden w-20 shrink-0 flex-col gap-3 lg:flex" role="group" aria-label={name}>
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-label={f(t.product.imageOf, { index: i + 1, total: images.length })}
              aria-current={i === active}
              className={cn(
                "plate relative aspect-square overflow-hidden rounded-lg ring-offset-2 ring-offset-bg transition-[box-shadow,opacity] duration-200",
                i === active ? "ring-2 ring-fg" : "[&_img]:opacity-55 hover:[&_img]:opacity-100",
              )}
            >
              <Image src={img.src} alt="" fill sizes="80px" className="object-contain p-2 transition-opacity duration-200" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
