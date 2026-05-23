import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "@vercel/postgres";
import type { InquiryInput, InquiryRecord } from "@/lib/inquiries";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "won"
  | "lost";

export type LeadActivityType =
  | "lead_created"
  | "status_changed"
  | "notes_updated"
  | "archive_changed";

export type LeadActivity = {
  id: string;
  at: string;
  type: LeadActivityType;
  message: string;
};

export type LeadRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  statusUpdatedAt: string;
  name: string;
  email: string;
  company?: string;
  projectType: string;
  timeline: string;
  budget: string;
  projectSummary: string;
  source: string;
  status: LeadStatus;
  notes: string;
  archived: boolean;
  activity: LeadActivity[];
};

type LeadUpdateInput = {
  status?: LeadStatus;
  notes?: string;
  archived?: boolean;
};

type LeadListOptions = {
  query?: string;
  status?: string;
  archived?: "include" | "only" | "exclude";
  sort?: "newest" | "oldest";
};

export type StorageMode = "postgres" | "local-file";

const dataDir = path.join(process.cwd(), ".data");
const localFile = path.join(dataDir, "leads.json");
const legacyLocalFile = path.join(dataDir, "inquiries.json");

export const leadStatuses: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
];

function nowIso() {
  return new Date().toISOString();
}

function createActivity(type: LeadActivityType, message: string, at = nowIso()): LeadActivity {
  return {
    id: crypto.randomUUID(),
    at,
    type,
    message,
  };
}

export function statusLabel(status: LeadStatus) {
  switch (status) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "qualified":
      return "Qualified";
    case "proposal_sent":
      return "Proposal sent";
    case "won":
      return "Won";
    case "lost":
      return "Lost";
  }
}

function normalizeStatus(value: string | undefined): LeadStatus {
  const normalized = (value ?? "").replace("-", "_");
  if (leadStatuses.includes(normalized as LeadStatus)) {
    return normalized as LeadStatus;
  }
  return "new";
}

function toLeadRecord(data: InquiryInput): LeadRecord {
  const createdAt = nowIso();
  return {
    id: crypto.randomUUID(),
    createdAt,
    updatedAt: createdAt,
    statusUpdatedAt: createdAt,
    name: data.name,
    email: data.email,
    company: data.company,
    projectType: data.projectType,
    timeline: data.timeline,
    budget: data.budget,
    projectSummary: data.projectSummary,
    source: data.source ?? "website",
    status: "new",
    notes: "",
    archived: false,
    activity: [createActivity("lead_created", "Lead created from inquiry submission.", createdAt)],
  };
}

function normalizeLeadRecord(record: InquiryRecord | LeadRecord): LeadRecord {
  const createdAt = record.createdAt;
  const updatedAt =
    "updatedAt" in record && typeof record.updatedAt === "string" ? record.updatedAt : createdAt;
  const statusUpdatedAt =
    "statusUpdatedAt" in record && typeof record.statusUpdatedAt === "string"
      ? record.statusUpdatedAt
      : updatedAt;

  const activity =
    "activity" in record && Array.isArray(record.activity)
      ? record.activity.filter(
          (entry): entry is LeadActivity =>
            Boolean(
              entry &&
                typeof entry === "object" &&
                typeof entry.id === "string" &&
                typeof entry.at === "string" &&
                typeof entry.type === "string" &&
                typeof entry.message === "string",
            ),
        )
      : [createActivity("lead_created", "Lead created from legacy inquiry record.", createdAt)];

  return {
    id: record.id,
    createdAt,
    updatedAt,
    statusUpdatedAt,
    name: record.name,
    email: record.email,
    company: record.company,
    projectType: record.projectType,
    timeline: record.timeline,
    budget: record.budget,
    projectSummary: record.projectSummary,
    source: record.source ?? "website",
    status:
      "status" in record && typeof record.status === "string"
        ? normalizeStatus(record.status)
        : "new",
    notes: "notes" in record && typeof record.notes === "string" ? record.notes : "",
    archived: "archived" in record ? Boolean(record.archived) : false,
    activity,
  };
}

