import { sql } from "@/lib/postgres";

export type StorageHealth = {
  mode: "postgres" | "local-file";
  postgresConfigured: boolean;
  postgresReachable: boolean;
  schemaReady: boolean;
  message: string;
  tables?: Record<string, boolean>;
};

const expectedTables = [
  "inquiries",
  "lead_activity",
  "project_workspaces",
  "upstream_state",
];

export async function getStorageHealth(): Promise<StorageHealth> {
  if (!process.env.POSTGRES_URL) {
    return {
      mode: "local-file",
      postgresConfigured: false,
      postgresReachable: false,
      schemaReady: false,
      message: "POSTGRES_URL is missing. The app is using local fallback storage where supported.",
    };
  }

  try {
    await sql`SELECT 1 AS ok;`;

    const tableRows = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = ANY(${expectedTables})
    `;

    const present = new Set(tableRows.rows.map((row) => String(row.table_name)));
    const tables = Object.fromEntries(expectedTables.map((table) => [table, present.has(table)]));
    const schemaReady = expectedTables.every((table) => tables[table]);

    return {
      mode: "postgres",
      postgresConfigured: true,
      postgresReachable: true,
      schemaReady,
      tables,
      message: schemaReady
        ? "Postgres is reachable and expected tables are present."
        : "Postgres is reachable, but one or more expected tables are not present yet. Visit the admin areas or submit an inquiry to initialize schema.",
    };
  } catch (error) {
    const message = error instanceof Error ? `${error.name} - ${error.message}` : String(error);
    return {
      mode: "postgres",
      postgresConfigured: true,
      postgresReachable: false,
      schemaReady: false,
      message: `POSTGRES_URL is set, but the database could not be reached or initialized: ${message}`,
    };
  }
}
