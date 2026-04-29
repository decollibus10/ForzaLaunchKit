# FORZA CAPITAL PARTNERS LLC Launch Checklist

## Legal And Compliance

- Have counsel review receivables-purchase agreement, performance guaranty, reconciliation terms, servicing process, privacy policy, terms, disclosures, ad copy, and website claims.
- Confirm NJ-only launch criteria and whether any state commercial financing disclosure changes apply before launch.
- Do not use confession-of-judgment provisions.
- Do not call the receivables-purchase product a consumer loan.
- Keep examples clear: funded amount, factor rate, purchased receivables amount, eligible prepayment discount, and assumptions.

## Operations

- Create HubSpot Free account, pipeline, properties, and the three launch forms.
- Add HubSpot portal/form IDs to `config/forza-site.json`, then rebuild the static site.
- Connect Google Workspace inbox to HubSpot or use HubSpot form notifications for v1.
- Create statuses: New Lead, Prequalified, Call Booked, Docs Requested, Underwriting, Offer Sent, Funded, Declined, Servicing, Reconciliation Requested, Paid Off.
- Set up secure document collection outside the public form.
- Create underwriting checklist for revenue, balances, negative days, NSFs, UCC/tax liens, owner identity, entity status, senior lender terms, existing positions, and use of funds.

## Marketing

- Deploy the static site to Cloudflare Pages staging first.
- Keep noindex controls active until counsel/content review is complete.
- Verify Meta ad copy avoids guaranteed approval claims and consumer-loan language.
- Keep Meta budget under $1k/month during the first test.
- Configure Meta Pixel only after privacy/tracking review.
- Set up Google Search Console, XML sitemap, analytics, and UTM naming.
- Publish one NJ funding education article per week.
- Build internal links from articles to `/eligibility/`, `/nj-business-funding/`, industry pages, and the readiness checklist.

## Website QA

- Test NJ eligibility, non-NJ routing, under-$15k revenue, under-12-month history, larger funding requests, and existing-position scenarios.
- Verify funding, AI audit, and readiness-checklist forms create HubSpot records with `lead_type`, `source_page`, and UTM fields.
- Confirm mobile layout, navigation, calculator, form validation, and status notices.
- Confirm privacy, terms, and disclosures pages are reachable from the footer.
- Confirm `robots.txt`, `_headers`, and page meta tags block indexing during staging.
