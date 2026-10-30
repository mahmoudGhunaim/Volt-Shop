"use client";

import { motion } from "framer-motion";
import { LogoMark } from "@/components/layout/logo";
import { cardBrand } from "@/lib/checkout";
import { cn } from "@/lib/utils";

/** Live card mock: mirrors what's typed and flips to the back while the CVC field has focus. */
export function CardPreview({
  number,
  name,
  expiry,
  cvc,
  flipped,
}: {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  flipped: boolean;
}) {
  const digits = number.replace(/\D/g, "");
  const groups = Array.from({ length: 4 }, (_, i) => digits.slice(i * 4, i * 4 + 4).padEnd(4, "•"));
  const brand = cardBrand(number);

  return (
    <div className="mx-auto w-full max-w-[22rem] [perspective:1400px]" aria-hidden dir="ltr">
      <motion.div
        className="relative aspect-[1.586] w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Front */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-plate p-5 text-white shadow-[0_30px_60px_-24px_rgb(0_0_0/0.7)] [backface-visibility:hidden] sm:p-6">
          <div className="absolute -end-16 -top-20 size-56 rounded-full bg-violet/60 blur-3xl" />
          <div className="absolute -bottom-24 -start-10 size-48 rounded-full bg-lime/25 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="h-8 w-11 rounded-md bg-gradient-to-br from-lime to-lime/60 shadow-inner" />
              <span className="flex items-center gap-2">
                <LogoMark className="h-4 w-auto text-lime" />
                <span className="font-wide text-sm font-extrabold">VOLT</span>
              </span>
            </div>
            <p className="tabular font-dot text-[1.35rem] font-bold tracking-[0.12em] sm:text-2xl">
              {groups.join(" ")}
            </p>
            <div className="flex items-end justify-between gap-4 text-xs">
              <div className="min-w-0">
                <p className="text-white/50">Card holder</p>
                <p className="mt-0.5 truncate text-sm font-medium uppercase tracking-wide">{name || "Your name"}</p>
              </div>
              <div className="shrink-0 text-end">
                <p className="text-white/50">Expires</p>
                <p className="tabular mt-0.5 text-sm font-medium">{expiry || "MM/YY"}</p>
              </div>
              <span className={cn("shrink-0 font-wide text-base font-extrabold italic", brand === "card" && "opacity-40")}>
                {brand === "visa" ? "VISA" : brand === "mastercard" ? (
                  <span className="flex">
                    <span className="size-6 rounded-full bg-[#EB001B]" />
                    <span className="-ms-2.5 size-6 rounded-full bg-[#F79E1B]/90" />
                  </span>
                ) : brand === "amex" ? "AMEX" : "CARD"}
              </span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-plate text-white shadow-[0_30px_60px_-24px_rgb(0_0_0/0.7)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="mt-6 h-11 bg-black/70" />
          <div className="mx-5 mt-5 flex items-center gap-3">
            <div className="h-9 flex-1 rounded bg-white/85" />
            <span className="tabular grid h-9 w-14 place-items-center rounded bg-white font-dot text-lg font-bold text-plate">
              {cvc || "•••"}
            </span>
          </div>
          <p className="mx-5 mt-4 text-[0.625rem] leading-snug text-white/45">
            Demo card. Nothing is charged and no data leaves your browser.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
