import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/marketing/section-heading";
import { faqItems, packages, serviceCards, useCases } from "@/lib/site-data";

const heroImage =
  "https://cdn.b12.io/client_media/n4cuK7Ey/c1e02708-5438-11f1-b89f-0242ac110002-zO-CuIuCjHaM-5qy0un-S.jpg";

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-night text-sand">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Abstract technical background"
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(243,239,231,0.18),transparent_35%),linear-gradient(180deg,rgba(13,24,36,0.35),rgba(13,24,36,0.86))]" />
        </div>

        <div className="section-shell relative flex min-h-[calc(100svh-5rem)] items-end py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div className="max-w-4xl space-y-8">
              <p className="eyebrow text-sand/70">Its Ala by Friday OS</p>
              <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.94] tracking-tight sm:text-6xl lg:text-8xl">
                Turn business friction into working software in days, not months.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-sand/82 sm:text-xl">
                Custom apps, internal tools, and AI workflows for founders and small teams that need clarity, speed, and a build partner who can actually ship.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="rounded-full bg-sand px-7 py-4 text-center font-semibold text-ink transition hover:bg-white"
                >
                  Get a build plan
                </Link>
                <Link
                  href="/use-cases"
                  className="rounded-full border border-white/25 px-7 py-4 text-center font-semibold text-sand transition hover:bg-white/10"
                >
                  See use cases
                </Link>
              </div>
            </div>

            <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-md">
              <p className="eyebrow text-sand/65">Why people reach out</p>
              <div className="space-y-5 text-sm leading-7 text-sand/86">
                <p>Too much manual work.</p>
                <p>An idea that needs a real product.</p>
                <p>Internal chaos spread across five tools.</p>
                <p>An automation opportunity nobody has had time to build properly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#ece7de]">
        <div className="section-shell grid gap-6 py-8 md:grid-cols-4">
          {["Fixed-scope builds", "Fast turnaround", "Direct collaboration", "Clear next steps"].map(
            (item) => (
              <div key={item} className="border-l border-black/10 pl-4 first:border-l-0 first:pl-0">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate">Trust layer</p>
                <p className="mt-2 text-lg font-semibold">{item}</p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="bg-sand py-24">
        <div className="section-shell">
          <SectionHeading
            eyebrow="What we build"
            title="A public-facing site is only the front door."
            body="The real project foundation is one codebase that can hold the trust layer, intake flow, internal operations, and the future client-facing apps behind it."
          />
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {serviceCards.map((card) => (
              <div key={card.title} className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-soft">
                <h3 className="text-2xl font-bold">{card.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate">{card.body}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Packages"
            title="Low-friction entry, serious delivery underneath."
            body="The offer needs a ladder. Early-stage trust grows faster when visitors can start with something finite instead of feeling pushed toward a vague large engagement."
          />
          <div className="space-y-4">
            {packages.map((item, index) => (
              <div key={item.name} className="grid gap-4 rounded-[1.75rem] border border-black/10 bg-sand p-6 sm:grid-cols-[56px_1fr_auto] sm:items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-lg font-bold text-sand">
                  {index + 1}
                </div>
                <div>
                  <p className="text-xl font-bold">{item.name}</p>
                  <p className="mt-1 text-sm leading-6 text-slate">{item.summary}</p>
                </div>
                <p className="font-mono text-sm uppercase tracking-[0.18em] text-slate">
                  {item.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e9e2d7] py-24">
        <div className="section-shell">
          <SectionHeading
            eyebrow="How it works"
            title="A simple path from idea to shipped system."
            body="No long sales maze, no blurry handoff, and no mystery about what happens next."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {[
              ["01", "Share the problem", "You do not need a perfect spec. The real starting point is the friction, the users, and the outcome."],
              ["02", "Scope the build", "The first pass turns the request into a realistic recommendation, package fit, and implementation direction."],
              ["03", "Build fast", "The app, workflow, or system gets built with direct feedback loops instead of bloated handoffs."],
              ["04", "Operate and expand", "Once the front door works, the same codebase can grow into admin tools, client workspaces, and reusable apps."],
            ].map(([step, title, body]) => (
              <div key={step} className="space-y-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-xl font-bold text-sand">
                  {step}
                </div>
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="text-base leading-7 text-slate">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-24">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Use cases"
            title="Representative systems that feel concrete, not magical."
            body="Trust grows when visitors can recognize the kind of workflow they already live inside."
          />
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {useCases.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-soft">
                <div className="relative h-72">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="space-y-4 p-7">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="leading-7 text-slate">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="FAQ"
            title="Answer the silent trust questions before they become friction."
          />
          <div className="space-y-5">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-[1.5rem] border border-black/10 bg-sand p-6">
                <h3 className="text-xl font-bold">{item.question}</h3>
                <p className="mt-3 leading-7 text-slate">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#efe9df] py-24" id="contact">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Start here"
            title="Tell me what needs to exist."
            body="This first version already includes the intake flow foundation, so the public site can become a working operating layer instead of staying a static brochure."
          />
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
