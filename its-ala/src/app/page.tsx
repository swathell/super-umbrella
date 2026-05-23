import Image from "next/image";
import { InquiryForm } from "@/components/inquiry-form";

const heroImage =
  "https://cdn.b12.io/client_media/n4cuK7Ey/c1e02708-5438-11f1-b89f-0242ac110002-zO-CuIuCjHaM-5qy0un-S.jpg";
const dashboardImage =
  "https://cdn.b12.io/client_media/n4cuK7Ey/c2155265-5438-11f1-a307-0242ac110002-Y8bAUk_ViFhpFa0ztH_Zg.jpg";
const workflowImage =
  "https://cdn.b12.io/client_media/n4cuK7Ey/c1f50f05-5438-11f1-9508-0242ac110002-OF-bPvba1Dnw9x_44-nT7.jpg";

const offerings = [
  {
    title: "Custom apps",
    text: "Focused software for a real business use case, built around your workflow instead of forcing your workflow into a generic tool.",
  },
  {
    title: "Internal tools",
    text: "Operator-grade dashboards, admin panels, and process layers that remove repetitive work and make the team faster.",
  },
  {
    title: "AI workflows",
    text: "Practical automation and AI-enabled systems for triage, routing, summarization, extraction, and follow-through.",
  },
];

const proof = [
  "Fast scoping without endless back-and-forth",
  "Clear deliverables instead of vague discovery loops",
  "Built for founders and small teams that need movement",
];

const process = [
  {
    step: "01",
    title: "Clarify the bottleneck",
    text: "Start with the broken workflow, missing system, or manual drag that is slowing the team down.",
  },
  {
    step: "02",
    title: "Shape the right build",
    text: "Translate the problem into a practical scope with the smallest version that creates useful operational change.",
  },
  {
    step: "03",
    title: "Ship with momentum",
    text: "Build quickly, keep the loop clear, and get to something real that can be used, tested, and improved.",
  },
];

const examples = [
  "A lead intake and qualification flow that routes serious inquiries cleanly.",
  "An internal dashboard that replaces spreadsheets, scattered notes, and manual status chasing.",
  "An AI-assisted workflow that summarizes noisy inputs and turns them into structured action.",
];

