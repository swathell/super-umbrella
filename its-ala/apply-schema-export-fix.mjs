import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const targets = [
  {
    file: path.join(root, "its-ala", "src", "lib", "upstream-store.ts"),
    exportLine: "export { ensurePostgresSchema as ensureUpstreamPostgresSchema };",
    exportName: "ensureUpstreamPostgresSchema",
  },
  {
    file: path.join(root, "its-ala", "src", "lib", "workspace-store.ts"),
    exportLine:
      "export { ensurePostgresSchema as ensureWorkspacePostgresSchema };",
    exportName: "ensureWorkspacePostgresSchema",
  },
];

for (const target of targets) {
  let source = await readFile(target.file, "utf8");

  if (source.includes(target.exportName)) {
    console.log(`${target.exportName} is already present in ${target.file}`);
    continue;
  }

  if (!source.includes("async function ensurePostgresSchema()")) {
    throw new Error(
      `Could not find the local ensurePostgresSchema function in ${target.file}`,
    );
  }

  source = `${source.trimEnd()}\n\n${target.exportLine}\n`;
  await writeFile(target.file, source, "utf8");
  console.log(`Added ${target.exportName} export to ${target.file}`);
}

console.log("Schema export fix applied.");
