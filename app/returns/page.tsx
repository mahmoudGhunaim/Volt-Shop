import type { Metadata } from "next";
import { CheckLists } from "@/components/info/check-list";
import { Faq } from "@/components/info/faq";
import { HelpCta, HelpNav, InfoHero, Steps } from "@/components/info/info-blocks";
import { returns } from "@/data/content";
import { localized } from "@/i18n";
import { getDictionary } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Returns",
  description: "Free 30-day returns at VOLT. Start a return from your order email and get refunded within five business days.",
  alternates: { canonical: "/returns" },
};

export default async function ReturnsPage() {
  const { t, locale } = await getDictionary();
  return (
    <>
      <InfoHero
        nav={<HelpNav t={t} current="returns" />}
        title={localized(returns.title, locale)}
        lede={localized(returns.lede, locale)}
        visual={
          <p
            aria-hidden
            className="font-wide text-[clamp(7rem,22vw,15rem)] font-extrabold leading-[0.8] tracking-[-0.05em] text-transparent [-webkit-text-stroke:2px_var(--fg)] lg:text-end"
            dir="ltr"
          >
            30d
          </p>
        }
      />
      <Steps steps={returns.steps} locale={locale} title={t.info.howItWorks} />
      <CheckLists
        locale={locale}
        yes={{ title: t.info.accepted, items: returns.accepted }}
        no={{ title: t.info.excluded, items: returns.excluded }}
      />
      <Faq items={returns.faq} />
      <HelpCta t={t} />
    </>
  );
}
