import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-[70vh] bg-night px-6 py-24 text-sand">
      <div className="mx-auto max-w-4xl space-y-8">
        <p className="eyebrow text-sand/65">Admin foundation</p>
        <h1 className="text-5xl font-extrabold tracking-tight">Internal workspace starts here.</h1>
        <p className="max-w-2xl text-lg leading-8 text-sand/80">
          The first internal layer is now in place. The next phase is adding authentication, editable statuses, notes, and the rest of the operating system behind the public site.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/admin/leads" className="inline-flex rounded-full bg-sand px-6 py-3 font-semibold text-ink">
            Open leads
          </Link>
          <Link href="/contact" className="inline-flex rounded-full border border-white/20 px-6 py-3 font-semibold text-sand">
            Test the intake flow
          </Link>
        </div>
      </div>
    </main>
  );
}
