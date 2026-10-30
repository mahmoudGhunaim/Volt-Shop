import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { posts } from "@/data/content";
import { getProducts } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...["/about", "/journal", "/careers", "/shipping", "/returns", "/warranty", "/contact"].map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...posts.map((p) => ({
      url: `${siteConfig.url}/journal/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...categories.map((c) => ({
      url: `${siteConfig.url}/shop?category=${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${siteConfig.url}/product/${p.slug}`,
      lastModified: new Date(p.releasedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: p.images.slice(0, 1).map((i) => i.src),
    })),
  ];
}
