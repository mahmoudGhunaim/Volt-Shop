"use client";

import { Toaster } from "sonner";
import type { Locale } from "@/types/product";

export function Toasts({ locale }: { locale: Locale }) {
  return (
    <Toaster
      position="bottom-center"
      dir={locale === "ar" ? "rtl" : "ltr"}
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-fg shadow-[0_16px_48px_-16px_rgb(0_0_0/0.5)] sm:w-[22rem]",
          title: "font-medium",
          description: "text-muted text-xs",
          icon: "text-lime [[data-theme=light]_&]:text-violet-text",
          actionButton:
            "ms-auto shrink-0 rounded-full bg-lime px-3 py-1.5 text-xs font-semibold text-on-lime transition-transform active:scale-95",
        },
      }}
    />
  );
}
