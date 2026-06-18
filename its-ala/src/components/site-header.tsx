const primaryLinks = [
  { href: "/product", label: "Product" },
  { href: "/solutions", label: "Solutions" },
  { href: "/security", label: "Security" },
];

const sectionLinks = [
  { href: "/#built-for", label: "Built for" },
  { href: "/#walkthrough", label: "Walkthrough" },
  { href: "/#about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-night/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <a href="/" className="text-xl font-extrabold tracking-tight text-white">
          ITSALA
        </a>

        <nav className="hidden items-center gap-8 text-sm text-white/78 lg:flex">
          {primaryLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="/#contact"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-night transition hover:bg-sand"
        >
          Request demo
        </a>
      </div>

      <nav className="scrollbar-none overflow-x-auto border-t border-white/10 px-5 py-3 text-sm text-white/72 lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-5 whitespace-nowrap sm:px-1">
          {[...primaryLinks, ...sectionLinks].map((link) => (
            <a key={`${link.href}-${link.label}`} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
