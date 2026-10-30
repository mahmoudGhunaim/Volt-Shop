"use client";

import { Star } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

/** Five stars with fractional fill. Lime on dark, ink on light for contrast. */
export function Stars({ rating, className, size = 14 }: { rating: number; className?: string; size?: number }) {
  const { t, f } = useI18n();
  return (
    <span
      role="img"
      aria-label={f(t.product.ratingLabel, { rating: rating.toFixed(1) })}
      className={cn("relative inline-flex", className)}
    >
      <span className="flex text-border" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} width={size} height={size} className="fill-current stroke-none" />
        ))}
      </span>
      <span
        className="absolute inset-y-0 start-0 flex overflow-hidden text-lime [[data-theme=light]_&]:text-fg"
        style={{ width: `${(rating / 5) * 100}%` }}
        aria-hidden
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} width={size} height={size} className="shrink-0 fill-current stroke-none" />
        ))}
      </span>
    </span>
  );
}
