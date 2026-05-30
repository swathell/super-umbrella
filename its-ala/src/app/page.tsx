import Image from "next/image";
import { InquiryForm } from "@/components/inquiry-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const heroImage =
  "https://cdn.b12.io/client_media/n4cuK7Ey/c1e02708-5438-11f1-b89f-0242ac110002-zO-CuIuCjHaM-5qy0un-S.jpg";
const trustImage =
  "https://cdn.b12.io/client_media/n4cuK7Ey/c2155265-5438-11f1-a307-0242ac110002-Y8bAUk_ViFhpFa0ztH_Zg.jpg";
const workflowImage =
  "https://cdn.b12.io/client_media/n4cuK7Ey/c1f50f05-5438-11f1-9508-0242ac110002-OF-bPvba1Dnw9x_44-nT7.jpg";

const trustPillars = [
  {
    title: "Security and privacy first",
    text: "Projects are scoped with access boundaries, role separation, and data handling in mind from the start.",
  },
  {
    title: "Enterprise-ready infrastructure",
    text: "Delivery is designed for practical production use, with durable storage, internal admin controls, and clear environment boundaries.",
  },
  {
    title: "Dedicated client environments available",
    text: "When a client needs tighter separation, ITSALA can shape delivery around isolated environments and client-specific operating surfaces.",
  },
  {
    title: "AI data isolation by design",
    text: "AI is used where it improves speed and clarity, with attention to what data is processed, where it flows, and who can touch it.",
  },
];

const audiences = [
  {
    title: "For consulting firms",
    text: "Manage engagements, client delivery, internal workflows, and reporting without stacking fragile point tools on top of each other.",
  },
  {
    title: "For venture and advisory teams",
    text: "Track companies, coordinate partner workflows, and bring AI-assisted structure to research, updates, and follow-through.",
  },
  {
    title: "For operationally serious SMEs",
    text: "Deploy internal systems that reduce handoff friction, increase visibility, and support client-facing work without bloated implementation cycles.",
  },
];

const platformPoints = [
  "Centralize operations across lead intake, delivery workflows, and client visibility.",
  "Automate repetitive routing, summarization, tracking, and internal follow-through.",
  "Create client-facing workspaces that make progress, milestones, and next steps obvious.",
  "Add AI where it compresses time to action instead of adding a new layer of noise.",
];

const differentiators = [
  "Fast scoping around a specific bottleneck, not a vague transformation project",
  "Clear operator workflows instead of generic dashboards with no operational meaning",
  "Practical delivery path from public intake to internal execution to client-facing visibility",
];

