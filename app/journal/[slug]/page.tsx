import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, PostCard } from "@/components/info/post-card";
import { ProductCard } from "@/components/shop/product-card";
import { posts } from "@/data/content";
import { format, localized } from "@/i18n";
import { getDictionary } from "@/i18n/server";
import { getProductBySlug, getProducts } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title.en,
    description: post.excerpt.en,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: { type: "article", title: post.title.en, description: post.excerpt.en, publishedTime: post.date },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const [{ t, locale }, product, products] = await Promise.all([
    getDictionary(),
    getProductBySlug(post.coverProductSlug),
    getProducts(),
  ]);
  const others = posts.filter((p) => p.slug !== post.slug);
  const cover = (s: string) => products.find((p) => p.slug === s)?.images[0]?.src;

  return (
    <article className="pb-10">
      <header className="container-volt pt-8 sm:pt-12">
        <Link href="/journal" className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-text hover:underline">
          <ArrowLeft className="flip-rtl size-4" />
          {t.info.backToJournal}
        </Link>
        <p className="mt-8 text-sm text-muted">
          <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time> · {format(t.info.minRead, { minutes: post.readMinutes })}
        </p>
        <h1 className="mt-4 max-w-[18ch] text-display">{localized(post.title, locale)}</h1>
        <p className="mt-6 max-w-[52ch] text-xl text-muted">{localized(post.excerpt, locale)}</p>
      </header>

      {product?.images[0] && (
        <div className="container-volt mt-12">
          <div className="plate relative aspect-[16/9] overflow-hidden rounded-xl sm:aspect-[21/9]">
            <div aria-hidden className="absolute end-[10%] top-[-20%] size-2/3 rounded-full bg-violet/30 blur-3xl" />
            <Image src={product.images[0].src} alt={product.images[0].alt} fill priority sizes="100vw" className="object-contain p-[8%]" />
          </div>
        </div>
      )}

      <div className="container-volt mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
        <div className="flex max-w-[66ch] flex-col gap-6 text-lg leading-relaxed sm:text-xl">
          {post.body.map((para) => (
            <p key={para.en}>{localized(para, locale)}</p>
          ))}
        </div>
        {product && (
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
            <ProductCard product={product} sizes="288px" />
          </aside>
        )}
      </div>

      <section aria-labelledby="more-title" className="container-volt mt-24 border-t border-border pt-14">
        <h2 id="more-title" className="text-h2">
          {t.info.moreArticles}
        </h2>
        <div className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2">
          {others.map((p) => (
            <PostCard key={p.slug} post={p} cover={cover(p.coverProductSlug)} locale={locale} t={t} />
          ))}
        </div>
      </section>
    </article>
  );
}
