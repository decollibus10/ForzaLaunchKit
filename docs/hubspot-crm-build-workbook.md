# HubSpot CRM Build Workbook

Use this to create HubSpot Free from scratch for FORZA CAPITAL PARTNERS LLC.

## Pipeline

Pipeline name: `FORZA Funding Pipeline`

Stages:

1. `New Lead`
2. `Resource Lead`
3. `Prequalified`
4. `Call Booked`
5. `Docs Requested`
6. `Underwriting`
7. `Offer Sent`
8. `Funded`
9. `Declined`
10. `Servicing`
11. `Reconciliation Requested`
12. `Paid Off`

## Properties

Create or map these contact/company properties:

- `lead_type`
- `source_page`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `business_name`
- `owner_name`
- `contact_name`
- `email`
- `phone`
- `business_state`
- `industry`
- `monthly_revenue`
- `time_in_business`
- `desired_funding`
- `existing_positions`
- `use_of_funds`
- `workflow_area`
- `current_tools`
- `bottleneck`
- `investor_profile`
- `investor_location`
- `conversation_type`
- `accredited_status`
- `investor_interest`
- `consent`

Dropdown values should match `docs/hubspot-lead-capture-fields.csv`.

## Forms

Create these forms:

1. `FORZA - Funding Eligibility`
2. `FORZA - AI Automation Audit`
3. `FORZA - NJ Funding Readiness Checklist`
4. `FORZA - Investor Overview Request`

Every form must include hidden fields:

- `lead_type`
- `source_page`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

## Funding Form Fields

- Business legal name
- Owner name
- Business email
- Phone number
- Business state
- Industry
- Monthly gross revenue
- Time in business
- Desired funding amount
- Existing funding positions
- Use of funds
- Consent checkbox

Consent text:

```text
I understand this is a business funding eligibility review for NJ businesses, not a guarantee of approval or a commitment to fund.
```

## AI Audit Form Fields

- Business name
- Contact name
- Business email
- Phone number
- Workflow to review
- Current tools
- Where work feels manual
- Consent checkbox

Consent text:

```text
I understand the AI Automation Audit is a separate consulting inquiry and is not required for funding eligibility.
```

## Checklist Form Fields

- Business name
- Contact name
- Business email
- Business state
- Monthly gross revenue
- Time in business
- Consent checkbox

Consent text:

```text
I understand this resource is educational only and does not guarantee funding approval or create a commitment to fund.
```

## Investor Overview Form Fields

- Name
- Email
- Investor profile
- Location
- Conversation type
- Accredited investor status
- What interests you?
- Consent checkbox

Consent text:

```text
I understand this is a request for information only, not an offer to sell securities or a solicitation to buy securities.
```

## HubSpot IDs

After publishing the four forms, copy each embed form ID and run:

```bash
npm run configure:hubspot -- --portalId=PORTAL_ID --fundingFormId=FUNDING_FORM_ID --auditFormId=AUDIT_FORM_ID --resourceFormId=RESOURCE_FORM_ID --investorFormId=INVESTOR_FORM_ID
npm run check:launch
```

Then redeploy to Cloudflare staging:

```bash
npm run deploy:cloudflare
```

## Routing Defaults

- Qualified funding lead: move to `Prequalified`.
- Outside NJ: move to `Declined` or tag as `outside-nj`.
- Under revenue/time threshold: move to `Declined` with education follow-up.
- Existing funding or larger request: tag `manual-review`.
- Checklist-only lead: move to `Resource Lead`.
- AI audit lead: tag `ai-audit-lead`.
- Investor overview lead: tag `investor-overview-request` and do not send securities terms until counsel approves the process.

Do not store SSNs, bank logins, full bank statements, IDs, or contracts in HubSpot notes.
