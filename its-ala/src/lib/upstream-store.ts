import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "@/lib/postgres";

export type SignalStage =
  | "captured"
  | "triaged"
  | "watch"
  | "ready"
  | "routed"
  | "won"
  | "discarded";

export type OrganizationStatus = "watch" | "action_range" | "engaged";

export type BriefingStatus = "draft" | "ready" | "active" | "closed";

export type Signal = {
  id: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  briefingId?: string;
  title: string;
  sourceType: string;
  sourceLabel: string;
  sourceUrl: string;
  summary: string;
  whyNow: string;
  route: string;
  stage: SignalStage;
  score: number;
  tags: string[];
  frictionPoints: string[];
  stackHints: string[];
};

export type Organization = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  segment: string;
  status: OrganizationStatus;
  summary: string;
  priority: number;
  likelyStack: string[];
};

export type Briefing = {
  id: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  title: string;
  objective: string;
  summary: string;
  nextAction: string;
  status: BriefingStatus;
  linkedSignalIds: string[];
};

export type UpstreamState = {
  organizations: Organization[];
  signals: Signal[];
  briefings: Briefing[];
};

const dataDir = path.join(process.cwd(), ".data");
const localFile = path.join(dataDir, "upstream.json");

export const signalStages: SignalStage[] = [
  "captured",
  "triaged",
  "watch",
  "ready",
  "routed",
  "won",
  "discarded",
];

export const briefingStatuses: BriefingStatus[] = [
  "draft",
  "ready",
  "active",
  "closed",
];

function nowIso() {
  return new Date().toISOString();
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) {
    return 70;
  }
  return Math.max(1, Math.min(Math.round(value), 99));
}

function sluglessId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

export function signalStageLabel(stage: SignalStage) {
  switch (stage) {
    case "captured":
      return "Captured";
    case "triaged":
      return "Triaged";
    case "watch":
      return "Watch";
    case "ready":
      return "Ready";
    case "routed":
      return "Routed";
    case "won":
      return "Won";
    case "discarded":
      return "Discarded";
  }
}

export function briefingStatusLabel(status: BriefingStatus) {
  switch (status) {
    case "draft":
      return "Draft";
    case "ready":
      return "Ready";
    case "active":
      return "Active";
    case "closed":
      return "Closed";
  }
}

