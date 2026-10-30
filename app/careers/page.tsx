import { ArrowUpRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { InfoHero } from "@/components/info/info-blocks";
import { careers, contact } from "@/data/content";
import { localized } from "@/i18n";
import { getDictionary } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the VOLT team in Berlin, Dubai or remote. Small team, real ownership.",
  alternates: { canonical: "/careers" },
};

export default async function CareersPage() {
  const { t, locale } = await getDictionary();
  const email = contact.channels[0]?.value as string;

  return (
    <>
      <InfoHero title={localized(careers.title, locale)} lede={localized(careers.lede, locale)} />

      <section aria-labelledby="roles-title" className="container-volt">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="roles-title" className="text-h2">
            {t.info.openRoles}
          </h2>
          <p className="text-sm text-muted">{localized(careers.note, locale)}</p>
        </div>
        <ul className="mt-8 border-t border-border">
          {careers.roles.map((r) => {
            const title = localized(r.title, locale);
            return (
              <li key={r.title.en} className="border-b border-border">
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent(`Application: ${r.title.en}`)}`}
                  className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-6 transition-colors sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:py-8"
                >
                  <span className="font-wide text-xl font-extrabold tracking-[-0.02em] transition-colors group-hover:text-violet-text sm:text-2xl">
                    {title}
                  </span>
                  <span className="col-start-1 row-start-2 text-sm text-muted sm:col-start-auto sm:row-start-auto sm:text-base">
                    {localized(r.team, locale)}
                  </span>
                  <span className="col-start-1 row-start-3 text-sm text-muted sm:col-start-auto sm:row-start-auto sm:text-base">
                    {localized(r.location, locale)}
                  </span>
                  <span className="col-start-2 row-span-3 row-start-1 inline-flex items-center gap-2 text-sm font-medium sm:col-start-auto sm:row-span-1 sm:row-start-auto">
                    <span className="max-sm:sr-only">{t.info.apply}</span>
                    <span className="grid size-10 place-items-center rounded-full border border-border transition-[background-color,border-color,color,transform] duration-300 group-hover:rotate-45 group-hover:border-lime group-hover:bg-lime group-hover:text-on-lime">
                      <ArrowUpRight className="size-4" aria-hidden />
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="perks-title" className="container-volt py-20 sm:py-28">
        <div className="plate grid gap-8 rounded-xl p-8 text-white sm:p-12 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
          <h2 id="perks-title" className="text-h2 text-white">
            {t.info.perks}
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2">
            {careers.perks.map((p) => (
              <li key={p.en} className="flex items-start gap-3">
                <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-lime text-on-lime">
                  <Check className="size-3.5" />
                </span>
                <span className="text-lg text-white/85">{localized(p, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
