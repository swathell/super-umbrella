import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "@vercel/postgres";
import type { InquiryInput, InquiryRecord } from "@/lib/inquiries";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal-sent"
  | "won"
  | "lost";

export type LeadRecord = {
  id: string;
  createdAt: string;
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

const dataDir = path.join(process.cwd(), ".data");
const localFile = path.join(dataDir, "leads.json");
const legacyLocalFile = path.join(dataDir, "inquiries.json");

const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal-sent",
  "won",
  "lost",
];

function toLeadRecord(data: InquiryInput): LeadRecord {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
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
  };
}

function normalizeLeadRecord(record: InquiryRecord | LeadRecord): LeadRecord {
  return {
    id: record.id,
    createdAt: record.createdAt,
    name: record.name,
    email: record.email,
    company: record.company,
    projectType: record.projectType,
    timeline: record.timeline,
    budget: record.budget,
    projectSummary: record.projectSummary,
    source: record.source ?? "website",
    status:
      "status" in record && record.status && LEAD_STATUSES.includes(record.status)
        ? record.status
        : "new",
    notes: "notes" in record && typeof record.notes === "string" ? record.notes : "",
    archived: "archived" in record ? Boolean(record.archived) : false,
  };
}

async function ensurePostgresSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      project_type TEXT NOT NULL,
      timeline TEXT NOT NULL,
      budget TEXT NOT NULL,
      project_summary TEXT NOT NULL,
      source TEXT NOT NULL
    );
  `;

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
    if (status && record.status !== status) {
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
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

async function listPostgresLeads(options: LeadListOptions): Promise<LeadRecord[]> {
  await ensurePostgresSchema();
  const result = await sql`
    SELECT
      id,
      created_at,
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

  const rows = result.rows.map((row) => ({
    id: String(row.id),
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(String(row.created_at)).toISOString(),
    name: String(row.name),
    email: String(row.email),
    company: row.company ? String(row.company) : "",
    projectType: String(row.project_type),
    timeline: String(row.timeline),
    budget: String(row.budget),
    projectSummary: String(row.project_summary),
    source: String(row.source),
    status: LEAD_STATUSES.includes(String(row.status) as LeadStatus)
      ? (String(row.status) as LeadStatus)
      : "new",
    notes: row.notes ? String(row.notes) : "",
    archived: Boolean(row.archived),
  }));

  return filterLeads(rows, options);
}

async function getPostgresLeadById(id: string): Promise<LeadRecord | null> {
  await ensurePostgresSchema();
  const result = await sql`
    SELECT
      id,
      created_at,
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

  const row = result.rows[0];
  return {
    id: String(row.id),
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(String(row.created_at)).toISOString(),
    name: String(row.name),
    email: String(row.email),
    company: row.company ? String(row.company) : "",
    projectType: String(row.project_type),
    timeline: String(row.timeline),
    budget: String(row.budget),
    projectSummary: String(row.project_summary),
    source: String(row.source),
    status: LEAD_STATUSES.includes(String(row.status) as LeadStatus)
      ? (String(row.status) as LeadStatus)
      : "new",
    notes: row.notes ? String(row.notes) : "",
    archived: Boolean(row.archived),
  };
}

async function updatePostgresLead(id: string, updates: LeadUpdateInput) {
  await ensurePostgresSchema();
  const current = await getPostgresLeadById(id);

  if (!current) {
    return null;
  }

  await sql`
    UPDATE inquiries
    SET
      status = ${updates.status ?? current.status},
      notes = ${updates.notes ?? current.notes},
      archived = ${updates.archived ?? current.archived}
    WHERE id = ${id}
  `;

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
    updates.status && LEAD_STATUSES.includes(updates.status)
      ? updates.status
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

  records[index] = {
    ...records[index],
    status: nextStatus ?? records[index].status,
    notes: nextNotes ?? records[index].notes,
    archived: nextArchived ?? records[index].archived,
  };

  await writeLocalLeads(records);
  return records[index];
}

export const leadStatuses = LEAD_STATUSES;
