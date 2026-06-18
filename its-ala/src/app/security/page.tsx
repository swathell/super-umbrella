import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "ITSALA Security",
  description:
    "Review ITSALA security practices, access controls, data handling posture, and deployment considerations.",
};

const securitySections = [
  {
    title: "Secure by design",
    items: [
      "Public, admin, and client-facing surfaces are separated instead of blended into one exposed interface.",
      "Environment-specific configuration is expected explicitly, so production behavior does not depend on guesswork.",
      "Sensitive workflows are designed with least-necessary access in mind from the start.",
    ],
  },
  {
    title: "Access control",
    items: [
      "Protected admin routes are kept separate from public pages.",
      "Client workspaces use restricted access rather than exposing internal operator context.",
      "Secrets are configured in deployment environments, not embedded in application code.",
    ],
  },
  {
    title: "Data handling",
    items: [
      "Production storage uses durable infrastructure when database configuration is present.",
      "Local-development fallback behavior is explicit so teams can tell when they are not in production mode.",
      "AI is introduced only around concrete jobs such as summarization, routing, and structured follow-through.",
    ],
  },
  {
    title: "Deployment options",
    items: [
      "Dedicated client environments are available when separation requirements are higher.",
      "Environment-specific secrets and storage can be configured per deployment target.",
      "The delivery model can flex from fast-moving shared environments to more isolated client setups.",
    ],
  },
];

export default function SecurityPage() {
  return (
    <main className="bg-sand text-ink">
      <SiteHeader />

      <section className="bg-night pt-28 text-white lg:pt-24">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/62">Security</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Security, access, and deployment posture should be visible before procurement asks.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
            ITSALA is designed to support serious client work with clearer boundaries, practical
            controls, and deployment choices that match risk profile and separation requirements.
          </p>
        </div>
      </section>

      <section className="section-divider bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              Current posture
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              A practical security page is better than making buyers infer trust on their own.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {securitySections.map((section) => (
              <div key={section.title} className="border-t border-line pt-5">
                <h3 className="text-2xl font-bold tracking-tight">{section.title}</h3>
                <div className="mt-4 space-y-4">
                  {section.items.map((item) => (
                    <p key={item} className="text-base leading-7 text-slate">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-mesh">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              Security contact
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Need to review a deployment requirement or separation concern?
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-slate">
            <p>
              Security and deployment questions can be surfaced before implementation begins so the
              project shape matches the client risk profile, not just the product roadmap.
            </p>
            <a
              href="mailto:hello@itsala.com?subject=ITSALA%20Security%20Inquiry"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-night"
            >
              Contact security
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
