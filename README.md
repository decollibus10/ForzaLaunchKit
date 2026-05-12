# FORZA ClearMatch

FORZA ClearMatch is the new focused product for **FORZA CAPITAL PARTNERS LLC**: an NJ-first MCA broker marketplace and merchant deal-room dashboard.

The old owner-funded launch kit, WordPress theme, investor deck, AI audit offer, static export, and newsletter tooling have been removed from the active project. The repo now centers on three surfaces:

- Public acquisition funnels for Meta and Google traffic.
- A merchant dashboard for MCA offer comparison, document status, renewal/payoff tracking, and outside-offer review.
- An internal admin deal desk for lead review, funder shopping, offer entry, and publish/unpublish controls.

## Offer

**FORZA ClearMatch** costs **$500/month**.

Merchants get a private MCA offer dashboard, deal shopping through funding partners, side-by-side comparison, offer math, file packaging, outside-offer review, and renewal/payoff tracking.

If a merchant funds through FORZA, FORZA may receive or retain a broker fee capped at **1% of the funded amount**.

## Tech Stack

- Next.js App Router
- React
- Cloudflare Workers via OpenNext
- Supabase Auth with email magic links
- Supabase Postgres as the source of truth
- Supabase Storage for merchant documents
- Row Level Security on public tables and document objects

## Local Setup

```bash
npm install
cp .env.example .env.local
cp .env.production.local.example .env.production.local
npm run dev
```

Open:

```text
http://localhost:3000
```

The app runs in demo mode until Supabase environment variables are added.
The public launch domain is:

```text
https://forza-funding.com
```

Paid funnel pages:

```text
/funnels/offer-dashboard-nj
/funnels/compare-mca-offers-nj
/funnels/mca-second-opinion-nj
/funnels/factor-rate-calculator-nj
```

## Supabase

Start local Supabase:

```bash
npm run supabase:start
npm run supabase:status
npm run supabase:env
npm run supabase:reset
```

Then copy the local API URL and publishable key into `.env.local`.

To create an admin account:

1. Sign in through the app or create a user in Supabase Studio.
2. Run:

```sql
update public.profiles
set role = 'admin'
where user_id = '<auth-user-id>';
```

## Checks

```bash
npm run typecheck
npm run lint
npm run build
npm run env:check:deploy
npm run check:deploy
```

## Cloudflare Workers

The production target is Cloudflare Workers using `@opennextjs/cloudflare`.

```bash
cp .dev.vars.example .dev.vars
cp .env.production.local.example .env.production.local
npm run preview
npm run deploy
```

The Worker is configured in `wrangler.jsonc` for `forza-funding.com` and `www.forza-funding.com`.

Launch helpers:

```bash
npm run env:check
npm run smoke:local
npm run smoke:worker
npm run smoke:prod
```

## Ad Engine

Add browser analytics IDs only when ready to test live tags:

```bash
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

Server-side Meta CAPI uses server-only env vars and skips safely when blank:

```bash
META_CAPI_ACCESS_TOKEN=
META_CAPI_GRAPH_API_VERSION=v24.0
META_CAPI_TEST_EVENT_CODE=
```

## Launch Guardrails

- NJ-first until counsel approves broader state routing.
- Public forms collect business basics only.
- Sensitive documents are uploaded after login.
- Ads promote dashboard transparency and offer comparison, not guaranteed approval or instant funding.
- Counsel must review broker disclosures, paid-ad copy, commercial-financing obligations, privacy language, and document workflows before paid traffic.
