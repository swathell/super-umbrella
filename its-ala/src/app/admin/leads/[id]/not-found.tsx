import Link from "next/link";

export default function LeadNotFound() {
  return (
    <div className="grid min-h-[60svh] place-items-center">
      <div className="max-w-md rounded-3xl border border-black/6 bg-white p-6 text-center shadow-soft">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
          Lead not found
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          That lead record does not exist.
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate">
          It may have been removed, never created in this environment, or the link may be incomplete.
        </p>
        <Link
          href="/admin/leads"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
        >
          Back to leads
        </Link>
      </div>
    </div>
  );
}
