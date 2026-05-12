# FORZA ClearMatch Updated Finish Plan

_Last refreshed: 2026-05-06 13:48 EDT (America/New_York)_

## Finish Definition

The project is finished when FORZA ClearMatch is explicitly frozen as a release
candidate, deployed to Cloudflare Workers with the intended self-hosted Supabase
production values, validated on Worker and live-domain smoke paths, and approved for
controlled paid traffic with attribution and compliance gates documented.

## Verified Current State

### What is already working

- The real repo root is `ForzaVentures` on branch `main`.
- The active product shape is stable: NJ-first broker marketplace, public funnels,
  merchant dashboard, and internal admin deal desk.
- The current dirty worktree has been reviewed as a deliberate launch-candidate
  scope: SEO/discovery routes, funnel metadata consolidation, dashboard/admin
  noindex/auth-gate hardening, self-hosted Supabase deploy guards, Worker smoke
  coverage, and launch docs.
- Local core env validation is green:
  - `npm run env:check`
  - `npm run env:check:strict`
- Local compile validation is green:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
- Local Worker bundle generation is green:
  - `npm run cloudflare:build`
- The app now includes public-discovery assets in the App Router build:
  - `/robots.txt`
  - `/sitemap.xml`
  - `/opengraph-image`
  - `/twitter-image`
- The Worker helper scripts now keep Wrangler logs in repo-local ignored
  `.wrangler/logs`, avoiding macOS preference-write failures in automation.
- The smoke script now verifies unauthenticated `/dashboard` and `/admin`
  redirects and reports DNS causes such as `ENOTFOUND` directly.

### What is still blocked or unverified

- `npm run check:deploy` is blocked until `NEXT_PUBLIC_SUPABASE_URL` resolves to
  a public HTTPS self-hosted Supabase gateway instead of local development
  values.
- `npm run env:check:deploy`, `npm run check:deploy`, and
  `npm run bundle:env:check` all stop on that same production Supabase gateway
  requirement. Use `.env.production.local.example` as the copy/paste template.
- `npm run worker:secrets:check` reaches the real Cloudflare dependency and is
  blocked in this sandbox by missing `CLOUDFLARE_API_TOKEN` plus DNS failure for
  `dash.cloudflare.com`.
- `npm run preview` completes the OpenNext build but cannot bind
  `127.0.0.1` in this sandbox (`listen EPERM`), so local Worker route smoke
  cannot run here.
- Worker and production smoke paths are still unverified from this sandbox
  because both hosts return `ENOTFOUND` with no local DNS configuration:
  - `npm run smoke:worker`
  - `npm run smoke:prod`
- The App Router deprecation warning for `middleware` (prefers `proxy`) is still
  unaddressed but not part of the launch-critical path.

## Remaining Work In Order

### 1. Define and freeze the release candidate

Goal: convert current incremental edits into one deliberate launch set.

Status: completed for the current launch-candidate payload on
2026-05-06 13:48 EDT. Do not add non-launch feature work before the production
Supabase and Cloudflare gates below are cleared.

Steps:

1. Review app/routes/docs/scripts to ensure each change supports launch scope:
   broker marketplace, funnels, dashboard, admin, and deployment readiness.
2. Remove or defer non-launch polish and debug leftovers.
3. Finalize the launch artifact set in this plan and any launch checklist docs.
4. Confirm no accidental drift remains in the frozen payload.

Exit condition:

- A stable, scoped set of files is approved as the release candidate. Current
  candidate scope is recorded in `docs/launch-evidence/2026-05-06-local-launch-gates.md`.

### 2. Finalize deploy-style build inputs

Goal: make deploy checks represent production Supabase values, not local defaults.

Steps:

1. Create/update `.env.production.local` with launch values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL=https://forza-funding.com`
2. Re-run:
   - `npm run check:deploy`
   - `npm run bundle:env:check`
3. Verify generated build artifacts do not contain localhost or accidental
   development Supabase endpoints.

Exit condition:

- Deploy checks pass using production values only.

### 3. Complete Cloudflare Worker secret setup

Goal: make the release pathway executable in CI/production context.

Steps:

