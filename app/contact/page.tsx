import { Mail, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/info/contact-form";
import { HelpNav, InfoHero } from "@/components/info/info-blocks";
import { contact } from "@/data/content";
import { localized } from "@/i18n";
import { getDictionary } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the VOLT team. Most messages get a reply within four hours on business days.",
  alternates: { canonical: "/contact" },
};

const icons = [Mail, MessageCircle, MapPin];

export default async function ContactPage() {
  const { t, locale } = await getDictionary();
  return (
    <>
      <InfoHero
        nav={<HelpNav t={t} current="contact" />}
        title={localized(contact.title, locale)}
        lede={localized(contact.lede, locale)}
      />
      <section className="container-volt grid gap-10 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div>
          <h2 className="text-h3">{t.info.channels}</h2>
          <ul className="mt-6 flex flex-col divide-y divide-border border-y border-border">
            {contact.channels.map((c, i) => {
              const Icon = icons[i] ?? Mail;
              const value = typeof c.value === "string" ? c.value : localized(c.value, locale);
              return (
                <li key={c.label.en} className="flex items-start gap-4 py-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-violet-text">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-muted">{localized(c.label, locale)}</p>
                    {c.href ? (
                      <a href={c.href} className="font-medium underline-offset-4 hover:text-violet-text hover:underline" dir="ltr">
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium">{value}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
