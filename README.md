# FORZA CAPITAL PARTNERS LLC Launch Kit

This workspace contains the launch package for **FORZA CAPITAL PARTNERS LLC**, an NJ-only business receivables-purchase funding firm with a separate AI Automation Audit consulting line.

Primary deployment path is now a static website on Cloudflare Pages with HubSpot Free for lead capture. The WordPress theme remains as a backup path, but the static site is the leaner launch target.

## Primary Deliverables

- `static-site/` - Cloudflare Pages-ready static website with lead capture routes.
- `config/forza-site.json` - source config for staging URL, future domain, and HubSpot form IDs.
- `tools/build-static-site.mjs` - generator for rebuilding the static site from this workspace.
- `package.json` - local build, check, serve, and Cloudflare deploy scripts.
- `deploy/cloudflare-pages.md` - no-VPS deployment instructions.
- `deploy/hubspot-forms.md` - HubSpot form setup and routing rules.
- `dist/` - generated zip packages for handoff or upload.
- `docs/lead-generation-engine.md` - SEO, paid traffic, landing page, and CRM funnel plan.
- `docs/landing-page-map.csv` - page-by-page lead intent and CTA map.
- `docs/hubspot-lead-capture-fields.csv` - HubSpot property/form blueprint.
- `docs/utm-tracking-map.csv` - campaign tracking examples.
- `docs/lead-magnet-nj-funding-readiness-checklist.md` - checklist resource copy.
- `docs/newsletter-research-machine/` - newsletter research operating system, templates, and agent prompts.
- `docs/project-notes/` - prior context and next-step notes kept out of the root.
- `forza-capital-partners-theme/` - WordPress fallback theme.
- `tools/deal-desk/` - local internal deal economics and risk calculator.
- `tools/newsletter-research-machine/` - local editorial steering dashboard.
- `docs/legal-templates/` - counsel-draft agreement, offer, ACH, guaranty, reconciliation, payoff, servicing, and call-script templates.
- `investor-deck/` - source and generated files for the investor presentation.
- `_archive/legacy-root-copy-2026-04-29/` - older duplicate root layout preserved for reference.

## Static Site

Build:

```bash
npm run build:static
```

Preview:

```bash
npm run serve:static
```

Then open:

```text
http://localhost:4173/
```

Check JavaScript and launch readiness:

```bash
npm run check:launch
```

Package clean handoff zips into `dist/`:

```bash
npm run package:launch
```

## Lead Generation Pages

- `/` - homepage and broad CTA.
- `/nj-business-funding/` - statewide SEO and campaign landing page.
- `/eligibility/` - primary funding pre-qual page.
- `/industries/contractor-funding-nj/`
- `/industries/restaurant-funding-nj/`
- `/industries/salon-funding-nj/`
- `/industries/auto-repair-funding-nj/`
- `/resources/nj-funding-readiness-checklist/`
- `/investor-overview/` - private investor overview request page.
- `/insights/` - SEO article hub.
- `/ai-automation-audit/` - separate consulting form.

## HubSpot

The static site has safe fallback forms that preview the fields and eligibility logic only. They do not send lead data until HubSpot IDs are added in:

```text
config/forza-site.json
```

Create four HubSpot forms:

- `FORZA - Funding Eligibility`
- `FORZA - AI Automation Audit`
- `FORZA - NJ Funding Readiness Checklist`
- `FORZA - Investor Overview Request`

Then run:

```bash
npm run configure:hubspot -- --portalId=PORTAL_ID --fundingFormId=FORM_ID --auditFormId=FORM_ID --resourceFormId=FORM_ID --investorFormId=FORM_ID
npm run build:static
```

## Important Launch Controls

- The generated site blocks indexing by default.
- Public forms collect business basics only.
- Do not collect SSNs, bank logins, bank statements, contracts, or sensitive documents on public forms.
- Counsel should review contracts, disclosures, ads, privacy policy, terms, servicing, reconciliation, and collection language before funding traffic goes live.
- Do not fund any deal until the contract/disclosure/servicing package is approved.

## Internal Deal Desk

Run a root-level local server and visit:

```bash
python3 -m http.server 4173
```

```text
http://localhost:4173/tools/deal-desk/
```

The Deal Desk is an internal planning calculator. It is not an approval engine and does not replace underwriting, counsel review, or funding-day controls.

## Newsletter Research Machine

Run the tools server and visit:

```bash
npm run serve:tools
```

```text
http://localhost:4173/tools/newsletter-research-machine/
```

Check the dashboard JavaScript:

```bash
npm run check:newsletter
```
