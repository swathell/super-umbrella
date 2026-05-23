# Its Ala

`Its Ala` is a Vercel-ready Next.js project for:

- the public trust-first website
- the intake and lead capture flow
- the future admin workspace for leads and projects

## What is implemented now

- a public-facing marketing site for custom apps, internal tools, and AI workflows
- a responsive intake section with client-side feedback
- a server-side inquiry API with validation
- inquiry persistence using Vercel Postgres when configured
- a local JSON fallback for development when Postgres is not configured
- an internal leads workspace with list and detail views
- lead status and notes updates
- Resend email notifications for new leads
- password-gated admin protection
- lightweight lead activity history for auditability
- a minimal client workspace layer linked to converted leads

## Lead record shape

Each submission becomes a lead record with:

- `id`
- `createdAt`
- `updatedAt`
- `statusUpdatedAt`
- `name`
- `email`
- `company`
- `projectType`
- `timeline`
- `budget`
- `projectSummary`
- `source`
- `status`
- `notes`
- `archived`
- `activity`

## Local setup

1. Install dependencies:
   - `npm install`
2. Copy env file:
   - `cp .env.example .env.local`
3. Run the app:
   - `npm run dev`
4. Open:
   - `http://localhost:3000`

## Internal workspace

- `/admin/leads`: list view with search, status filtering, archived filtering, and recent-first sorting
- `/admin/leads/[id]`: detail view with full project context, visible status, and internal notes editing
- `/admin/login`: admin sign-in for protected routes
- `/admin/workspaces`: index of active client workspaces
- `/admin/workspaces/[id]`: operator workspace management page for client-visible projects

## Client workspace MVP

- Workspaces are created from a lead record when a project is ready to move into active delivery.
- Each workspace includes:
  - overview
  - current focus
  - next step
  - milestones
  - progress updates
  - shared links
  - contact guidance
- Client access uses a per-workspace access code and a lightweight signed session.
- Client-facing route:
  - `/client/[slug]`
- Client access screen:
  - `/client/[slug]/login`

## Storage behavior

- If `POSTGRES_URL` is available, leads are written to a Postgres table named `inquiries`.
- If `POSTGRES_URL` is missing, leads are stored in `.data/leads.json` for local development.
- Existing local `.data/inquiries.json` data is migrated forward automatically when present.
- When Postgres is enabled, lead activity is also stored in a `lead_activity` table.
- Client workspace data is stored in `project_workspaces` in Postgres, or `.data/workspaces.json` in local development.

## Notifications

- New lead notifications are sent through Resend when `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `NOTIFICATION_EMAIL` are configured.
- Submitter confirmation email is sent by default and can be disabled with `SEND_CONFIRMATION_EMAIL=false`.
- If email config is incomplete, lead saving still succeeds and the system logs a clear warning instead of failing silently.

## Admin protection

- In production, `/admin/*` routes require a password-gated session using `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
- In local development, auth is bypassed only when those variables are not configured, to keep local iteration practical.
- If admin auth is misconfigured in production, the login screen explains what is missing.

## Environment variables

- `NEXT_PUBLIC_SITE_URL`: base URL used by the app
- `NOTIFICATION_EMAIL`: operator inbox for new lead notifications
- `RESEND_API_KEY`: Resend API key for outbound email
- `RESEND_FROM_EMAIL`: verified sender used for Resend email delivery
- `SEND_CONFIRMATION_EMAIL`: set to `false` to disable submitter confirmation email
- `POSTGRES_URL`: enables durable inquiry storage
- `POSTGRES_PRISMA_URL`: optional companion Postgres setting for Vercel environments
- `ADMIN_PASSWORD`: password used for the admin login screen
- `ADMIN_SESSION_SECRET`: secret used to sign the admin session cookie
- `CLIENT_SESSION_SECRET`: optional dedicated secret for client workspace sessions; falls back to `ADMIN_SESSION_SECRET` when omitted
