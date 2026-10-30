"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { LogoMark } from "@/components/layout/logo";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setError(t.home.emailInvalid);
      return;
    }
    setError(null);
    setState("sending");
    await new Promise((r) => setTimeout(r, 900)); // pretend network
    setState("done");
    toast.success(t.home.subscribed, { description: email.trim() });
  }

  return (
    <section aria-labelledby="newsletter-title" className="container-volt py-16 sm:py-24">
      <div className="relative grid grid-cols-1 items-end gap-10 border-t border-border pt-12 lg:grid-cols-2">
        <LogoMark
          className="pointer-events-none absolute -top-px end-0 h-24 w-auto -translate-y-full text-violet/20 sm:h-32"
        />
        <div>
          <h2 id="newsletter-title" className="max-w-[16ch] text-h1">
            {t.home.newsletterTitle}
          </h2>
          <p className="mt-5 max-w-md text-muted">{t.home.newsletterBody}</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="w-full">
          <label htmlFor="newsletter-email" className="text-sm font-medium">
            {t.home.emailLabel}
          </label>
          <div
            className={cn(
              "mt-2 flex items-center gap-2 rounded-full border bg-surface p-1.5 ps-5 transition-[border-color,box-shadow] duration-200 focus-within:border-fg/40 focus-within:shadow-[0_0_0_4px_var(--glow-violet)]",
              error ? "border-danger" : "border-border",
            )}
          >
            <input
              id="newsletter-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t.home.emailPlaceholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
                if (state === "done") setState("idle");
              }}
              aria-invalid={!!error}
              aria-describedby={error ? "newsletter-error" : undefined}
              disabled={state === "sending"}
              className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted focus-visible:outline-none"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="relative inline-flex h-11 shrink-0 items-center gap-2 overflow-hidden rounded-full bg-lime px-5 text-sm font-semibold text-on-lime transition-[transform,box-shadow] duration-200 hover:shadow-[0_0_0_4px_var(--glow-lime)] active:scale-95 disabled:cursor-progress"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {state === "sending" ? (
                  <motion.span key="s" className="flex gap-1 px-3" initial={{ y: 16 }} animate={{ y: 0 }} exit={{ y: -16 }} aria-label={t.common.loading}>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-1.5 rounded-full bg-on-lime"
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </motion.span>
                ) : state === "done" ? (
                  <motion.span key="d" className="flex items-center gap-1.5" initial={{ y: 16 }} animate={{ y: 0 }} exit={{ y: -16 }}>
                    <Check className="size-4" />
                  </motion.span>
                ) : (
                  <motion.span key="i" className="flex items-center gap-1.5" initial={{ y: 16 }} animate={{ y: 0 }} exit={{ y: -16 }}>
                    {t.home.subscribe}
                    <ArrowRight className="flip-rtl size-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
          <p id="newsletter-error" role="alert" className="mt-2 min-h-5 ps-5 text-sm text-danger">
            {error}
          </p>
        </form>
      </div>
    </section>
  );
}
