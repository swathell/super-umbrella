import { readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const appDir = path.join(root, "its-ala");
const storageHealthPath = path.join(appDir, "src", "lib", "storage-health.ts");

function run(command, args, options = {}) {
  console.log(`\n$ ${[command, ...args].join(" ")}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

let source = await readFile(storageHealthPath, "utf8");

source = source.replace(
  'import { ensureUpstreamPostgresSchema } from "@/lib/upstream-store";',
  'import { readUpstreamState } from "@/lib/upstream-store";',
);

source = source.replace(
  'import { ensureWorkspacePostgresSchema } from "@/lib/workspace-store";',
  'import { listWorkspaces } from "@/lib/workspace-store";',
);

source = source.replace(
  "await ensureWorkspacePostgresSchema(); await ensureUpstreamPostgresSchema();",
  "await listWorkspaces(); await readUpstreamState();",
);

if (
  source.includes("ensureUpstreamPostgresSchema") ||
  source.includes("ensureWorkspacePostgresSchema")
) {
  throw new Error(
    "Patch incomplete: storage-health.ts still references missing schema exports.",
  );
}

if (!source.includes("readUpstreamState") || !source.includes("listWorkspaces")) {
  throw new Error(
    "Patch incomplete: storage-health.ts does not contain replacement health calls.",
  );
}

await writeFile(storageHealthPath, source, "utf8");
console.log("\nPatched its-ala/src/lib/storage-health.ts");

const patched = await readFile(storageHealthPath, "utf8");
if (patched.includes("ensureUpstreamPostgresSchema")) {
  throw new Error("Verification failed: ensureUpstreamPostgresSchema remains.");
}
if (patched.includes("ensureWorkspacePostgresSchema")) {
  throw new Error("Verification failed: ensureWorkspacePostgresSchema remains.");
}

console.log("Verified missing-export imports are gone.");

run("npm", ["run", "typecheck"], { cwd: appDir });
run("npm", ["run", "build"], { cwd: appDir });

console.log("\nStorage fix passed local typecheck and build.");
console.log("Commit only after this script completes successfully.");
