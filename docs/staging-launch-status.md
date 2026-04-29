# FORZA Staging Launch Status

Status date: April 28, 2026

## Completed Locally

- Static site generated in `static-site/`.
- Cloudflare Pages project config added in `wrangler.toml`.
- Launch config source added in `config/forza-site.json`.
- HubSpot config helper added: `npm run configure:hubspot`.
- Launch readiness check added: `npm run check:launch`.
- Static site archive exists: `forza-capital-partners-static-site.zip`.
- Full launch archive exists: `forza-capital-partners-launch-kit.zip`.
- Staging indexing remains blocked by `robots.txt`, page meta tags, and `_headers`.

## External Account Blockers

Cloudflare:

```text
npx wrangler whoami
You are not authenticated. Please run `wrangler login`.
```

HubSpot:

- No HubSpot account credentials or API access are available in this workspace.
- Portal ID and form IDs are blank in `config/forza-site.json`.

## Next Human Login Steps

1. Run `npm run login:cloudflare` and complete Cloudflare browser login.
2. Run `npm run deploy:cloudflare`.
3. Create HubSpot Free account.
4. Build the pipeline, properties, and forms using `docs/hubspot-crm-build-workbook.md`.
5. Run `npm run configure:hubspot -- --portalId=... --fundingFormId=... --auditFormId=... --resourceFormId=...`.
6. Run `npm run check:launch`.
7. Redeploy with `npm run deploy:cloudflare`.

## Keep Deferred

- Custom domain.
- Google Workspace.
- Search Console.
- Canonical domain replacement.
- Indexing.
- Meta ads and pixels.
- Sensitive document collection.
