import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "ITSALA Platform Overview",
  description:
    "Explore the ITSALA platform: operations, workflow automation, client workspaces, operator visibility, and deployment options.",
};

const overviewImage =
  "https://cdn.b12.io/client_media/n4cuK7Ey/c2155265-5438-11f1-a307-0242ac110002-Y8bAUk_ViFhpFa0ztH_Zg.jpg";

const modules = [
  {
    title: "Lead and intake operations",
    text: "Capture serious inquiries, structure them immediately, and route them into an internal system that makes follow-up, qualification, and commercial visibility easier.",
  },
  {
    title: "Internal workflow layer",
    text: "Replace spreadsheets, scattered notes, and handoff ambiguity with a practical operating surface built around the actual work your team does.",
  },
  {
    title: "Client workspace visibility",
    text: "Give clients a clean view of status, milestones, updates, and shared resources without forcing them into a bloated project management product.",
  },
  {
    title: "Operator intelligence",
    text: "Track signals, organize organizations, and surface what matters now when your team needs stronger commercial timing and context reconstruction.",
  },
];

const workflow = [
  "A visitor lands on a clear offer and books a demo or submits an inquiry.",
  "The lead enters an admin workflow with qualification, notes, and commercial progress tracking.",
  "Qualified work becomes a client workspace with milestones, updates, and a clear next step.",
  "High-signal commercial context can be captured and organized in the operator workspace.",
];

const deploymentOptions = [
  "Single production environment for fast-moving engagements",
  "Dedicated client environments when separation requirements are higher",
  "Role-based admin and client access boundaries",
  "Practical storage, notification, and workflow layers that can grow with the operation",
];

export default function ProductPage() {
  return (
    <main className="bg-sand text-ink">
      <SiteHeader />

      <section className="relative overflow-hidden bg-night pt-28 text-white lg:pt-24">
        <div className="absolute inset-0">
          <Image src={overviewImage} alt="ITSALA product overview" fill className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(14,24,37,0.95),rgba(14,24,37,0.74),rgba(14,24,37,0.3))]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/62">
            Product overview
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            One operating system for intake, internal workflow, client delivery, and commercial visibility.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
            ITSALA is designed to give professional services firms a cleaner operational spine:
            clearer data, fewer handoff gaps, and better visibility into what is moving or stalling.
          </p>
        </div>
      </section>

      <section className="section-divider bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              Core modules
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Each layer is narrow on purpose and useful immediately.
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
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              Workflow example
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              A product tour should make the path through the system obvious.
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

      <section className="section-divider bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              Deployment options
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Enough flexibility to meet client requirements without overcomplicating the offer.
            </h2>
          </div>
          <div className="space-y-5">
            {deploymentOptions.map((item) => (
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
              Next step
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              If the workflow is real, the platform conversation should be practical.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/76">
              The best demo starts with the operational friction, the revenue stall, or the client
              delivery problem that needs to change.
            </p>
            <a
              href="/#contact"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-night transition hover:bg-sand"
            >
              Book a demo
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
