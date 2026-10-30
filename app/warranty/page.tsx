import type { Metadata } from "next";
import { CheckLists } from "@/components/info/check-list";
import { Faq } from "@/components/info/faq";
import { HelpCta, HelpNav, InfoHero, Steps } from "@/components/info/info-blocks";
import { warranty } from "@/data/content";
import { localized } from "@/i18n";
import { getDictionary } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Warranty",
  description: "Every VOLT product is covered for two years against defects. See what's covered and how to make a claim.",
  alternates: { canonical: "/warranty" },
};

export default async function WarrantyPage() {
  const { t, locale } = await getDictionary();
  return (
    <>
      <InfoHero
        nav={<HelpNav t={t} current="warranty" />}
        title={localized(warranty.title, locale)}
        lede={localized(warranty.lede, locale)}
        visual={
          <p
            aria-hidden
            className="font-wide text-[clamp(7rem,22vw,15rem)] font-extrabold leading-[0.8] tracking-[-0.05em] text-transparent [-webkit-text-stroke:2px_var(--fg)] lg:text-end"
            dir="ltr"
          >
            2yr
          </p>
        }
      />
      <CheckLists
        locale={locale}
        yes={{ title: t.info.covered, items: warranty.covered }}
        no={{ title: t.info.notCovered, items: warranty.notCovered }}
      />
      <Steps steps={warranty.steps} locale={locale} title={t.info.claim} />
      <Faq items={warranty.faq} />
      <HelpCta t={t} />
    </>
  );
}
