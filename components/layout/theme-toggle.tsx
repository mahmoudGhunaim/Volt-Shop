"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/provider";
import { Button } from "@/components/ui/button";
import { THEME_KEY } from "@/lib/theme";

function subscribe(cb: () => void) {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function ThemeToggle() {
  const { t } = useI18n();
  const theme = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme ?? "dark",
    () => "dark",
  );
  const next = theme === "dark" ? "light" : "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`${t.theme.toggle}: ${next === "light" ? t.theme.light : t.theme.dark}`}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {
          /* storage blocked: theme still applies for this visit */
        }
      }}
    >
      <Sun className="hidden [[data-theme=dark]_&]:block" />
      <Moon className="hidden [[data-theme=light]_&]:block" />
    </Button>
  );
}
