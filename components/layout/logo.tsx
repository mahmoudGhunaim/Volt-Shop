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

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)} dir="ltr">
      <LogoMark className="h-[0.95em] w-auto text-lime [[data-theme=light]_&]:text-fg" />
      <span className="font-wide text-[1.35em] font-extrabold leading-none tracking-[-0.02em]">
        {siteConfig.name}
      </span>
    </span>
  );
}