async function ensurePostgresSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      project_type TEXT NOT NULL,
      timeline TEXT NOT NULL,
      budget TEXT NOT NULL,
      project_summary TEXT NOT NULL,
      source TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      notes TEXT NOT NULL DEFAULT '',
      archived BOOLEAN NOT NULL DEFAULT FALSE
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS lead_activity (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL
    );
  `;

  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '';`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;`;
}

async function readLocalLeads(): Promise<LeadRecord[]> {
  await mkdir(dataDir, { recursive: true });

  try {
    const content = await readFile(localFile, "utf8");
    const parsed = JSON.parse(content) as Array<InquiryRecord | LeadRecord>;
    const normalized = parsed.map(normalizeLeadRecord);
    await writeFile(localFile, JSON.stringify(normalized, null, 2), "utf8");
    return normalized;
  } catch {
    try {
      const legacyContent = await readFile(legacyLocalFile, "utf8");
      const legacyParsed = JSON.parse(legacyContent) as InquiryRecord[];
      const migrated = legacyParsed.map(normalizeLeadRecord);
      await writeFile(localFile, JSON.stringify(migrated, null, 2), "utf8");
      return migrated;
    } catch {
      return [];
    }
  }
}

async function writeLocalLeads(records: LeadRecord[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(localFile, JSON.stringify(records, null, 2), "utf8");
}

function filterLeads(records: LeadRecord[], options: LeadListOptions) {
  const query = options.query?.trim().toLowerCase() ?? "";
  const status = options.status?.trim() ?? "";
  const archivedMode = options.archived ?? "exclude";
  const sorted = [...records].sort((left, right) => {
    const direction = options.sort === "oldest" ? 1 : -1;
    return (
      (new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()) * direction
    );
  });

  return sorted.filter((record) => {
    if (archivedMode === "exclude" && record.archived) {
      return false;
    }
    if (archivedMode === "only" && !record.archived) {
      return false;
    }
    if (status && record.status !== normalizeStatus(status)) {
      return false;
    }
    if (!query) {
      return true;
    }

    const haystack = [
      record.name,
      record.email,
      record.company ?? "",
      record.projectSummary,
      record.budget,
      record.projectType,
      record.notes,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

async function listPostgresActivities(leadIds: string[]) {
  if (leadIds.length === 0) {
    return new Map<string, LeadActivity[]>();
  }

  const map = new Map<string, LeadActivity[]>();

  for (const leadId of leadIds) {
    const result = await sql`
      SELECT id, lead_id, created_at, type, message
      FROM lead_activity
      WHERE lead_id = ${leadId}
      ORDER BY created_at DESC
    `;

    for (const row of result.rows) {
      const activity: LeadActivity = {
        id: String(row.id),
        at:
          row.created_at instanceof Date
            ? row.created_at.toISOString()
            : new Date(String(row.created_at)).toISOString(),
        type: String(row.type) as LeadActivityType,
        message: String(row.message),
      };
      const existing = map.get(leadId) ?? [];
      existing.push(activity);
      map.set(leadId, existing);
    }
  }

  return map;
}

function rowToLeadRecord(
  row: Record<string, unknown>,
  activity: LeadActivity[] = [],
): LeadRecord {
  return {
    id: String(row.id),
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(String(row.created_at)).toISOString(),
    updatedAt:
      row.updated_at instanceof Date
        ? row.updated_at.toISOString()
        : new Date(String(row.updated_at)).toISOString(),
    statusUpdatedAt:
      row.status_updated_at instanceof Date
        ? row.status_updated_at.toISOString()
        : new Date(String(row.status_updated_at)).toISOString(),
    name: String(row.name),
    email: String(row.email),
    company: row.company ? String(row.company) : "",
    projectType: String(row.project_type),
    timeline: String(row.timeline),
    budget: String(row.budget),
    projectSummary: String(row.project_summary),
    source: String(row.source),
    status: normalizeStatus(String(row.status)),
    notes: row.notes ? String(row.notes) : "",
    archived: Boolean(row.archived),
    activity,
  };
}

async function listPostgresLeads(options: LeadListOptions): Promise<LeadRecord[]> {
  await ensurePostgresSchema();
  const result = await sql`
    SELECT
      id,
      created_at,
      updated_at,
      status_updated_at,
      name,
      email,
      company,
      project_type,
      timeline,
      budget,
      project_summary,
      source,
      status,
      notes,
      archived
    FROM inquiries
  `;

  const leadIds = result.rows.map((row) => String(row.id));
  const activityMap = await listPostgresActivities(leadIds);
  const rows = result.rows.map((row) => rowToLeadRecord(row, activityMap.get(String(row.id)) ?? []));

  return filterLeads(rows, options);
}

async function getPostgresLeadById(id: string): Promise<LeadRecord | null> {
  await ensurePostgresSchema();
  const result = await sql`
    SELECT
      id,
      created_at,
      updated_at,
      status_updated_at,
      name,
      email,
      company,
      project_type,
      timeline,
      budget,
      project_summary,
      source,
      status,
      notes,
      archived
    FROM inquiries
    WHERE id = ${id}
    LIMIT 1
  `;

  if (result.rows.length === 0) {
    return null;
  }

  const activityMap = await listPostgresActivities([id]);
  return rowToLeadRecord(result.rows[0], activityMap.get(id) ?? []);
}

async function recordPostgresActivity(leadId: string, entries: LeadActivity[]) {
  for (const entry of entries) {
    await sql`
      INSERT INTO lead_activity (id, lead_id, created_at, type, message)
      VALUES (${entry.id}, ${leadId}, ${entry.at}, ${entry.type}, ${entry.message});
    `;
  }
}

async function updatePostgresLead(id: string, updates: LeadUpdateInput) {
  await ensurePostgresSchema();
  const current = await getPostgresLeadById(id);

  if (!current) {
    return null;
  }

  const updatedAt = nowIso();
  const activity: LeadActivity[] = [];
  const nextStatus = updates.status ?? current.status;
  const nextNotes = updates.notes ?? current.notes;
  const nextArchived = updates.archived ?? current.archived;
  const statusUpdatedAt = nextStatus !== current.status ? updatedAt : current.statusUpdatedAt;

  if (nextStatus !== current.status) {
    activity.push(
      createActivity(
        "status_changed",
        `Status changed from ${statusLabel(current.status)} to ${statusLabel(nextStatus)}.`,
        updatedAt,
      ),
    );
  }

  if (nextNotes !== current.notes) {
    activity.push(createActivity("notes_updated", "Internal notes updated.", updatedAt));
  }

  if (nextArchived !== current.archived) {
    activity.push(
      createActivity(
        "archive_changed",
        nextArchived ? "Lead archived." : "Lead restored from archive.",
        updatedAt,
      ),
    );
  }

  await sql`
    UPDATE inquiries
    SET
      status = ${nextStatus},
      notes = ${nextNotes},
      archived = ${nextArchived},
      updated_at = ${updatedAt},
      status_updated_at = ${statusUpdatedAt}
    WHERE id = ${id}
  `;

  if (activity.length > 0) {
    await recordPostgresActivity(id, activity);
  }

  return getPostgresLeadById(id);
}

export async function saveInquiry(data: InquiryInput) {
  const record = toLeadRecord(data);
  const usingPostgres = Boolean(process.env.POSTGRES_URL);

  if (usingPostgres) {
    await ensurePostgresSchema();
    await sql`
      INSERT INTO inquiries (
        id,
        created_at,
        updated_at,
        status_updated_at,
        name,
        email,
        company,
        project_type,
        timeline,
        budget,
        project_summary,
        source,
        status,
        notes,
        archived
      ) VALUES (
        ${record.id},
        ${record.createdAt},
        ${record.updatedAt},
        ${record.statusUpdatedAt},
        ${record.name},
        ${record.email},
        ${record.company ?? ""},
        ${record.projectType},
        ${record.timeline},
        ${record.budget},
        ${record.projectSummary},
        ${record.source},
        ${record.status},
        ${record.notes},
        ${record.archived}
      );
    `;

    await recordPostgresActivity(record.id, record.activity);
    return { record, storage: "postgres" as const };
  }

  const existing = await readLocalLeads();
  existing.unshift(record);
  await writeLocalLeads(existing);
  return { record, storage: "local-file" as const };
}

export async function listLeads(options: LeadListOptions = {}) {
  if (process.env.POSTGRES_URL) {
    return listPostgresLeads(options);
  }

  const records = await readLocalLeads();
  return filterLeads(records, options);
}

export async function getLeadById(id: string) {
  if (process.env.POSTGRES_URL) {
    return getPostgresLeadById(id);
  }

  const records = await readLocalLeads();
  return records.find((record) => record.id === id) ?? null;
}

export async function updateLead(id: string, updates: LeadUpdateInput) {
  const nextStatus =
    updates.status && leadStatuses.includes(normalizeStatus(updates.status))
      ? normalizeStatus(updates.status)
      : undefined;
  const nextNotes = typeof updates.notes === "string" ? updates.notes.slice(0, 8000) : undefined;
  const nextArchived =
    typeof updates.archived === "boolean" ? updates.archived : undefined;

  if (process.env.POSTGRES_URL) {
    return updatePostgresLead(id, {
      status: nextStatus,
      notes: nextNotes,
      archived: nextArchived,
    });
  }

  const records = await readLocalLeads();
  const index = records.findIndex((record) => record.id === id);

  if (index === -1) {
    return null;
  }

  const current = records[index];
  const updatedAt = nowIso();
  const nextRecord: LeadRecord = {
    ...current,
    status: nextStatus ?? current.status,
    notes: nextNotes ?? current.notes,
    archived: nextArchived ?? current.archived,
    updatedAt,
    statusUpdatedAt:
      nextStatus && nextStatus !== current.status ? updatedAt : current.statusUpdatedAt,
    activity: [...current.activity],
  };

  if (nextRecord.status !== current.status) {
    nextRecord.activity.unshift(
      createActivity(
        "status_changed",
        `Status changed from ${statusLabel(current.status)} to ${statusLabel(nextRecord.status)}.`,
        updatedAt,
      ),
    );
  }

  if (nextRecord.notes !== current.notes) {
    nextRecord.activity.unshift(
      createActivity("notes_updated", "Internal notes updated.", updatedAt),
    );
  }

  if (nextRecord.archived !== current.archived) {
    nextRecord.activity.unshift(
      createActivity(
        "archive_changed",
        nextRecord.archived ? "Lead archived." : "Lead restored from archive.",
        updatedAt,
      ),
    );
  }

  records[index] = nextRecord;
  await writeLocalLeads(records);
  return nextRecord;
}

export function getStorageMode(): StorageMode {
  return process.env.POSTGRES_URL ? "postgres" : "local-file";
}
