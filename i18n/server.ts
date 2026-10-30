import "server-only";
import { cookies } from "next/headers";
import type { Locale } from "@/types/product";
import { defaultLocale, dictionaries, isLocale, LOCALE_COOKIE } from "./index";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
