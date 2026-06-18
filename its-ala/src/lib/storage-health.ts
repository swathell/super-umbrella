import { sql } from "@vercel/postgres";
import { ensureLeadPostgresSchema, getStorageMode } from "@/lib/lead-store";
import { ensureUpstreamPostgresSchema } from "@/lib/upstream-store";
import { ensureWorkspacePostgresSchema } from "@/lib/workspace-store";

export type StorageHealth = {
  mode: "postgres" | "local-file";
  postgresConfigured: boolean;
  postgresReachable: boolean;
  schemaReady: boolean;
  message: string;
  counts?: {
    leads: number;
    workspaces: number;
    upstreamStateRows: number;
  };
};

export async function getStorageHealth(): Promise<StorageHealth> {
  const mode = getStorageMode();

  if (mode === "local-file") {
    return {
      mode,
      postgresConfigured: false,
      postgresReachable: false,
      schemaReady: false,
      message: "POSTGRES_URL is missing. The app is using the local file fallback.",
    };
  }

  try {
    await sql`SELECT 1`;
    await ensureLeadPostgresSchema();
    await ensureWorkspacePostgresSchema();
    await ensureUpstreamPostgresSchema();

    const [leadCount, workspaceCount, upstreamRows] = await Promise.all([
      sql`SELECT COUNT(*)::int AS count FROM inquiries`,
      sql`SELECT COUNT(*)::int AS count FROM project_workspaces`,
      sql`SELECT COUNT(*)::int AS count FROM upstream_state`,
    ]);

    return {
      mode,
      postgresConfigured: true,
      postgresReachable: true,
      schemaReady: true,
      message: "Postgres is connected and all application tables are ready.",
      counts: {
        leads: Number(leadCount.rows[0]?.count ?? 0),
        workspaces: Number(workspaceCount.rows[0]?.count ?? 0),
        upstreamStateRows: Number(upstreamRows.rows[0]?.count ?? 0),
      },
    };
  } catch (error) {
    return {
      mode,
      postgresConfigured: true,
      postgresReachable: false,
      schemaReady: false,
      message:
        error instanceof Error
          ? `POSTGRES_URL is set, but the database could not be reached or initialized: ${error.message}`
          : "POSTGRES_URL is set, but the database could not be reached or initialized.",
    };
  }
}
