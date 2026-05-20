import { SectionHeading } from "@/components/marketing/section-heading";

const phases = [
  {
    name: "Trust",
    body: "The site explains the offer clearly enough that a visitor feels safe reaching out.",
  },
  {
    name: "Intake",
    body: "The form turns a vague inquiry into structured project data with enough shape to respond intelligently.",
  },
  {
    name: "Build",
    body: "The scoped request becomes a working app, internal tool, or workflow with direct collaboration and fast iteration.",
  },
  {
    name: "Operate",
    body: "The same foundation expands into admin tooling, lead management, and future client-facing systems.",
  },
];

export default function ProcessPage() {
  return (
    <main className="bg-[#e9e2d7] py-24">
      <div className="section-shell space-y-16">
        <SectionHeading
          eyebrow="Process"
          title="The site, intake, and app layers are meant to reinforce each other."
          body="This is not just a homepage with nice sections. It is the beginning of one operating system for trust, conversion, and delivery."
        />
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {phases.map((phase, index) => (
            <div key={phase.name} className="rounded-[2rem] border border-black/10 bg-white p-8">
              <p className="font-mono text-sm uppercase tracking-[0.22em] text-slate">0{index + 1}</p>
              <h2 className="mt-6 text-3xl font-bold">{phase.name}</h2>
              <p className="mt-4 leading-7 text-slate">{phase.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
