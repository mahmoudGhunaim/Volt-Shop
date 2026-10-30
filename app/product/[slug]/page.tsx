import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/product/gallery";
import { InfoTabs } from "@/components/product/info-tabs";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ProductCard } from "@/components/shop/product-card";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { localized } from "@/i18n";
import { getDictionary } from "@/i18n/server";
import { getProductBySlug, getRelatedProducts } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  const description = `${product.tagline.en}. ${product.description.en}`.slice(0, 160);
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${siteConfig.name}`,
      description,
      url: `/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, { t, locale }] = await Promise.all([getRelatedProducts(product, 4), getDictionary()]);
  const category = categories.find((c) => c.slug === product.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => i.src),
    description: product.description.en,
    sku: product.specs.sku,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: siteConfig.currency,
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="container-volt pt-6 sm:pt-8">
        <nav aria-label={t.nav.breadcrumb}>
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <li>
              <Link href="/" className="hover:text-fg">
                {t.nav.home}
              </Link>
            </li>
            <ChevronRight className="flip-rtl size-3.5" aria-hidden />
            <li>
              <Link href="/shop" className="hover:text-fg">
                {t.nav.shop}
              </Link>
            </li>
            {category && (
              <>
                <ChevronRight className="flip-rtl size-3.5" aria-hidden />
                <li>
                  <Link href={`/shop?category=${category.slug}`} className="hover:text-fg">
                    {localized(category.name, locale)}
                  </Link>
                </li>
              </>
            )}
            <ChevronRight className="flip-rtl size-3.5" aria-hidden />
            <li aria-current="page" className="max-w-[16ch] truncate text-fg sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:mt-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
            <Gallery images={product.images} name={product.name} />
          </div>
          <PurchasePanel product={product} />
        </div>

        <div className="mt-20 sm:mt-28">
          <InfoTabs product={product} />
        </div>

        <section aria-labelledby="related-title" className="mt-24 sm:mt-32">
          <h2 id="related-title" className="text-h2">
            {t.product.youMayAlsoLike}
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} sizes="(min-width: 1024px) 23vw, 46vw" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
