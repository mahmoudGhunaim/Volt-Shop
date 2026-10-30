"use client";

import { Check, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const DEADLINE_KEY = "volt-promo-deadline";

/** Deadline is set on first visit and stored, so the demo always shows a live countdown. */
function getDeadline() {
  const hours = siteConfig.promoDurationHours;
  try {
    const saved = Number(localStorage.getItem(DEADLINE_KEY));
    if (saved && saved > Date.now()) return saved;
    const next = Date.now() + hours * 3_600_000;
    localStorage.setItem(DEADLINE_KEY, String(next));
    return next;
  } catch {
    return Date.now() + hours * 3_600_000;
  }
}

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

export function PromoCountdown({ products }: { products: Product[] }) {
  const { t } = useI18n();
  const code = siteConfig.promoCodes[0]?.code ?? "";
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => setRemaining(deadline - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const parts = split(remaining ?? siteConfig.promoDurationHours * 3_600_000);
  const units = [
    { label: t.home.days, value: parts.days },
    { label: t.home.hours, value: parts.hours },
    { label: t.home.minutes, value: parts.minutes },
    { label: t.home.seconds, value: parts.seconds },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard blocked: the code is still visible on screen */
    }
    setCopied(true);
    toast.success(t.home.codeCopied, { description: code });
    setTimeout(() => setCopied(false), 2000);
  }

  const [promoBody0, promoBody1] = t.home.promoBody.split("{code}");
  // Stepped plinths: three products at different heights, tallest in the middle.
  const plinths = [
    { h: "h-[34%]", w: "w-[30%]", img: "bottom-[30%]" },
    { h: "h-[52%]", w: "w-[34%]", img: "bottom-[48%]" },
    { h: "h-[22%]", w: "w-[30%]", img: "bottom-[18%]" },
  ];

  return (
    <section aria-labelledby="promo-title" className="container-volt py-8 sm:py-12">
      <div className="plate grain relative isolate grid overflow-hidden rounded-xl text-white lg:grid-cols-[1.1fr_1fr]">
        <div aria-hidden className="absolute -end-1/4 -top-1/3 -z-10 size-[80%] rounded-full bg-violet/40 blur-[120px]" />
        <div aria-hidden className="absolute -bottom-1/3 -start-[10%] -z-10 size-[50%] rounded-full bg-lime/15 blur-[100px]" />

        <div className="flex flex-col gap-8 p-6 sm:p-10 lg:p-14">
          <h2 id="promo-title" className="text-h1 text-white">
            {t.home.promoTitle}
          </h2>
          <p className="max-w-md text-white/70">
            {promoBody0}
            <strong className="font-semibold text-white">{code}</strong>
            {promoBody1}
          </p>

          <div role="timer" aria-live="off" aria-label={units.map((u) => `${u.value} ${u.label}`).join(", ")} className="flex gap-2 sm:gap-3" dir="ltr">
            {units.map((u, i) => (
              <div key={u.label} className="flex items-start gap-2 sm:gap-3">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      "tabular grid h-[4.25rem] min-w-[4.25rem] place-items-center rounded-lg border border-white/10 bg-black/30 px-2 font-dot text-[2.75rem] font-bold leading-none sm:h-24 sm:min-w-24 sm:text-6xl",
                      i === 3 ? "text-lime" : "text-white",
                    )}
                    suppressHydrationWarning
                  >
                    {String(u.value).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-white/60">{u.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/shop">{t.home.promoCta}</Link>
            </Button>
            <button
              type="button"
              onClick={copy}
              className="group inline-flex h-14 items-center gap-3 rounded-full border border-dashed border-white/30 px-5 text-sm transition-[border-color,background-color,transform] duration-200 hover:border-lime hover:bg-white/5 active:scale-95"
              aria-label={`${t.home.copyCode}: ${code}`}
            >
              <span className="font-dot text-xl font-bold tracking-wider">{code}</span>
              {copied ? <Check className="size-4 text-lime" /> : <Copy className="size-4 text-white/60 group-hover:text-white" />}
            </button>
          </div>
        </div>

        <div className="relative min-h-[18rem] sm:min-h-[22rem]" aria-hidden>
          <div className="absolute inset-x-[6%] bottom-0 flex h-full items-end justify-center gap-[3%]">
            {products.slice(0, 3).map((p, i) => {
              const s = plinths[i]!;
              return (
                <div key={p.id} className={cn("relative flex h-full flex-col justify-end", s.w)}>
                  <div className={cn("absolute inset-x-[-6%] aspect-square", s.img)}>
                    {p.images[0] && (
                      <Image
                        src={p.images[0].src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 14vw, 30vw"
                        className="object-contain drop-shadow-[0_20px_24px_rgb(0_0_0/0.55)]"
                      />
                    )}
                  </div>
                  <div
                    className={cn(
                      "w-full rounded-t-lg border border-b-0 border-white/10 bg-gradient-to-b from-white/12 to-white/[0.02]",
                      s.h,
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
