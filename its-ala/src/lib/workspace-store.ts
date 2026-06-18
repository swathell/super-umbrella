import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "@vercel/postgres";
import type { LeadRecord } from "@/lib/lead-store";
import { getLeadById } from "@/lib/lead-store";

export type WorkspaceStatus =
  | "planned"
  | "active"
  | "review"
  | "completed"
  | "paused";

export type WorkspaceMilestone = {
  id: string;
  title: string;
  status: "upcoming" | "active" | "done";
  detail: string;
  dueLabel: string;
};

export type WorkspaceUpdate = {
  id: string;
  createdAt: string;
  title: string;
  body: string;
};

export type WorkspaceResource = {
  id: string;
  label: string;
  url: string;
  description: string;
};

export type ProjectWorkspace = {
  id: string;
  leadId: string;
  slug: string;
  clientName: string;
  clientEmail: string;
  company: string;
  title: string;
  status: WorkspaceStatus;
  overview: string;
  currentFocus: string;
  nextStep: string;
  communicationGuidance: string;
  contactEmail: string;
  accessCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  milestones: WorkspaceMilestone[];
  updates: WorkspaceUpdate[];
  resources: WorkspaceResource[];
};

type WorkspaceSummary = {
  id: string;
  slug: string;
  title: string;
  status: WorkspaceStatus;
  clientName: string;
  company: string;
  updatedAt: string;
};

type WorkspaceBaseUpdate = {
  title?: string;
  status?: WorkspaceStatus;
  overview?: string;
  currentFocus?: string;
  nextStep?: string;
  communicationGuidance?: string;
  contactEmail?: string;
  isActive?: boolean;
};

type StorageWorkspaceRow = {
  id: string;
  leadId: string;
  slug: string;
  clientName: string;
  clientEmail: string;
  company: string;
  title: string;
  status: WorkspaceStatus;
  overview: string;
  currentFocus: string;
  nextStep: string;
  communicationGuidance: string;
  contactEmail: string;
  accessCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  milestones: WorkspaceMilestone[];
  updates: WorkspaceUpdate[];
  resources: WorkspaceResource[];
};

const dataDir = path.join(process.cwd(), ".data");
const localFile = path.join(dataDir, "workspaces.json");

export const workspaceStatuses: WorkspaceStatus[] = [
  "planned",
  "active",
  "review",
  "completed",
  "paused",
];

function nowIso() {
  return new Date().toISOString();
}

function randomCode(length: number) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  for (const byte of bytes) {
    value += alphabet[byte % alphabet.length];
  }
  return value;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

function ensureStatus(status: string | undefined): WorkspaceStatus {
  return workspaceStatuses.includes(status as WorkspaceStatus)
    ? (status as WorkspaceStatus)
    : "planned";
}

function normalizeWorkspace(input: StorageWorkspaceRow | ProjectWorkspace): ProjectWorkspace {
  return {
    id: input.id,
    leadId: input.leadId,
    slug: input.slug,
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    company: input.company,
    title: input.title,
    status: ensureStatus(input.status),
    overview: input.overview,
    currentFocus: input.currentFocus,
    nextStep: input.nextStep,
    communicationGuidance: input.communicationGuidance,
    contactEmail: input.contactEmail,
    accessCode: input.accessCode,
    isActive: Boolean(input.isActive),
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    milestones: Array.isArray(input.milestones) ? input.milestones : [],
    updates: Array.isArray(input.updates) ? input.updates : [],
    resources: Array.isArray(input.resources) ? input.resources : [],
  };
}

