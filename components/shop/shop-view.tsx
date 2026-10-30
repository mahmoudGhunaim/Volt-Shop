"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { useI18n } from "@/i18n/provider";
import {
  activeFilterCount,
  allColors,
  applyFilters,
  parseFilters,
  priceBounds,
  serializeFilters,
  sortKeys,
  type Filters,
  type SortKey,
} from "@/lib/filters";
import { useDebounced } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types/product";
import { FilterPanel } from "./filter-panel";
import { ProductCard, ProductCardSkeleton } from "./product-card";

export function ShopView({ products, categories }: { products: Product[]; categories: Category[] }) {
  const { t, f, l, price } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const filters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);

  const bounds = useMemo(() => priceBounds(products), [products]);
  const colors = useMemo(() => allColors(products), [products]);
  const results = useMemo(() => applyFilters(products, filters), [products, filters]);
  // Category counts reflect every other active filter, so the numbers never lie.
  const categoryCounts = useMemo(() => {
    const pool = applyFilters(products, filters, { skipCategory: true });
    return Object.fromEntries(categories.map((c) => [c.slug, pool.filter((p) => p.category === c.slug).length]));
  }, [products, filters, categories]);

  function update(patch: Partial<Filters>) {
    const qs = serializeFilters({ ...filters, ...patch });
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  // Search: instant local input, debounced URL sync.
  const [query, setQuery] = useState(filters.q);
  const debounced = useDebounced(query, 220);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    if (debounced !== filters.q) update({ q: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the debounced value
  }, [debounced]);
  useEffect(() => {
    if (params.get("focus") === "search") searchRef.current?.focus();
  }, [params]);

  const instant = useMemo(
    () => (query.trim() ? applyFilters(products, { ...parseFilters(new URLSearchParams()), q: query }).slice(0, 5) : []),
    [products, query],
  );

  const [sheetOpen, setSheetOpen] = useState(false);
  const activeCategory = categories.find((c) => c.slug === filters.category);
  const activeCount = activeFilterCount(filters);

  const chips: Array<{ key: string; label: string; clear: Partial<Filters> }> = [
    ...(activeCategory ? [{ key: "cat", label: l(activeCategory.name), clear: { category: null } }] : []),
    ...(filters.min !== null || filters.max !== null
      ? [{ key: "price", label: `${price(filters.min ?? bounds.min)} – ${price(filters.max ?? bounds.max)}`, clear: { min: null, max: null } }]
      : []),
    ...filters.colors.flatMap((id) => {
      const c = colors.find((x) => x.id === id);
      return c ? [{ key: `c-${id}`, label: l(c.name), clear: { colors: filters.colors.filter((x) => x !== id) } }] : [];
    }),
    ...(filters.rating ? [{ key: "rating", label: f(t.shop.ratingAtLeast, { rating: filters.rating }), clear: { rating: null } }] : []),
    ...(filters.inStock ? [{ key: "stock", label: t.shop.inStockOnly, clear: { inStock: false } }] : []),
  ];

  const panel = (
    <FilterPanel
      filters={filters}
      update={update}
      categories={categories}
      categoryCounts={categoryCounts}
      colors={colors}
      bounds={bounds}
    />
  );

  return (
    <div className="container-volt pb-10 pt-8 sm:pt-12">
      {/* Title */}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <h1 className="text-h1">{activeCategory ? l(activeCategory.name) : t.shop.title}</h1>
          <p className="mt-3 text-muted" aria-live="polite">
            {activeCategory ? `${l(activeCategory.tagline)} · ` : ""}
            {f(t.shop.resultsCount, { count: results.length })}
          </p>
        </div>
      </div>

      {/* Category pills */}
      <nav aria-label={t.shop.category} className="no-scrollbar -mx-(--gutter) mt-8 overflow-x-auto px-(--gutter)">
        <ul className="flex gap-2">
          {[null, ...categories.map((c) => c.slug)].map((slug) => {
            const selected = filters.category === slug;
            const cat = categories.find((c) => c.slug === slug);
            return (
              <li key={slug ?? "all"}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update({ category: slug })}
                  className={cn(
                    "relative h-10 whitespace-nowrap rounded-full border px-5 text-sm font-medium transition-[border-color,color] duration-200",
                    selected ? "border-transparent text-bg" : "border-border hover:border-fg/40",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="category-pill"
                      className="absolute inset-0 -z-0 rounded-full bg-fg"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{cat ? l(cat.name) : t.shop.allCategories}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toolbar */}
      <div className="sticky top-(--header-h) z-(--z-sticky) -mx-(--gutter) mt-6 border-b border-border bg-bg/85 px-(--gutter) py-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
          <div className="relative min-w-0 basis-full sm:basis-auto sm:flex-1 lg:max-w-md">
            <label htmlFor="shop-search" className="sr-only">
              {t.shop.searchLabel}
            </label>
            <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              ref={searchRef}
              id="shop-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
              placeholder={t.shop.searchPlaceholder}
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="instant-results"
              aria-expanded={searchOpen && instant.length > 0}
              className="h-11 w-full rounded-full border border-border bg-surface pe-10 ps-11 text-[0.9375rem] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted focus:border-fg/40 focus:shadow-[0_0_0_4px_var(--glow-violet)] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                aria-label={t.shop.clearAll}
                className="absolute end-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
              >
                <X className="size-3.5" />
              </button>
            )}

            <AnimatePresence>
              {searchOpen && instant.length > 0 && (
                <motion.ul
                  id="instant-results"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-x-0 top-full z-(--z-dropdown) mt-2 overflow-hidden rounded-lg border border-border bg-surface p-1.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.55)]"
                >
                  {instant.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/product/${p.slug}`}
                        className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-surface-2 focus-visible:bg-surface-2"
                      >
                        <span className="plate relative size-11 shrink-0 overflow-hidden rounded-md">
                          {p.images[0] && <Image src={p.images[0].src} alt="" fill sizes="44px" className="object-contain p-1" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{p.name}</span>
                          <span className="block text-xs text-muted">{p.brand}</span>
                        </span>
                        <span className="tabular text-sm font-semibold">{price(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <Button
            variant="outline"
            className="relative h-11 flex-1 sm:flex-none lg:hidden"
            onClick={() => setSheetOpen(true)}
            aria-label={`${t.shop.filters}${activeCount ? ` (${activeCount})` : ""}`}
          >
            <SlidersHorizontal />
            <span>{t.shop.filters}</span>
            {activeCount > 0 && (
              <span className="tabular grid size-5 place-items-center rounded-full bg-lime text-[0.6875rem] font-bold text-on-lime">
                {activeCount}
              </span>
            )}
          </Button>

          <div className="relative flex-1 sm:ms-auto sm:flex-none">
            <label htmlFor="shop-sort" className="sr-only">
              {t.shop.sortBy}
            </label>
            <select
              id="shop-sort"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="h-11 cursor-pointer appearance-none rounded-full border border-border bg-surface pe-10 ps-4 text-sm font-medium outline-none transition-[border-color] hover:border-fg/40 max-sm:w-full"
            >
              {sortKeys.map((k) => (
                <option key={k} value={k}>
                  {t.shop.sort[k]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          </div>
        </div>

        {chips.length > 0 && (
          <ul className="mt-3 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <li key={c.key}>
                <button
                  type="button"
                  onClick={() => update(c.clear)}
                  aria-label={f(t.shop.removeFilter, { name: c.label })}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface-2 pe-2.5 ps-3.5 text-xs font-medium transition-colors hover:bg-border"
                >
                  {c.label}
                  <X className="size-3.5" aria-hidden />
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  update({ category: null, min: null, max: null, colors: [], rating: null, inStock: false, q: "" });
                }}
                className="h-8 px-2 text-xs font-medium text-violet-text underline-offset-4 hover:underline"
              >
                {t.shop.clearAll}
              </button>
            </li>
          </ul>
        )}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16.5rem_minmax(0,1fr)]">
        <aside aria-label={t.shop.filters} className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+5.5rem)] max-h-[calc(100dvh-var(--header-h)-7rem)] overflow-y-auto overscroll-contain pe-2 no-scrollbar">
            {panel}
          </div>
        </aside>

        <section aria-labelledby="results-title" className={cn("transition-opacity duration-200", pending && "opacity-60")}>
          <h2 id="results-title" className="sr-only">
            {f(t.shop.resultsCount, { count: results.length })}
          </h2>
          {results.length === 0 ? (
            <div className="grid place-items-center rounded-xl border border-dashed border-border px-6 py-24 text-center">
              <Search className="size-8 text-muted" aria-hidden />
              <p className="mt-4 font-wide text-2xl font-extrabold tracking-[-0.02em]">{t.shop.noResults}</p>
              <p className="mt-2 text-muted">{t.shop.noResultsBody}</p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setQuery("");
                  startTransition(() => router.replace(pathname, { scroll: false }));
                }}
              >
                {t.shop.clearAll}
              </Button>
            </div>
          ) : (
            <motion.ul layout className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 2xl:grid-cols-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((p, i) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProductCard product={p} priority={i < 4} sizes="(min-width: 1536px) 19vw, (min-width: 768px) 26vw, 46vw" />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </section>
      </div>

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        side="bottom"
        title={t.shop.filters}
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => update({ category: null, min: null, max: null, colors: [], rating: null, inStock: false })}
            >
              {t.shop.clearAll}
            </Button>
            <Button className="flex-[2]" onClick={() => setSheetOpen(false)}>
              {f(t.shop.showResults, { count: results.length })}
            </Button>
          </div>
        }
      >
        <div className="pb-4">{panel}</div>
      </Sheet>
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <div className="container-volt pb-10 pt-8 sm:pt-12" aria-busy="true">
      <div className="skeleton h-14 w-64 rounded-lg" />
      <div className="skeleton mt-4 h-4 w-32 rounded" />
      <div className="mt-8 flex gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-10 w-20 rounded-full" />
        ))}
      </div>
      <div className="skeleton mt-6 h-11 w-full max-w-md rounded-full" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16.5rem_minmax(0,1fr)]">
        <div className="hidden flex-col gap-3 lg:flex">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="skeleton h-9 rounded-md" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
