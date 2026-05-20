import { promises as fs } from "fs";
import path from "path";
import { sql } from "@vercel/postgres";

export type LeadStatus = "new" | "reviewing" | "quoted" | "won" | "closed";

export type LeadRecord = {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  summary: string;
  status: LeadStatus;
  source: string;
  createdAt: string;
  notes: string;
};

type CreateLeadInput = Omit<LeadRecord, "id" | "createdAt" | "status" | "notes">;

const localDataPath = process.env.VERCEL
  ? path.join("/tmp", "leads.json")
  : path.join(process.cwd(), "tmp", "leads.json");

function createLeadId() {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function hasPostgres() {
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
}

async function ensureLocalStore() {
  await fs.mkdir(path.dirname(localDataPath), { recursive: true });

  try {
    await fs.access(localDataPath);
  } catch {
    await fs.writeFile(localDataPath, "[]", "utf8");
  }
}

async function readLocalLeads() {
  await ensureLocalStore();
  const raw = await fs.readFile(localDataPath, "utf8");
  return JSON.parse(raw) as LeadRecord[];
}

async function writeLocalLeads(leads: LeadRecord[]) {
  await ensureLocalStore();
  await fs.writeFile(localDataPath, JSON.stringify(leads, null, 2), "utf8");
}

export async function ensureLeadTable() {
  if (!hasPostgres()) {
    return;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT NOT NULL,
      project_type TEXT NOT NULL,
      budget TEXT NOT NULL,
      timeline TEXT NOT NULL,
      summary TEXT NOT NULL,
      status TEXT NOT NULL,
      source TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      notes TEXT NOT NULL
    )
  `;
}

export async function createLead(input: CreateLeadInput) {
  const lead: LeadRecord = {
    id: createLeadId(),
    name: input.name,
    email: input.email,
    company: input.company,
    projectType: input.projectType,
    budget: input.budget,
    timeline: input.timeline,
    summary: input.summary,
    source: input.source,
    status: "new",
    createdAt: new Date().toISOString(),
    notes: "",
  };

  if (hasPostgres()) {
    await ensureLeadTable();

    await sql`
      INSERT INTO leads (
        id, name, email, company, project_type, budget, timeline, summary, status, source, created_at, notes
      ) VALUES (
        ${lead.id},
        ${lead.name},
        ${lead.email},
        ${lead.company},
        ${lead.projectType},
        ${lead.budget},
        ${lead.timeline},
        ${lead.summary},
        ${lead.status},
        ${lead.source},
        ${lead.createdAt},
        ${lead.notes}
      )
    `;

    return { lead, storage: "postgres" as const };
  }

  const leads = await readLocalLeads();
  leads.unshift(lead);
  await writeLocalLeads(leads);
  return { lead, storage: "local" as const };
}

export async function listLeads() {
  if (hasPostgres()) {
    await ensureLeadTable();
    const result = await sql<{
      id: string;
      name: string;
      email: string;
      company: string;
      project_type: string;
      budget: string;
      timeline: string;
      summary: string;
      status: string;
      source: string;
      created_at: string;
      notes: string;
    }>`
      SELECT * FROM leads ORDER BY created_at DESC
    `;

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      company: row.company,
      projectType: row.project_type,
      budget: row.budget,
      timeline: row.timeline,
      summary: row.summary,
      status: row.status as LeadStatus,
      source: row.source,
      createdAt: row.created_at,
      notes: row.notes,
    })) satisfies LeadRecord[];
  }

  return readLocalLeads();
}

export async function getLeadById(id: string) {
  if (hasPostgres()) {
    await ensureLeadTable();
    const result = await sql<{
      id: string;
      name: string;
      email: string;
      company: string;
      project_type: string;
      budget: string;
      timeline: string;
      summary: string;
      status: string;
      source: string;
      created_at: string;
      notes: string;
    }>`
      SELECT * FROM leads WHERE id = ${id} LIMIT 1
    `;

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      company: row.company,
      projectType: row.project_type,
      budget: row.budget,
      timeline: row.timeline,
      summary: row.summary,
      status: row.status as LeadStatus,
      source: row.source,
      createdAt: row.created_at,
      notes: row.notes,
    } satisfies LeadRecord;
  }

  const leads = await readLocalLeads();
  return leads.find((lead) => lead.id === id) ?? null;
}
