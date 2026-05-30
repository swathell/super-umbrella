import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "ITSALA Trust Center",
  description:
    "Review ITSALA security practices, data handling posture, access controls, backup approach, and deployment considerations.",
};

const trustSections = [
  {
    title: "Security practices",
    items: [
      "Admin and client access are separated to reduce accidental exposure across surfaces.",
      "Projects are structured with explicit environment configuration instead of hidden operational assumptions.",
      "Sensitive workflows are designed with least-necessary access in mind.",
    ],
  },
  {
    title: "Data handling",
    items: [
      "Operational data is stored in durable infrastructure when production database configuration is present.",
      "Local development fallback behavior is explicit, so environments do not silently pretend to be production.",
      "AI-assisted flows are introduced selectively around concrete use cases, with attention to what information is being processed.",
    ],
  },
  {
    title: "Access controls",
    items: [
      "Internal admin routes are protected separately from public pages.",
      "Client workspaces use restricted access instead of exposing internal operator context.",
      "Environment secrets are expected to be configured at deployment, not embedded in application code.",
    ],
  },
  {
    title: "Backup and operational posture",
    items: [
      "The production path is designed to run with durable storage rather than browser-only or ephemeral application state.",
      "Notification and workflow failures are surfaced clearly instead of being swallowed silently.",
      "The operating model favors visible state transitions, timestamps, and practical auditability where it matters.",
    ],
  },
];

export default function TrustPage() {
  return (
    <main className="bg-sand text-ink">
      <SiteHeader />

      <section className="bg-night pt-28 text-white lg:pt-24">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/62">
            Trust center
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Security, access, and operational clarity should be visible before procurement asks.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
            ITSALA is built to support serious client work with practical controls, clear data
            boundaries, and production-minded operating choices.
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
              A lightweight trust center is better than making buyers guess.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate">
              This page is intentionally plain about what exists today: access boundaries,
              environment-aware storage, and an operational model that favors explicit behavior over
              silent magic.
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {trustSections.map((section) => (
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
              Dedicated environments
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              When client separation matters, the delivery model can meet it.
            </h2>
          </div>
          <div className="space-y-5">
            {[
              "Dedicated client environments are available when the engagement requires stronger separation.",
              "Environment-specific secrets and storage can be configured per deployment target.",
              "Client-facing workspaces remain distinct from internal operator and admin surfaces.",
            ].map((item) => (
              <div key={item} className="border-t border-line pt-5 text-base leading-7 text-slate">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-night text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/55">
              Security contact
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Need to review a client requirement or deployment concern?
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/76">
              Security and deployment questions can be routed before implementation begins so the
              delivery shape matches the client risk profile from the start.
            </p>
            <a
              href="mailto:hello@itsala.com?subject=ITSALA%20Security%20Inquiry"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-night transition hover:bg-sand"
            >
              Contact the security team
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
