# Publishing Runbook

## Target

- Platform: Cloudflare Workers.
- Adapter: `@opennextjs/cloudflare`.
- Worker: `forza-clearmatch`.
- Domains: `https://forza-funding.com`, `https://www.forza-funding.com`.

## Deploy

```bash
npm install
npm run env:check:strict
npm run env:check:deploy
npm run worker:secrets:check
npm run check:deploy
npm run deploy
npm run smoke:prod
```

Use `npm run preview` for local Worker runtime testing. Local preview reads
`.dev.vars`, which points at the local Supabase stack. Copy
`.env.production.local.example` to `.env.production.local` for deploy-style
checks and replace the placeholders with the real self-hosted HTTPS gateway
values. `npm run env:check:deploy`, `npm run check:deploy`, `npm run deploy`,
and `npm run upload` inject the production public Worker variables before the
build. The deploy check also scans `.next` and `.open-next` so a local
`.env.local` Supabase URL cannot be silently inlined into the production client
bundle.

## Required Production Env

Set public values as Cloudflare Worker variables and server-only values as Worker secrets.

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_META_PIXEL_ID
META_CAPI_ACCESS_TOKEN
```

CLI secrets:

```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put META_CAPI_ACCESS_TOKEN
```

After rotating the Supabase service-role key, confirm Wrangler secret names:

```bash
npm run worker:secrets:check
```

The output must include `SUPABASE_SERVICE_ROLE_KEY`. If a JWT-like value appears
as a secret name, delete that misnamed secret and rotate the service-role key
again.

Workers Builds from GitHub also need build-time `NEXT_PUBLIC_` values so `next build` can inline them.

## Domain Notes

`wrangler.jsonc` declares custom domains for both hostnames. If Cloudflare reports a route conflict, remove the conflicting `76.76.21.21` A records or attach the domains manually from Workers & Pages > `forza-clearmatch` > Settings > Domains & Routes.

## Before Ads

- Confirm the live domain resolves to the Worker.
- Confirm Supabase auth, leads, dashboard, admin, uploads, and offer publishing work in production.
- Confirm analytics and conversion env vars are set.
- Do not publish the owner home address unless counsel says it is required.
- Use a compliant public business address strategy before Google Ads.
- Counsel must review disclosures, ad copy, commercial-financing obligations, privacy language, and document workflows.
