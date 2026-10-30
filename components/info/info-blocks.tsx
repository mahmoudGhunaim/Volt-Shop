import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClasses } from "@/components/ui/button";
import type { Step } from "@/data/content";
import { localized, type Dictionary } from "@/i18n";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/product";

/** Title + lede over a soft mesh, with an optional visual on the end side. */
export function InfoHero({
  title,
  lede,
  visual,
  nav,
}: {
  title: string;
  lede: string;
  visual?: ReactNode;
  nav?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="mesh-soft absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]"
      />
      <div className="container-volt pb-14 pt-10 sm:pb-20 sm:pt-14">
        {nav}
        <div className={cn("grid items-end gap-10", visual && "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]")}>
          <div>
            <h1 className="max-w-[14ch] text-display">{title}</h1>
            <p className="mt-6 max-w-[52ch] text-lg text-muted sm:text-xl">{lede}</p>
          </div>
          {visual}
        </div>
      </div>
    </section>
  );
}

const helpLinks = [
  { href: "/shipping", key: "shipping" },
  { href: "/returns", key: "returns" },
  { href: "/warranty", key: "warranty" },
  { href: "/contact", key: "contact" },
] as const;

/** Pill nav shared by the four help pages. */
export function HelpNav({ t, current }: { t: Dictionary; current: (typeof helpLinks)[number]["key"] }) {
  return (
    <nav aria-label={t.footer.help} className="no-scrollbar -mx-(--gutter) mb-10 overflow-x-auto px-(--gutter)">
      <ul className="flex gap-2">
        {helpLinks.map((l) => {
          const active = l.key === current;
          return (
            <li key={l.key}>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 items-center whitespace-nowrap rounded-full border px-5 text-sm font-medium transition-[border-color,background-color,color] duration-200",
                  active ? "border-fg bg-fg text-bg" : "border-border hover:border-fg/40",
                )}
              >
                {t.footer[l.key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** A real ordered sequence, so the numbers carry meaning. */
export function Steps({ steps, locale, title }: { steps: Step[]; locale: Locale; title: string }) {
  return (
    <section aria-labelledby="steps-title" className="container-volt py-14 sm:py-20">
      <h2 id="steps-title" className="text-h2">
        {title}
      </h2>
      <ol
        className={cn(
          "mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2",
          steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        )}
      >
        {steps.map((s, i) => (
          <li key={i} className="relative">
            <div className="flex items-center gap-4">
              <span className="tabular grid size-11 shrink-0 place-items-center rounded-full bg-fg font-wide text-base font-extrabold text-bg">
                {i + 1}
              </span>
              {i < steps.length - 1 && <span aria-hidden className="hidden h-px flex-1 bg-border lg:block" />}
            </div>
            <h3 className="mt-5 text-h3">{localized(s.title, locale)}</h3>
            <p className="mt-2 max-w-[32ch] text-muted">{localized(s.body, locale)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function HelpCta({ t }: { t: Dictionary }) {
  return (
    <section className="container-volt py-8">
      <div className="plate flex flex-col items-start justify-between gap-6 rounded-xl p-8 text-white sm:flex-row sm:items-center sm:p-10">
        <div>
          <h2 className="text-h2 text-white">{t.info.stillStuck}</h2>
          <p className="mt-2 text-white/70">{t.info.stillStuckBody}</p>
        </div>
        <Link href="/contact" className={buttonClasses({ size: "lg" })}>
          {t.info.contactUs}
          <ArrowUpRight className="flip-rtl" />
        </Link>
      </div>
    </section>
  );
}
