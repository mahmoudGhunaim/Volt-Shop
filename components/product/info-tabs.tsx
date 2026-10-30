"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Tabs } from "radix-ui";
import { useState } from "react";
import { Stars } from "@/components/shop/stars";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import type { Product, SpecKey } from "@/types/product";

type Tab = "description" | "specs" | "reviews";

export function InfoTabs({ product }: { product: Product }) {
  const { t, f, l, locale } = useI18n();
  const [tab, setTab] = useState<Tab>("description");
  const tabs: Tab[] = ["description", "specs", "reviews"];
  const reviews = product.reviews;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const dateFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-US", { dateStyle: "medium" });

  return (
    <Tabs.Root id="details" value={tab} onValueChange={(v) => setTab(v as Tab)} className="scroll-mt-28">
      <Tabs.List aria-label={product.name} className="no-scrollbar flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((key) => (
          <Tabs.Trigger
            key={key}
            value={key}
            className="relative whitespace-nowrap px-4 pb-4 pt-2 font-wide text-lg font-bold tracking-[-0.02em] text-muted transition-colors duration-200 hover:text-fg data-[state=active]:text-fg sm:text-xl"
          >
            {t.product[key]}
            {key === "reviews" && <span className="tabular ms-1.5 text-sm font-medium text-muted">{product.reviewCount}</span>}
            {tab === key && (
              <motion.span
                layoutId="pdp-tab"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-fg"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="description" className="pt-8 outline-none">
        <p className="max-w-[65ch] text-lg leading-relaxed text-muted">{l(product.description)}</p>
      </Tabs.Content>

      <Tabs.Content value="specs" className="pt-6 outline-none">
        <dl className="grid max-w-3xl sm:grid-cols-2 sm:gap-x-10">
          {(Object.entries(product.specs) as Array<[SpecKey, string | undefined]>)
            .filter(([, v]) => v)
            .map(([key, value]) => (
              <div key={key} className="flex justify-between gap-6 border-b border-border py-4 text-sm">
                <dt className="text-muted">{t.product.spec[key]}</dt>
                <dd className="text-end font-medium" dir="auto">
                  {value}
                </dd>
              </div>
            ))}
        </dl>
      </Tabs.Content>

      <Tabs.Content value="reviews" className="pt-8 outline-none">
        <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="font-wide text-6xl font-extrabold leading-none tracking-[-0.04em]">{product.rating.toFixed(1)}</p>
            <Stars rating={product.rating} size={18} className="mt-3" />
            <p className="mt-2 text-sm text-muted">{f(t.product.basedOn, { count: product.reviewCount })}</p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {breakdown.map(({ star, count }) => (
                <li key={star} className="flex items-center gap-3 text-sm">
                  <span className="tabular w-3 text-muted">{star}</span>
                  <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-border" aria-hidden>
                    <motion.span
                      className="absolute inset-y-0 start-0 rounded-full bg-fg"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                  <span className="tabular w-4 text-end text-muted">{count}</span>
                  <span className="sr-only">{f(t.product.stars, { count: star })}</span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="flex flex-col divide-y divide-border">
            {reviews.map((r) => (
              <li key={r.id} className="py-6 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="grid size-10 place-items-center rounded-full bg-surface-2 text-sm font-semibold"
                    >
                      {r.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-semibold">
                        {r.author}
                        <BadgeCheck className="size-4 text-violet-text" aria-label={t.product.verified} />
                      </p>
                      <p className="text-xs text-muted">{dateFmt.format(new Date(r.date))}</p>
                    </div>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p className={cn("mt-4 text-[1.0625rem]")} dir="auto">
                  {r.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