1. Provision valid `CLOUDFLARE_API_TOKEN` in the deploy environment.
2. Confirm required Worker secret names are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `META_CAPI_ACCESS_TOKEN` (when Meta conversion work begins)
3. Re-run `npm run worker:secrets:check` and resolve any missing/invalid values.
4. Re-run `npm run deploy` only after secret validation is clean.

Exit condition:

- Worker secret state is reproducible and matches script checks.

### 4. Validate Worker runtime before domain handoff

Goal: prove Cloudflare runtime behavior independently of DNS/domain config.

Steps:

1. Run `npm run smoke:worker`.
2. Verify core routes render expected content:
   - `/`
   - `/compare`
   - `/calculator`
   - `/login`
   - funnel routes under `/funnels/*`
3. Verify auth gating:
   - `/dashboard` -> `/login` when unauthenticated
   - `/admin` -> `/login` when unauthenticated
4. Validate lead write/read path (safe scope): `/api/leads` returns expected
   shape with authenticated handoff behavior.

Exit condition:

- Worker smoke coverage passes route and auth-gate behavior.

### 5. Validate live domain behavior

Goal: confirm `https://forza-funding.com` has no functional drift from Worker
validation.

Steps:

1. Confirm DNS for `forza-funding.com` and `www.forza-funding.com` points to
the intended Worker.
2. Run `npm run smoke:prod`.
3. Perform manual production checks not fully covered by smoke:
   - `/auth/confirm` magic-link path
   - merchant login and dashboard access
   - admin access for admin-marked profile
   - published offers visible; draft/archived offers hidden
   - documents upload path under `merchant-documents/<merchant_profile_id>/...`
4. Capture proof artifacts (screenshots or notes) for all checks.

Exit condition:

- Public and authenticated flows work correctly on both live hostnames.

### 6. Close attribution, compliance, and paid-traffic readiness

Goal: reduce non-technical launch risk before a controlled ad test.

Steps:

1. Confirm marketing/instrumentation env vars are present:
   - `NEXT_PUBLIC_GTM_ID` or `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
   - `NEXT_PUBLIC_GOOGLE_ADS_ID`
   - conversion labels for Google
   - `NEXT_PUBLIC_META_PIXEL_ID`
2. Verify UTM/ID persistence in lead attribution:
   - `utm_*`, `gclid`, `fbclid`, `_fbp`, `_fbc`
3. Confirm minimum event coverage in analytics layer:
   - `lead_submitted`
   - `calculator_lead`
   - `dashboard_started`
4. Audit copy/legal controls:
   - $500/month billing disclosure
   - 1% fee-cap framing
   - no direct-funder promises
   - no guaranteed approval claims
5. Capture counsel/operational sign-off for disclosures, privacy, ad copy, NJ
domain compliance.

Exit condition:

- Controlled traffic can run with attribution and legal/commercial controls documented.

### 7. Capture launch evidence bundle

Goal: avoid last-minute ambiguity for internal approval.

Steps:

1. Consolidate all smoke outputs, manual checks, and policy sign-offs in
   `docs/launch-evidence/` (or equivalent canonical folder).
2. Attach timestamps and command logs for:
   - `check:deploy`
   - `bundle:env:check`
   - `worker:secrets:check`
   - `smoke:worker`
   - `smoke:prod`
3. Note owner/signoff for each blocker and each completion condition.

Exit condition:

- One auditable evidence package exists for controlled-launch approval.

## Shortest Credible Next Path

1. Set production self-hosted Supabase values in `.env.production.local` or
   shell env:
   - `NEXT_PUBLIC_SUPABASE_URL=https://supabase.forza-funding.com` or the actual
     public HTTPS gateway.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<self-hosted publishable key>`.
   - `NEXT_PUBLIC_SITE_URL=https://forza-funding.com`.
2. Run `npm run check:deploy` and `npm run bundle:env:check` successfully.
3. Set Cloudflare auth/secrets, then clear `npm run worker:secrets:check`.
4. Deploy and run `npm run smoke:worker`, then `npm run smoke:prod`.
5. Finish attribution/compliance artifacts and collect launch evidence.

## Deferred Until After Launch

- Refactor deprecated `middleware` setup to `proxy`.
- All non-launch polish that does not materially affect launch-critical
  product/route/security/compliance paths.
