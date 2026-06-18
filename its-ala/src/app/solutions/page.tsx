import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "ITSALA Solutions",
  description:
    "See how ITSALA supports consulting firms, venture and advisory teams, enterprise operations, and professional services leaders.",
};

const segments = [
  {
    title: "Consulting firms",
    outcome: "Run engagements, reporting, and team follow-through with more visibility and less delivery friction.",
    bullets: [
      "Keep milestones, updates, and client communication in one operating layer.",
      "See where delivery is blocked before it becomes a client trust issue.",
      "Reduce manual status chasing across internal and client-facing work.",
    ],
  },
  {
    title: "Venture and advisory teams",
    outcome: "Track organization context, signals, and partner follow-through with more structure.",
    bullets: [
      "Bring signals, commentary, and opportunity timing into one place.",
      "Reduce dropped follow-up across meetings, reporting, and internal handoffs.",
      "Create briefing-ready visibility for higher-signal commercial conversations.",
    ],
  },
  {
    title: "Enterprise operations teams",
    outcome: "Deploy secure workflow layers that route work, clarify ownership, and support AI-assisted execution.",
    bullets: [
      "Make approval flow, queue visibility, and role separation more legible.",
      "Use AI in narrow operational jobs where speed and structure matter.",
      "Support adoption with interfaces that feel practical rather than experimental.",
    ],
  },
];

export default function SolutionsPage() {
  return (
    <main className="bg-sand text-ink">
      <SiteHeader />

      <section className="bg-night pt-28 text-white lg:pt-24">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/62">Solutions</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Built for organizations that already know where operational drag lives.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
            ITSALA works best when the team is real, the workflow problem is clear, and the need is
            for a better operating layer around delivery, visibility, and follow-through.
          </p>
        </div>
      </section>

      <section className="section-divider bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="space-y-12">
            {segments.map((segment) => (
              <article key={segment.title} className="grid gap-8 border-t border-line pt-8 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {segment.title}
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-slate">{segment.outcome}</p>
                </div>
                <div className="space-y-4">
                  {segment.bullets.map((bullet) => (
                    <div key={bullet} className="rounded-[24px] border border-black/6 bg-[#fbfaf7] px-5 py-4 text-base leading-7 text-slate">
                      {bullet}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-divider bg-mesh">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">Engagement fit</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              The common thread is not industry buzzwords. It is operational seriousness.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-slate">
            <p>
              The strongest fit is a team that already understands the workflow pain and wants a
              system that helps revenue, delivery, and execution stay in view.
            </p>
            <p>
              That usually means fewer generic features, more specific operating logic, and a clearer
              path from problem to usable product.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