export default function HomePage() {
  return (
    <main className="bg-sand text-ink">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-night/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="text-xl font-extrabold tracking-tight text-white">
            Its Ala
          </a>
          <nav className="hidden items-center gap-8 text-sm text-white/75 md:flex">
            <a href="#services" className="transition hover:text-white">
              What I build
            </a>
            <a href="#process" className="transition hover:text-white">
              Process
            </a>
            <a href="#examples" className="transition hover:text-white">
              Examples
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </nav>
          <a
            href="#contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white px-5 text-sm font-semibold text-ink transition hover:bg-sand"
          >
            Start a project
          </a>
        </div>
      </header>

      <section id="top" className="grain relative min-h-svh overflow-hidden bg-night pt-24 text-white">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Abstract workflow image"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,24,37,0.9),rgba(14,24,37,0.58),rgba(14,24,37,0.25))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,107,61,0.22),transparent_32%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-7xl items-end px-5 pb-14 pt-20 sm:px-6 lg:px-8">
          <div className="grid w-full gap-14 lg:grid-cols-[minmax(0,1.1fr)_22rem] lg:items-end">
            <div className="max-w-4xl">
              <p className="animate-rise font-mono text-xs uppercase tracking-[0.32em] text-white/65">
                Trust-first custom systems
              </p>
              <h1 className="mt-5 max-w-5xl animate-rise text-5xl font-extrabold leading-[0.92] tracking-tight text-white [animation-delay:120ms] sm:text-6xl lg:text-8xl">
                Custom apps, internal tools, and AI workflows built fast.
              </h1>
              <p className="mt-6 max-w-2xl animate-rise text-lg leading-8 text-white/78 [animation-delay:220ms] sm:text-xl">
                I help founders and small teams move from a messy workflow or stalled idea
                to a usable system with clear scope, direct communication, and real delivery.
              </p>
              <div className="mt-9 flex animate-rise flex-col gap-4 sm:flex-row [animation-delay:320ms]">
                <a
                  href="#contact"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 text-base font-semibold text-ink transition hover:bg-sand"
                >
                  Start a project
                </a>
                <a
                  href="#examples"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-white/8 px-7 text-base font-semibold text-white transition hover:bg-white/14"
                >
                  See example use cases
                </a>
              </div>
            </div>

            <div className="animate-rise self-end rounded-[2rem] border border-white/14 bg-white/8 p-6 backdrop-blur-md [animation-delay:420ms]">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/55">
                Best fit
              </p>
              <div className="mt-5 space-y-4">
                {proof.map((item) => (
                  <div
                    key={item}
                    className="border-t border-white/10 pt-4 text-sm leading-6 text-white/78 first:border-t-0 first:pt-0"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section-divider">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              What I build
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Three lanes, one standard: practical systems that earn their keep quickly.
            </h2>
          </div>
          <div className="mt-14 grid gap-12 lg:grid-cols-3">
            {offerings.map((offering) => (
              <article key={offering.title} className="border-t border-line pt-6">
                <h3 className="text-2xl font-bold tracking-tight">{offering.title}</h3>
                <p className="mt-4 max-w-sm text-base leading-7 text-slate">{offering.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-mesh">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              Who this is for
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              The sweet spot is not “everyone who needs software.”
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate">
              This is for operators with a clear use case, a live bottleneck, or a specific system
              they need built without a bloated agency process.
            </p>
            <ul className="mt-8 space-y-4 text-base leading-7 text-ink">
              <li>Founders replacing manual workflows with a real operating system.</li>
              <li>Small teams needing internal software that actually matches how they work.</li>
              <li>Operators looking for AI where it saves time, not where it creates noise.</li>
            </ul>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] shadow-soft">
            <Image
              src={dashboardImage}
              alt="Dashboard and internal workflow visual"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,24,37,0.08),rgba(14,24,37,0.55))]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/65">
                Delivery lens
              </p>
              <p className="mt-3 max-w-lg text-lg leading-8 text-white/86">
                The goal is not more software. The goal is less drag, tighter visibility, and a
                system people can actually use.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="section-divider bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
                Process
              </p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Clear path in, clear path through.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate">
                The project starts by getting concrete about the system, not by creating a giant
                planning ritual around it.
              </p>
            </div>
            <div className="space-y-10">
              {process.map((item) => (
                <div key={item.step} className="grid gap-4 border-t border-line pt-6 sm:grid-cols-[80px_1fr]">
                  <p className="font-mono text-sm text-accent">{item.step}</p>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="examples" className="section-divider bg-night text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:px-8 lg:py-24">
          <div className="relative min-h-[440px] overflow-hidden rounded-[2rem]">
            <Image src={workflowImage} alt="Workflow image" fill className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,24,37,0.15),rgba(14,24,37,0.72))]" />
          </div>
          <div className="self-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/55">
              Example use cases
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              A good first version should already solve something expensive.
            </h2>
            <div className="mt-10 space-y-6">
              {examples.map((item) => (
                <div key={item} className="border-t border-white/10 pt-5 text-base leading-7 text-white/76">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section-divider bg-sand">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
                Start a project
              </p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Send the real version of the problem.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate">
                Share what is slowing you down, what needs to exist, and how soon it matters.
                A clear inquiry gets a sharper reply.
              </p>
              <div className="mt-10 border-t border-line pt-6 text-sm leading-7 text-slate">
                Typical fit:
                <br />
                custom build, internal tool, workflow redesign, automation layer, or AI-assisted
                system with a real operational use case.
              </div>
            </div>

            <div className="rounded-[2rem] border border-line bg-white/72 p-6 shadow-soft backdrop-blur-sm sm:p-8">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      <footer className="section-divider bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 text-sm text-slate sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-ink">Its Ala</p>
            <p className="mt-3 max-w-sm leading-7">
              Custom apps, internal tools, and AI workflows built with speed, clarity, and a bias
              toward real operational value.
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink">Navigate</p>
            <div className="mt-3 space-y-2">
              <a href="#services" className="block transition hover:text-ink">
                What I build
              </a>
              <a href="#process" className="block transition hover:text-ink">
                Process
              </a>
              <a href="#examples" className="block transition hover:text-ink">
                Examples
              </a>
              <a href="#contact" className="block transition hover:text-ink">
                Start a project
              </a>
            </div>
          </div>
          <div>
            <p className="font-semibold text-ink">Contact</p>
            <div className="mt-3 space-y-2">
              <p>hello@itsala.com</p>
              <p>Built for founders and small teams.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
