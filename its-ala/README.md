# Strong Storage Preflight Bundle

This is the no-more-blind-redeploy bundle.

The latest Vercel logs prove `main` still has this problem:

```ts
storage-health.ts imports names that upstream-store.ts and workspace-store.ts do not export.
```

This script patches `storage-health.ts` to stop importing the missing names and use already-exported store functions instead:

```ts
readUpstreamState()
listWorkspaces()
```

Those functions already call each store's private `ensurePostgresSchema()` when `POSTGRES_URL` is configured.

## Use

From the repository root:

```bash
node apply-and-preflight-storage-fix.mjs
```

The script will:

1. Patch `its-ala/src/lib/storage-health.ts`
2. Verify the missing export names are gone
3. Run:

```bash
cd its-ala
npm run typecheck
npm run build
```

Only commit and redeploy after this script passes locally.

## Why this is stronger

The previous deploy attempts were checking the fix only after Vercel cloned the repo.
This script refuses to finish unless the exact missing-import issue is gone and the app passes local TypeScript/build checks.
