# FORZA ClearMatch Release Readiness Remediation

_Captured: 2026-05-06 (America/New_York)_

## Current release verdict

Release is **not ready**. Local compile gates are green, but deploy-style
environment validation, Cloudflare secret validation, and deployed smoke tests
remain blocked.

## Verified evidence snapshot

### Repo state

- Repo root: `ForzaVentures`
- Branch: `main`
- Worktree is dirty and not yet frozen as a deliberate release candidate.

### Green local gates

- `node /Users/moof/.codex/skills/forza-launch-operator/scripts/forza-preflight.mjs /Users/moof/Projects/Forza\ Capital\ LLC\ Business\ Workspace/ForzaVentures`
- `npm run env:check`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

### Red or blocked gates

- `npm run bundle:env:check`
  - Fails with `NEXT_PUBLIC_SUPABASE_URL must be a public HTTPS URL` because no
    deploy-style self-hosted Supabase gateway value is configured yet.
- `npm run check:deploy`
  - Fails because deploy-style validation resolves local `.env.local` values and
    sees `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:58321`.
- `npm run worker:secrets:check`
  - Fails fast with `CLOUDFLARE_API_TOKEN is required before Wrangler can
    validate secret names.`
- `npm run smoke:worker`
  - Not attempted in this pass because deploy and secret gates are still red.
- `npm run smoke:prod`
  - Not attempted in this pass because deploy and secret gates are still red.

## Top 10 unfinished release tasks

Ranked by release risk first, then dependency order.

1. Freeze the current release candidate and record the intentional ship set.
   Evidence: `git status --short` shows app, docs, scripts, config, and SEO
   changes still mixed together with no frozen approval artifact.
2. Supply real deploy-style production env values in `.env.production.local` or
   shell env.
   Evidence: `npm run check:deploy` fails because only local
   `http://127.0.0.1:58321` values are available in `.env.local`.
3. Make deploy-style env verification reproducible from repo artifacts alone.
   Evidence: `npm run bundle:env:check` fails standalone because it does not load
   the same production env sources as deploy-time checks.
4. Provide Cloudflare auth for Worker secret validation.
   Evidence: `npm run worker:secrets:check` fails in non-interactive mode
   without `CLOUDFLARE_API_TOKEN`.
5. Verify the required Worker secret names exist in Cloudflare.
   Evidence: `docs/QA_CHECKLIST.md` and `docs/PUBLISHING.md` require
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY`, but current validation cannot confirm them.
6. Clear the full deploy preflight.
   Evidence: `docs/PUBLISHING.md` defines `npm run check:deploy` as the main
   pre-deploy gate, and it is currently red.
7. Smoke-test the deployed Worker URL in read-only mode.
   Evidence: `docs/LAUNCH_RUNBOOK.md` requires `npm run smoke:worker` before
   custom-domain handoff, but it is still unverified.
8. Smoke-test both live domains after DNS is confirmed.
   Evidence: `docs/QA_CHECKLIST.md` requires route coverage on
   `https://forza-funding.com` and `https://www.forza-funding.com`.
9. Run authenticated production QA for auth, dashboard, admin, uploads, and
   published-offer visibility.
   Evidence: `docs/QA_CHECKLIST.md` still lists these as required launch gates.
10. Close attribution and compliance readiness, then assemble the final launch
    evidence bundle.
    Evidence: `docs/LAUNCH_RUNBOOK.md`, `docs/QA_CHECKLIST.md`, and
    `docs/UPDATED_FINISH_PLAN.md` all block paid traffic on tracking vars,
    disclosure review, and counsel sign-off.

## Task execution log

### Task 1. Freeze the release candidate and record the intentional ship set

Status: completed for documentation and evidence capture.

Actions:

- Captured the current gate outcomes in this canonical remediation file.
- Ranked the remaining release tasks from current repo docs and live gate
  output.
- Explicitly marked the release as blocked pending deploy env, Cloudflare
  secret access, and deployed smoke validation.

Verification:

- `git status --short`
- Reviewed `docs/UPDATED_FINISH_PLAN.md`, `docs/LAUNCH_RUNBOOK.md`,
  `docs/QA_CHECKLIST.md`, and `docs/PUBLISHING.md` against current gate output.

Result:

- PASS for release-candidate documentation freeze.
- FAIL for launch readiness overall; the repo is still blocked by Tasks 2-10.

### Task 2. Supply real deploy-style production env values

Status: blocked on credentials/infrastructure.

Actions:

- Verified the repo only has local runtime files: `.env.local` and `.dev.vars`.
- Confirmed no `.env.production.local` exists in the repo.
- Added `.env.production.local.example` so the required production-only inputs
  are now explicit and reproducible without committing secrets.

Verification:

- `ls -la .env* .dev.vars*`
- Redacted review of `.env.local` and `.dev.vars`
- `npm run check:deploy`

Result:

- FAIL. Deploy-style validation still sees local
  `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:58321`, so a real self-hosted
  HTTPS gateway value is still required before release.

### Task 3. Make deploy-style env verification reproducible from repo artifacts alone

Status: completed.

Actions:

- Added `scripts/env-utils.mjs` so deploy-time env parsing and Wrangler var
  loading are shared across release scripts.
- Updated `scripts/run-with-worker-vars.mjs` to report which env sources it
  resolved.
- Updated `scripts/check-bundle-env.mjs` to self-load deploy-style env instead
  of assuming exported shell vars.
- Added `npm run env:check:deploy` and documented the `.env.production.local`
  workflow in `README.md`, `AGENTS.md`, and `docs/PUBLISHING.md`.

Verification:

- `npm run env:check:deploy`
- `npm run bundle:env:check`
- `npm run typecheck`
- `npm run build`

Result:

- PASS. The gates now fail coherently on the real missing prerequisite: a public
  HTTPS self-hosted Supabase URL.
- PASS. `npm run typecheck` and `npm run build` remain green after the patch.

### Task 4. Provide Cloudflare auth for Worker secret validation

Status: blocked on credentials.

Actions:

- Patched `scripts/check-worker-secrets.mjs` to fail fast when
  `CLOUDFLARE_API_TOKEN` is missing instead of cascading into Wrangler noise.

Verification:

- `npm run worker:secrets:check`
- `npm run typecheck`

Result:

- FAIL. The script now reports the exact blocker:
  `CLOUDFLARE_API_TOKEN is required before Wrangler can validate secret names.`

## Remaining tasks after Task 4

1. Supply real deploy-style production env values in `.env.production.local` or shell env.
2. Provide Cloudflare auth for Worker secret validation.
3. Verify the required Worker secret names exist in Cloudflare.
4. Clear the full deploy preflight.
5. Smoke-test the deployed Worker URL in read-only mode.
6. Smoke-test both live domains after DNS is confirmed.
7. Run authenticated production QA for auth, dashboard, admin, uploads, and published-offer visibility.
8. Close attribution and compliance readiness.
9. Assemble the final launch evidence bundle.
