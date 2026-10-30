import { Check, X } from "lucide-react";
import { localized } from "@/i18n";
import { cn } from "@/lib/utils";
import type { Locale, Localized } from "@/types/product";

/** Two side-by-side lists: what's in, what's out. */
export function CheckLists({
  locale,
  yes,
  no,
}: {
  locale: Locale;
  yes: { title: string; items: Localized[] };
  no: { title: string; items: Localized[] };
}) {
  return (
    <section className="container-volt py-14 sm:py-20">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { ...yes, positive: true },
          { ...no, positive: false },
        ].map((list) => (
          <div
            key={list.title}
            className={cn(
              "rounded-xl p-7 sm:p-9",
              list.positive ? "plate text-white" : "border border-border",
            )}
          >
            <h2 className={cn("text-h3", list.positive && "text-white")}>{list.title}</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {list.items.map((item) => (
                <li key={item.en} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full",
                      list.positive ? "bg-lime text-on-lime" : "bg-surface-2 text-muted",
                    )}
                    aria-hidden
                  >
                    {list.positive ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  </span>
                  <span className={list.positive ? "text-white/85" : "text-muted"}>{localized(item, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
