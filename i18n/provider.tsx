"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Locale, Localized } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { dictionaries, dirFor, format, localized, LOCALE_COOKIE, type Dictionary } from "./index";

interface I18nContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  f: typeof format;
  l: (value: Localized) => string;
  price: (value: number, cents?: boolean) => string;
  setLocale: (next: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const router = useRouter();

  const setLocale = useCallback(
    (next: Locale) => {
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      // Flip direction immediately so the switch feels instant, then re-render server content.
      document.documentElement.lang = next;
      document.documentElement.dir = dirFor(next);
      router.refresh();
    },
    [router],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir: dirFor(locale),
      t: dictionaries[locale],
      f: format,
      l: (v) => localized(v, locale),
      price: (v, cents) => formatPrice(v, locale, cents),
      setLocale,
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
