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

Self-hosted default:

- Local development uses the Docker-backed Supabase CLI stack.
- Public pre-customer deploys use a network-reachable self-hosted Supabase
  gateway that you control, for example `https://supabase.forza-funding.com`.
- Supabase Cloud URLs are blocked in deploy checks so the repo does not drift
  back into a paid backend before customers exist.
- Cloudflare Workers must never point at `127.0.0.1` or `localhost`.
- Production deploy scripts inject public Supabase values from
  `.env.production.local` or shell env so local `.env.local` values are not baked
  into the deployed client bundle.

Self-hosted production build env:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://supabase.forza-funding.com
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<self-hosted publishable key>
NEXT_PUBLIC_SITE_URL=https://forza-funding.com
```

### Where These Values Come From

- `NEXT_PUBLIC_SUPABASE_URL` is the external base URL of your self-hosted Supabase
  API gateway. In the Supabase Docker bundle `.env`, it should match the public
  URL fields you configure for internet access (for example,
  `SUPABASE_PUBLIC_URL` / `API_EXTERNAL_URL`).
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the client-side API key for your
  self-hosted Supabase project. In the Supabase Docker bundle `.env`, use
  `SUPABASE_PUBLISHABLE_KEY` when present; otherwise use the legacy `ANON_KEY`.
  Do not use `SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, or any server-only key in
  a `NEXT_PUBLIC_` variable.

### Deploy Gate Constraints (What The Scripts Enforce)

Deploy-style commands (`npm run env:check:deploy`, `npm run check:deploy`,
`npm run bundle:env:check`, `npm run deploy`, `npm run upload`) resolve public
variables from `.env.production.local` (then `.env.local`, `.env`, and
`.dev.vars`), the shell environment, and `wrangler.jsonc`, then enforce:

- `NEXT_PUBLIC_SUPABASE_URL` must start with `https://` and must not contain
  `localhost`, `127.0.0.1`, or `0.0.0.0`.
- Supabase Cloud URLs (hostnames ending in `.supabase.co`) are blocked.
- `NEXT_PUBLIC_SITE_URL` must start with `https://` and must not be local.

`npm run bundle:env:check` also scans `.next` and `.open-next` output and fails
if any localhost URLs or `.supabase.co` strings were inlined into the client
bundle.

Set the same Supabase values as Worker secrets so the Worker runtime can reach
the self-hosted gateway without committing backend coordinates:

```bash
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npm run worker:secrets:check
```

If you later choose Supabase Cloud after revenue exists, remove the deploy guard
intentionally and document the spend decision in this file.

## Local Self-Hosted Stack

This repo can run against the Docker-backed Supabase CLI stack for local development.
The local config uses the `583xx` port range so it can coexist with other Supabase
projects on the same machine.

```bash
npx supabase start -x vector
npm run supabase:status
npm run supabase:env
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

## Public Self-Hosted Stack

For a public pre-customer environment, use the official Supabase Docker
self-hosting bundle on a VPS or local server with HTTPS in front of it. Minimum
operator responsibilities: backups, upgrades, generated secrets, durable storage
volumes, HTTPS/DNS, logs, firewall rules, and monitoring.

Core shape:

```bash
git clone --depth 1 https://github.com/supabase/supabase
mkdir forza-supabase
cp -rf supabase/docker/* forza-supabase
cp supabase/docker/.env.example forza-supabase/.env
cd forza-supabase
docker compose pull
sh utils/generate-keys.sh
sh utils/add-new-auth-keys.sh
```

Before `docker compose up -d`, set:

```bash
SUPABASE_PUBLIC_URL=https://supabase.forza-funding.com
API_EXTERNAL_URL=https://supabase.forza-funding.com
SITE_URL=https://forza-funding.com
DASHBOARD_USERNAME=<strong username>
DASHBOARD_PASSWORD=<strong password>
```

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
