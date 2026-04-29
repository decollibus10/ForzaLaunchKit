# HubSpot Forms Setup

Official reference: HubSpot forms embed docs: https://developers.hubspot.com/docs/cms/building-blocks/forms

## Forms To Create

Create three HubSpot forms:

1. `FORZA - Funding Eligibility`
2. `FORZA - AI Automation Audit`
3. `FORZA - NJ Funding Readiness Checklist`
4. `FORZA - Investor Overview Request`

Each form should map to HubSpot contact/company properties and include hidden UTM fields.

## Static Site Embed Config

After forms are created, copy the Portal ID, Form IDs, and region from HubSpot into:

```text
config/forza-site.json
```

Use the helper:

```bash
npm run configure:hubspot -- --portalId=12345678 --fundingFormId=00000000-0000-0000-0000-000000000000 --auditFormId=11111111-1111-1111-1111-111111111111 --resourceFormId=22222222-2222-2222-2222-222222222222 --investorFormId=33333333-3333-3333-3333-333333333333
npm run build:static
```

Until those IDs are present, fallback forms will preview fields and eligibility logic only. They do not transmit lead data.

## Required Hidden Fields

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

## Routing Rules

- NJ, 12+ months, $15k+ revenue, $5k-$15k request, no active advance: status `Prequalified`.
- Outside NJ: status `Declined` or `Future Expansion`, depending on how HubSpot is configured.
- Under revenue or time-in-business threshold: status `Declined` with education follow-up.
- Existing position or larger request: status `Manual Review`.
- Checklist-only lead: status `New Lead`, lead type `Resource`.
- AI audit lead: separate pipeline or lead type `AI Audit`.

## Important Control

Do not add public upload fields for bank statements, contracts, tax documents, SSNs, bank logins, or sensitive files. Those should be requested after a call through a secure process.