function seedState(): UpstreamState {
  const t = nowIso();

  const organizations: Organization[] = [
    {
      id: "org_northstar",
      createdAt: t,
      updatedAt: t,
      name: "Northstar Health Ops",
      segment: "Healthcare operations",
      status: "action_range",
      summary: "Healthcare operator with visible workflow drag around intake routing and internal coordination.",
      priority: 92,
      likelyStack: ["HubSpot", "Airtable", "Zapier"],
    },
    {
      id: "org_ridgeback",
      createdAt: t,
      updatedAt: t,
      name: "Ridgeback Revenue",
      segment: "B2B SaaS",
      status: "watch",
      summary: "Revenue team showing repeated CRM leakage and rep handoff friction in public support and founder channels.",
      priority: 81,
      likelyStack: ["Salesforce", "Slack", "Google Sheets"],
    },
    {
      id: "org_helium",
      createdAt: t,
      updatedAt: t,
      name: "Helium Logistics",
      segment: "Ops-heavy services",
      status: "engaged",
      summary: "Small operations-heavy company with strong signals around manual dispatching and fragmented status visibility.",
      priority: 88,
      likelyStack: ["Notion", "WhatsApp", "Excel"],
    },
  ];

  const signals: Signal[] = [
    {
      id: "sig_1",
      createdAt: t,
      updatedAt: t,
      organizationId: "org_northstar",
      briefingId: "brief_1",
      title: "Ops lead describing intake backlog and duplicate handoffs",
      sourceType: "reddit",
      sourceLabel: "r/smallbusiness",
      sourceUrl: "https://reddit.com",
      summary: "Team is manually sorting inbound requests, losing context between steps, and relying on side-channel updates.",
      whyNow: "Repeated urgency + explicit process fatigue + non-technical language suggests they need imposed structure, not more advice.",
      route: "email-first continuity brief",
      stage: "ready",
      score: 91,
      tags: ["intake", "ops", "manual-routing"],
      frictionPoints: ["duplicate entry", "handoff loss", "status ambiguity"],
      stackHints: ["HubSpot", "Airtable", "email"],
    },
    {
      id: "sig_2",
      createdAt: t,
      updatedAt: t,
      organizationId: "org_ridgeback",
      title: "Founder asking why CRM automations keep breaking after growth",
      sourceType: "reddit",
      sourceLabel: "r/SaaS",
      sourceUrl: "https://reddit.com",
      summary: "Automation rules were set up early and now fail under higher volume, causing messy ownership and lost context.",
      whyNow: "Signal is strong but still exploratory. Good candidate for dossier building before direct move.",
      route: "watch and prepare dossier",
      stage: "watch",
      score: 78,
      tags: ["crm", "growth", "automation"],
      frictionPoints: ["ownership confusion", "automation breakage", "scale mismatch"],
      stackHints: ["Salesforce", "Slack"],
    },
    {
      id: "sig_3",
      createdAt: t,
      updatedAt: t,
      organizationId: "org_helium",
      briefingId: "brief_2",
      title: "Manual dispatch workflow collapsing into chat-thread chaos",
      sourceType: "support-thread",
      sourceLabel: "Public support forum",
      sourceUrl: "https://example.com",
      summary: "Dispatch coordination is happening through chat and spreadsheets with no shared state for what changed and why.",
      whyNow: "Operational pain is concrete and delivery language already points toward a workflow system rather than abstract consulting.",
      route: "DM to scoped systems walkthrough",
      stage: "routed",
      score: 95,
      tags: ["dispatch", "internal-tool", "shared-state"],
      frictionPoints: ["chat dependency", "manual sync", "no single source of truth"],
      stackHints: ["Notion", "WhatsApp", "Excel"],
    },
    {
      id: "sig_4",
      createdAt: t,
      updatedAt: t,
      organizationId: "org_northstar",
      title: "Operator asks for better visibility across handoff stages",
      sourceType: "linkedin",
      sourceLabel: "Founder post",
      sourceUrl: "https://linkedin.com",
      summary: "The team can see volume but not where cases are stalling, which creates reactive follow-up instead of operational control.",
      whyNow: "Good companion evidence that strengthens the org-level case rather than living as a standalone outreach target.",
      route: "attach to existing briefing",
      stage: "triaged",
      score: 73,
      tags: ["visibility", "handoffs", "ops-control"],
      frictionPoints: ["stall points hidden", "reactive follow-up"],
      stackHints: ["HubSpot", "Airtable"],
    },
  ];

  const briefings: Briefing[] = [
    {
      id: "brief_1",
      createdAt: t,
      updatedAt: t,
      organizationId: "org_northstar",
      title: "Northstar continuity brief",
      objective: "Show how intake routing and handoff visibility can be compressed into one operator-facing workflow.",
      summary: "Northstar does not need a broad digital transformation story. They need continuity around intake, shared state, and stage visibility.",
      nextAction: "Draft a short continuity assessment and open with the intake bottleneck rather than a feature pitch.",
      status: "ready",
      linkedSignalIds: ["sig_1", "sig_4"],
    },
    {
      id: "brief_2",
      createdAt: t,
      updatedAt: t,
      organizationId: "org_helium",
      title: "Helium dispatch workflow brief",
      objective: "Convert dispatch chaos into a scoped internal tool conversation.",
      summary: "The opportunity is a shared-state dispatch layer with fewer chat loops and clearer escalation paths.",
      nextAction: "Send the workflow walkthrough and offer a first delivery slice focused on dispatch visibility.",
      status: "active",
      linkedSignalIds: ["sig_3"],
    },
  ];

  return { organizations, signals, briefings };
}

async function ensurePostgresSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS upstream_state (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
  `;
}

async function readLocalState() {
  await mkdir(dataDir, { recursive: true });
  try {
    const content = await readFile(localFile, "utf8");
    return JSON.parse(content) as UpstreamState;
  } catch {
    const seeded = seedState();
    await writeFile(localFile, JSON.stringify(seeded, null, 2), "utf8");
    return seeded;
  }
}

async function writeLocalState(state: UpstreamState) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(localFile, JSON.stringify(state, null, 2), "utf8");
}

export async function readUpstreamState() {
  if (process.env.POSTGRES_URL) {
    await ensurePostgresSchema();
    const result = await sql`
      SELECT payload FROM upstream_state WHERE id = 'default' LIMIT 1
    `;
    if (result.rows[0]?.payload) {
      return result.rows[0].payload as UpstreamState;
    }
    const seeded = seedState();
    await sql`
      INSERT INTO upstream_state (id, payload, updated_at)
      VALUES ('default', ${JSON.stringify(seeded)}::jsonb, ${nowIso()})
      ON CONFLICT (id) DO NOTHING
    `;
    return seeded;
  }

  return readLocalState();
}

async function writeUpstreamState(state: UpstreamState) {
  if (process.env.POSTGRES_URL) {
    await ensurePostgresSchema();
    await sql`
      INSERT INTO upstream_state (id, payload, updated_at)
      VALUES ('default', ${JSON.stringify(state)}::jsonb, ${nowIso()})
      ON CONFLICT (id)
      DO UPDATE SET payload = EXCLUDED.payload, updated_at = EXCLUDED.updated_at
    `;
    return;
  }

  await writeLocalState(state);
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function normalizeSourceUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.startsWith("http") ? trimmed.slice(0, 1000) : `https://${trimmed}`.slice(0, 1000);
}

