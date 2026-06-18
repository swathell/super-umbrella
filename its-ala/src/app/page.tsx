import { InquiryForm } from "@/components/inquiry-form";
import { PlatformWalkthrough } from "@/components/platform-walkthrough";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const trustItems = [
  "Secure by design",
  "Enterprise ready",
  "Role-based access control",
  "Dedicated deployments available",
  "AI data isolation",
];

const builtFor = [
  {
    title: "Consulting firms",
    text: "Run delivery, reporting, and internal follow-through with less spreadsheet drag and more visibility.",
  },
  {
    title: "Venture and advisory teams",
    text: "Track portfolio context, organize signals, and keep partner workflows moving with more structure.",
  },
  {
    title: "Enterprise operations teams",
    text: "Deploy secure workflow layers that route work cleanly, improve handoffs, and make activity legible.",
  },
  {
    title: "Professional services leaders",
    text: "Connect revenue movement, client delivery, and operational health instead of managing them in separate tools.",
  },
];

const solutionPoints = [
  "Clear lead qualification instead of scattered intake",
  "Client workspaces that reduce status-chasing emails",
  "AI-assisted summaries that compress time to action",
  "Operational reporting that shows where revenue stalls",
];

export default function HomePage() {
  return (
    <main className="bg-sand text-ink">
      <SiteHeader />

      <section className="relative overflow-hidden bg-night pt-28 text-white lg:pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,107,61,0.25),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-20">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/60">
              Built for modern professional services
            </p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              AI-powered operating system for professional services firms.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
              Centralize operations, automate workflows, manage clients, and deploy secure
              AI-assisted business processes from one platform.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="/#contact"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 text-base font-semibold text-night transition hover:bg-sand"
              >
                Request demo
              </a>
              <a
                href="/product"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/16 bg-white/6 px-7 text-base font-semibold text-white transition hover:bg-white/12"
              >
                View platform
              </a>
            </div>
            <div className="mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {solutionPoints.map((item) => (
                <div key={item} className="border-t border-white/12 pt-4 text-sm leading-6 text-white/72">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-divider bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-5">
            {trustItems.map((item) => (
              <div
                key={item}
                className="rounded-full border border-black/8 bg-[#fbfaf7] px-4 py-3 text-center text-sm font-semibold text-ink"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="built-for" className="section-divider bg-mesh">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">Built for</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Buyers should recognize themselves immediately.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate">
                ITSALA is for organizations that sell expertise, manage delivery, and need a better
                operating layer around revenue, workflow execution, and client visibility.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {builtFor.map((item) => (
                <article key={item.title} className="border-t border-line pt-5">
                  <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="walkthrough" className="section-divider bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              Product walkthrough
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Show the product, not just the promise.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate">
              The platform should feel understandable in minutes: one surface for revenue and
              operations, one for client visibility, one for AI-assisted execution, and one for control.
            </p>
          </div>
          <div className="mt-12">
            <PlatformWalkthrough />
          </div>
        </div>
      </section>

      <section className="section-divider bg-night text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/55">
              Why it matters
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Revenue gets lost in the handoff between lead, delivery, and follow-through.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-white/76">
            <p>
              ITSALA is built around a simple problem: too many firms do serious client work across
              scattered notes, disconnected tools, and status updates that arrive too late to help.
            </p>
            <p>
              The result is not just operational drag. It is missed follow-up, delayed proposals,
              weak visibility, and revenue stalls that are hard to diagnose.
            </p>
            <p>
              ITSALA exists to put that operating layer in one place so the team can see what is
              moving, what is blocked, and what needs attention now.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="section-divider bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">About ITSALA</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              A real founder story beats a generic software voice.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-slate">
            <p>
              ITSALA was shaped around the recurring pattern that serious teams often outgrow generic
              tools long before they are ready for heavyweight transformation projects.
            </p>
            <p>
              The gap is usually the same: client work is real, the workflow pain is known, but the
              operating layer around it is fragmented, manual, and too easy to lose track of.
            </p>
            <p>
              That is why the platform is opinionated about clarity. It is meant to help a firm
              capture demand, run delivery, and use AI in practical ways without turning the business
              into a tool-integration project.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="section-divider bg-sand">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
                Request demo
              </p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Start with the company, use case, and operating problem.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate">
                This is a qualification-driven demo request, not a generic contact inbox. Share just
                enough context to understand the fit and the first conversation will be sharper.
              </p>
            </div>
            <div className="rounded-[2rem] border border-line bg-white/76 p-6 shadow-soft backdrop-blur-sm sm:p-8">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
