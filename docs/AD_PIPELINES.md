# FORZA Ad Engine V1

## Launch Shape

- 14-day test, about **$100/day**.
- Budget split: **65% Google Search**, **35% Meta**.
- Website forms only; no native lead forms in v1.
- Paid spend starts only after counsel reviews ad copy, disclosures, privacy language, document language, and NJ commercial-financing obligations.

## Funnel URLs

| Intent | URL |
| --- | --- |
| Dashboard start | `/funnels/offer-dashboard-nj` |
| Compare offers | `/funnels/compare-mca-offers-nj` |
| Second opinion | `/funnels/mca-second-opinion-nj` |
| Calculator lead | `/funnels/factor-rate-calculator-nj` |

## Tracking Rules

Campaign naming:

```text
forza_[platform]_[state]_[intent]_[audience]_[yyyyq#]
```

Required UTMs:

```text
utm_source=google|meta
utm_medium=paid_search|paid_social
utm_campaign=<campaign_name>
utm_content=<ad_or_creative_name>
utm_term=<keyword_or_audience>
```

Also captured when present: `gclid`, `fbclid`, `_fbp`, `_fbc`, first touch, last touch, referrer, landing URL, funnel intent, consent flags, and calculator snapshot.

Conversion events:

- `lead_submitted`
- `calculator_lead`
- `dashboard_started`

Browser events are env-gated through GTM/GA4/Meta Pixel. Server events post to `/api/conversions`; Meta CAPI skips safely when tokens are blank.

## Campaign Map

| Platform | Campaign | Page | Main hook |
| --- | --- | --- | --- |
| Google | Compare MCA Offers NJ | `/funnels/compare-mca-offers-nj` | Compare MCA offers before you sign. |
| Google | MCA Offer Review NJ | `/funnels/mca-second-opinion-nj` | Get a second opinion on confusing terms. |
| Google | Factor Rate Calculator NJ | `/funnels/factor-rate-calculator-nj` | Estimate payback, payment, and cash pressure. |
| Meta | Dashboard Transparency NJ | `/funnels/offer-dashboard-nj` | Create a private offer dashboard. |
| Meta | Offer Checker Waitlist | TBD | Free opt-in MCA Offer Checker. |

Meta campaigns reaching US audiences must use the Financial Products and Services special ad category.

## Copy Rules

Allowed anchors:

- Compare MCA offers before you sign.
- Create a private offer dashboard.
- Review factor rate, payback, payment, fees, and renewal notes.
- $500/month ClearMatch membership.
- 1% broker-fee cap if funded through FORZA.
- Business-purpose commercial financing only.

Banned claims:

- Guaranteed approval.
- Instant funding.
- No-doc funding.
- Bad-credit targeting.
- Personal hardship or desperation hooks.
- Consumer-loan framing.
- Claims that FORZA directly funds, underwrites, or approves deals.

Every paid page must show the broker role, ClearMatch price, 1% fee cap, no-guarantee language, partner-underwriting language, business-purpose positioning, and a compliant business address strategy before launch.
