import { SectionHeading } from "@/components/marketing/section-heading";
import { packages, serviceCards } from "@/lib/site-data";

export default function ServicesPage() {
  return (
    <main className="bg-sand py-24">
      <div className="section-shell space-y-16">
        <SectionHeading
          eyebrow="Services"
          title="A clearer service menu than 'I can build anything.'"
          body="Each offer is framed around an outcome, a fit, and a next step so the site reduces low-trust friction instead of increasing it."
        />
        <div className="grid gap-8 lg:grid-cols-3">
          {serviceCards.map((card) => (
            <div key={card.title} className="rounded-[2rem] border border-black/10 bg-white p-8">
              <h2 className="text-2xl font-bold">{card.title}</h2>
              <p className="mt-4 leading-7 text-slate">{card.body}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {packages.map((item) => (
            <div key={item.name} className="rounded-[1.5rem] border border-black/10 bg-[#ebe4da] p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-slate">{item.price}</p>
              </div>
              <p className="mt-2 text-slate">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
