import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeadById } from "@/lib/leads";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  return (
    <main className="min-h-[70vh] bg-sand px-6 py-24">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link href="/admin/leads" className="text-sm font-semibold text-slate transition hover:text-ink">
          Back to leads
        </Link>

        <div className="rounded-[2rem] border border-black/10 bg-white p-10 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Lead detail</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight">{lead.name}</h1>
              <p className="mt-3 text-lg text-slate">{lead.company}</p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-[#efe9df] px-4 py-2 text-sm font-semibold capitalize">
              {lead.status}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-soft">
            <h2 className="text-xl font-bold">Lead summary</h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-semibold text-slate">Email</dt>
                <dd className="mt-1">{lead.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate">Project type</dt>
                <dd className="mt-1">{lead.projectType}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate">Budget</dt>
                <dd className="mt-1">{lead.budget}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate">Timeline</dt>
                <dd className="mt-1">{lead.timeline}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate">Created</dt>
                <dd className="mt-1">{formatDate(lead.createdAt)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate">Source</dt>
                <dd className="mt-1 capitalize">{lead.source}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-soft">
            <h2 className="text-xl font-bold">Project brief</h2>
            <p className="mt-6 whitespace-pre-wrap leading-8 text-slate">{lead.summary}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
