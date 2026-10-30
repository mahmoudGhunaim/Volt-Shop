import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InfoHero } from "@/components/info/info-blocks";
import { buttonClasses } from "@/components/ui/button";
import { about } from "@/data/content";
import { localized } from "@/i18n";
import { getDictionary } from "@/i18n/server";
import { getTrendingProducts } from "@/lib/api";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: "VOLT is a small team picking tested, built-to-last tech and lifestyle gear. Fewer, better, charged.",
  alternates: { canonical: "/about" },
};

// Staggered plate heights make the product band read like a shelf, not a grid.
const heights = ["h-56", "h-72", "h-48", "h-64", "h-52"];

export default async function AboutPage() {
  const [{ t, locale }, products] = await Promise.all([getDictionary(), getTrendingProducts(5)]);

  return (
    <>
      <InfoHero title={localized(about.title, locale)} lede={localized(about.lede, locale)} />

      <section aria-label={t.info.team} className="container-volt">
        <div className="no-scrollbar -mx-(--gutter) flex items-end gap-3 overflow-x-auto px-(--gutter) pb-2 sm:gap-4">
          {products.map((p, i) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className={cn(
                "plate group relative w-44 shrink-0 overflow-hidden rounded-xl sm:w-auto sm:flex-1",
                heights[i % heights.length],
              )}
              aria-label={p.name}
            >
              {p.images[0] && (
                <Image
                  src={p.images[0].src}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 20vw, 176px"
                  className="object-contain p-[14%] transition-transform duration-700 ease-expo group-hover:scale-110"
                />
              )}
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="story-title" className="container-volt grid gap-8 py-20 sm:py-28 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <h2 id="story-title" className="text-h2">
          {t.info.ourStory}
        </h2>
        <div className="flex max-w-[62ch] flex-col gap-6 text-lg text-muted sm:text-xl">
          {about.story.map((p) => (
            <p key={p.en}>{localized(p, locale)}</p>
          ))}
        </div>
      </section>

      <section aria-labelledby="principles-title" className="container-volt pb-12">
        <h2 id="principles-title" className="text-h2">
          {t.info.principles}
        </h2>
        <ul className="mt-10 grid border-t border-border md:grid-cols-3">
          {about.principles.map((p, i) => (
            <li
              key={p.title.en}
              className={cn(
                "border-b border-border py-8 md:border-b-0 md:pe-8",
                i > 0 && "md:border-s md:ps-8",
              )}
            >
              <h3 className="text-h3">{localized(p.title, locale)}</h3>
              <p className="mt-3 text-muted">{localized(p.body, locale)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/shop" className={buttonClasses({ size: "lg" })}>
            {t.home.heroPrimary}
            <ArrowUpRight className="flip-rtl" />
          </Link>
          <Link href="/careers" className={buttonClasses({ size: "lg", variant: "outline" })}>
            {t.footer.careers}
          </Link>
        </div>
      </section>
    </>
  );
}
