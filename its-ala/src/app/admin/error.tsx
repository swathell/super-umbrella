"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[60svh] place-items-center">
      <div className="max-w-lg rounded-3xl border border-red-200 bg-white p-6 shadow-soft">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-red-700">
          Admin error
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          The leads workspace could not load.
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate">
          {error.message || "Something went wrong while loading this workspace."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
