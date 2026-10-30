import { CategoryBento } from "@/components/home/category-bento";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { Newsletter } from "@/components/home/newsletter";
import { PromoCountdown } from "@/components/home/promo-countdown";
import { Testimonials } from "@/components/home/testimonials";
import { TrendingRail } from "@/components/home/trending-rail";
import {
  getCategories,
  getHeroBackdrop,
  getProductBySlug,
  getProducts,
  getTestimonials,
  getTrendingProducts,
} from "@/lib/api";

const HERO_SLUG = "apple-airpods-max-silver";
const PROMO_SLUGS = ["apple-airpods", "rolex-submariner-watch", "puma-future-rider-trainers"];

export default async function HomePage() {
  const [products, categories, trending, testimonials, backdrop] = await Promise.all([
    getProducts(),
    getCategories(),
    getTrendingProducts(10),
    getTestimonials(),
    getHeroBackdrop(),
  ]);
  const hero = (await getProductBySlug(HERO_SLUG)) ?? trending[0]!;
  const promo = PROMO_SLUGS.flatMap((s) => products.find((p) => p.slug === s) ?? []);
  const counts = Object.fromEntries(
    categories.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]),
  );

  return (
    <>
      <Hero product={hero} backdrop={backdrop} />
      <Marquee />
      <CategoryBento categories={categories} counts={counts} />
      <TrendingRail products={trending} />
      <PromoCountdown products={promo} />
      <Testimonials items={testimonials} products={products} />
      <Newsletter />
    </>
  );
}
