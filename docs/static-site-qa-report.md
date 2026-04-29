# Static Site QA Report

QA date: April 28, 2026

## Build Checks

- `npm run build:static` completed successfully.
- `npm run check:static` completed successfully.
- Static site archive created: `forza-capital-partners-static-site.zip`.
- Full launch archive refreshed: `forza-capital-partners-launch-kit.zip`.

## Browser Render Checks

Local server:

```bash
python3 -m http.server 4173 --directory static-site
```

Pages checked with Playwright screenshots:

- `/` at 1440px desktop.
- `/nj-business-funding/` at 390px mobile.
- `/resources/nj-funding-readiness-checklist/` at 1440px desktop.

Screenshots were rendered successfully and reviewed for:

- Hero image loading.
- Navigation and footer links visible.
- Lead forms visible and usable.
- Mobile layout stacking cleanly.
- No obvious text overlap.
- No blank image or CSS failure.

## Lead Form Behavior

Eligibility test:

- NJ business.
- Contractor industry.
- `$15k-$25k/month` revenue.
- `12-24 months` in business.
- `$5k-$15k` requested.
- No active advance.

Expected result shown:

```text
Strong pilot fit based on the basics
```

Outside-NJ test:

```text
Outside the current pilot area
```

UTM/source-page test:

- `source_page` populated as `/eligibility/`.
- `utm_campaign` populated from URL query string.

Checklist form test:

- `lead_type` populated as `nj_funding_readiness_checklist`.
- `source_page` populated as `/resources/nj-funding-readiness-checklist/`.
- Fallback form showed the safe preview message and did not transmit data.

## Indexing Controls

Confirmed staging blocks are present:

- Page-level `noindex,nofollow` meta tag.
- `static-site/robots.txt` disallows crawling.
- `static-site/_headers` includes `X-Robots-Tag: noindex, nofollow`.

## Known Pre-Launch Tasks

- Replace placeholder canonical domain in `config/forza-site.json`.
- Add HubSpot portal ID and form IDs in `config/forza-site.json`.
- Review privacy, terms, disclosures, ads, and funding claims with counsel.
- Remove noindex controls only after review.
- Submit final sitemap after domain launch.
