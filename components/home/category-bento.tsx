"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import type { Category, CategorySlug } from "@/types/product";

/** 12-column asymmetric bento on desktop, 2-up on mobile. Each tile gets its own glow position. */
const layout: Record<CategorySlug, { tile: string; glow: string; img: string }> = {
  audio: {
    tile: "col-span-2 row-span-2 min-h-[22rem] md:col-span-6 lg:col-span-5 lg:min-h-0",
    glow: "start-[10%] top-[20%] size-[70%]",
    img: "inset-[10%_8%_22%]",
  },
  wear: {
    tile: "md:col-span-3 lg:col-span-4",
    glow: "end-[-10%] top-[-10%] size-[60%]",
    img: "inset-[12%_6%_30%_40%] rtl:inset-[12%_40%_30%_6%]",
  },
  kicks: {
    tile: "md:col-span-3 lg:col-span-3",
    glow: "start-[20%] bottom-[-20%] size-[70%]",
    img: "inset-[8%_6%_30%]",
  },
  carry: {
    tile: "md:col-span-3 lg:col-span-3",
    glow: "end-[0%] top-[10%] size-[60%]",
    img: "inset-[8%_10%_30%]",
  },
  desk: {
    tile: "md:col-span-3 lg:col-span-4",
    glow: "start-[-10%] bottom-[-10%] size-[60%]",
    img: "inset-[14%_6%_30%_36%] rtl:inset-[14%_36%_30%_6%]",
  },
};

const order: CategorySlug[] = ["audio", "wear", "kicks", "carry", "desk"];

export function CategoryBento({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const { t, f, l } = useI18n();
  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  return (
    <section id="categories" aria-labelledby="categories-title" className="container-volt py-20 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="categories-title" className="text-h1">
          {t.home.categoriesTitle}
        </h2>
        <p className="max-w-xs text-muted">{t.home.categoriesBody}</p>
      </div>

      <div className="mt-10 grid auto-rows-[13rem] grid-cols-2 gap-3 sm:auto-rows-[15rem] sm:gap-4 md:grid-cols-6 lg:auto-rows-[19rem] lg:grid-cols-12">
        {order.map((slug, i) => {
          const c = bySlug.get(slug);
          if (!c) return null;
          const s = layout[slug];
          const big = slug === "audio";
          return (
            <Link
              key={slug}
              href={`/shop?category=${slug}`}
              className={cn(
                "group/tile plate relative isolate overflow-hidden rounded-xl p-5 sm:p-6",
                "transition-shadow duration-500 hover:shadow-[0_0_0_1px_var(--glow-violet),0_30px_80px_-30px_var(--glow-violet)]",
                s.tile,
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute -z-10 rounded-full bg-violet/25 blur-3xl transition-[background-color,transform] duration-700 ease-expo group-hover/tile:scale-125 group-hover/tile:bg-violet/45",
                  s.glow,
                )}
              />
              {c.image.src && (
                <div className={cn("absolute -z-10", c.imageKind === "photo" ? "inset-0" : s.img)}>
                  <Image
                    src={c.image.src}
                    alt=""
                    fill
                    sizes={big ? "(min-width: 1024px) 40vw, 90vw" : "(min-width: 1024px) 30vw, 45vw"}
                    priority={i === 0}
                    className={cn(
                      "transition-transform duration-[900ms] ease-expo group-hover/tile:scale-[1.08]",
                      c.imageKind === "photo" ? "object-cover" : "object-contain drop-shadow-[0_24px_30px_rgb(0_0_0/0.45)]",
                      c.imageKind === "cutout" && "group-hover/tile:-rotate-3",
                    )}
                  />
                </div>
              )}

              <div className="flex h-full flex-col justify-end text-white">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/65 sm:text-sm">
                      {f(t.home.itemsCount, { count: counts[slug] ?? 0 })}
                    </p>
                    <h3
                      className={cn(
                        "mt-1 leading-[0.9]",
                        big ? "text-[clamp(2.5rem,6vw,4.75rem)]" : "text-[clamp(1.5rem,2.6vw,2.25rem)]",
                      )}
                    >
                      {l(c.name)}
                    </h3>
                    <p className={cn("mt-2 text-sm text-white/70", !big && "max-sm:hidden")}>{l(c.tagline)}</p>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 backdrop-blur transition-[background-color,color,transform] duration-300 group-hover/tile:rotate-45 group-hover/tile:bg-lime group-hover/tile:text-on-lime sm:size-12">
                    <ArrowUpRight className="flip-rtl size-4 sm:size-5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
