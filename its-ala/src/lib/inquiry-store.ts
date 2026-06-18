import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "@/lib/postgres";
import type { InquiryInput, InquiryRecord } from "@/lib/inquiries";

const dataDir = path.join(process.cwd(), ".data");
const localFile = path.join(dataDir, "inquiries.json");

function createRecord(data: InquiryInput): InquiryRecord {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...data,
  };
}

async function saveToLocalFile(record: InquiryRecord) {
  await mkdir(dataDir, { recursive: true });

  let existing: InquiryRecord[] = [];

  try {
    const content = await readFile(localFile, "utf8");
    existing = JSON.parse(content) as InquiryRecord[];
  } catch {
    existing = [];
  }

  existing.unshift(record);
  await writeFile(localFile, JSON.stringify(existing, null, 2), "utf8");
}

async function saveToPostgres(record: InquiryRecord) {
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
      source
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
      ${record.source ?? "website"}
    );
  `;
}

export async function saveInquiry(data: InquiryInput) {
  const record = createRecord(data);
  const usingPostgres = Boolean(process.env.POSTGRES_URL);

  if (usingPostgres) {
    await saveToPostgres(record);
    return { record, storage: "postgres" as const };
  }

  await saveToLocalFile(record);
  return { record, storage: "local-file" as const };
}
