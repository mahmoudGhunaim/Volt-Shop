"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { I18nProvider } from "@/i18n/provider";
import type { Locale } from "@/types/product";
import { DeferredUI } from "./deferred-ui";

export function Providers({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <I18nProvider locale={locale}>
      {/* "user" swaps transform animations for instant changes when reduced motion is on. */}
      <MotionConfig reducedMotion="user">
        {children}
        <DeferredUI locale={locale} />
      </MotionConfig>
    </I18nProvider>
  );
}
