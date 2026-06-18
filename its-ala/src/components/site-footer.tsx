const footerLinks = [
  { href: "/product", label: "Product" },
  { href: "/solutions", label: "Solutions" },
  { href: "/security", label: "Security" },
  { href: "/#contact", label: "Request demo" },
];

export function SiteFooter() {
  return (
    <footer className="section-divider bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 text-sm text-slate sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-lg font-extrabold tracking-tight text-ink">ITSALA</p>
          <p className="mt-3 max-w-sm leading-7">
            AI-powered operating systems for professional services firms that need clearer
            workflows, stronger client delivery, and less internal drag.
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink">Explore</p>
          <div className="mt-3 space-y-2">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="block transition hover:text-ink">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-ink">Contact</p>
          <div className="mt-3 space-y-2">
            <p>hello@itsala.com</p>
            <p>Built for consulting, advisory, and operationally serious teams.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
