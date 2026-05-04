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
npm run check:deploy
npm run cloudflare:build
npx wrangler deploy --dry-run
npm run deploy
npm run smoke:prod
```

Use `npm run preview` for local Worker runtime testing.

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
