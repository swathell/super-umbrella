import Link from "next/link";
import { listWorkspaceSummaries, workspaceStatusLabel } from "@/lib/workspace-store";

function workspaceTone(status: ReturnType<typeof workspaceStatusLabel>) {
  switch (status) {
    case "Planned":
      return "bg-zinc-100 text-zinc-700";
    case "Active":
      return "bg-emerald-100 text-emerald-800";
    case "In review":
      return "bg-amber-100 text-amber-800";
    case "Completed":
      return "bg-sky-100 text-sky-800";
    case "Paused":
      return "bg-rose-100 text-rose-800";
  }
}

export const dynamic = "force-dynamic";

export default async function WorkspacesIndexPage() {
  const workspaces = await listWorkspaceSummaries();

  return (
    <div className="rounded-[28px] border border-black/6 bg-white shadow-soft">
      <div className="border-b border-black/6 px-5 py-5 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
          Delivery workspaces
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Client workspaces</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate">
          This is the small delivery layer linked to converted leads. Each workspace is a client-facing status room, not a full project-management system.
        </p>
      </div>

      {workspaces.length === 0 ? (
        <div className="grid min-h-[320px] place-items-center px-6 py-10">
          <div className="max-w-md text-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">Empty state</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">No client workspaces yet.</h2>
            <p className="mt-3 text-sm leading-7 text-slate">
              Create a workspace from an active lead when a project moves into delivery.
            </p>
            <Link
              href="/admin/leads"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
            >
              Open leads
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.24em] text-slate">
                <th className="border-b border-black/6 px-6 py-4 font-medium">Workspace</th>
                <th className="border-b border-black/6 px-6 py-4 font-medium">Client</th>
                <th className="border-b border-black/6 px-6 py-4 font-medium">Status</th>
                <th className="border-b border-black/6 px-6 py-4 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {workspaces.map((workspace) => {
                const status = workspaceStatusLabel(workspace.status);
                return (
                  <tr key={workspace.id} className="align-top hover:bg-[#fbfaf7]">
                    <td className="border-b border-black/6 px-6 py-5">
                      <Link href={`/admin/workspaces/${workspace.id}`} className="block">
                        <div className="text-sm font-semibold text-ink">{workspace.title}</div>
                        <div className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-slate">
                          /client/{workspace.slug}
                        </div>
                      </Link>
                    </td>
                    <td className="border-b border-black/6 px-6 py-5 text-sm text-slate">
                      {workspace.clientName}
                      {workspace.company ? ` · ${workspace.company}` : ""}
                    </td>
                    <td className="border-b border-black/6 px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${workspaceTone(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="border-b border-black/6 px-6 py-5 text-sm text-slate">
                      {new Date(workspace.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
