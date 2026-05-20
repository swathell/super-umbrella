# Its Ala

`Its Ala` is a Vercel-ready Next.js project for:

- the public trust-first website
- the intake and lead capture flow
- the future admin workspace for leads and projects

## Local setup

1. Install dependencies:
   - `npm install`
2. Copy env file:
   - `cp .env.example .env.local`
3. Run the app:
   - `npm run dev`

## Vercel beginner setup

1. Create a GitHub repository and push this folder.
2. In Vercel, click `Add New` -> `Project`.
3. Import the GitHub repository.
4. Let Vercel detect `Next.js`.
5. Add environment variables in `Project Settings` -> `Environment Variables`.
6. Deploy.
7. Connect `itsala.com` later under `Domains`.

## Current scope

- Marketing pages
- Working intake UI and API route foundation
- Lead storage via Vercel Postgres when configured
- Local fallback storage for development
- Basic admin leads list and detail views

## Next phase

- Email delivery with Resend
- Authentication for admin routes
- Lead status editing
- Durable production-ready storage confirmation
- Client workspaces
