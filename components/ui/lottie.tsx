"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type LottieName = "empty-cart" | "empty-wishlist" | "success" | "not-found" | "bolt";

interface LottieProps {
  name: LottieName;
  loop?: boolean;
  className?: string;
  /** Wrap in an ink plate so the lime/violet artwork reads in both themes. */
  plate?: boolean;
}

/**
 * Plays a recolored LottieFiles animation from /public/lottie.
 * lottie-web (SVG-only light build) is loaded on demand, so pages without an animation pay nothing.
 * With reduced motion, the animation shows a still frame.
 */
export function Lottie({ name, loop = true, className, plate = true }: LottieProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    let cancelled = false;
    let destroy: (() => void) | undefined;

    (async () => {
      const [{ default: lottie }, data] = await Promise.all([
        import("lottie-web/build/player/lottie_light"),
        fetch(`/lottie/${name}.json`).then((r) => r.json() as Promise<object>),
      ]);
      if (cancelled) return;
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const anim = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: still ? false : loop,
        autoplay: !still,
        animationData: data,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      if (still) anim.addEventListener("DOMLoaded", () => anim.goToAndStop(anim.totalFrames - 1, true));
      destroy = () => anim.destroy();
    })().catch(() => {
      /* Decorative: a missing animation must never break the page. */
    });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [name, loop]);

  return (
    <div
      aria-hidden
      className={cn(
        "relative aspect-square",
        plate && "plate overflow-hidden rounded-full",
        className,
      )}
    >
      <div ref={ref} className={cn("absolute", plate ? "inset-[14%]" : "inset-0")} />
    </div>
  );
}
