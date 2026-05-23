import { clientLoginAction } from "@/app/client/[slug]/login/actions";
import { isClientAuthConfigured, shouldBypassClientAuth } from "@/lib/client-auth";
import { getWorkspaceBySlug } from "@/lib/workspace-store";

type ClientLoginPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export const dynamic = "force-dynamic";

export default async function ClientLoginPage({
  params,
  searchParams,
}: ClientLoginPageProps) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace || !workspace.isActive) {
    return (
      <div className="grid min-h-svh place-items-center bg-[#f3f1ec] px-4">
        <div className="max-w-md rounded-[28px] border border-black/6 bg-white p-6 text-center shadow-soft">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">Workspace unavailable</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">This client workspace is not active.</h1>
          <p className="mt-3 text-sm leading-7 text-slate">
            If you expected access here, contact the project operator directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-svh place-items-center bg-[#f3f1ec] px-4">
      <div className="w-full max-w-md rounded-[28px] border border-black/6 bg-white p-6 shadow-soft">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">Client workspace</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{workspace.title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate">
          Enter the workspace access code to view project status, milestones, updates, and shared links.
        </p>
        {!isClientAuthConfigured() && shouldBypassClientAuth() ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Client session signing is not configured in this local environment. Access code validation still works.
          </div>
        ) : null}
        {query.error === "invalid" ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            The access code was not valid for this workspace.
          </div>
        ) : null}
        <form action={clientLoginAction} className="mt-6 space-y-4">
          <input type="hidden" name="slug" value={slug} />
          <div>
            <label htmlFor="accessCode" className="text-sm font-medium text-ink">
              Access code
            </label>
            <input
              id="accessCode"
              name="accessCode"
              className="mt-2 h-12 w-full rounded-2xl border border-black/8 bg-[#f7f5f1] px-4 text-sm uppercase tracking-[0.16em] outline-none focus:border-accent"
              placeholder="Enter code"
            />
          </div>
          <button type="submit" className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
            Open workspace
          </button>
        </form>
      </div>
    </div>
  );
}
