import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addWorkspaceMilestoneAction,
  addWorkspaceResourceAction,
  addWorkspaceUpdateAction,
  updateWorkspaceBaseAction,
} from "@/app/admin/workspaces/actions";
import { getLeadById, statusLabel } from "@/lib/lead-store";
import {
  getWorkspaceById,
  workspaceStatusLabel,
  workspaceStatuses,
} from "@/lib/workspace-store";

type WorkspaceAdminPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    created?: string;
    saved?: string;
    milestone?: string;
    update?: string;
    resource?: string;
  }>;
};

function workspaceTone(status: (typeof workspaceStatuses)[number]) {
  switch (status) {
    case "planned":
      return "bg-zinc-100 text-zinc-700";
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "review":
      return "bg-amber-100 text-amber-800";
    case "completed":
      return "bg-sky-100 text-sky-800";
    case "paused":
      return "bg-rose-100 text-rose-800";
  }
}

export const dynamic = "force-dynamic";

export default async function WorkspaceAdminPage({
  params,
  searchParams,
}: WorkspaceAdminPageProps) {
  const { id } = await params;
  const query = (await searchParams) ?? {};
  const workspace = await getWorkspaceById(id);
  if (!workspace) {
    notFound();
  }
  const lead = await getLeadById(workspace.leadId);
  const clientUrl = `/client/${workspace.slug}`;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
      <section className="rounded-[28px] border border-black/6 bg-white shadow-soft">
        <div className="border-b border-black/6 px-5 py-5 sm:px-6">
          <Link href={`/admin/leads/${workspace.leadId}`} className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
            Back to lead
          </Link>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{workspace.title}</h1>
              <p className="mt-2 text-sm text-slate">
                {workspace.clientName} · {workspace.company || "Client workspace"} · {workspace.clientEmail}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${workspaceTone(workspace.status)}`}>
                {workspaceStatusLabel(workspace.status)}
              </span>
              <span className="inline-flex rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold text-slate">
                {workspace.isActive ? "Client access enabled" : "Client access paused"}
              </span>
            </div>
          </div>
          {query.created === "1" || query.saved === "1" || query.milestone === "1" || query.update === "1" || query.resource === "1" ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Workspace saved successfully.
            </div>
          ) : null}
        </div>

        <div className="grid gap-8 px-5 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-8">
            <div>
              <SectionLabel>Overview</SectionLabel>
              <div className="mt-3 rounded-[24px] bg-[#f7f5f1] p-5 text-sm leading-8 text-ink">
                {workspace.overview}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <InfoBlock label="Current focus" value={workspace.currentFocus} />
              <InfoBlock label="Next step" value={workspace.nextStep} />
              <InfoBlock label="Client contact" value={workspace.contactEmail} />
              <InfoBlock label="Workspace link" value={clientUrl} mono />
              <InfoBlock label="Access code" value={workspace.accessCode} mono />
              <InfoBlock label="Linked lead status" value={lead ? statusLabel(lead.status) : "Lead unavailable"} />
            </div>

            <div>
              <SectionLabel>Milestones</SectionLabel>
              <div className="mt-4 space-y-3">
                {workspace.milestones.map((milestone) => (
                  <div key={milestone.id} className="rounded-2xl border border-black/6 bg-[#fbfaf7] px-4 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink">{milestone.title}</p>
                        <p className="mt-1 text-sm leading-7 text-slate">{milestone.detail}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate">
                          {milestone.status}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate">
                          {milestone.dueLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Updates</SectionLabel>
              <div className="mt-4 space-y-3">
                {workspace.updates.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-black/6 bg-[#fbfaf7] px-4 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink">{entry.title}</p>
                        <p className="mt-1 text-sm leading-7 text-slate">{entry.body}</p>
                      </div>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Resources</SectionLabel>
              <div className="mt-4 space-y-3">
                {workspace.resources.length === 0 ? (
                  <div className="rounded-2xl border border-black/6 bg-[#fbfaf7] px-4 py-3 text-sm text-slate">
                    No shared links yet.
                  </div>
                ) : (
                  workspace.resources.map((resource) => (
                    <div key={resource.id} className="rounded-2xl border border-black/6 bg-[#fbfaf7] px-4 py-4">
                      <a href={resource.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-ink underline-offset-4 hover:underline">
                        {resource.label}
                      </a>
                      <p className="mt-1 text-sm leading-7 text-slate">{resource.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <Panel title="Share with client">
              <p className="text-sm leading-7 text-slate">
                Send the workspace link and access code separately if you want a cleaner handoff.
              </p>
              <div className="mt-4 rounded-2xl bg-[#f7f5f1] p-4 text-sm text-ink">
                <p><strong>Link:</strong> {clientUrl}</p>
                <p className="mt-2"><strong>Code:</strong> {workspace.accessCode}</p>
              </div>
            </Panel>

            <Panel title="Edit workspace">
              <form action={updateWorkspaceBaseAction} className="space-y-4">
                <input type="hidden" name="workspaceId" value={workspace.id} />
                <TextField name="title" label="Title" defaultValue={workspace.title} />
                <SelectField name="status" label="Status" defaultValue={workspace.status}>
                  {workspaceStatuses.map((status) => (
                    <option key={status} value={status}>
                      {workspaceStatusLabel(status)}
                    </option>
                  ))}
                </SelectField>
                <TextAreaField name="overview" label="Overview" defaultValue={workspace.overview} rows={5} />
                <TextAreaField name="currentFocus" label="Current focus" defaultValue={workspace.currentFocus} rows={3} />
                <TextAreaField name="nextStep" label="Next step" defaultValue={workspace.nextStep} rows={3} />
                <TextAreaField
                  name="communicationGuidance"
                  label="Communication guidance"
                  defaultValue={workspace.communicationGuidance}
                  rows={4}
                />
                <TextField name="contactEmail" label="Contact email" defaultValue={workspace.contactEmail} />
                <label className="flex items-center gap-3 rounded-2xl border border-black/6 bg-[#f7f5f1] px-4 py-3 text-sm text-slate">
                  <input type="checkbox" name="isActive" defaultChecked={workspace.isActive} />
                  Client access enabled
                </label>
                <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                  Save workspace
                </button>
              </form>
            </Panel>

            <Panel title="Add milestone">
              <form action={addWorkspaceMilestoneAction} className="space-y-4">
                <input type="hidden" name="workspaceId" value={workspace.id} />
                <TextField name="title" label="Milestone title" />
                <SelectField name="status" label="Milestone state" defaultValue="upcoming">
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="done">Done</option>
                </SelectField>
                <TextField name="dueLabel" label="Timing label" placeholder="Next, Week 2, Final" />
                <TextAreaField name="detail" label="Detail" rows={4} />
                <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-full border border-black/8 text-sm font-semibold text-ink">
                  Add milestone
                </button>
              </form>
            </Panel>

            <Panel title="Post update">
              <form action={addWorkspaceUpdateAction} className="space-y-4">
                <input type="hidden" name="workspaceId" value={workspace.id} />
                <TextField name="title" label="Update title" />
                <TextAreaField name="body" label="Update body" rows={5} />
                <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-full border border-black/8 text-sm font-semibold text-ink">
                  Add update
                </button>
              </form>
            </Panel>

            <Panel title="Share resource">
              <form action={addWorkspaceResourceAction} className="space-y-4">
                <input type="hidden" name="workspaceId" value={workspace.id} />
                <TextField name="label" label="Resource label" />
                <TextField name="url" label="URL" placeholder="https://..." />
                <TextAreaField name="description" label="Description" rows={3} />
                <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-full border border-black/8 text-sm font-semibold text-ink">
                  Add resource
                </button>
              </form>
            </Panel>
          </aside>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">{children}</p>;
}

function InfoBlock({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border-t border-black/6 pt-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate">{label}</p>
      <p className={`mt-2 text-sm leading-7 text-ink ${mono ? "font-mono text-xs break-all" : ""}`}>{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-black/6 bg-white p-4 shadow-soft">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-2xl border border-black/8 bg-[#f7f5f1] px-4 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  children,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 h-11 w-full rounded-2xl border border-black/8 bg-[#f7f5f1] px-4 text-sm outline-none focus:border-accent"
      >
        {children}
      </select>
    </div>
  );
}

function TextAreaField({
  name,
  label,
  defaultValue,
  rows,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="mt-2 w-full rounded-[20px] border border-black/8 bg-[#f7f5f1] px-4 py-3 text-sm leading-7 outline-none focus:border-accent"
      />
    </div>
  );
}
