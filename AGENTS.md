# AGENTS.md

## Scope

This repo is FORZA ClearMatch, a Next.js App Router app deployed to Cloudflare Workers via OpenNext, with Supabase as the backing auth/database/storage platform.

## Working Defaults

- Run commands from the repo root: `/Users/moof/Projects/Forza Capital LLC Business Workspace/ForzaVentures`.
- Prefer the checked-in npm scripts over ad hoc commands.
- For Supabase CLI tasks, use the repo scripts or `npx supabase ...`; do not assume a globally installed `supabase` binary.
- Do not use local `localhost` or `127.0.0.1` Supabase values for production Worker builds. The deploy wrappers inject public Worker vars from `wrangler.jsonc`.

## Core Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run check
```

## Worker And Deploy Workflow

Use these when validating or shipping the Cloudflare Worker target:

```bash
npm run env:check
npm run env:check:strict
npm run worker:secrets:check
npm run preview
npm run smoke:local
npm run check:deploy
npm run deploy
npm run smoke:worker
npm run smoke:prod
```

Notes:

- `preview` runs the local OpenNext/Worker runtime.
- `smoke:local` writes a demo lead against `http://localhost:8787`.
- `smoke:worker` and `smoke:prod` are read-only by default.
- `check:deploy`, `deploy`, and `upload` use `scripts/run-with-worker-vars.mjs` so production public vars are injected before the build.

## Supabase Workflow

```bash
npm run supabase:start
npm run supabase:reset
npm run supabase:migrations
npx supabase status
npx supabase stop --project-id ForzaVentures
```

Local defaults documented in this repo:

- Studio: `http://127.0.0.1:58323`
- API: `http://127.0.0.1:58321`
- DB: `postgresql://postgres:postgres@127.0.0.1:58322/postgres`

## Guardrails

- Treat `npm run check:deploy` as the main pre-deploy verification path; it runs app checks, a Worker dry run, and bundle env validation.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it as a `NEXT_PUBLIC_` variable.
- Before paid traffic changes, review [`docs/QA_CHECKLIST.md`](/Users/moof/Projects/Forza%20Capital%20LLC%20Business%20Workspace/ForzaVentures/docs/QA_CHECKLIST.md) and [`docs/LAUNCH_RUNBOOK.md`](/Users/moof/Projects/Forza%20Capital%20LLC%20Business%20Workspace/ForzaVentures/docs/LAUNCH_RUNBOOK.md).
