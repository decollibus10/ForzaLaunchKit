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
cp .env.example .env.local
cp .dev.vars.example .dev.vars
cp .env.production.local.example .env.production.local
npm run dev
npm run cf-typegen
npm run typecheck
npm run lint
npm run build
npm run check
npm run env:check:deploy
npm run start
npm run bundle:env:check
```

## Worker And Deploy Workflow

Use these when validating or shipping the Cloudflare Worker target:

```bash
npm run env:check
npm run env:check:strict
npm run env:check:deploy
npm run worker:secrets:check
npm run worker:secrets:check:paid
npm run preview
npm run smoke:local
npm run check:deploy
npm run check:deploy:raw
npm run cloudflare:build
npm run upload
npm run upload:raw
npm run deploy
npm run deploy:raw
npm run smoke:worker
npm run smoke:prod
```

Set production secrets before deploys that will use public self-hosted Supabase:

```bash
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

Notes:

- `preview` runs the local OpenNext/Worker runtime.
- `smoke:local` writes a demo lead against `http://localhost:8787`.
- `smoke:worker` and `smoke:prod` are read-only by default.
- Set `SMOKE_WRITE=1` only when you intentionally want a write-enabled smoke against a non-local target.
- `check:deploy`, `deploy`, and `upload` use `scripts/run-with-worker-vars.mjs` so production public vars are injected before the build.

## Supabase Workflow

```bash
npm run supabase:start
npm run supabase:reset
npm run supabase:migrations
npm run supabase:env
npm run supabase:status
npm run supabase:stop
```

Local defaults documented in this repo:

- Studio: `http://127.0.0.1:58323`
- API: `http://127.0.0.1:58321`
- DB: `postgresql://postgres:postgres@127.0.0.1:58322/postgres`
- Mailpit: `http://127.0.0.1:58324`
- `.env.local` is for Next.js dev/build commands.
- `.env.production.local` is for deploy-style checks and Cloudflare/OpenNext
  production builds.
- `.dev.vars` is for local Wrangler/OpenNext preview.

## Codex Skills

- Use `forza-launch-operator` for launch gating, deploy sequencing, and finish-plan updates in this repo.
- Use `forza-paid-funnel-qa` for ad/funnel QA passes before traffic changes.
- Use `forza-supabase-dealroom` for Supabase-backed marketplace and dashboard work.
- Use `forza-offer-checker-extension` for offer comparison/funnel extension validation when editing checkout logic, offer cards, and funnel links.
- Use `cloudflare:wrangler` when the task depends on Wrangler config, deploy behavior, or Worker routing.
- Use `self-improving-agent` for self-improvement automation, durable `.learnings` capture, and promotion of recurring agent guidance.
- Before creating or validating repo-local skills from automation memory, verify the actual filesystem first; this workspace may not contain older `outputs/codex-skills` artifacts referenced by prior runs.
- TODO: add `forza-attribution-debugger` for conversion-event, tracking, and campaign verification before paid spend (`docs/AD_PIPELINES.md`, `docs/QA_CHECKLIST.md`).
- TODO: add `forza-live-operator-flow-verifier` when full funnel flow proof (`/funnels/*`, `/api/leads`, admin, uploads) is required in one pass.

## Useful Plugins

Use these plugins first when the work fits their lane, and keep exploring newly available plugins as ClearMatch adds launch, dealroom, funding, and traffic workflows:

- `Build Web Apps` for Next.js App Router implementation, dashboards, funnels, and UI/product work.
- `Supabase` for auth, database, storage, RLS, dealroom, and production migration tasks.
- `Cloudflare` for OpenNext Workers, Wrangler, secrets, deploys, DNS, and smoke verification.
- `Stripe` for subscriptions, broker/payment flows, and future monetization surfaces.
- `Spreadsheets` for funder buy-box research, offer comparison workbooks, and source-backed exports.
- `Gmail` for funder outreach, broker/customer follow-up, and launch communication workflows when mail access is needed.
- `Browser Use` for dashboard, funnel, auth, and production route click-through checks.
- `GitHub` for PRs, CI, code review, and release-publish workflow.

## Guardrails

- Treat `npm run check:deploy` as the main pre-deploy verification path; it runs app checks, a Worker dry run, and bundle env validation.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it as a `NEXT_PUBLIC_` variable.
- Before paid traffic changes, review [`docs/QA_CHECKLIST.md`](/Users/moof/Projects/Forza%20Capital%20LLC%20Business%20Workspace/ForzaVentures/docs/QA_CHECKLIST.md) and [`docs/LAUNCH_RUNBOOK.md`](/Users/moof/Projects/Forza%20Capital%20LLC%20Business%20Workspace/ForzaVentures/docs/LAUNCH_RUNBOOK.md).
- Before ads and traffic, verify funnel pages/events in [`docs/AD_PIPELINES.md`](/Users/moof/Projects/Forza%20Capital%20LLC%20Business%20Workspace/ForzaVentures/docs/AD_PIPELINES.md): `/funnels/offer-dashboard-nj`, `/funnels/compare-mca-offers-nj`, `/funnels/mca-second-opinion-nj`, `/funnels/factor-rate-calculator-nj`, and events `lead_submitted`, `calculator_lead`, `dashboard_started`.
