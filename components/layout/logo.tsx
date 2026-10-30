import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Lightning-V mark, redrawn from /public/brand/volt-icon.png so it works on any background. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 79" aria-hidden="true" className={cn("fill-current", className)}>
      <polygon points="0,0 26.4,0 42.8,28.6 35.4,41.6 48.8,41.6 44.4,64.3 67.7,31.1 50.8,31.6 73.4,0 100,0 49.8,78.6" />
    </svg>
  );
}

/**
 * The brand wordmark (/public/brand/volt-logo.png, a transparent cutout of volt-wordmark.png).
 * Lime on dark; rendered in ink on the light theme, where lime would lack contrast.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={siteConfig.logo.wordmark}
      alt={siteConfig.name}
      width={480}
      height={109}
      priority
      className={cn("h-6 w-auto [[data-theme=light]_&]:brightness-0", className)}
    />
  );
}
