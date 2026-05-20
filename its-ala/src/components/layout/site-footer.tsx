import Link from "next/link";
import { navItems, site } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#ebe6dc]">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-2xl font-extrabold">{site.name}</p>
          <p className="max-w-sm text-sm leading-7 text-slate">
            Custom software, internal tools, and AI workflows for teams that want clear scope, direct communication, and useful systems.
          </p>
        </div>
        <div>
          <p className="mb-4 font-semibold">Navigate</p>
          <div className="space-y-3 text-sm text-slate">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link href={item.href} className="transition hover:text-ink">
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 font-semibold">Contact</p>
          <a className="text-sm text-slate transition hover:text-ink" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <p className="mt-5 text-xs uppercase tracking-[0.25em] text-slate/80">
            Vercel-ready foundation for site, intake, and future client apps
          </p>
        </div>
      </div>
    </footer>
  );
}
