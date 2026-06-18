const walkthroughItems = [
  {
    title: "Dashboard",
    caption: "See revenue movement, active work, delivery risk, and next actions in one operating view.",
    variant: "dashboard" as const,
  },
  {
    title: "Workspace",
    caption: "Give clients a clear workspace for status, milestones, updates, and what happens next.",
    variant: "workspace" as const,
  },
  {
    title: "AI Assistant",
    caption: "Use AI where it reduces handoff drag, summarizes context, and surfaces action.",
    variant: "assistant" as const,
  },
  {
    title: "Reporting",
    caption: "Turn operational activity into readable reporting instead of scattered status chasing.",
    variant: "reporting" as const,
  },
  {
    title: "Administration",
    caption: "Manage leads, access, routing, and internal follow-through from one control surface.",
    variant: "admin" as const,
  },
];

export function PlatformWalkthrough() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {walkthroughItems.map((item, index) => (
        <article
          key={item.title}
          className={`overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-soft ${
            index === 0 ? "lg:col-span-2" : ""
          }`}
        >
          <PreviewFrame variant={item.variant} featured={index === 0} />
          <div className="px-5 py-5 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">{item.title}</h3>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate">{item.caption}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function PreviewFrame({
  variant,
  featured = false,
}: {
  variant: "dashboard" | "workspace" | "assistant" | "reporting" | "admin";
  featured?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#0e1825] ${
        featured ? "min-h-[360px]" : "min-h-[280px]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,107,61,0.22),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
        <div className="rounded-[24px] border border-white/10 bg-[#101b2a] shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 text-[11px] text-white/50">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </div>
            <div className="w-40 rounded-full bg-white/6 px-4 py-1 text-center text-white/40">
              itsala.app
            </div>
            <div className="w-16" />
          </div>

          <div className={`${featured ? "grid lg:grid-cols-[220px_minmax(0,1fr)]" : "grid grid-cols-[160px_minmax(0,1fr)]"}`}>
            <aside className="border-r border-white/8 bg-[#0c1522] p-4">
              <div className="text-sm font-semibold tracking-[0.2em] text-white">ITSALA</div>
              <div className="mt-5 space-y-3">
                {["Overview", "Leads", "Clients", "Workflows", "Reporting", "Settings"].map((item, index) => (
                  <div
                    key={item}
                    className={`rounded-xl px-3 py-2 text-xs ${
                      index === 0 ? "bg-white/10 text-white" : "text-white/50"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>

            <div className="p-4 sm:p-5">
              {variant === "dashboard" ? <DashboardPreview /> : null}
              {variant === "workspace" ? <WorkspacePreview /> : null}
              {variant === "assistant" ? <AssistantPreview /> : null}
              {variant === "reporting" ? <ReportingPreview /> : null}
              {variant === "admin" ? <AdminPreview /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {["Pipeline", "Active work", "Utilization", "At risk"].map((item, index) => (
          <div key={item} className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className="text-xs text-white/50">{item}</div>
            <div className="mt-3 text-3xl font-semibold text-white">{["24", "38", "78%", "7"][index]}</div>
            <div className="mt-3 h-10 rounded-xl bg-[linear-gradient(90deg,rgba(78,140,255,0.14),rgba(78,140,255,0.02))]" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">Revenue and delivery view</div>
            <div className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/50">Live</div>
          </div>
          <div className="mt-4 grid gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-[1.3fr_0.8fr_0.5fr] gap-3 rounded-xl bg-black/10 px-3 py-2">
                <div className="h-3 rounded-full bg-white/15" />
                <div className="h-3 rounded-full bg-white/10" />
                <div className="h-3 rounded-full bg-[#ca6b3d]/50" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <div className="text-sm font-semibold text-white">Next actions</div>
          <div className="mt-4 space-y-3">
            {["Follow up with qualified lead", "Resolve delayed client input", "Review proposal risk"].map((item) => (
              <div key={item} className="rounded-xl bg-black/12 px-3 py-3 text-sm text-white/78">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspacePreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">Northbridge engagement</div>
          <div className="mt-2 text-xs uppercase tracking-[0.2em] text-emerald-300">On track</div>
        </div>
        <div className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/60">Client workspace</div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-white/50">Current focus</div>
          <div className="mt-3 h-3 w-3/4 rounded-full bg-white/20" />
          <div className="mt-2 h-3 w-full rounded-full bg-white/10" />
          <div className="mt-2 h-3 w-5/6 rounded-full bg-white/10" />
          <div className="mt-6 text-xs uppercase tracking-[0.2em] text-white/50">Milestones</div>
          <div className="mt-3 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="grid grid-cols-[110px_1fr] gap-3">
                <div className="h-3 rounded-full bg-[#ca6b3d]/50" />
                <div className="h-3 rounded-full bg-white/14" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-white/50">Updates and resources</div>
          <div className="mt-3 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-xl bg-black/12 px-3 py-3">
                <div className="h-3 w-2/3 rounded-full bg-white/18" />
                <div className="mt-2 h-3 w-full rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AssistantPreview() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
        <div className="text-sm font-semibold text-white">Operational summary</div>
        <div className="mt-4 rounded-2xl bg-black/12 p-4">
          <div className="h-3 w-1/2 rounded-full bg-white/18" />
          <div className="mt-3 h-3 w-full rounded-full bg-white/12" />
          <div className="mt-2 h-3 w-11/12 rounded-full bg-white/10" />
          <div className="mt-2 h-3 w-4/5 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
        <div className="text-sm font-semibold text-white">Recommended actions</div>
        <div className="mt-4 space-y-3">
          {["Summarize account context", "Flag stalled proposal", "Route delivery risk"].map((item) => (
            <div key={item} className="rounded-xl bg-black/12 px-3 py-3 text-sm text-white/78">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportingPreview() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <div className="text-sm font-semibold text-white">Revenue trend</div>
          <div className="mt-4 h-36 rounded-2xl bg-[linear-gradient(180deg,rgba(202,107,61,0.2),rgba(202,107,61,0.02))]" />
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <div className="text-sm font-semibold text-white">Delivery health</div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {["76%", "12", "4"].map((item) => (
              <div key={item} className="rounded-xl bg-black/12 px-3 py-5 text-center text-2xl font-semibold text-white">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
        <div className="text-sm font-semibold text-white">Reporting breakdown</div>
        <div className="mt-4 grid gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid grid-cols-[1fr_80px] gap-3">
              <div className="h-3 rounded-full bg-white/12" />
              <div className="h-3 rounded-full bg-[#ca6b3d]/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminPreview() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-white">Lead administration</div>
          <div className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/50">Protected</div>
        </div>
        <div className="mt-4 grid gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-[1fr_110px_90px] gap-3 rounded-xl bg-black/12 px-3 py-3">
              <div className="h-3 rounded-full bg-white/15" />
              <div className="h-3 rounded-full bg-white/10" />
              <div className="h-3 rounded-full bg-[#ca6b3d]/50" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <div className="text-sm font-semibold text-white">Access control</div>
          <div className="mt-3 space-y-2">
            {["Admin", "Client", "Operator"].map((item) => (
              <div key={item} className="rounded-xl bg-black/12 px-3 py-3 text-sm text-white/78">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <div className="text-sm font-semibold text-white">Audit visibility</div>
          <div className="mt-3 space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-xl bg-black/12 px-3 py-3">
                <div className="h-3 w-2/3 rounded-full bg-white/15" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
