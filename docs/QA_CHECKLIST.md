# QA Checklist

## Public Pages

- No direct-funder language remains.
- No AI audit, investor overview, WordPress, or owner-funded pages are linked.
- Primary CTA says `Create Your Offer Dashboard`.
- Secondary CTA says `Compare An Offer You Already Received`.
- Broker disclosure appears on public pages.
- Meta and Google funnel copy avoids approval guarantees and instant-funding claims.
- Paid funnel pages exist at `/funnels/offer-dashboard-nj`, `/funnels/compare-mca-offers-nj`, `/funnels/mca-second-opinion-nj`, and `/funnels/factor-rate-calculator-nj`.
- Paid funnel pages show the ClearMatch price, broker role, 1% fee cap, no funding guarantee, and business-purpose financing language.

## Ad Engine

- UTMs, `gclid`, `fbclid`, referrer, landing URL, first touch, and last touch persist into lead attribution records.
- Calculator lead submissions include calculator snapshot values.
- Lead form responses include `{ id, nextUrl }`.
- Submitted website leads redirect to `/login` with email, lead id, and funnel intent.
- GTM/GA4/Meta browser events are env-gated and do not require third-party scripts in local demo mode.
- `/api/conversions` skips safely when Meta CAPI env vars are blank.
- Server-side tokens are never exposed as `NEXT_PUBLIC_`.
- Admin ad performance view groups leads by channel, campaign, funnel, dashboard-start count, and calculator-lead count.

## Dashboard

- Logged-out users redirect to login when Supabase env vars are configured.
- Demo mode appears only when Supabase env vars are missing.
- Published offers appear in merchant dashboard.
- Draft and archived offers do not appear to merchants.
- Cash-pressure indicator updates from offer payment and merchant revenue.
- Document uploads go to `merchant-documents/<merchant_profile_id>/...`.

## Admin

- Non-admin users cannot access admin data.
- Admin can create draft offers.
- Admin can publish and unpublish offers.
- Funder ids stay internal.
- Merchant-facing offer labels stay FORZA-branded.

## Supabase

- RLS is enabled on every public table.
- Storage policies restrict document access to merchant owners and admins.
- Service role key is not exposed as `NEXT_PUBLIC_`.
- Magic-link confirmation route works with the Supabase email template.
