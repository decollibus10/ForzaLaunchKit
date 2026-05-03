# FORZA Ad Engine V1

## Launch Assumption

- 14-day lean test.
- $100/day total.
- 65% Google high-intent search, 35% Meta dashboard-transparency campaigns.
- Website forms only in v1; no native Meta or Google lead forms.
- Paid spend waits for counsel review of ad copy, disclosures, privacy language, document language, and NJ commercial-financing obligations.

## Funnel URLs

- `/funnels/offer-dashboard-nj`
- `/funnels/compare-mca-offers-nj`
- `/funnels/mca-second-opinion-nj`
- `/funnels/factor-rate-calculator-nj`

## Campaign Naming

Use this pattern:

```text
forza_[platform]_[state]_[intent]_[audience]_[yyyyq#]
```

Examples:

- `forza_google_nj_compare_mca_search_2026q2`
- `forza_google_nj_factor_rate_search_2026q2`
- `forza_meta_nj_dashboard_transparency_broad_2026q2`
- `forza_meta_nj_second_opinion_retargeting_2026q2`

## UTM Rules

Required query fields:

```text
utm_source=google|meta
utm_medium=paid_search|paid_social
utm_campaign=<campaign_name>
utm_content=<ad_or_creative_name>
utm_term=<keyword_or_audience>
```

The app also captures `gclid`, `fbclid`, `_fbp`, `_fbc`, first touch, last touch, referrer, landing URL, funnel intent, consent flags, and calculator snapshots when present.

## Conversion Events

- `lead_submitted`: any paid funnel form outside the calculator.
- `calculator_lead`: calculator form submitted with a calculator snapshot.
- `dashboard_started`: login/magic-link step started after lead submission.

Browser events go to `dataLayer`, GA4/Google Ads, and Meta Pixel when env vars are configured. Server events post to `/api/conversions`; Meta CAPI is skipped safely when `NEXT_PUBLIC_META_PIXEL_ID` or `META_CAPI_ACCESS_TOKEN` is missing.

## Google Search Structure

Campaigns:

- Compare MCA Offers NJ
- MCA Offer Review NJ
- MCA Second Opinion NJ
- Factor Rate Calculator NJ

Initial keyword themes:

- `compare mca offers`
- `merchant cash advance offer review`
- `mca second opinion`
- `factor rate calculator`
- `merchant cash advance broker nj`

Copy anchors:

- Compare MCA offers before you sign.
- Create a private offer dashboard.
- Review factor rate, payback, payment, fees, and renewal notes.
- $500/month ClearMatch membership.
- 1% broker-fee cap if funded through FORZA.

## Meta Structure

Use the Financial Products and Services special ad category for campaigns reaching US audiences.

Campaign themes:

- Dashboard transparency.
- Outside-offer review.
- Factor-rate education.
- MCA second opinion.
- Free MCA Offer Checker waitlist after the website is live.

Audience defaults:

- NJ launch geography.
- Broad special-category compliant targeting.
- Retargeting only where permitted and reviewed.

## Extension Lead Magnet

The Chrome extension is a future acquisition and retention tool, not a blocker for the first ad launch.

Public hook:

```text
Free MCA Offer Checker
Decode factor rate, payback, payments, fees, and cash pressure before you sign.
```

Allowed CTA language:

- Install the free MCA Offer Checker.
- Decode this offer.
- Send this offer to my FORZA dashboard.
- Get a second opinion before signing.

Ad and landing-page rules:

- Frame the extension as an opt-in tool, not a background monitor.
- Do not say it watches every funding site or automatically intercepts competitor offers.
- Do not use notifications for ads or promotional nudges.
- Make the merchant click the extension before reading page content or selected text.
- Explain that submitted offer text/documents may be sent to FORZA for dashboard comparison.

## Banned Claims

Do not use:

- Guaranteed approval.
- Instant funding.
- No-doc funding.
- Bad-credit targeting.
- Personal hardship or desperation hooks.
- Consumer-loan framing.
- Claims that FORZA directly funds, underwrites, or approves deals.

## Landing Page Requirements

Every paid page must visibly include:

- FORZA broker role.
- $500/month ClearMatch membership.
- 1% broker-fee cap if funded through FORZA.
- No funding guarantee.
- Funding partners control approval, terms, costs, and underwriting.
- Business-purpose commercial financing positioning.
- Business address before paid launch.

## QA Checklist

- Submit a Google-style URL with `utm_*` and `gclid`; confirm lead and attribution records contain those values.
- Submit a Meta-style URL with `utm_*`, `fbclid`, `_fbp`, and `_fbc`; confirm lead and attribution records contain those values.
- Confirm form response returns `{ id, nextUrl }` and redirects to `/login` with email, lead id, and intent.
- Confirm `dataLayer` receives `lead_submitted`, `calculator_lead`, and `dashboard_started`.
- Confirm server conversion endpoint returns skipped status when Meta env vars are blank.
- Confirm admin ad performance groups leads by channel, campaign, funnel, dashboard starts, and calculator leads.
- Confirm paid pages avoid banned claims and show the ClearMatch disclosure language.
