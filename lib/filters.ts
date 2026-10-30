import type { CategorySlug, Product, ProductColor } from "@/types/product";

export const sortKeys = ["featured", "price-asc", "price-desc", "newest", "rating"] as const;
export type SortKey = (typeof sortKeys)[number];

export interface Filters {
  q: string;
  category: CategorySlug | null;
  min: number | null;
  max: number | null;
  colors: string[];
  rating: number | null;
  inStock: boolean;
  sort: SortKey;
}

const categorySlugs: CategorySlug[] = ["audio", "wear", "carry", "desk", "kicks"];

function num(v: string | null) {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** URL query → filters. Unknown or malformed values are ignored, never thrown. */
export function parseFilters(params: URLSearchParams): Filters {
  const category = params.get("category") as CategorySlug | null;
  const sort = params.get("sort") as SortKey | null;
  const rating = num(params.get("rating"));
  return {
    q: params.get("q")?.slice(0, 80) ?? "",
    category: category && categorySlugs.includes(category) ? category : null,
    min: num(params.get("min")),
    max: num(params.get("max")),
    colors: params.get("colors")?.split(",").filter(Boolean) ?? [],
    rating: rating && rating >= 1 && rating <= 5 ? rating : null,
    inStock: params.get("stock") === "1",
    sort: sort && sortKeys.includes(sort) ? sort : "featured",
  };
}

/** Filters → URL query. Defaults are omitted to keep shareable URLs short. */
export function serializeFilters(f: Filters) {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.category) p.set("category", f.category);
  if (f.min !== null) p.set("min", String(Math.round(f.min)));
  if (f.max !== null) p.set("max", String(Math.round(f.max)));
  if (f.colors.length) p.set("colors", f.colors.join(","));
  if (f.rating) p.set("rating", String(f.rating));
  if (f.inStock) p.set("stock", "1");
  if (f.sort !== "featured") p.set("sort", f.sort);
  return p.toString();
}

export function activeFilterCount(f: Filters) {
  return (
    (f.category ? 1 : 0) +
    (f.min !== null || f.max !== null ? 1 : 0) +
    f.colors.length +
    (f.rating ? 1 : 0) +
    (f.inStock ? 1 : 0)
  );
}

function matchesQuery(p: Product, q: string) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const hay = [p.name, p.brand, p.category, p.tagline.en, p.tagline.ar, p.description.en].join(" ").toLowerCase();
  return terms.every((t) => hay.includes(t));
}

export function applyFilters(products: Product[], f: Filters, opts: { skipCategory?: boolean } = {}) {
  const filtered = products.filter(
    (p) =>
      matchesQuery(p, f.q) &&
      (opts.skipCategory || !f.category || p.category === f.category) &&
      (f.min === null || p.price >= f.min) &&
      (f.max === null || p.price <= f.max) &&
      (f.colors.length === 0 || p.colors.some((c) => f.colors.includes(c.id))) &&
      (!f.rating || p.rating >= f.rating) &&
      (!f.inStock || p.stock > 0),
  );
  return sortProducts(filtered, f.sort);
}

export function sortProducts(products: Product[], sort: SortKey) {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "newest":
      return list.sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    default:
      return list.sort((a, b) => a.featuredRank - b.featuredRank);
  }
}

export function priceBounds(products: Product[]) {
  const prices = products.map((p) => p.price);
  return {
    min: Math.max(1, Math.floor(Math.min(...prices) / 10) * 10),
    max: Math.ceil(Math.max(...prices) / 100) * 100,
  };
}

export function allColors(products: Product[]): ProductColor[] {
  const map = new Map<string, ProductColor>();
  for (const p of products) for (const c of p.colors) map.set(c.id, c);
  return [...map.values()];
}

/**
 * Prices span $40 to $14k, so a linear slider would cram most products into the first 2%.
 * The slider works on a 0–1000 log scale instead.
 */
export const SLIDER_STEPS = 1000;
export function sliderToPrice(pos: number, min: number, max: number) {
  return min * Math.pow(max / min, pos / SLIDER_STEPS);
}
export function priceToSlider(price: number, min: number, max: number) {
  const clamped = Math.min(Math.max(price, min), max);
  return Math.round((Math.log(clamped / min) / Math.log(max / min)) * SLIDER_STEPS);
}
/** Rounds a slider price to a "nice" number so the URL and label read well. */
export function nicePrice(v: number) {
  if (v < 100) return Math.round(v / 5) * 5;
  if (v < 1000) return Math.round(v / 10) * 10;
  return Math.round(v / 100) * 100;
}
