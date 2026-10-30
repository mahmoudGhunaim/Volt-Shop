"use client";

import { Plus } from "lucide-react";
import { Accordion } from "radix-ui";
import type { Faq as FaqItem } from "@/data/content";
import { useI18n } from "@/i18n/provider";

export function Faq({ items }: { items: FaqItem[] }) {
  const { t, l } = useI18n();
  return (
    <section aria-labelledby="faq-title" className="container-volt py-14 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <h2 id="faq-title" className="text-h2">
          {t.info.questions}
        </h2>
        <Accordion.Root type="single" collapsible className="border-t border-border">
          {items.map((item, i) => (
            <Accordion.Item key={i} value={`q${i}`} className="border-b border-border">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-start text-lg font-medium transition-colors hover:text-violet-text">
                  {l(item.q)}
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border transition-[transform,background-color,border-color] duration-300 ease-expo group-data-[state=open]:rotate-45 group-data-[state=open]:border-fg group-data-[state=open]:bg-fg group-data-[state=open]:text-bg">
                    <Plus className="size-4" aria-hidden />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="max-w-[62ch] pb-6 text-muted">{l(item.a)}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
