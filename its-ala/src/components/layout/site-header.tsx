import Link from "next/link";
import { navItems, site } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-sand/90 backdrop-blur">
      <div className="section-shell flex h-20 items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          {site.name}
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full bg-ink px-5 py-3 font-semibold text-sand transition hover:bg-night"
          >
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
