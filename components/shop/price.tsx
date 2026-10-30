"use client";

import { useI18n } from "@/i18n/provider";
import { cn, discountPercent } from "@/lib/utils";

export function Price({
  price,
  compareAt,
  className,
  size = "md",
}: {
  price: number;
  compareAt?: number;
  className?: string;
  size?: "md" | "lg";
}) {
  const { price: fmt } = useI18n();
  const off = discountPercent(price, compareAt);
  return (
    <span className={cn("tabular inline-flex flex-wrap items-baseline gap-x-2", className)}>
      <span className={cn("font-semibold", size === "lg" && "font-wide text-3xl font-extrabold tracking-[-0.02em]")}>
        {fmt(price)}
      </span>
      {off > 0 && compareAt && (
        <s className={cn("text-muted", size === "lg" ? "text-lg" : "text-sm")}>
          <span className="sr-only">Was </span>
          {fmt(compareAt)}
        </s>
      )}
    </span>
  );
}
