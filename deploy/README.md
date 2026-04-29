# FORZA Static Deployment Pack

This folder now treats **Cloudflare Pages + HubSpot Free** as the primary launch path for FORZA CAPITAL PARTNERS LLC.

The old VPS idea remains a backup concept only. The working launch path is static hosting: no PHP, no database, no server patching, and no WordPress admin attack surface.

## Primary Path

1. Build the static site:

   ```bash
   npm run build:static
   ```

2. Preview locally:

   ```bash
   npm run serve:static
   ```

3. Deploy `static-site/` to Cloudflare Pages by direct upload or Wrangler.
4. Add HubSpot form IDs in `config/forza-site.json`, then rebuild.
5. Keep indexing blocked until counsel and content review are complete.
6. Remove noindex controls, update the real domain, and submit the sitemap after approval.

## Included Deployment Docs

- `deploy/cloudflare-pages.md` - static hosting setup and launch controls.
- `deploy/hubspot-forms.md` - HubSpot form and CRM setup for lead capture.
- `docs/staging-launch-status.md` - current implementation and deployment blocker status.
- `docs/hubspot-crm-build-workbook.md` - exact HubSpot pipeline, fields, and form build steps.
- `docs/test-lead-scenarios.csv` - launch QA lead scenarios.
- `docs/lead-generation-engine.md` - SEO, landing page, paid traffic, and lead routing system.
- `docs/landing-page-map.csv` - funnel pages and primary intent.
- `docs/hubspot-lead-capture-fields.csv` - HubSpot form/property blueprint.
- `docs/utm-tracking-map.csv` - campaign tracking naming.

## Hard Launch Controls

- Do not collect SSNs, bank logins, statements, contracts, or sensitive documents on public forms.
- Do not run Meta ads until counsel approves claims and disclaimers.
- Do not enable indexing until the domain, disclosures, privacy policy, terms, and contracts are reviewed.
- Do not fund a deal until contract, disclosure, servicing, reconciliation, and collections docs are approved.
