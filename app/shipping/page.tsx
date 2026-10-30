import type { Metadata } from "next";
import { Faq } from "@/components/info/faq";
import { HelpCta, HelpNav, InfoHero, Steps } from "@/components/info/info-blocks";
import { shipping } from "@/data/content";
import { format, localized } from "@/i18n";
import { getDictionary } from "@/i18n/server";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shipping",
  description: "VOLT shipping rates, delivery times and customs. Free standard shipping over $150, duties included.",
  alternates: { canonical: "/shipping" },
};

export default async function ShippingPage() {
  const { t, locale } = await getDictionary();
  const price = (v: number) => formatPrice(v, locale, true);

  return (
    <>
      <InfoHero
        nav={<HelpNav t={t} current="shipping" />}
        title={localized(shipping.title, locale)}
        lede={localized(shipping.lede, locale)}
      />

      <section aria-label={t.info.method} className="container-volt">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-start">
            <thead className="bg-surface text-sm text-muted">
              <tr>
                <th scope="col" className="px-5 py-4 text-start font-medium sm:px-8">{t.info.method}</th>
                <th scope="col" className="px-5 py-4 text-start font-medium max-sm:hidden sm:px-8">{t.info.delivery}</th>
                <th scope="col" className="px-5 py-4 text-end font-medium sm:px-8">{t.info.cost}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shipping.rates.map((r) => (
                <tr key={r.method.en}>
                  <th scope="row" className="px-5 py-6 text-start align-top sm:px-8">
                    <span className="block font-wide text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">
                      {localized(r.method, locale)}
                    </span>
                    <span className="mt-1 block text-sm font-normal text-muted sm:hidden">{localized(r.eta, locale)}</span>
                  </th>
                  <td className="px-5 py-6 align-top text-muted max-sm:hidden sm:px-8">{localized(r.eta, locale)}</td>
                  <td className="tabular px-5 py-6 text-end align-top sm:px-8">
                    <span className="block font-semibold">{price(r.price)}</span>
                    {r.freeOver && (
                      <span className="mt-1.5 inline-block rounded-full bg-lime px-2.5 py-0.5 text-xs font-bold text-on-lime">
                        {format(t.info.freeOver, { amount: formatPrice(r.freeOver, locale) })}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Steps steps={shipping.steps} locale={locale} title={t.info.howItWorks} />
      <Faq items={shipping.faq} />
      <HelpCta t={t} />
    </>
  );
}
