import {
  captureSignalAction,
  createBriefingAction,
  updateBriefingAction,
  updateSignalAction,
} from "@/app/admin/upstream/actions";
import {
  briefingStatusLabel,
  briefingStatuses,
  computeUpstreamMetrics,
  readUpstreamState,
  signalStageLabel,
  signalStages,
  type Briefing,
  type Organization,
  type Signal,
} from "@/lib/upstream-store";

type UpstreamPageProps = {
  searchParams?: Promise<{
    module?: string;
    signal?: string;
    organization?: string;
    briefing?: string;
    captured?: string;
    saved?: string;
    promoted?: string;
    error?: string;
  }>;
};

function signalStageTone(stage: Signal["stage"]) {
  switch (stage) {
    case "captured":
      return "bg-zinc-100 text-zinc-700";
    case "triaged":
      return "bg-sky-100 text-sky-800";
    case "watch":
      return "bg-indigo-100 text-indigo-800";
    case "ready":
      return "bg-emerald-100 text-emerald-800";
    case "routed":
      return "bg-amber-100 text-amber-800";
    case "won":
      return "bg-teal-100 text-teal-800";
    case "discarded":
      return "bg-rose-100 text-rose-800";
  }
}

function briefingTone(status: Briefing["status"]) {
  switch (status) {
    case "draft":
      return "bg-zinc-100 text-zinc-700";
    case "ready":
      return "bg-sky-100 text-sky-800";
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "closed":
      return "bg-amber-100 text-amber-800";
  }
}

function orgTone(status: Organization["status"]) {
  switch (status) {
    case "watch":
      return "bg-zinc-100 text-zinc-700";
    case "action_range":
      return "bg-emerald-100 text-emerald-800";
    case "engaged":
      return "bg-amber-100 text-amber-800";
  }
}

export const dynamic = "force-dynamic";

