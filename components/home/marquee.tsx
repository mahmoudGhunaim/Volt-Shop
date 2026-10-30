"use client";

import { LogoMark } from "@/components/layout/logo";
import { useI18n } from "@/i18n/provider";

/** Brand values band. Two copies of the list loop seamlessly; pauses on hover, static with reduced motion. */
export function Marquee() {
  const { t } = useI18n();
  const items = t.home.marquee;

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="px-6 font-wide text-xl font-extrabold tracking-[-0.02em] whitespace-nowrap sm:px-10 sm:text-3xl">
            {item}
          </span>
          <LogoMark className="h-5 w-auto text-lime sm:h-6 [[data-theme=light]_&]:text-violet" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={t.nav.benefits} className="group overflow-hidden border-y border-border bg-surface/50 py-5 sm:py-7">
      {/* Track is always LTR so the loop math holds in Arabic too. */}
      <div dir="ltr" className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
