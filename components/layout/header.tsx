"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";
import { useHydrated } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";
import { siteConfig } from "@/config/site";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const categoryLinks = ["audio", "wear", "carry", "desk", "kicks"] as const;

// Loaded on first tap: keeps Radix Dialog out of the initial bundle.
const MobileMenu = dynamic(() => import("./mobile-menu").then((m) => m.MobileMenu), { ssr: false });

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuUsed, setMenuUsed] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const pulse = useCart((s) => s.addPulse);
  const wishCount = useWishlist((s) => s.slugs.length);
  const setCartOpen = useUI((s) => s.setCartOpen);

  const isActive = (href: string) => (href === "/shop" ? pathname === "/shop" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-(--z-header) h-(--header-h) transition-[background-color,border-color,backdrop-filter] duration-300 ease-expo",
        scrolled
          ? "border-b border-border/70 bg-bg/72 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-volt flex h-full items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="-ms-2 lg:hidden"
          aria-label={t.nav.menu}
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuUsed(true);
            setMenuOpen(true);
          }}
        >
          <Menu />
        </Button>

        <Link href="/" className="me-auto rounded-md text-lg lg:me-10" aria-label={`${siteConfig.name}, ${t.nav.home}`}>
          <Logo />
        </Link>

        <nav aria-label={t.nav.primary} className="me-auto hidden lg:block">
          <ul className="flex items-center gap-1 text-sm">
            <li>
              <NavLink href="/shop" active={isActive("/shop")}>
                {t.nav.shop}
              </NavLink>
            </li>
            {categoryLinks.map((c) => (
              <li key={c}>
                <NavLink href={`/shop?category=${c}`}>{t.nav[c]}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
            <Link href="/shop?focus=search" aria-label={t.nav.search}>
              <Search />
            </Link>
          </Button>

          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="hidden h-11 rounded-full px-3 text-sm font-medium transition-[background-color,transform] duration-200 hover:bg-surface-2 active:scale-95 sm:block"
            aria-label={t.locale.label}
            lang={locale === "en" ? "ar" : "en"}
          >
            {t.locale.toggle}
          </button>

          <ThemeToggle />

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/wishlist" aria-label={`${t.nav.wishlist} (${hydrated ? wishCount : 0})`}>
              <Heart />
              {hydrated && wishCount > 0 && <Badge value={wishCount} tone="violet" />}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative -me-2"
            aria-label={`${t.nav.cart} (${hydrated ? count : 0})`}
            onClick={() => setCartOpen(true)}
          >
            <motion.span
              key={pulse}
              initial={pulse ? { rotate: -14, scale: 0.85 } : false}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="inline-flex"
            >
              <ShoppingBag />
            </motion.span>
            {hydrated && count > 0 && <Badge value={count} pulseKey={pulse} />}
          </Button>
        </div>
      </div>

      {menuUsed && <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />}
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative rounded-full px-3.5 py-2 text-muted transition-colors duration-200 hover:text-fg",
        active && "text-fg",
      )}
    >
      {children}
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-lime"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
    </Link>
  );
}

function Badge({ value, tone = "lime", pulseKey }: { value: number; tone?: "lime" | "violet"; pulseKey?: number }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={pulseKey ?? value}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{ type: "spring", stiffness: 600, damping: 22 }}
        aria-hidden
        className={cn(
          "tabular absolute end-1 top-1 grid h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full px-1 text-[0.6875rem] font-bold leading-none",
          tone === "lime" ? "bg-lime text-on-lime" : "bg-violet text-white",
        )}
      >
        {value > 99 ? "99+" : value}
      </motion.span>
    </AnimatePresence>
  );
}
