# Schema Export Fix Bundle

The latest Vercel log shows the original `postgres.ts` type failure is gone.
The remaining blocker is that `storage-health.ts` imports schema helpers that still are not exported:

- `ensureUpstreamPostgresSchema` from `src/lib/upstream-store.ts`
- `ensureWorkspacePostgresSchema` from `src/lib/workspace-store.ts`

This bundle fixes only that.

## Recommended use

From the repository root:

```bash
node apply-schema-export-fix.mjs
```

Then:

```bash
cd its-ala
npm run typecheck
npm run build
```

## What the script does

It appends these export aliases:

```ts
export { ensurePostgresSchema as ensureUpstreamPostgresSchema };
export { ensurePostgresSchema as ensureWorkspacePostgresSchema };
```

It does not rename the internal function, so existing calls inside each store remain intact.

## Why this is the right second fix

`storage-health.ts` already expects store-owned schema helpers. The stores already have private `ensurePostgresSchema()` functions. The cleanest unblock is to export those existing functions under the expected names.
