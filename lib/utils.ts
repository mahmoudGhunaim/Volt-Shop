import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/types/product";
import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Unicode left-to-right isolate / pop directional isolate.
const LRI = String.fromCharCode(0x2066);
const PDI = String.fromCharCode(0x2069);

const formatters = new Map<string, Intl.NumberFormat>();

/** Whole amounts drop the cents ($150) unless `cents` forces them, as in order totals. */
export function formatPrice(value: number, locale: Locale = "en", cents = false) {
  const showCents = cents || value % 1 !== 0;
  const key = `${locale}-${showCents ? "dec" : "int"}`;
  let f = formatters.get(key);
  if (!f) {
    // Arabic UI keeps "$1,299" (Latin digits, $ sign), as most Gulf storefronts do.
    f = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: siteConfig.currency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: showCents ? 2 : 0,
      maximumFractionDigits: 2,
    });
    formatters.set(key, f);
  }
  // In Arabic, isolate the price as an LTR run so "$150" never reorders to "150$" mid-sentence.
  return locale === "ar" ? `${LRI}${f.format(value)}${PDI}` : f.format(value);
}

export function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round((1 - price / compareAt) * 100);
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
