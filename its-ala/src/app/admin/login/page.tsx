import { loginAction } from "@/app/admin/login/actions";
import { isAdminAuthConfigured, shouldBypassAdminAuth } from "@/lib/admin-auth";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
    message?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const next = params.next || "/admin/leads";
  const configured = isAdminAuthConfigured();
  const bypass = shouldBypassAdminAuth();

  return (
    <div className="grid min-h-svh place-items-center bg-[#f3f1ec] px-4">
      <div className="w-full max-w-md rounded-[28px] border border-black/6 bg-white p-6 shadow-soft">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
          Admin access
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Sign in to the leads workspace</h1>
        <p className="mt-3 text-sm leading-7 text-slate">
          This simple password gate protects the internal admin surface without adding a larger auth stack yet.
        </p>

        {!configured ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Admin auth is not configured. Set <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code>.
            {bypass ? " Local development is currently allowed without auth." : ""}
          </div>
        ) : null}

        {params.error === "invalid" ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            Incorrect admin password.
          </div>
        ) : null}

        {params.error === "config" ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            Admin protection is not configured correctly for this environment.
          </div>
        ) : null}

        {params.message === "logged-out" ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            You have been signed out.
          </div>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-5">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-ink">
              Admin password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="mt-2 h-12 w-full rounded-2xl border border-black/8 bg-[#f7f5f1] px-4 text-sm outline-none focus:border-accent"
              placeholder="Enter admin password"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-semibold text-white"
          >
            Open admin
          </button>
        </form>
      </div>
    </div>
  );
}
