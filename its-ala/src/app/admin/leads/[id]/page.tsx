import Link from "next/link";
import { notFound } from "next/navigation";
import { updateLeadAction } from "@/app/admin/actions";
import { getLeadById, leadStatuses, type LeadRecord } from "@/lib/lead-store";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
};

function statusLabel(status: LeadRecord["status"]) {
  switch (status) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "qualified":
      return "Qualified";
    case "proposal-sent":
      return "Proposal sent";
    case "won":
      return "Won";
    case "lost":
      return "Lost";
  }
}

function statusTone(status: LeadRecord["status"]) {
  switch (status) {
    case "new":
      return "bg-sky-100 text-sky-800";
    case "contacted":
      return "bg-amber-100 text-amber-800";
    case "qualified":
      return "bg-violet-100 text-violet-800";
    case "proposal-sent":
      return "bg-orange-100 text-orange-800";
    case "won":
      return "bg-emerald-100 text-emerald-800";
    case "lost":
      return "bg-zinc-200 text-zinc-700";
  }
}

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
  searchParams,
}: LeadDetailPageProps) {
  const { id } = await params;
  const query = (await searchParams) ?? {};
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="grid min-h-svh gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
      <section className="rounded-[28px] border border-black/6 bg-white shadow-soft">
        <div className="border-b border-black/6 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Link href="/admin/leads" className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
                Back to leads
              </Link>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{lead.name}</h1>
              <p className="mt-2 text-sm text-slate">
                {lead.company || "No company provided"} · {lead.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone(lead.status)}`}
              >
                {statusLabel(lead.status)}
              </span>
              {lead.archived ? (
                <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                  Archived
                </span>
              ) : null}
            </div>
          </div>
          {query.saved === "1" ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Lead updated successfully.
            </div>
          ) : null}
        </div>

        <div className="grid gap-8 px-5 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <SectionLabel>Project summary</SectionLabel>
            <div className="mt-3 rounded-[24px] bg-[#f7f5f1] p-5 text-sm leading-8 text-ink">
              {lead.projectSummary}
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <InfoBlock label="Project type" value={lead.projectType} />
              <InfoBlock label="Timeline" value={lead.timeline} />
              <InfoBlock label="Budget" value={lead.budget} />
              <InfoBlock label="Source" value={lead.source} />
              <InfoBlock label="Created" value={new Date(lead.createdAt).toLocaleString()} />
              <InfoBlock label="Lead ID" value={lead.id} mono />
            </div>
          </div>

          <aside className="rounded-[24px] border border-black/6 bg-[#fbfaf7] p-5">
            <SectionLabel>Operator notes</SectionLabel>
            <p className="mt-3 text-sm leading-7 text-slate">
              Use this record to track qualification, decision state, and any context that should stay internal.
            </p>
            <div className="mt-6 rounded-2xl bg-white p-4 text-sm leading-7 text-slate">
              {lead.notes || "No internal notes yet."}
            </div>
          </aside>
        </div>
      </section>

      <aside className="rounded-[28px] border border-black/6 bg-[#0f1824] p-5 text-white shadow-soft">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/55">
          Update lead
        </p>
        <form action={updateLeadAction} className="mt-5 space-y-5">
          <input type="hidden" name="id" value={lead.id} />

          <div>
            <label htmlFor="status" className="text-sm font-semibold text-white">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={lead.status}
              className="mt-2 h-12 w-full rounded-2xl border border-white/12 bg-white/6 px-4 text-sm text-white outline-none"
            >
              {leadStatuses.map((status) => (
                <option key={status} value={status} className="text-ink">
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="text-sm font-semibold text-white">
              Internal notes
            </label>
            <textarea
              id="notes"
              name="notes"
              defaultValue={lead.notes}
              className="mt-2 min-h-56 w-full rounded-[24px] border border-white/12 bg-white/6 px-4 py-3 text-sm leading-7 text-white outline-none"
              placeholder="Qualification notes, context, next step, proposal details, or anything the operator should retain."
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/78">
            <input
              type="checkbox"
              name="archived"
              defaultChecked={lead.archived}
              className="size-4 rounded border-white/30"
            />
            Mark this lead as archived
          </label>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-ink"
          >
            Save lead update
          </button>
        </form>
      </aside>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">{children}</p>;
}

function InfoBlock({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="border-t border-black/6 pt-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate">{label}</p>
      <p className={`mt-2 text-sm leading-7 text-ink ${mono ? "font-mono text-xs break-all" : ""}`}>
        {value}
      </p>
    </div>
  );
}
