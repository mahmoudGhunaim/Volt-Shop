import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { categories as rawCategories } from "@/data/categories";
import { catalog, type ProductEnrichment } from "@/data/products";
import { testimonials } from "@/data/testimonials";
import snapshot from "@/data/dummyjson-snapshot.json";
import type { Category, CategorySlug, Product, Testimonial } from "@/types/product";

/**
 * Data access layer. Products come from DummyJSON, merged with VOLT's merchandising
 * layer in data/products.ts. Components only ever see the `Product` shape, so the
 * source can be swapped for Shopify, Medusa or your own backend by rewriting this file.
 */

const API_URL = "https://dummyjson.com/products?limit=0";
const REVALIDATE_SECONDS = 60 * 60 * 24;

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku: string;
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  reviews: Array<{ rating: number; comment: string; date: string; reviewerName: string }>;
  images: string[];
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Show a sale price only for meaningful discounts, so not every card shouts "sale". */
function compareAt(price: number, discount: number) {
  if (discount < 10) return undefined;
  return Math.ceil(price / (1 - discount / 100)) - 0.01;
}

function toProduct(api: DummyProduct, volt: ProductEnrichment): Product {
  const { width, height, depth } = api.dimensions;
  return {
    id: String(api.id),
    slug: slugify(api.title),
    name: api.title,
    brand: api.brand ?? "VOLT",
    price: api.price,
    compareAtPrice: compareAt(api.price, api.discountPercentage),
    images: api.images.map((src, i) => ({
      src,
      alt: `${api.title}, ${i === 0 ? "front view" : `view ${i + 1}`}`,
    })),
    category: volt.category,
    colors: volt.colors,
    sizes: volt.sizes ?? [],
    rating: Math.round(api.rating * 10) / 10,
    reviewCount: api.reviews.length,
    stock: api.stock,
    isNew: volt.isNew ?? false,
    featuredRank: volt.featuredRank,
    releasedAt: volt.releasedAt,
    tagline: volt.tagline,
    description: { en: api.description, ar: volt.descriptionAr },
    specs: {
      brand: api.brand,
      sku: api.sku,
      dimensions: `${width.toFixed(1)} × ${height.toFixed(1)} × ${depth.toFixed(1)} cm`,
      warranty: api.warrantyInformation,
      shipping: api.shippingInformation,
      returns: api.returnPolicy,
    },
    reviews: api.reviews.map((r, i) => ({
      id: `${api.id}-r${i}`,
      author: r.reviewerName,
      rating: r.rating,
      body: r.comment,
      date: r.date,
    })),
  };
}

async function fetchDummyProducts(): Promise<DummyProduct[]> {
  try {
    const res = await fetch(API_URL, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(`DummyJSON ${res.status}`);
    const data = (await res.json()) as { products: DummyProduct[] };
    return data.products;
  } catch (error) {
    console.warn("[api] DummyJSON unreachable, using local snapshot.", error);
    return snapshot.products as DummyProduct[];
  }
}

const loadCatalog = cache(async (): Promise<Product[]> => {
  const apiProducts = await fetchDummyProducts();
  const byId = new Map(apiProducts.map((p) => [p.id, p]));
  const fallbackById = new Map((snapshot.products as DummyProduct[]).map((p) => [p.id, p]));
  return catalog.flatMap((volt) => {
    const api = byId.get(volt.id) ?? fallbackById.get(volt.id);
    return api ? [toProduct(api, volt)] : [];
  });
});

export async function getProducts(): Promise<Product[]> {
  return loadCatalog();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await loadCatalog()).find((p) => p.slug === slug);
}

export async function getProductsByCategory(category: CategorySlug): Promise<Product[]> {
  return (await loadCatalog()).filter((p) => p.category === category);
}

export async function getTrendingProducts(limit = 10): Promise<Product[]> {
  return [...(await loadCatalog())].sort((a, b) => a.featuredRank - b.featuredRank).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await loadCatalog();
  const sameCategory = all.filter((p) => p.category === product.category && p.id !== product.id);
  const others = all
    .filter((p) => p.category !== product.category)
    .sort((a, b) => a.featuredRank - b.featuredRank);
  return [...sameCategory, ...others].slice(0, limit);
}

const hasPublicFile = (publicPath: string) => existsSync(path.join(process.cwd(), "public", publicPath));

export async function getCategories(): Promise<Category[]> {
  const all = await loadCatalog();
  return rawCategories.map(({ coverProductId, ...c }) => {
    const photo = `/categories/${c.slug}.webp`;
    if (hasPublicFile(photo)) {
      return { ...c, image: { src: photo, alt: c.tagline.en }, imageKind: "photo" as const };
    }
    const cover = all.find((p) => p.id === String(coverProductId)) ?? all.find((p) => p.category === c.slug);
    return {
      ...c,
      image: { src: cover?.images[0]?.src ?? "", alt: cover?.name ?? c.name.en },
      imageKind: "cutout" as const,
    };
  });
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials;
}

/** Optional generated backdrop behind the hero object. */
export async function getHeroBackdrop(): Promise<string | null> {
  return hasPublicFile("/hero/hero-bg.webp") ? "/hero/hero-bg.webp" : null;
}
