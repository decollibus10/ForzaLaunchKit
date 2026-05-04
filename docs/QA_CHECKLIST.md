# Launch QA Gate

Run this before paid traffic.

## Build And Deploy

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run cloudflare:build`
- [ ] `npx wrangler deploy --dry-run`
- [ ] `npm run smoke:prod`
- [ ] Live domain serves `/`, `/compare`, `/calculator`, `/login`, and all paid funnel URLs.

## Public Copy

- [ ] No direct-funder, owner-funded, AI audit, investor, WordPress, or newsletter-research positioning.
- [ ] Primary CTA: `Create Your Offer Dashboard`.
- [ ] Secondary CTA: `Compare An Offer You Already Received`.
- [ ] Paid pages show broker role, $500/month price, 1% fee cap, no-guarantee language, partner-underwriting language, and business-purpose positioning.
- [ ] Paid pages avoid guaranteed approval, instant funding, no-doc funding, bad-credit targeting, hardship hooks, consumer-loan framing, and direct-funder claims.

## Lead And Attribution

- [ ] Google-style URL with `utm_*` and `gclid` persists into lead and attribution records.
- [ ] Meta-style URL with `utm_*`, `fbclid`, `_fbp`, and `_fbc` persists into lead and attribution records.
- [ ] Lead form returns `{ id, nextUrl }` and routes to `/login` with email, lead id, and intent.
- [ ] Calculator leads include calculator snapshot values.
- [ ] `dataLayer` receives `lead_submitted`, `calculator_lead`, and `dashboard_started`.
- [ ] `/api/conversions` skips safely when Meta CAPI env vars are blank.
- [ ] Admin ad performance groups leads by channel, campaign, funnel, dashboard starts, and calculator leads.

## Auth, Dashboard, Admin

- [ ] Logged-out users cannot access dashboard/admin when Supabase env vars are configured.
- [ ] Magic-link confirmation route works with the Supabase email template.
- [ ] Merchant dashboard shows published offers only.
- [ ] Draft and archived offers stay hidden from merchants.
- [ ] Cash-pressure score updates from offer payment and merchant revenue.
- [ ] Admin can create, publish, unpublish, and archive offers.
- [ ] Funder identities stay internal; merchant labels stay FORZA-branded.

## Security And Compliance

- [ ] RLS is enabled on every exposed public table.
- [ ] Storage policies restrict documents to merchant owners and admins.
- [ ] Service role key is never exposed as `NEXT_PUBLIC_`.
- [ ] Document upload path stays under `merchant-documents/<merchant_profile_id>/...`.
- [ ] Counsel has reviewed broker disclosure, address strategy, ad copy, privacy language, and NJ commercial-financing obligations.
