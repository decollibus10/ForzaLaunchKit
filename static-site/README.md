# FORZA Static Site

This is the Cloudflare Pages-ready static version of the FORZA CAPITAL PARTNERS LLC website.

## Local Preview

```bash
npm run serve:static
```

Then open:

```text
http://localhost:4173/
```

## Build

```bash
npm run build:static
```

The generated site intentionally blocks indexing by default through `robots.txt`, page meta tags, and `_headers`.

## HubSpot Forms

Lead capture is disabled until HubSpot IDs are added in:

```text
config/forza-site.json
```

The config supports `fundingFormId`, `auditFormId`, `resourceFormId`, and `investorFormId`. The fallback forms preview the fields and eligibility logic only. They do not send lead data.

## Lead Generation Pages

- `/nj-business-funding/` - statewide funding hub for SEO and paid campaigns.
- `/industries/contractor-funding-nj/` - contractor and trades page.
- `/industries/restaurant-funding-nj/` - restaurant and food service page.
- `/industries/salon-funding-nj/` - salon and wellness page.
- `/industries/auto-repair-funding-nj/` - auto repair and service-shop page.
- `/resources/nj-funding-readiness-checklist/` - lead magnet page.
- `/investor-overview/` - private investor conversation request page.

## Before Public Launch

- Replace `https://forza-capital-partners.example` with the real domain in `config/forza-site.json`.
- Add HubSpot portal and form IDs.
- Remove the staging noindex controls only after counsel/content review.
- Submit the final sitemap in Google Search Console.
