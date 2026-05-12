# 2026-05-06 Local Launch Gate Evidence

Captured: 2026-05-06 13:48 EDT

## Release-Candidate Scope

The current worktree is treated as the launch-candidate payload for the next
external activation pass. Scope is limited to:

- Public discovery and SEO assets: metadata helpers, structured data,
  `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, and `/twitter-image`.
- Funnel cleanup: shared paid-funnel definitions and per-route metadata.
- Private surface hardening: dashboard/admin noindex metadata and production
  redirects when demo data is unavailable.
- Self-hosted Supabase deploy guardrails: deploy checks reject local and
  Supabase Cloud URLs until a public self-hosted gateway is configured.
- Worker/script hardening: repo-local Wrangler logs, stricter Worker secret
  name checks, protected-route smoke coverage, and clearer DNS failure output.
- Launch docs and repo-local learning notes.

## Passed

- `npm run env:check`
- `npm run env:check:strict`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run cloudflare:build`

## Blocked

- `npm run check:deploy`
  - Blocker: `NEXT_PUBLIC_SUPABASE_URL` is still a local development value.
  - Required next value: a public HTTPS self-hosted Supabase gateway such as
    `https://supabase.forza-funding.com`.
- `npm run env:check:deploy`
  - Same blocker as `check:deploy`; use `.env.production.local.example` as the
    production-value template.
- `npm run bundle:env:check`
  - Same blocker as `check:deploy`; the bundle scan is intentionally blocked
    until production self-hosted Supabase values are present.
- `npm run worker:secrets:check`
  - Fixed: Wrangler logs now write to ignored `.wrangler/logs`.
  - Remaining blocker: Cloudflare access is unavailable here. `dash.cloudflare.com`
    returns `ENOTFOUND`, and `CLOUDFLARE_API_TOKEN` is unset.
- `npm run preview`
  - OpenNext build completes.
  - Local serving is blocked by sandbox networking: `listen EPERM 127.0.0.1`.
- `npm run smoke:worker`
  - Blocker: `https://forza-clearmatch.c10decollibus.workers.dev/` returns
    `ENOTFOUND` in this sandbox.
- `npm run smoke:prod`
  - Blocker: `https://forza-funding.com/` returns `ENOTFOUND` in this sandbox.

## Next Gate

Set production self-hosted Supabase values in `.env.production.local` or shell
env, then rerun:

```bash
npm run env:check:deploy
npm run check:deploy
npm run bundle:env:check
```

After that, set Cloudflare auth and Worker secrets, then rerun:

```bash
npm run worker:secrets:check
npm run deploy
npm run smoke:worker
npm run smoke:prod
```