function defaultWorkspaceFromLead(lead: LeadRecord): ProjectWorkspace {
  const createdAt = nowIso();
  const baseName = lead.company || lead.name;
  return {
    id: crypto.randomUUID(),
    leadId: lead.id,
    slug: `${slugify(baseName)}-${randomCode(4).toLowerCase()}`,
    clientName: lead.name,
    clientEmail: lead.email,
    company: lead.company || "",
    title: `${lead.company || lead.name} workspace`,
    status: "planned",
    overview:
      `This workspace tracks the delivery path for ${lead.projectType}. It is meant to keep the project state legible without turning communication into a full project-management system.`,
    currentFocus: "Initial scope confirmation and delivery plan setup.",
    nextStep: "Confirm the first working milestone and share any required source material.",
    communicationGuidance:
      "Use this workspace for updates, milestone visibility, and shared references. Major scope changes should still be handled directly by email.",
    contactEmail: process.env.NOTIFICATION_EMAIL || "hello@itsala.com",
    accessCode: randomCode(8),
    isActive: true,
    createdAt,
    updatedAt: createdAt,
    milestones: [
      {
        id: crypto.randomUUID(),
        title: "Scope locked",
        status: "active",
        detail: "Confirm what is in the first delivery slice and what is intentionally out of scope.",
        dueLabel: "Current",
      },
      {
        id: crypto.randomUUID(),
        title: "First working build",
        status: "upcoming",
        detail: "Ship the first usable version for review.",
        dueLabel: "Next",
      },
      {
        id: crypto.randomUUID(),
        title: "Review and handoff",
        status: "upcoming",
        detail: "Tighten edges, document next actions, and confirm the delivery state.",
        dueLabel: "Later",
      },
    ],
    updates: [
      {
        id: crypto.randomUUID(),
        createdAt,
        title: "Workspace opened",
        body: "The project workspace is active. The next step is aligning on the first delivery slice and any dependencies needed from your side.",
      },
    ],
    resources: [],
  };
}

