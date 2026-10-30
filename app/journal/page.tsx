import type { Metadata } from "next";
import { PostCard } from "@/components/info/post-card";
import { posts } from "@/data/content";
import { getDictionary } from "@/i18n/server";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Journal",
  description: "Field notes, long-term tests and desk tours from the VOLT team.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const [{ t, locale }, products] = await Promise.all([getDictionary(), getProducts()]);
  const cover = (slug: string) => products.find((p) => p.slug === slug)?.images[0]?.src;
  const [first, ...rest] = posts;

  return (
    <div className="container-volt pb-10 pt-10 sm:pt-14">
      <h1 className="text-display">{t.info.journalTitle}</h1>
      <p className="mt-5 max-w-[48ch] text-lg text-muted">{t.info.journalLede}</p>

      {first && (
        <div className="mt-14">
          <PostCard post={first} cover={cover(first.coverProductSlug)} locale={locale} t={t} featured />
        </div>
      )}
      <div className="mt-16 grid gap-x-6 gap-y-14 border-t border-border pt-14 md:grid-cols-2">
        {rest.map((p) => (
          <PostCard key={p.slug} post={p} cover={cover(p.coverProductSlug)} locale={locale} t={t} />
        ))}
      </div>
    </div>
  );
}
