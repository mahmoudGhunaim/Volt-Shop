import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { format } from "@/i18n";
import { getDictionary } from "@/i18n/server";

export async function Footer() {
  const { t } = await getDictionary();

  const columns = [
    {
      title: t.footer.shop,
      links: [
        { label: t.nav.audio, href: "/shop?category=audio" },
        { label: t.nav.wear, href: "/shop?category=wear" },
        { label: t.nav.carry, href: "/shop?category=carry" },
        { label: t.nav.desk, href: "/shop?category=desk" },
        { label: t.nav.kicks, href: "/shop?category=kicks" },
      ],
    },
    {
      title: t.footer.help,
      links: [
        { label: t.footer.shipping, href: "/shipping" },
        { label: t.footer.returns, href: "/returns" },
        { label: t.footer.warranty, href: "/warranty" },
        { label: t.footer.contact, href: "/contact" },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { label: t.footer.about, href: "/about" },
        { label: t.footer.journal, href: "/journal" },
        { label: t.footer.careers, href: "/careers" },
      ],
    },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-surface/40">
      <div className="container-volt grid grid-cols-2 gap-x-6 gap-y-10 pb-10 pt-16 sm:grid-cols-3 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-12">
        <div className="col-span-2 max-w-sm sm:col-span-3 md:col-span-1">
          <a
            href={siteConfig.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-lime/40 bg-lime/10 py-1.5 pe-4 ps-1.5 text-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-lime hover:shadow-[0_0_0_4px_var(--glow-lime)]"
          >
            <span className="rounded-full bg-lime px-2.5 py-1 text-xs font-bold text-on-lime">
              {t.footer.demoBadge}
            </span>
            <span className="font-medium">{siteConfig.author}</span>
            <ArrowUpRight className="flip-rtl size-4 transition-transform duration-300 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <p className="mt-5 text-sm text-muted">
            {format(t.footer.demoBadgeBody, { author: siteConfig.author })}
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-sans text-sm font-semibold [font-stretch:100%]">{col.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition-colors duration-200 hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container-volt flex flex-col gap-2 border-t border-border py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{format(t.footer.rights, { year: new Date().getFullYear(), name: siteConfig.name })}</p>
        <p>Next.js · Tailwind · Framer Motion · DummyJSON</p>
      </div>
    </footer>
  );
}
