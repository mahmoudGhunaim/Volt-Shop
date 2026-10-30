import type { Locale, Localized } from "@/types/product";
import { ar } from "./ar";
import { en, type Dictionary } from "./en";

export type { Dictionary };

export const locales: Locale[] = ["en", "ar"];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "volt-locale";

export const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ar";
}

export function dirFor(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Replaces {placeholders} in a dictionary string. */
export function format(template: string, values: Record<string, string | number> = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

export function localized(value: Localized, locale: Locale) {
  return value[locale] || value.en;
}
