import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Archivo, Doto, Geist, IBM_Plex_Sans_Arabic } from "next/font/google";
import type { ReactNode } from "react";
import { BuiltByBar } from "@/components/layout/built-by-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/layout/providers";
import { siteConfig } from "@/config/site";
import { dictionaries, dirFor } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});
const doto = Doto({ subsets: ["latin"], variable: "--font-doto", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} | Charged objects for everyday carry`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Charged objects for everyday carry`,
    description: siteConfig.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0B12" },
    { media: "(prefers-color-scheme: light)", color: "#F5F4F0" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const t = dictionaries[locale];

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      data-theme="dark"
      suppressHydrationWarning
      className={`${archivo.variable} ${geist.variable} ${plexArabic.variable} ${doto.variable}`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body>
        <a
          href="#main"
          className="fixed start-4 top-3 z-(--z-tooltip) -translate-y-20 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-on-lime transition-transform focus:translate-y-0"
        >
          {t.nav.skipToContent}
        </a>
        <BuiltByBar t={t} />
        <Providers locale={locale}>
          <Header />
          <main id="main" className="min-h-[70dvh]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
