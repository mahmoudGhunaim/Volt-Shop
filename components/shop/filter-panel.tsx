"use client";

import { Check, Star } from "lucide-react";
import { useState } from "react";
import { RangeSlider } from "@/components/ui/range-slider";
import { useI18n } from "@/i18n/provider";
import {
  nicePrice,
  priceToSlider,
  SLIDER_STEPS,
  sliderToPrice,
  type Filters,
} from "@/lib/filters";
import { cn } from "@/lib/utils";
import type { Category, CategorySlug, ProductColor } from "@/types/product";

interface FilterPanelProps {
  filters: Filters;
  update: (patch: Partial<Filters>) => void;
  categories: Category[];
  categoryCounts: Record<string, number>;
  colors: ProductColor[];
  bounds: { min: number; max: number };
}

export function FilterPanel({ filters, update, categories, categoryCounts, colors, bounds }: FilterPanelProps) {
  const { t, f, l } = useI18n();
  const total = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col divide-y divide-border">
      <Group title={t.shop.category}>
        <ul className="flex flex-col gap-0.5">
          {[{ slug: null, label: t.shop.allCategories, count: total }, ...categories.map((c) => ({ slug: c.slug, label: l(c.name), count: categoryCounts[c.slug] ?? 0 }))].map(
            (c) => {
              const selected = filters.category === c.slug;
              return (
                <li key={c.slug ?? "all"}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update({ category: c.slug as CategorySlug | null })}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-start text-sm transition-colors duration-150",
                      selected ? "bg-fg font-semibold text-bg" : "hover:bg-surface-2",
                    )}
                  >
                    {c.label}
                    <span className={cn("tabular text-xs", selected ? "text-bg/70" : "text-muted")}>{c.count}</span>
                  </button>
                </li>
              );
            },
          )}
        </ul>
      </Group>

      <Group title={t.shop.price}>
        <PriceFilter filters={filters} update={update} bounds={bounds} />
      </Group>

      <Group title={t.shop.colors}>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((c) => {
            const on = filters.colors.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                aria-label={l(c.name)}
                title={l(c.name)}
                onClick={() =>
                  update({ colors: on ? filters.colors.filter((x) => x !== c.id) : [...filters.colors, c.id] })
                }
                className={cn(
                  "grid size-9 place-items-center rounded-full ring-1 ring-border ring-offset-2 ring-offset-bg transition-[box-shadow,transform] duration-200 active:scale-90",
                  on && "ring-2 ring-fg",
                )}
                style={{ backgroundColor: c.hex }}
              >
                {on && <Check className="size-4 text-white mix-blend-difference" />}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title={t.shop.rating}>
        <div className="flex flex-wrap gap-2">
          {[4.5, 4, 3].map((r) => {
            const on = filters.rating === r;
            return (
              <button
                key={r}
                type="button"
                aria-pressed={on}
                onClick={() => update({ rating: on ? null : r })}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors duration-150",
                  on ? "border-fg bg-fg text-bg" : "border-border hover:border-fg/40",
                )}
              >
                <Star className="size-3.5 fill-current" aria-hidden />
                {f(t.shop.ratingAtLeast, { rating: r })}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title={t.shop.availability}>
        <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
          {t.shop.inStockOnly}
          <span className="relative inline-flex">
            <input
              type="checkbox"
              role="switch"
              checked={filters.inStock}
              onChange={(e) => update({ inStock: e.target.checked })}
              className="peer sr-only"
            />
            <span className="h-6 w-11 rounded-full bg-border transition-colors duration-200 peer-checked:bg-lime peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--focus)" />
            <span className="absolute start-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200 ease-expo peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5" />
          </span>
        </label>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="py-6 first:pt-0">
      <legend className="float-start mb-4 w-full text-sm font-semibold">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function PriceFilter({
  filters,
  update,
  bounds,
}: Pick<FilterPanelProps, "filters" | "update" | "bounds">) {
  const { t, price } = useI18n();
  const committed: [number, number] = [
    priceToSlider(filters.min ?? bounds.min, bounds.min, bounds.max),
    priceToSlider(filters.max ?? bounds.max, bounds.min, bounds.max),
  ];
  // Local value while dragging; URL updates on commit only. Resets when the URL changes.
  const [drag, setDrag] = useState<{ from: string; value: [number, number] } | null>(null);
  const key = committed.join("-");
  const value = drag && drag.from === key ? drag.value : committed;
  const lo = nicePrice(sliderToPrice(value[0], bounds.min, bounds.max));
  const hi = nicePrice(sliderToPrice(value[1], bounds.min, bounds.max));

  return (
    <div>
      <RangeSlider
        min={0}
        max={SLIDER_STEPS}
        value={value}
        labels={[t.shop.priceMin, t.shop.priceMax]}
        onValueChange={(v) => setDrag({ from: key, value: v })}
        onValueCommit={(v) =>
          update({
            min: v[0] <= 0 ? null : nicePrice(sliderToPrice(v[0], bounds.min, bounds.max)),
            max: v[1] >= SLIDER_STEPS ? null : nicePrice(sliderToPrice(v[1], bounds.min, bounds.max)),
          })
        }
      />
      <div className="tabular mt-3 flex justify-between text-sm" aria-live="polite">
        <span className="rounded-md border border-border px-2.5 py-1">{price(lo)}</span>
        <span className="rounded-md border border-border px-2.5 py-1">{price(hi)}</span>
      </div>
    </div>
  );
}
