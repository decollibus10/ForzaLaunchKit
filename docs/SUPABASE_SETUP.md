# Supabase Setup

## Environment

Use publishable browser keys only in `NEXT_PUBLIC_` variables.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose the service role key in client code.

Hybrid launch default:

- Production uses Supabase Cloud project `rhofkdvolzgbhoananoi`.
- Local development uses the Docker-backed Supabase CLI stack.
- Cloudflare Workers must never point at `127.0.0.1` or `localhost`.
- Production deploy scripts inject `wrangler.jsonc` public vars so local
  `.env.local` values are not baked into the deployed client bundle.

Cloudflare Worker public vars:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rhofkdvolzgbhoananoi.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<cloud publishable key>
NEXT_PUBLIC_SITE_URL=https://forza-funding.com
```

Rotate the Supabase Cloud service-role key before setting it as a Worker secret:

```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npm run worker:secrets:check
```

## Local Self-Hosted Stack

This repo can run against the Docker-backed Supabase CLI stack for local development.
The local config uses the `583xx` port range so it can coexist with other Supabase
projects on the same machine.

```bash
npx supabase start -x vector
npx supabase status
```

Local service URLs:

- Studio: `http://127.0.0.1:58323`
- API: `http://127.0.0.1:58321`
- Database: `postgresql://postgres:postgres@127.0.0.1:58322/postgres`
- Mailpit: `http://127.0.0.1:58324`

Local app env:

- `.env.local` points Next.js dev/build commands at local Supabase.
- `.dev.vars` points local Wrangler/OpenNext preview at local Supabase.
- Both files are gitignored and must not be used for production deploys.

Use `npx supabase stop --project-id ForzaVentures` to stop this local stack.
The `vector` logging sidecar is excluded on this machine because Docker reports a
socket mount error for the active Colima context; API, Auth, REST, Storage,
Realtime, Studio, and the database still run locally.

## Auth

The app uses email magic links. Configure the Supabase confirmation email template so the confirmation link points to:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

## Data Model

Primary tables:

- `profiles`
- `leads`
- `merchant_profiles`
- `funders`
- `offers`
- `deal_files`
- `deal_events`
- `tasks`
- `ad_attribution`

Storage bucket:

- `merchant-documents`

## Security

RLS is enabled on all public tables. Merchant access is scoped to records connected to their `auth.uid()`. Admin access is granted by setting `public.profiles.role = 'admin'`.

Document object policies restrict access to paths beginning with the merchant profile id.
