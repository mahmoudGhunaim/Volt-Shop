"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lottie, type LottieName } from "@/components/ui/lottie";
import { useI18n } from "@/i18n/provider";

export function EmptyState({
  animation,
  title,
  body,
  cta,
  href = "/shop",
  onNavigate,
}: {
  animation: LottieName;
  title: string;
  body: string;
  cta: string;
  href?: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      <Lottie name={animation} className="w-40" />
      <h2 className="mt-8 text-h3">{title}</h2>
      <p className="mt-2 max-w-xs text-muted">{body}</p>
      <Button asChild className="mt-6">
        <Link href={href} onClick={onNavigate}>
          {cta}
        </Link>
      </Button>
    </div>
  );
}

export function CartEmpty({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  return (
    <EmptyState
      animation="empty-cart"
      title={t.cart.empty}
      body={t.cart.emptyBody}
      cta={t.cart.startShopping}
      onNavigate={onNavigate}
    />
  );
}
