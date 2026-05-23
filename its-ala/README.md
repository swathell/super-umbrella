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

## Inquiry record shape

Each submission is stored with:

- `id`
- `createdAt`
- `name`
- `email`
- `company`
- `projectType`
- `timeline`
- `budget`
- `projectSummary`
- `source`

## Local setup

1. Install dependencies:
   - `npm install`
2. Copy env file:
   - `cp .env.example .env.local`
3. Run the app:
   - `npm run dev`
4. Open:
   - `http://localhost:3000`

## Storage behavior

- If `POSTGRES_URL` is available, inquiries are written to a Postgres table named `inquiries`.
- If `POSTGRES_URL` is missing, inquiries are stored in `.data/inquiries.json` for local development.

## Environment variables

- `NEXT_PUBLIC_SITE_URL`: base URL used by the app
- `NOTIFICATION_EMAIL`: reserved for later email notification work
- `RESEND_API_KEY`: reserved for later email delivery work
- `POSTGRES_URL`: enables durable inquiry storage
- `POSTGRES_PRISMA_URL`: optional companion Postgres setting for Vercel environments
