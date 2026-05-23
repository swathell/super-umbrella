import Link from "next/link";
import { listLeads, type LeadRecord, leadStatuses, statusLabel } from "@/lib/lead-store";

type LeadsPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    archived?: string;
    sort?: string;
    error?: string;
  }>;
};

function statusTone(status: LeadRecord["status"]) {
  switch (status) {
    case "new":
      return "bg-sky-100 text-sky-800";
    case "contacted":
      return "bg-amber-100 text-amber-800";
    case "qualified":
      return "bg-violet-100 text-violet-800";
    case "proposal_sent":
      return "bg-orange-100 text-orange-800";
    case "won":
      return "bg-emerald-100 text-emerald-800";
    case "lost":
      return "bg-zinc-200 text-zinc-700";
  }
}

function countByStatus(records: LeadRecord[], status: LeadRecord["status"]) {
  return records.filter((record) => record.status === status).length;
}

export const dynamic = "force-dynamic";

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = (await searchParams) ?? {};
  const q = params.q ?? "";
  const status = params.status ?? "";
  const archived =
    params.archived === "only"
      ? "only"
      : params.archived === "include"
        ? "include"
        : "exclude";
  const sort = params.sort === "oldest" ? "oldest" : "newest";
  const error = params.error ?? "";

  const allVisibleLeads = await listLeads({ archived: "include", sort: "newest" });
  const leads = await listLeads({
    query: q,
    status,
    archived,
    sort,
  });

  const usingPostgres = Boolean(process.env.POSTGRES_URL);

  return (
    <div className="grid min-h-svh gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-black/6 bg-[#0f1824] p-5 text-white shadow-soft">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/55">
          Admin workspace
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Leads</h1>
        <p className="mt-4 text-sm leading-7 text-white/72">
          Internal intake review for new project inquiries. Built for scanning, not browsing.
        </p>

        <div className="mt-8 space-y-3">
          <StatCard label="Visible now" value={String(leads.length)} />
          <StatCard label="New" value={String(countByStatus(allVisibleLeads, "new"))} />
          <StatCard label="Qualified" value={String(countByStatus(allVisibleLeads, "qualified"))} />
          <StatCard label="Won" value={String(countByStatus(allVisibleLeads, "won"))} />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="font-semibold">Storage</p>
          <p className="mt-2 text-sm leading-7 text-white/68">
            {usingPostgres
              ? "Using Postgres because POSTGRES_URL is configured."
              : "Using local file fallback because POSTGRES_URL is missing."}
          </p>
        </div>
      </aside>

      <section className="rounded-[28px] border border-black/6 bg-white shadow-soft">
        <div className="border-b border-black/6 px-5 py-5 sm:px-6">
          {error === "missing-id" ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              Lead update failed because the record id was missing.
            </div>
          ) : null}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
                Intake operations
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">Recent inquiries</h2>
            </div>

            <form className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_180px_160px_150px_auto]">
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search name, email, company, or summary"
                className="h-12 rounded-2xl border border-black/8 bg-[#f7f5f1] px-4 text-sm outline-none focus:border-accent"
              />
              <select
                name="status"
                defaultValue={status}
                className="h-12 rounded-2xl border border-black/8 bg-[#f7f5f1] px-4 text-sm outline-none focus:border-accent"
              >
                <option value="">All statuses</option>
                {leadStatuses.map((option) => (
                  <option key={option} value={option}>
                    {statusLabel(option)}
                  </option>
                ))}
              </select>
              <select
                name="archived"
                defaultValue={archived}
                className="h-12 rounded-2xl border border-black/8 bg-[#f7f5f1] px-4 text-sm outline-none focus:border-accent"
              >
                <option value="exclude">Active only</option>
                <option value="include">Include archived</option>
                <option value="only">Archived only</option>
              </select>
              <select
                name="sort"
                defaultValue={sort}
                className="h-12 rounded-2xl border border-black/8 bg-[#f7f5f1] px-4 text-sm outline-none focus:border-accent"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
              >
                Apply
              </button>
            </form>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="grid min-h-[320px] place-items-center px-6 py-10">
            <div className="max-w-md text-center">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
                Empty state
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight">
                No leads match the current view.
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate">
                Try clearing the filters, or submit a new inquiry from the public site to create the
                first lead record.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.24em] text-slate">
                  <th className="border-b border-black/6 px-6 py-4 font-medium">Lead</th>
                  <th className="border-b border-black/6 px-6 py-4 font-medium">Summary</th>
                  <th className="border-b border-black/6 px-6 py-4 font-medium">Status</th>
                  <th className="border-b border-black/6 px-6 py-4 font-medium">Budget</th>
                  <th className="border-b border-black/6 px-6 py-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="align-top hover:bg-[#fbfaf7]">
                    <td className="border-b border-black/6 px-6 py-5">
                      <Link href={`/admin/leads/${lead.id}`} className="block">
                        <div className="text-sm font-semibold text-ink">{lead.name}</div>
                        <div className="mt-1 text-sm text-slate">{lead.email}</div>
                        <div className="mt-1 text-sm text-slate">
                          {lead.company || "No company provided"}
                        </div>
                      </Link>
                    </td>
                    <td className="border-b border-black/6 px-6 py-5">
                      <Link href={`/admin/leads/${lead.id}`} className="block">
                        <div className="max-w-xl text-sm leading-7 text-slate">
                          {lead.projectSummary.slice(0, 140)}
                          {lead.projectSummary.length > 140 ? "..." : ""}
                        </div>
                        <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate">
                          {lead.projectType} · {lead.timeline}
                        </div>
                      </Link>
                    </td>
                    <td className="border-b border-black/6 px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone(lead.status)}`}
                      >
                        {statusLabel(lead.status)}
                      </span>
                      {lead.archived ? (
                        <span className="ml-2 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                          Archived
                        </span>
                      ) : null}
                    </td>
                    <td className="border-b border-black/6 px-6 py-5 text-sm text-slate">
                      {lead.budget}
                    </td>
                    <td className="border-b border-black/6 px-6 py-5 text-sm text-slate">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">{value}</p>
    </div>
  );
}
