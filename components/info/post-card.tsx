import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/data/content";
import { format, localized, type Dictionary } from "@/i18n";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/product";

export function formatPostDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-US", { dateStyle: "long" }).format(new Date(date));
}

export function PostCard({
  post,
  cover,
  locale,
  t,
  featured,
}: {
  post: Post;
  cover?: string;
  locale: Locale;
  t: Dictionary;
  featured?: boolean;
}) {
  return (
    <article className={cn("group relative flex flex-col gap-5", featured && "lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-12")}>
      <div className={cn("plate relative overflow-hidden rounded-xl", featured ? "aspect-[16/10]" : "aspect-[4/3]")}>
        {cover && (
          <Image
            src={cover}
            alt=""
            fill
            sizes={featured ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 768px) 45vw, 100vw"}
            priority={featured}
            className="object-contain p-[12%] transition-transform duration-700 ease-expo group-hover:scale-105 group-hover:-rotate-2"
          />
        )}
        <div aria-hidden className="absolute -bottom-1/3 start-1/4 size-2/3 rounded-full bg-violet/0 blur-3xl transition-colors duration-700 group-hover:bg-violet/30" />
      </div>
      <div>
        <p className="text-sm text-muted">
          <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time> · {format(t.info.minRead, { minutes: post.readMinutes })}
        </p>
        <h2 className={cn("mt-3", featured ? "text-h1" : "text-h3")}>
          <Link href={`/journal/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {localized(post.title, locale)}
          </Link>
        </h2>
        <p className={cn("mt-3 max-w-[52ch] text-muted", featured && "text-lg")}>{localized(post.excerpt, locale)}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-text">
          {t.info.readMore}
          <ArrowUpRight className="flip-rtl size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
