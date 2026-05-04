# FORZA Launch Runbook

## Current Priority

Get `forza-funding.com` live on Cloudflare Workers, connected to production Supabase, and smoke-tested before paid traffic.

## Live URLs

- Worker URL: `https://forza-clearmatch.c10decollibus.workers.dev`
- Custom domains: `https://forza-funding.com`, `https://www.forza-funding.com`

Use the Worker URL until public DNS resolves for the custom domains.

## Fast Path

1. Set Cloudflare Worker variables and secrets.
2. Deploy the Worker.
3. Run production smoke tests.
4. Verify Supabase auth, leads, uploads, admin, and offer publishing.
5. Add Google/Meta tracking IDs.
6. Complete counsel review.
7. Start the 14-day ad test.

## Commands

```bash
npm run env:check
npm run env:check:strict
npm run worker:secrets:check
npm run typecheck
npm run lint
npm run build
npm run check:deploy
npm run deploy
npm run smoke:worker
npm run smoke:prod
```

Local Worker smoke test:

```bash
npm run preview
npm run smoke:local
```

`smoke:local` writes a demo lead to `/api/leads`. `smoke:prod` is read-only unless `SMOKE_WRITE=1` is set.

## Production Env

Required for launch:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` as a Worker secret

Required before paid traffic:

- `NEXT_PUBLIC_GTM_ID` or `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_ID`
- Google conversion labels
- `NEXT_PUBLIC_META_PIXEL_ID`
- `META_CAPI_ACCESS_TOKEN`

Never expose server-only tokens with `NEXT_PUBLIC_`.

Hybrid Supabase rule: local development can use `.env.local` with
`http://127.0.0.1:58321`, but production Worker builds must use the public
Supabase Cloud URL from `wrangler.jsonc`. The deploy scripts enforce this by
injecting Worker vars into the build environment.

The previous Supabase service-role value was exposed during setup and must be
rotated in Supabase Cloud before setting `SUPABASE_SERVICE_ROLE_KEY` in
Cloudflare.

## Smoke Test Coverage

Read-only checks:

- `/`
- `/compare`
- `/calculator`
- `/login`
- `/funnels/offer-dashboard-nj`
- `/funnels/compare-mca-offers-nj`
- `/funnels/mca-second-opinion-nj`
- `/funnels/factor-rate-calculator-nj`

Write check when enabled:

- `POST /api/leads`
- Confirms `{ id, nextUrl }`
- Confirms handoff URL starts with `/login`

## Operational Rhythm

Daily until ads launch:

- Review new leads and admin performance view.
- Confirm broken-link and smoke test status.
- Check missing production env vars.
- Move one merchant path closer to: dashboard start, outside-offer review, document upload, offer comparison, or scheduled call.

## Blockers Before Spend

- Live domain not resolving to Cloudflare Worker.
- Supabase service-role key not rotated and reset as a correctly named Worker secret.
- Supabase auth/RLS/uploads not verified.
- No compliant public business address strategy.
- No counsel review for disclosures, ad copy, privacy language, and NJ commercial-financing obligations.
- No conversion tracking verification.
