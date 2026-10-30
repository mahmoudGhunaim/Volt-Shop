"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { useI18n } from "@/i18n/provider";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const categoryLinks = ["audio", "wear", "carry", "desk", "kicks"] as const;

export function MobileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t, locale, setLocale } = useI18n();
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={<Logo />} side="start">
      <nav aria-label={t.nav.mobile}>
        <ul className="flex flex-col">
          <li>
            <MobileLink href="/shop" onNavigate={() => onOpenChange(false)}>
              {t.nav.shop}
            </MobileLink>
          </li>
          {categoryLinks.map((c) => (
            <li key={c}>
              <MobileLink href={`/shop?category=${c}`} onNavigate={() => onOpenChange(false)}>
                {t.nav[c]}
              </MobileLink>
            </li>
          ))}
          <li>
            <MobileLink href="/wishlist" onNavigate={() => onOpenChange(false)}>
              {t.nav.wishlist}
            </MobileLink>
          </li>
        </ul>
      </nav>
      <div className="mt-8 flex items-center gap-2 pb-8">
        <Button
          variant="outline"
          onClick={() => {
            setLocale(locale === "en" ? "ar" : "en");
            onOpenChange(false);
          }}
          lang={locale === "en" ? "ar" : "en"}
        >
          {t.locale.toggle}
        </Button>
        <ThemeToggle />
      </div>
    </Sheet>
  );
}

function MobileLink({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block border-b border-border py-4 font-wide text-3xl font-extrabold tracking-[-0.03em] transition-colors hover:text-violet-text"
    >
      {children}
    </Link>
  );
}
