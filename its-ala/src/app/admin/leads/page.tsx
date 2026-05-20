import Link from "next/link";
import { listLeads } from "@/lib/leads";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminLeadsPage() {
  const leads = await listLeads();

  return (
    <main className="min-h-[70vh] bg-sand px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] border border-black/10 bg-white p-10 shadow-soft">
          <p className="eyebrow">Leads view</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Incoming inquiries</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate">
            This is the first real internal layer behind the site. Every inquiry can now become a lead record with structured fields instead of a floating message.
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white shadow-soft">
          <div className="grid gap-4 border-b border-black/10 px-8 py-6 sm:grid-cols-[1.4fr_0.8fr_0.8fr_0.6fr]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Lead</p>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Project</p>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Budget</p>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Status</p>
          </div>

          {leads.length === 0 ? (
            <div className="px-8 py-12">
              <p className="text-lg font-semibold">No leads yet.</p>
              <p className="mt-3 max-w-2xl leading-7 text-slate">
                Once the contact form is used, new inquiries will show up here. If you are on Vercel without database configuration yet, they can still be emailed, but durable storage should be connected next.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/10">
              {leads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="grid gap-4 px-8 py-6 transition hover:bg-[#f7f2ea] sm:grid-cols-[1.4fr_0.8fr_0.8fr_0.6fr]"
                >
                  <div>
                    <p className="font-semibold">{lead.name}</p>
                    <p className="text-sm text-slate">{lead.email}</p>
                    <p className="mt-1 text-sm text-slate">{lead.company}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate/80">
                      {formatDate(lead.createdAt)}
                    </p>
                  </div>
                  <p className="font-medium">{lead.projectType}</p>
                  <div>
                    <p className="font-medium">{lead.budget}</p>
                    <p className="text-sm text-slate">{lead.timeline}</p>
                  </div>
                  <div>
                    <span className="inline-flex rounded-full bg-[#efe9df] px-3 py-1 text-sm font-semibold capitalize">
                      {lead.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