export default async function UpstreamPage({ searchParams }: UpstreamPageProps) {
  const query = (await searchParams) ?? {};
  const module = query.module || "signals";
  const state = await readUpstreamState();
  const metrics = computeUpstreamMetrics(state);

  const selectedSignal =
    state.signals.find((signal) => signal.id === query.signal) ?? state.signals[0] ?? null;
  const selectedOrganization =
    state.organizations.find((org) => org.id === query.organization) ??
    (selectedSignal
      ? state.organizations.find((org) => org.id === selectedSignal.organizationId)
      : state.organizations[0] ?? null);
  const selectedBriefing =
    state.briefings.find((briefing) => briefing.id === query.briefing) ??
    (selectedSignal?.briefingId
      ? state.briefings.find((briefing) => briefing.id === selectedSignal.briefingId)
      : state.briefings[0] ?? null);

  const linkedSignalsForOrganization = selectedOrganization
    ? state.signals.filter((signal) => signal.organizationId === selectedOrganization.id)
    : [];

  return (
    <div className="grid min-h-svh gap-6 lg:grid-cols-[280px_minmax(0,1.2fr)_360px]">
      <aside className="rounded-[28px] border border-black/6 bg-[#0f1824] p-5 text-white shadow-soft">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/55">
          Operational intelligence
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Upstream</h1>
        <p className="mt-4 text-sm leading-7 text-white/72">
          Detect friction before demand, reconstruct context fast, and route the next conversation with precision.
        </p>

        <nav className="mt-8 space-y-2">
          {[
            ["signals", "Signal stream"],
            ["organizations", "Organizations"],
            ["workflows", "Workflows"],
            ["briefings", "Briefings"],
          ].map(([key, label]) => (
            <a
              key={key}
              href={`/admin/upstream?module=${key}`}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold ${
                module === key ? "bg-white text-ink" : "bg-white/5 text-white/78"
              }`}
            >
              <span>{label}</span>
              <span className="font-mono text-xs uppercase tracking-[0.18em]">
                {key === "signals"
                  ? state.signals.length
                  : key === "organizations"
                    ? state.organizations.length
                    : key === "workflows"
                      ? signalStages.length
                      : state.briefings.length}
              </span>
            </a>
          ))}
        </nav>

        <div className="mt-8 space-y-3">
          <MetricCard label="High-confidence signals" value={String(metrics.readySignals)} />
          <MetricCard label="Action-range organizations" value={String(metrics.actionRangeOrgs)} />
          <MetricCard label="Trust-ready briefs" value={String(metrics.readyBriefings)} />
        </div>

        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-4">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/55">
            Operating lens
          </p>
          <div className="mt-4 space-y-3 text-sm text-white/78">
            <p>Friction before demand</p>
            <p>Context before pitch</p>
            <p>Trust before proposal</p>
          </div>
        </div>
      </aside>

      <section className="rounded-[28px] border border-black/6 bg-white shadow-soft">
        <div className="border-b border-black/6 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">
                Current workspace
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
                Find the organizations already leaking operational pressure.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
                Upstream is a signal triage console. It turns noisy public evidence into operator-ready context: friction, stack clues, likely route, and the smallest useful next move.
              </p>
            </div>
          </div>
          {query.captured === "1" || query.saved === "1" || query.promoted === "1" ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Upstream workspace updated successfully.
            </div>
          ) : null}
          {query.error === "missing-briefing" ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              The selected signal could not be promoted into a briefing.
            </div>
          ) : null}
        </div>

        <div className="px-5 py-6 sm:px-6">
          {module === "signals" ? (
            <div className="space-y-6">
              <Panel title="Capture signal">
                <form action={captureSignalAction} className="grid gap-4 md:grid-cols-2">
                  <TextField name="organizationName" label="Organization" placeholder="Northstar Health Ops" />
                  <TextField name="title" label="Signal title" placeholder="Ops lead describing intake backlog" />
                  <TextField name="sourceType" label="Source type" placeholder="reddit" />
                  <TextField name="sourceLabel" label="Source label" placeholder="r/smallbusiness" />
                  <TextField name="sourceUrl" label="Source URL" placeholder="reddit.com/r/..." />
                  <TextField name="route" label="Suggested route" placeholder="Email-first continuity brief" />
                  <TextField name="score" label="Signal score (1-99)" placeholder="86" />
                  <TextField name="tags" label="Tags" placeholder="crm, routing, ops" />
                  <TextField name="frictionPoints" label="Friction points" placeholder="handoff loss, manual sync" />
                  <TextField name="stackHints" label="Stack hints" placeholder="HubSpot, Airtable" />
                  <div className="md:col-span-2">
                    <TextAreaField name="summary" label="Signal summary" rows={4} />
                  </div>
                  <div className="md:col-span-2">
                    <TextAreaField name="whyNow" label="Why it matters now" rows={4} />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
                      Capture signal
                    </button>
                  </div>
                </form>
              </Panel>

              <Panel title="Signal stream">
                <div className="space-y-3">
                  {state.signals.map((signal) => {
                    const organization = state.organizations.find((org) => org.id === signal.organizationId);
                    return (
                      <a
                        key={signal.id}
                        href={`/admin/upstream?module=signals&signal=${signal.id}`}
                        className={`block rounded-2xl border px-4 py-4 ${
                          selectedSignal?.id === signal.id ? "border-ink bg-[#fbfaf7]" : "border-black/6 bg-white"
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-ink">{signal.title}</p>
                            <p className="mt-1 text-sm leading-7 text-slate">{signal.summary}</p>
                            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate">
                              {organization?.name || "Unknown org"} · {signal.sourceLabel}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${signalStageTone(signal.stage)}`}>
                              {signalStageLabel(signal.stage)}
                            </span>
                            <span className="inline-flex rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold text-slate">
                              Score {signal.score}
                            </span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </Panel>
            </div>
          ) : null}

          {module === "organizations" ? (
            <Panel title="Organizations">
              <div className="space-y-3">
                {state.organizations.map((organization) => {
                  const linkedSignals = state.signals.filter(
                    (signal) => signal.organizationId === organization.id,
                  );
                  return (
                    <a
                      key={organization.id}
                      href={`/admin/upstream?module=organizations&organization=${organization.id}`}
                      className={`block rounded-2xl border px-4 py-4 ${
                        selectedOrganization?.id === organization.id
                          ? "border-ink bg-[#fbfaf7]"
                          : "border-black/6 bg-white"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-ink">{organization.name}</p>
                          <p className="mt-1 text-sm leading-7 text-slate">{organization.summary}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate">
                            {organization.segment}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${orgTone(organization.status)}`}>
                            {organization.status}
                          </span>
                          <span className="inline-flex rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold text-slate">
                            {linkedSignals.length} signals
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </Panel>
          ) : null}

          {module === "workflows" ? (
            <Panel title="Workflow lanes">
              <div className="grid gap-4 xl:grid-cols-3">
                {[
                  ["captured", "triaged"],
                  ["watch", "ready"],
                  ["routed", "won", "discarded"],
                ].map((lane, index) => (
                  <div key={index} className="rounded-2xl border border-black/6 bg-[#fbfaf7] p-4">
                    <p className="text-sm font-semibold text-ink">
                      {index === 0 ? "Sense and filter" : index === 1 ? "Context and readiness" : "Route and outcome"}
                    </p>
                    <div className="mt-4 space-y-3">
                      {state.signals
                        .filter((signal) => lane.includes(signal.stage))
                        .map((signal) => (
                          <a
                            key={signal.id}
                            href={`/admin/upstream?module=signals&signal=${signal.id}`}
                            className="block rounded-2xl border border-black/6 bg-white px-3 py-3"
                          >
                            <p className="text-sm font-semibold text-ink">{signal.title}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate">
                              {signalStageLabel(signal.stage)} · Score {signal.score}
                            </p>
                          </a>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          ) : null}

          {module === "briefings" ? (
            <Panel title="Briefings">
              <div className="space-y-3">
                {state.briefings.map((briefing) => {
                  const org = state.organizations.find((item) => item.id === briefing.organizationId);
                  return (
                    <a
                      key={briefing.id}
                      href={`/admin/upstream?module=briefings&briefing=${briefing.id}`}
                      className={`block rounded-2xl border px-4 py-4 ${
                        selectedBriefing?.id === briefing.id ? "border-ink bg-[#fbfaf7]" : "border-black/6 bg-white"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-ink">{briefing.title}</p>
                          <p className="mt-1 text-sm leading-7 text-slate">{briefing.summary}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate">
                            {org?.name || "Unknown organization"}
                          </p>
                        </div>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${briefingTone(briefing.status)}`}>
                          {briefingStatusLabel(briefing.status)}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </Panel>
          ) : null}
        </div>
      </section>

      <aside className="space-y-4">
        {module === "signals" && selectedSignal ? (
          <>
            <Inspector title="Signal detail">
              <p className="text-sm font-semibold text-ink">{selectedSignal.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate">{selectedSignal.whyNow}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedSignal.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold text-slate">
                    {tag}
                  </span>
                ))}
              </div>
            </Inspector>

            <Inspector title="Pressure pattern">
              <ListChips values={selectedSignal.frictionPoints} />
            </Inspector>

            <Inspector title="Likely stack">
              <ListChips values={selectedSignal.stackHints} />
            </Inspector>

            <Inspector title="Advance signal">
              <form action={updateSignalAction} className="space-y-4">
                <input type="hidden" name="signalId" value={selectedSignal.id} />
                <SelectField name="stage" label="Stage" defaultValue={selectedSignal.stage}>
                  {signalStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {signalStageLabel(stage)}
                    </option>
                  ))}
                </SelectField>
                <TextField name="score" label="Score" defaultValue={String(selectedSignal.score)} />
                <TextField name="route" label="Route" defaultValue={selectedSignal.route} />
                <TextAreaField
                  name="whyNow"
                  label="Why it matters now"
                  defaultValue={selectedSignal.whyNow}
                  rows={5}
                />
                <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                  Save signal
                </button>
              </form>
            </Inspector>

            {!selectedSignal.briefingId ? (
              <Inspector title="Promote to briefing">
                <p className="text-sm leading-7 text-slate">
                  When a signal is strong enough to support a real outreach angle, convert it into a briefing.
                </p>
                <form action={createBriefingAction} className="mt-4">
                  <input type="hidden" name="signalId" value={selectedSignal.id} />
                  <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-full border border-black/8 text-sm font-semibold text-ink">
                    Create briefing
                  </button>
                </form>
              </Inspector>
            ) : null}
          </>
        ) : null}

        {module === "organizations" && selectedOrganization ? (
          <>
            <Inspector title="Organization dossier">
              <p className="text-sm font-semibold text-ink">{selectedOrganization.name}</p>
              <p className="mt-2 text-sm leading-7 text-slate">{selectedOrganization.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${orgTone(selectedOrganization.status)}`}>
                  {selectedOrganization.status}
                </span>
                <span className="inline-flex rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold text-slate">
                  Priority {selectedOrganization.priority}
                </span>
              </div>
            </Inspector>

            <Inspector title="Likely stack">
              <ListChips values={selectedOrganization.likelyStack} />
            </Inspector>

            <Inspector title="Linked signals">
              <div className="space-y-3">
                {linkedSignalsForOrganization.map((signal) => (
                  <a
                    key={signal.id}
                    href={`/admin/upstream?module=signals&signal=${signal.id}`}
                    className="block rounded-2xl border border-black/6 bg-[#fbfaf7] px-3 py-3"
                  >
                    <p className="text-sm font-semibold text-ink">{signal.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate">
                      {signalStageLabel(signal.stage)} · Score {signal.score}
                    </p>
                  </a>
                ))}
              </div>
            </Inspector>
          </>
        ) : null}

        {module === "briefings" && selectedBriefing ? (
          <>
            <Inspector title="Briefing detail">
              <p className="text-sm font-semibold text-ink">{selectedBriefing.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate">{selectedBriefing.summary}</p>
            </Inspector>

            <Inspector title="Update briefing">
              <form action={updateBriefingAction} className="space-y-4">
                <input type="hidden" name="briefingId" value={selectedBriefing.id} />
                <SelectField name="status" label="Status" defaultValue={selectedBriefing.status}>
                  {briefingStatuses.map((status) => (
                    <option key={status} value={status}>
                      {briefingStatusLabel(status)}
                    </option>
                  ))}
                </SelectField>
                <TextAreaField
                  name="objective"
                  label="Objective"
                  defaultValue={selectedBriefing.objective}
                  rows={4}
                />
                <TextAreaField
                  name="summary"
                  label="Summary"
                  defaultValue={selectedBriefing.summary}
                  rows={5}
                />
                <TextAreaField
                  name="nextAction"
                  label="Next action"
                  defaultValue={selectedBriefing.nextAction}
                  rows={4}
                />
                <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                  Save briefing
                </button>
              </form>
            </Inspector>
          </>
        ) : null}

        {module === "workflows" ? (
          <Inspector title="Workflow read">
            <p className="text-sm leading-7 text-slate">
              The MVP pipeline is intentionally small: capture, triage, watch, ready, routed, and outcome. It exists to preserve attention, not to simulate a giant sales operating system.
            </p>
          </Inspector>
        ) : null}
      </aside>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-black/6 bg-white">
      <div className="border-b border-black/6 px-4 py-4">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Inspector({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-black/6 bg-white p-4 shadow-soft">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ListChips({ values }: { values: string[] }) {
  if (values.length === 0) {
    return <p className="text-sm text-slate">None captured yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span key={value} className="rounded-full bg-[#f7f5f1] px-3 py-1 text-xs font-semibold text-slate">
          {value}
        </span>
      ))}
    </div>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-2xl border border-black/8 bg-[#f7f5f1] px-4 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  children,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 h-11 w-full rounded-2xl border border-black/8 bg-[#f7f5f1] px-4 text-sm outline-none focus:border-accent"
      >
        {children}
      </select>
    </div>
  );
}

function TextAreaField({
  name,
  label,
  defaultValue,
  rows,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="mt-2 w-full rounded-[20px] border border-black/8 bg-[#f7f5f1] px-4 py-3 text-sm leading-7 outline-none focus:border-accent"
      />
    </div>
  );
}
