# Fixed Vercel Storage Build Bundle

This bundle targets the Vercel build failure from `src/lib/postgres.ts` and the missing schema-helper exports reported from `storage-health.ts`.

## Files included

- `apply-storage-fix.mjs`
  - Recommended application path.
  - Rewrites the exact three target files from the repository root.
  - Handles the current long-line formatting seen in the GitHub source.

- `its-ala/src/lib/postgres.ts`
  - Full replacement for the current one-line SQL wrapper.
  - Changes `unknown[]` to the primitive values accepted by `@vercel/postgres`.

- `fix-vercel-storage.patch`
  - Unified patch for:
    - `its-ala/src/lib/postgres.ts`
    - `its-ala/src/lib/workspace-store.ts`
    - `its-ala/src/lib/upstream-store.ts`

## Intended result

- Unblocks the TypeScript build error:
  - `Argument of type 'unknown' is not assignable to parameter of type 'Primitive'.`

- Resolves the compile warnings:
  - `ensureWorkspacePostgresSchema is not exported from '@/lib/workspace-store'`
  - `ensureUpstreamPostgresSchema is not exported from '@/lib/upstream-store'`

## Verification checklist

From the repository root, run:

```bash
node apply-storage-fix.mjs
```

Then verify:

```bash
cd its-ala
npm install
npm run typecheck
npm run build
```

Then deploy and check:

```txt
/api/health/storage
```

Expected production health once `POSTGRES_URL` is valid:

```json
{
  "mode": "postgres",
  "postgresReachable": true,
  "schemaReady": true
}
```

## Important note

This patch is designed from the exact Vercel build log and the public repo source visible under `swathell/super-umbrella/its-ala`.
I cannot honestly guarantee deployment from this environment because the full repository could not be cloned or built here due network restrictions, but this is the minimal empirical fix for the reported failure path.
