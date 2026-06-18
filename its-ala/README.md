# Exact Storage Health Replacement

Replace this file in the repo:

```txt
its-ala/src/lib/storage-health.ts
```

with:

```txt
exact-storage-health-replacement/its-ala/src/lib/storage-health.ts
```

This removes the two imports that Vercel keeps failing on:

```ts
ensureUpstreamPostgresSchema
ensureWorkspacePostgresSchema
```

Before committing, verify from the repository root:

```bash
grep -R "ensureUpstreamPostgresSchema\\|ensureWorkspacePostgresSchema" its-ala/src/lib/storage-health.ts
```

That command must print nothing.

Then run:

```bash
cd its-ala
npm run typecheck
npm run build
```

Only commit after both pass.
