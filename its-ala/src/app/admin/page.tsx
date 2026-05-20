import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-[70vh] bg-night px-6 py-24 text-sand">
      <div className="mx-auto max-w-4xl space-y-8">
        <p className="eyebrow text-sand/65">Admin foundation</p>
        <h1 className="text-5xl font-extrabold tracking-tight">Internal workspace starts here.</h1>
        <p className="max-w-2xl text-lg leading-8 text-sand/80">
          This route is reserved for the next phase: lead review, project triage, notes, statuses, and the operating layer behind the public site.
        </p>
        <Link href="/contact" className="inline-flex rounded-full bg-sand px-6 py-3 font-semibold text-ink">
          Test the intake flow
        </Link>
      </div>
    </main>
  );
}
