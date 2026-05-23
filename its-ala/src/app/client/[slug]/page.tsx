import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getClientCookieName, readClientSessionValue, shouldBypassClientAuth } from "@/lib/client-auth";
import { getWorkspaceBySlug, workspaceStatusLabel } from "@/lib/workspace-store";

type ClientWorkspacePageProps = {
  params: Promise<{ slug: string }>;
};

function statusTone(status: ReturnType<typeof workspaceStatusLabel>) {
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

export default async function ClientWorkspacePage({ params }: ClientWorkspacePageProps) {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace || !workspace.isActive) {
    redirect(`/client/${slug}/login`);
  }

  if (!shouldBypassClientAuth()) {
    const cookieStore = await cookies();
    const session = await readClientSessionValue(
      cookieStore.get(`${getClientCookieName()}_${workspace.id}`)?.value,
    );

    if (!session || session.workspaceId !== workspace.id || session.slug !== workspace.slug) {
      redirect(`/client/${slug}/login`);
    }
  }

  const status = workspaceStatusLabel(workspace.status);

  return (
    <main className="min-h-svh bg-[#f3f1ec] text-ink">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-black/6 bg-white p-6 shadow-soft">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">Client workspace</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight">{workspace.title}</h1>
              <p className="mt-4 text-base leading-8 text-slate">{workspace.overview}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone(status)}`}>
                {status}
              </span>
              <span className="inline-flex rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold text-slate">
                Updated {new Date(workspace.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_320px]">
          <section className="space-y-6">
            <Band title="What is happening now">
              <p className="text-sm leading-7 text-ink">{workspace.currentFocus}</p>
            </Band>

            <Band title="What happens next">
              <p className="text-sm leading-7 text-ink">{workspace.nextStep}</p>
            </Band>

            <Band title="Milestones">
              <div className="space-y-3">
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
            </Band>

            <Band title="Progress log">
              <div className="space-y-3">
                {workspace.updates.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-black/6 bg-[#fbfaf7] px-4 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink">{entry.title}</p>
                        <p className="mt-1 text-sm leading-7 text-slate">{entry.body}</p>
                      </div>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Band>

            <Band title="Shared links">
              {workspace.resources.length === 0 ? (
                <p className="text-sm leading-7 text-slate">No links are shared here yet.</p>
              ) : (
                <div className="space-y-3">
                  {workspace.resources.map((resource) => (
                    <div key={resource.id} className="rounded-2xl border border-black/6 bg-[#fbfaf7] px-4 py-4">
                      <a href={resource.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-ink underline-offset-4 hover:underline">
                        {resource.label}
                      </a>
                      <p className="mt-1 text-sm leading-7 text-slate">{resource.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </Band>
          </section>

          <aside className="space-y-6">
            <Band title="Workspace guide">
              <p className="text-sm leading-7 text-slate">{workspace.communicationGuidance}</p>
            </Band>

            <Band title="Contact">
              <p className="text-sm text-ink">{workspace.contactEmail}</p>
              <p className="mt-2 text-sm leading-7 text-slate">
                Use direct contact for scope shifts, approvals, or anything sensitive. Use this workspace for visibility and continuity.
              </p>
            </Band>

            <Band title="Quick orientation">
              <ul className="space-y-2 text-sm leading-7 text-slate">
                <li>Current focus tells you what is being worked on right now.</li>
                <li>Next step shows the most important near-term move.</li>
                <li>Progress log captures meaningful project movement without turning into chat.</li>
              </ul>
            </Band>

            <div className="rounded-[24px] border border-black/6 bg-white p-4 text-sm text-slate shadow-soft">
              <Link href={`/client/${workspace.slug}/login`} className="font-semibold text-ink underline-offset-4 hover:underline">
                Return to access screen
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Band({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-black/6 bg-white p-5 shadow-soft">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}