async function ensurePostgresSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS project_workspaces (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
      slug TEXT UNIQUE NOT NULL,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      company TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      overview TEXT NOT NULL,
      current_focus TEXT NOT NULL,
      next_step TEXT NOT NULL,
      communication_guidance TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      access_code TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      milestones_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      updates_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      resources_json JSONB NOT NULL DEFAULT '[]'::jsonb
    );
  `;
}

async function readLocalWorkspaces() {
  await mkdir(dataDir, { recursive: true });
  try {
    const content = await readFile(localFile, "utf8");
    const parsed = JSON.parse(content) as StorageWorkspaceRow[];
    return parsed.map(normalizeWorkspace);
  } catch {
    return [];
  }
}

async function writeLocalWorkspaces(records: ProjectWorkspace[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(localFile, JSON.stringify(records, null, 2), "utf8");
}

function rowToWorkspace(row: Record<string, unknown>) {
  return normalizeWorkspace({
    id: String(row.id),
    leadId: String(row.lead_id),
    slug: String(row.slug),
    clientName: String(row.client_name),
    clientEmail: String(row.client_email),
    company: String(row.company || ""),
    title: String(row.title),
    status: ensureStatus(String(row.status)),
    overview: String(row.overview),
    currentFocus: String(row.current_focus),
    nextStep: String(row.next_step),
    communicationGuidance: String(row.communication_guidance),
    contactEmail: String(row.contact_email),
    accessCode: String(row.access_code),
    isActive: Boolean(row.is_active),
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(String(row.created_at)).toISOString(),
    updatedAt:
      row.updated_at instanceof Date
        ? row.updated_at.toISOString()
        : new Date(String(row.updated_at)).toISOString(),
    milestones: (row.milestones_json as WorkspaceMilestone[]) ?? [],
    updates: (row.updates_json as WorkspaceUpdate[]) ?? [],
    resources: (row.resources_json as WorkspaceResource[]) ?? [],
  });
}

function toSummary(workspace: ProjectWorkspace): WorkspaceSummary {
  return {
    id: workspace.id,
    slug: workspace.slug,
    title: workspace.title,
    status: workspace.status,
    clientName: workspace.clientName,
    company: workspace.company,
    updatedAt: workspace.updatedAt,
  };
}

export function workspaceStatusLabel(status: WorkspaceStatus) {
  switch (status) {
    case "planned":
      return "Planned";
    case "active":
      return "Active";
    case "review":
      return "In review";
    case "completed":
      return "Completed";
    case "paused":
      return "Paused";
  }
}

export async function getWorkspaceByLeadId(leadId: string) {
  if (process.env.POSTGRES_URL) {
    await ensurePostgresSchema();
    const result = await sql`
      SELECT * FROM project_workspaces WHERE lead_id = ${leadId} LIMIT 1
    `;
    return result.rows[0] ? rowToWorkspace(result.rows[0]) : null;
  }

  const records = await readLocalWorkspaces();
  return records.find((record) => record.leadId === leadId) ?? null;
}

export async function getWorkspaceById(id: string) {
  if (process.env.POSTGRES_URL) {
    await ensurePostgresSchema();
    const result = await sql`
      SELECT * FROM project_workspaces WHERE id = ${id} LIMIT 1
    `;
    return result.rows[0] ? rowToWorkspace(result.rows[0]) : null;
  }

  const records = await readLocalWorkspaces();
  return records.find((record) => record.id === id) ?? null;
}

export async function getWorkspaceBySlug(slug: string) {
  if (process.env.POSTGRES_URL) {
    await ensurePostgresSchema();
    const result = await sql`
      SELECT * FROM project_workspaces WHERE slug = ${slug} LIMIT 1
    `;
    return result.rows[0] ? rowToWorkspace(result.rows[0]) : null;
  }

  const records = await readLocalWorkspaces();
  return records.find((record) => record.slug === slug) ?? null;
}

export async function listWorkspaces() {
  if (process.env.POSTGRES_URL) {
    await ensurePostgresSchema();
    const result = await sql`
      SELECT * FROM project_workspaces ORDER BY updated_at DESC
    `;
    return result.rows.map((row) => rowToWorkspace(row));
  }

  const records = await readLocalWorkspaces();
  return [...records].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function createWorkspaceFromLead(leadId: string) {
  const existing = await getWorkspaceByLeadId(leadId);
  if (existing) {
    return existing;
  }

  const lead = await getLeadById(leadId);
  if (!lead) {
    return null;
  }

  const workspace = defaultWorkspaceFromLead(lead);

  if (process.env.POSTGRES_URL) {
    await ensurePostgresSchema();
    await sql`
      INSERT INTO project_workspaces (
        id,
        lead_id,
        slug,
        client_name,
        client_email,
        company,
        title,
        status,
        overview,
        current_focus,
        next_step,
        communication_guidance,
        contact_email,
        access_code,
        is_active,
        created_at,
        updated_at,
        milestones_json,
        updates_json,
        resources_json
      ) VALUES (
        ${workspace.id},
        ${workspace.leadId},
        ${workspace.slug},
        ${workspace.clientName},
        ${workspace.clientEmail},
        ${workspace.company},
        ${workspace.title},
        ${workspace.status},
        ${workspace.overview},
        ${workspace.currentFocus},
        ${workspace.nextStep},
        ${workspace.communicationGuidance},
        ${workspace.contactEmail},
        ${workspace.accessCode},
        ${workspace.isActive},
        ${workspace.createdAt},
        ${workspace.updatedAt},
        ${JSON.stringify(workspace.milestones)}::jsonb,
        ${JSON.stringify(workspace.updates)}::jsonb,
        ${JSON.stringify(workspace.resources)}::jsonb
      )
    `;
    return workspace;
  }

  const records = await readLocalWorkspaces();
  records.unshift(workspace);
  await writeLocalWorkspaces(records);
  return workspace;
}

export async function updateWorkspaceBase(id: string, updates: WorkspaceBaseUpdate) {
  const current = await getWorkspaceById(id);
  if (!current) {
    return null;
  }

  const next: ProjectWorkspace = {
    ...current,
    title: updates.title?.trim().slice(0, 180) || current.title,
    status: updates.status ? ensureStatus(updates.status) : current.status,
    overview: updates.overview?.trim().slice(0, 5000) || current.overview,
    currentFocus: updates.currentFocus?.trim().slice(0, 2000) || current.currentFocus,
    nextStep: updates.nextStep?.trim().slice(0, 2000) || current.nextStep,
    communicationGuidance:
      updates.communicationGuidance?.trim().slice(0, 2000) || current.communicationGuidance,
    contactEmail: updates.contactEmail?.trim().slice(0, 160) || current.contactEmail,
    isActive: typeof updates.isActive === "boolean" ? updates.isActive : current.isActive,
    updatedAt: nowIso(),
  };

  if (process.env.POSTGRES_URL) {
    await ensurePostgresSchema();
    await sql`
      UPDATE project_workspaces
      SET
        title = ${next.title},
        status = ${next.status},
        overview = ${next.overview},
        current_focus = ${next.currentFocus},
        next_step = ${next.nextStep},
        communication_guidance = ${next.communicationGuidance},
        contact_email = ${next.contactEmail},
        is_active = ${next.isActive},
        updated_at = ${next.updatedAt}
      WHERE id = ${id}
    `;
    return next;
  }

  const records = await readLocalWorkspaces();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) {
    return null;
  }
  records[index] = next;
  await writeLocalWorkspaces(records);
  return next;
}

export async function addWorkspaceMilestone(
  id: string,
  input: Omit<WorkspaceMilestone, "id">,
) {
  const current = await getWorkspaceById(id);
  if (!current) {
    return null;
  }
  const next: ProjectWorkspace = {
    ...current,
    updatedAt: nowIso(),
    milestones: [
      ...current.milestones,
      {
        id: crypto.randomUUID(),
        title: input.title.trim().slice(0, 160),
        status: input.status,
        detail: input.detail.trim().slice(0, 1200),
        dueLabel: input.dueLabel.trim().slice(0, 120),
      },
    ],
  };

  return persistWorkspace(next);
}

export async function addWorkspaceUpdate(
  id: string,
  input: Omit<WorkspaceUpdate, "id" | "createdAt">,
) {
  const current = await getWorkspaceById(id);
  if (!current) {
    return null;
  }
  const createdAt = nowIso();
  const next: ProjectWorkspace = {
    ...current,
    updatedAt: createdAt,
    updates: [
      {
        id: crypto.randomUUID(),
        createdAt,
        title: input.title.trim().slice(0, 160),
        body: input.body.trim().slice(0, 3000),
      },
      ...current.updates,
    ],
  };

  return persistWorkspace(next);
}

export async function addWorkspaceResource(
  id: string,
  input: Omit<WorkspaceResource, "id">,
) {
  const current = await getWorkspaceById(id);
  if (!current) {
    return null;
  }
  const next: ProjectWorkspace = {
    ...current,
    updatedAt: nowIso(),
    resources: [
      ...current.resources,
      {
        id: crypto.randomUUID(),
        label: input.label.trim().slice(0, 160),
        url: input.url.trim().slice(0, 1000),
        description: input.description.trim().slice(0, 600),
      },
    ],
  };

  return persistWorkspace(next);
}

async function persistWorkspace(next: ProjectWorkspace) {
  if (process.env.POSTGRES_URL) {
    await ensurePostgresSchema();
    await sql`
      UPDATE project_workspaces
      SET
        title = ${next.title},
        status = ${next.status},
        overview = ${next.overview},
        current_focus = ${next.currentFocus},
        next_step = ${next.nextStep},
        communication_guidance = ${next.communicationGuidance},
        contact_email = ${next.contactEmail},
        is_active = ${next.isActive},
        updated_at = ${next.updatedAt},
        milestones_json = ${JSON.stringify(next.milestones)}::jsonb,
        updates_json = ${JSON.stringify(next.updates)}::jsonb,
        resources_json = ${JSON.stringify(next.resources)}::jsonb
      WHERE id = ${next.id}
    `;
    return next;
  }

  const records = await readLocalWorkspaces();
  const index = records.findIndex((record) => record.id === next.id);
  if (index === -1) {
    return null;
  }
  records[index] = next;
  await writeLocalWorkspaces(records);
  return next;
}

export async function verifyWorkspaceAccess(slug: string, accessCode: string) {
  const workspace = await getWorkspaceBySlug(slug);
  if (!workspace || !workspace.isActive) {
    return null;
  }
  return workspace.accessCode === accessCode.trim().toUpperCase() ? workspace : null;
}

export async function listWorkspaceSummaries() {
  const workspaces = await listWorkspaces();
  return workspaces.map(toSummary);
}