export default function HomePage() {
  return (
    <main className="bg-sand text-ink">
      <SiteHeader />

      <section className="grain relative min-h-svh overflow-hidden bg-night pt-28 text-white lg:pt-24">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="ITSALA workflow environment"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(14,24,37,0.95),rgba(14,24,37,0.7),rgba(14,24,37,0.22))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,107,61,0.24),transparent_30%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100svh-7rem)] max-w-7xl items-end px-5 pb-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="animate-rise font-mono text-xs uppercase tracking-[0.32em] text-white/64">
              AI-powered operating systems
            </p>
            <h1 className="mt-5 max-w-5xl animate-rise text-5xl font-extrabold leading-[0.94] tracking-tight text-white [animation-delay:100ms] sm:text-6xl lg:text-8xl">
              AI-powered business operating systems for professional services firms.
            </h1>
            <p className="mt-6 max-w-2xl animate-rise text-lg leading-8 text-white/78 [animation-delay:200ms] sm:text-xl">
              Centralize operations, automate workflows, manage clients, and gain actionable
              visibility through a secure, delivery-oriented platform.
            </p>
            <div className="mt-9 flex animate-rise flex-col gap-4 sm:flex-row [animation-delay:300ms]">
              <a
                href="/#contact"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 text-base font-semibold text-night transition hover:bg-sand"
              >
                Book a demo
              </a>
              <a
                href="/product"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-white/8 px-7 text-base font-semibold text-white transition hover:bg-white/14"
              >
                See platform overview
              </a>
            </div>
            <div className="mt-10 grid max-w-3xl gap-4 text-sm text-white/76 sm:grid-cols-3">
              {differentiators.map((item) => (
                <p key={item} className="border-t border-white/14 pt-4 leading-6">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-divider bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              Trust signals
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              The credibility layer should be obvious before anyone asks for a call.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {trustPillars.map((pillar) => (
              <div key={pillar.title} className="border-t border-line pt-5">
                <h3 className="text-2xl font-bold tracking-tight">{pillar.title}</h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-slate">{pillar.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/trust"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/10 px-6 text-sm font-semibold text-ink transition hover:border-ink hover:bg-sand"
            >
              Visit the trust center
            </a>
            <a
              href="/product"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/10 px-6 text-sm font-semibold text-ink transition hover:border-ink hover:bg-sand"
            >
              Review product deployment options
            </a>
          </div>
        </div>
      </section>

      <section id="who-we-serve" className="section-divider bg-mesh">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              Who we serve
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Built for firms that sell expertise and need cleaner operations around it.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate">
              ITSALA is strongest when the business is already real, the workflow pain is known,
              and the goal is to replace drag with an operating system people can actually use.
            </p>
            <div className="mt-10 border-t border-line pt-6 text-sm leading-7 text-slate">
              This is not generic software consulting. It is focused delivery for firms that need
              operational clarity, client visibility, and AI used in disciplined ways.
            </div>
          </div>

          <div className="space-y-8">
            {audiences.map((audience) => (
              <div key={audience.title} className="border-t border-line pt-5">
                <h3 className="text-2xl font-bold tracking-tight">{audience.title}</h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate">{audience.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="section-divider bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:px-8 lg:py-24">
          <div className="relative min-h-[440px] overflow-hidden rounded-[2rem] shadow-soft">
            <Image src={trustImage} alt="ITSALA platform overview" fill className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,24,37,0.12),rgba(14,24,37,0.65))]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/64">
                Platform lens
              </p>
              <p className="mt-3 max-w-lg text-lg leading-8 text-white/86">
                The goal is not to add another layer of software. The goal is to make the
                operation easier to run, easier to trust, and easier to grow.
              </p>
            </div>
          </div>

          <div className="self-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              Platform overview
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              One system spanning intake, internal workflows, delivery, and client visibility.
            </h2>
            <div className="mt-10 space-y-6">
              {platformPoints.map((item) => (
                <div key={item} className="border-t border-line pt-5 text-base leading-7 text-slate">
                  {item}
                </div>
              ))}
            </div>
            <a
              href="/product"
              className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-night px-6 text-sm font-semibold text-white transition hover:bg-ink"
            >
              See the full product tour
            </a>
          </div>
        </div>
      </section>

      <section className="section-divider bg-night text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:px-8 lg:py-24">
          <div className="self-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/55">
              Workflow example
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              The system should make revenue movement and delivery friction visible.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/76">
              ITSALA is especially useful when a firm needs to answer the hard operational
              questions: did they book, did they show, did they get a proposal, and where does
              hesitation actually appear?
            </p>
            <div className="mt-10 space-y-6">
              {[
                "Lead capture and qualification",
                "Admin review with status, notes, and routing",
                "Client workspace visibility for active projects",
                "Operator intelligence for higher-signal opportunities",
              ].map((item) => (
                <div key={item} className="border-t border-white/12 pt-5 text-base leading-7 text-white/76">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[440px] overflow-hidden rounded-[2rem]">
            <Image src={workflowImage} alt="Workflow view" fill className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,24,37,0.18),rgba(14,24,37,0.72))]" />
          </div>
        </div>
      </section>

      <section id="contact" className="section-divider bg-sand">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
                Book a demo
              </p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Start with the operating problem, not the tech wishlist.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate">
                Share the bottleneck, the clients it affects, and what better would look like.
                That is enough to scope the right next conversation.
              </p>
              <div className="mt-10 border-t border-line pt-6 text-sm leading-7 text-slate">
                Best fit:
                <br />
                consulting operations, advisory workflows, client delivery systems, internal
                tooling, workflow automation, or AI-assisted operational layers.
              </div>
            </div>

            <div className="rounded-[2rem] border border-line bg-white/72 p-6 shadow-soft backdrop-blur-sm sm:p-8">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
