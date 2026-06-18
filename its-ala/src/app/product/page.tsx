import type { Metadata } from "next";
import { PlatformWalkthrough } from "@/components/platform-walkthrough";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "ITSALA Product",
  description:
    "Explore the ITSALA platform across dashboard, client workspace, AI assistant, reporting, and administration.",
};

const modules = [
  {
    title: "Dashboard and operating visibility",
    text: "See pipeline, delivery health, operational bottlenecks, and next actions without switching between disconnected tools.",
  },
  {
    title: "Client workspace",
    text: "Give clients a clean surface for status, milestones, updates, and shared resources without sending them into project-management sprawl.",
  },
  {
    title: "AI assistant",
    text: "Use AI where it reduces handoff drag: summaries, triage, operational context, and faster decision support.",
  },
  {
    title: "Administration and control",
    text: "Manage access, lead routing, and internal workflow updates from one protected administrative layer.",
  },
];

const workflow = [
  "Capture demand through a structured demo request instead of a generic inquiry inbox.",
  "Qualify opportunities inside an internal lead workspace with status, notes, and commercial visibility.",
  "Convert active work into client-facing delivery spaces that keep updates and next steps obvious.",
  "Use operator intelligence to surface timing, friction, and higher-signal commercial context.",
];

export default function ProductPage() {
  return (
    <main className="bg-sand text-ink">
      <SiteHeader />

      <section className="bg-night pt-28 text-white lg:pt-24">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/62">Product</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            One platform for revenue operations, delivery visibility, and AI-assisted follow-through.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
            ITSALA is built to help professional services firms run the business layer around client
            work with more clarity, fewer handoff gaps, and stronger operational visibility.
          </p>
        </div>
      </section>

      <section className="section-divider bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">Core modules</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Narrow by design. Useful immediately.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {modules.map((item) => (
              <div key={item.title} className="border-t border-line pt-5">
                <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-slate">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-mesh">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              Product walkthrough
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Five views that explain the product faster than a feature list.
            </h2>
          </div>
          <div className="mt-12">
            <PlatformWalkthrough />
          </div>
        </div>
      </section>

      <section className="section-divider bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">How it works</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              The product path should feel commercially useful, not abstract.
            </h2>
          </div>
          <div className="space-y-6">
            {workflow.map((item, index) => (
              <div key={item} className="grid gap-4 border-t border-line pt-5 sm:grid-cols-[70px_1fr]">
                <p className="font-mono text-sm text-accent">0{index + 1}</p>
                <p className="text-base leading-7 text-slate">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-night text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/55">Next step</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              The best demo starts with the operational problem, not a generic software tour.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/76">
              If the use case is real, the conversation should quickly move from workflow friction
              to platform fit and implementation path.
            </p>
            <a
              href="/#contact"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-night transition hover:bg-sand"
            >
              Request demo
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
