"use client";

import { Check } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import type { ProductColor } from "@/types/product";

/** Perceived lightness, to pick a readable check mark on the swatch. */
function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 > 150;
}

export function ColorPicker({
  colors,
  value,
  onChange,
}: {
  colors: ProductColor[];
  value?: string;
  onChange: (id: string) => void;
}) {
  const { t, l } = useI18n();
  const current = colors.find((c) => c.id === value);
  if (colors.length === 0) return null;
  return (
    <fieldset>
      <legend className="text-sm text-muted">
        {t.product.color}: <span className="font-medium text-fg">{current ? l(current.name) : ""}</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {colors.map((c) => {
          const selected = c.id === value;
          return (
            <label
              key={c.id}
              className={cn(
                "relative grid size-10 cursor-pointer place-items-center rounded-full ring-1 ring-border ring-offset-2 ring-offset-bg transition-[box-shadow,transform] duration-200 active:scale-90 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-(--focus)",
                selected && "ring-2 ring-fg",
              )}
              style={{ backgroundColor: c.hex }}
              title={l(c.name)}
            >
              <input
                type="radio"
                name="color"
                value={c.id}
                checked={selected}
                onChange={() => onChange(c.id)}
                className="sr-only"
                aria-label={l(c.name)}
              />
              {selected && (
                <Check className={cn("size-4", isLight(c.hex) ? "text-plate" : "text-white")} aria-hidden />
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SizePicker({
  sizes,
  value,
  onChange,
}: {
  sizes: string[];
  value?: string;
  onChange: (size: string) => void;
}) {
  const { t } = useI18n();
  if (sizes.length === 0) return null;
  return (
    <fieldset>
      <legend className="text-sm text-muted">
        {t.product.size}: <span className="font-medium text-fg">{value ?? t.product.selectSize}</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((s) => {
          const selected = s === value;
          return (
            <label
              key={s}
              className={cn(
                "tabular grid h-11 min-w-14 cursor-pointer place-items-center rounded-md border px-3 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-95 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--focus)",
                selected ? "border-fg bg-fg text-bg" : "border-border hover:border-fg/50",
              )}
            >
              <input
                type="radio"
                name="size"
                value={s}
                checked={selected}
                onChange={() => onChange(s)}
                className="sr-only"
              />
              {s}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
