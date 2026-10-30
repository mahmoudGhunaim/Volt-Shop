import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopSkeleton, ShopView } from "@/components/shop/shop-view";
import { categories as rawCategories } from "@/data/categories";
import { getCategories, getProducts } from "@/lib/api";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const cat = rawCategories.find((c) => c.slug === category);
  const title = cat ? `${cat.name.en}: ${cat.tagline.en}` : "Shop all";
  return {
    title,
    description: cat
      ? `Shop VOLT ${cat.name.en.toLowerCase()}: ${cat.tagline.en.toLowerCase()}. Filter by price, color and rating.`
      : "Browse every VOLT product: audio, watches, bags, desk setup and sneakers. Filter by price, color and rating.",
    alternates: { canonical: cat ? `/shop?category=${cat.slug}` : "/shop" },
    openGraph: { title, url: "/shop" },
  };
}

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopView products={products} categories={categories} />
    </Suspense>
  );
}
