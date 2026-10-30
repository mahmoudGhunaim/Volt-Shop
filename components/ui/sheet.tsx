"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

type Side = "end" | "start" | "bottom";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  side?: Side;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Drawer built on Radix Dialog (focus trap, Esc, scroll lock) with Framer Motion.
 * `start` / `end` are logical, so the cart slides from the left in RTL.
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  side = "end",
  children,
  footer,
  className,
}: SheetProps) {
  const { dir, t } = useI18n();
  const fromRight = (side === "end") === (dir === "ltr");
  const hidden =
    side === "bottom" ? { y: "100%" } : { x: fromRight ? "100%" : "-100%" };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-(--z-overlay) bg-black/55 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className={cn(
                  "fixed z-(--z-drawer) flex flex-col bg-bg text-fg shadow-[0_0_80px_-20px_rgb(0_0_0/0.6)] outline-none",
                  side === "bottom"
                    ? "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-xl border-t border-border"
                    : "inset-y-0 w-full max-w-[28rem] border-border",
                  side !== "bottom" && (fromRight ? "right-0 border-l" : "left-0 border-r"),
                  className,
                )}
                initial={hidden}
                animate={{ x: 0, y: 0 }}
                exit={hidden}
                transition={{ duration: 0.42, ease }}
              >
                {side === "bottom" && (
                  <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border" aria-hidden />
                )}
                <header className="flex items-center justify-between gap-4 px-5 pb-4 pt-5 sm:px-6">
                  <div className="min-w-0">
                    <Dialog.Title className="font-wide text-xl font-extrabold tracking-[-0.02em]">
                      {title}
                    </Dialog.Title>
                    {description ? (
                      <Dialog.Description className="text-sm text-muted">{description}</Dialog.Description>
                    ) : (
                      <Dialog.Description className="sr-only">{title}</Dialog.Description>
                    )}
                  </div>
                  <Dialog.Close
                    className="grid size-10 shrink-0 place-items-center rounded-full border border-border transition-[transform,background-color] duration-200 hover:bg-surface-2 active:scale-95"
                    aria-label={t.nav.close}
                  >
                    <X className="size-4" />
                  </Dialog.Close>
                </header>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6">
                  {children}
                </div>
                {footer && <footer className="border-t border-border px-5 py-5 sm:px-6">{footer}</footer>}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
