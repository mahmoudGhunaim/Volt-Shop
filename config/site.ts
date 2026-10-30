/**
 * Brand + store settings. Rename the shop by editing this file only:
 * the name, logo mark, tagline, URLs, currency and promo codes all flow from here.
 */
export const siteConfig = {
  name: "VOLT",
  tagline: {
    en: "Charged objects for everyday carry.",
    ar: "أدوات مشحونة لحياتك اليومية.",
  },
  description:
    "VOLT is a demo store for premium tech and lifestyle accessories: headphones, watches, bags, desk setup and sneakers.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://volt-shop.vercel.app",
  portfolioUrl: "https://mahmoud-ghunaim.pages.dev",
  author: "Mahmoud Ghunaim",
  logo: {
    icon: "/brand/volt-icon.png",
    wordmark: "/brand/volt-wordmark.png",
  },
  currency: "USD",
  freeShippingThreshold: 150,
  shippingFlatRate: 12,
  promoCodes: [{ code: "VOLT20", percentOff: 0.2 }],
  /** End of the promo countdown, relative to first visit so the demo never shows an expired timer. */
  promoDurationHours: 52,
  social: {
    instagram: "https://instagram.com",
    x: "https://x.com",
    github: "https://github.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
