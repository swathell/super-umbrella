import type { Metadata } from "next";
import { logoutAction } from "@/app/admin/login/actions";
import { getStorageMode } from "@/lib/lead-store";

export const metadata: Metadata = {
  title: "Admin | Its Ala",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storageMode = getStorageMode();
  const authConfigured =
    Boolean(process.env.ADMIN_PASSWORD) && Boolean(process.env.ADMIN_SESSION_SECRET);

  return (
    <div className="min-h-svh bg-[#f3f1ec] text-ink">
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 rounded-[24px] border border-black/6 bg-white px-4 py-3 text-sm text-slate shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <nav className="mr-2 flex flex-wrap items-center gap-2">
              <a href="/admin/leads" className="rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
                Leads
              </a>
              <a href="/admin/workspaces" className="rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
                Workspaces
              </a>
              <a href="/admin/upstream" className="rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
                Upstream
              </a>
            </nav>
            <span className="font-semibold text-ink">Admin system status</span>
            <span className="rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Storage: {storageMode === "postgres" ? "Postgres" : "Local fallback"}
            </span>
            <span className="rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Email: {process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL ? "Configured" : "Needs config"}
            </span>
            <span className="rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Admin auth: {authConfigured ? "Configured" : "Needs config"}
            </span>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-full border border-black/8 px-4 text-sm font-semibold text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
        {children}
      </div>
    </div>
  );
}
