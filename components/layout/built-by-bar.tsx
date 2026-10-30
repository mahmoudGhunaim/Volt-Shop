import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n";

/** Site-wide strip linking to the author's portfolio. Shown above the header on every page. */
export function BuiltByBar({ t }: { t: Dictionary }) {
  const host = siteConfig.portfolioUrl.replace(/^https?:\/\//, "");
  return (
    <div className="relative z-(--z-header) border-b border-border bg-surface text-sm">
      <a
        href={siteConfig.portfolioUrl}
        target="_blank"
        rel="noopener"
        className="group container-volt flex h-9 items-center justify-center gap-2 sm:gap-3"
      >
        <span className="text-muted max-sm:hidden">{t.builtBy.lead}</span>
        <span className="font-semibold">{t.builtBy.cta}</span>
        <span className="text-muted max-[400px]:hidden" dir="ltr">
          {host}
        </span>
        <span className="grid size-5 place-items-center rounded-full bg-lime text-on-lime transition-transform duration-300 ease-expo group-hover:rotate-45">
          <ArrowUpRight className="flip-rtl size-3" aria-hidden />
        </span>
      </a>
    </div>
  );
}