export async function addSignal(input: {
  organizationName: string;
  title: string;
  sourceType: string;
  sourceLabel: string;
  sourceUrl: string;
  summary: string;
  whyNow: string;
  route: string;
  score: number;
  tags: string;
  frictionPoints: string;
  stackHints: string;
}) {
  const state = await readUpstreamState();
  const organizationName = input.organizationName.trim().slice(0, 160);
  const signalTitle = input.title.trim().slice(0, 220);
  const summary = input.summary.trim().slice(0, 2000);
  const whyNow = input.whyNow.trim().slice(0, 1800);
  const now = nowIso();

  if (!organizationName || !signalTitle || !summary || !whyNow) {
    throw new Error("Signal capture requires organization, title, summary, and why-now context.");
  }

  let organization = state.organizations.find(
    (item) => item.name.toLowerCase() === organizationName.toLowerCase(),
  );

  if (!organization) {
    organization = {
      id: sluglessId("org"),
      createdAt: now,
      updatedAt: now,
      name: organizationName,
      segment: "Unclassified",
      status: "watch",
      summary: "Organization created from manual signal capture.",
      priority: Math.max(50, clampScore(input.score)),
      likelyStack: splitList(input.stackHints),
    };
    state.organizations.unshift(organization);
  }

  const signal: Signal = {
    id: sluglessId("sig"),
    createdAt: now,
    updatedAt: now,
    organizationId: organization.id,
    title: signalTitle,
    sourceType: input.sourceType.trim().slice(0, 80) || "manual",
    sourceLabel: input.sourceLabel.trim().slice(0, 120) || "Manual capture",
    sourceUrl: normalizeSourceUrl(input.sourceUrl),
    summary,
    whyNow,
    route: input.route.trim().slice(0, 240),
    stage: clampScore(input.score) >= 85 ? "ready" : clampScore(input.score) >= 70 ? "triaged" : "captured",
    score: clampScore(input.score),
    tags: splitList(input.tags),
    frictionPoints: splitList(input.frictionPoints),
    stackHints: splitList(input.stackHints),
  };

  organization.updatedAt = now;
  organization.priority = Math.max(organization.priority, signal.score);
  if (signal.score >= 85) {
    organization.status = "action_range";
  }
  if (signal.stackHints.length > 0) {
    organization.likelyStack = Array.from(
      new Set([...organization.likelyStack, ...signal.stackHints]),
    ).slice(0, 10);
  }

  state.signals.unshift(signal);
  await writeUpstreamState(state);
  return signal;
}

export async function updateSignal(input: {
  signalId: string;
  stage: SignalStage;
  score: number;
  route: string;
  whyNow: string;
}) {
  const state = await readUpstreamState();
  const signal = state.signals.find((item) => item.id === input.signalId);
  if (!signal) {
    return null;
  }
  signal.stage = input.stage;
  signal.score = clampScore(input.score);
  signal.route = input.route.trim().slice(0, 240);
  signal.whyNow = input.whyNow.trim().slice(0, 1800);
  signal.updatedAt = nowIso();
  await writeUpstreamState(state);
  return signal;
}

export async function createBriefingFromSignal(signalId: string) {
  const state = await readUpstreamState();
  const signal = state.signals.find((item) => item.id === signalId);
  if (!signal) {
    return null;
  }
  if (signal.briefingId) {
    return state.briefings.find((item) => item.id === signal.briefingId) ?? null;
  }

  const organization = state.organizations.find((item) => item.id === signal.organizationId);
  const now = nowIso();

  const briefing: Briefing = {
    id: sluglessId("brief"),
    createdAt: now,
    updatedAt: now,
    organizationId: signal.organizationId,
    title: `${organization?.name || "Organization"} operator brief`,
    objective: "Turn visible friction into a structured operator conversation.",
    summary: signal.summary,
    nextAction: signal.route || "Prepare a trust-first outreach angle tied to continuity risk.",
    status: "draft",
    linkedSignalIds: [signal.id],
  };

  signal.briefingId = briefing.id;
  signal.stage = signal.stage === "captured" ? "triaged" : signal.stage;
  signal.updatedAt = now;

  if (organization) {
    organization.status = "action_range";
    organization.updatedAt = now;
  }

  state.briefings.unshift(briefing);
  await writeUpstreamState(state);
  return briefing;
}

export async function updateBriefing(input: {
  briefingId: string;
  status: BriefingStatus;
  objective: string;
  summary: string;
  nextAction: string;
}) {
  const state = await readUpstreamState();
  const briefing = state.briefings.find((item) => item.id === input.briefingId);
  if (!briefing) {
    return null;
  }
  briefing.status = input.status;
  briefing.objective = input.objective.trim().slice(0, 1600);
  briefing.summary = input.summary.trim().slice(0, 2000);
  briefing.nextAction = input.nextAction.trim().slice(0, 1600);
  briefing.updatedAt = nowIso();
  await writeUpstreamState(state);
  return briefing;
}

export function computeUpstreamMetrics(state: UpstreamState) {
  const readySignals = state.signals.filter((signal) =>
    ["ready", "routed", "won"].includes(signal.stage),
  ).length;
  const actionRangeOrgs = state.organizations.filter(
    (org) => org.status === "action_range" || org.status === "engaged",
  ).length;
  const readyBriefings = state.briefings.filter((briefing) =>
    ["ready", "active"].includes(briefing.status),
  ).length;

  return {
    readySignals,
    actionRangeOrgs,
    readyBriefings,
  };
}
