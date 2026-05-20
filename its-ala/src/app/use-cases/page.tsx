import Image from "next/image";
import { SectionHeading } from "@/components/marketing/section-heading";
import { useCases } from "@/lib/site-data";

export default function UseCasesPage() {
  return (
    <main className="bg-white py-24">
      <div className="section-shell space-y-16">
        <SectionHeading
          eyebrow="Use cases"
          title="Real business patterns people can recognize themselves inside."
          body="This page gives the site concrete shape. Visitors should see their own operational mess reflected back in a way that feels solvable."
        />
        <div className="grid gap-8 lg:grid-cols-3">
          {useCases.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-[2rem] border border-black/10 bg-sand shadow-soft">
              <div className="relative h-72">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-7">
                <h2 className="text-2xl font-bold">{item.title}</h2>
                <p className="mt-4 leading-7 text-slate">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
