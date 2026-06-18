import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const postgresPath = path.join(root, "its-ala", "src", "lib", "postgres.ts");
const workspaceStorePath = path.join(
  root,
  "its-ala",
  "src",
  "lib",
  "workspace-store.ts",
);
const upstreamStorePath = path.join(
  root,
  "its-ala",
  "src",
  "lib",
  "upstream-store.ts",
);

const postgresSource = `import { createClient } from "@vercel/postgres";

const connectionString = process.env.POSTGRES_URL;
const client = createClient(connectionString ? { connectionString } : undefined);

export type SqlPrimitive = string | number | boolean | null | undefined;

export function sql(strings: TemplateStringsArray, ...values: SqlPrimitive[]) {
  return client.sql(strings, ...values);
}
`;

async function replacePostgresWrapper() {
  await writeFile(postgresPath, postgresSource, "utf8");
}

async function exportSchemaHelper(filePath, exportedName, nextFunctionName) {
  let source = await readFile(filePath, "utf8");

  if (source.includes(`export async function ${exportedName}(`)) {
    console.log(`${exportedName} already exported`);
    return;
  }

  source = source.replace(
    /async function ensurePostgresSchema\(\)\s*\{/,
    `export async function ${exportedName}() {`,
  );

  if (!source.includes(`const ensurePostgresSchema = ${exportedName};`)) {
    source = source.replace(
      new RegExp(`(}\\s*async function ${nextFunctionName}\\()`, "m"),
      `}\n\nconst ensurePostgresSchema = ${exportedName};\n\nasync function ${nextFunctionName}(`,
    );
  }

  if (!source.includes(`export async function ${exportedName}(`)) {
    throw new Error(
      `Could not export ${exportedName}. The local schema helper shape was not recognized in ${filePath}.`,
    );
  }

  await writeFile(filePath, source, "utf8");
}

await replacePostgresWrapper();
await exportSchemaHelper(
  workspaceStorePath,
  "ensureWorkspacePostgresSchema",
  "readLocalWorkspaces",
);
await exportSchemaHelper(
  upstreamStorePath,
  "ensureUpstreamPostgresSchema",
  "readLocalState",
);

console.log("Storage build fix applied.");
