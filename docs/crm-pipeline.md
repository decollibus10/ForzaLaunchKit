# FORZA CRM Pipeline

Use this as the first manual CRM structure. Keep it simple until lead flow proves which statuses and fields actually matter.

## Pipeline Stages

| Stage | Meaning | Owner Action | Exit Criteria |
| --- | --- | --- | --- |
| New Lead | Website, Meta, referral, or SEO inquiry received | Check NJ fit and obvious completeness | Move to Prequalified, Manual Review, or Declined |
| Resource Lead | Checklist or education resource inquiry | Send resource and check whether basic fit is visible | Move to New Lead, Prequalified, or nurture |
| Prequalified | Meets launch basics | Call or text within 1 business hour when possible | Call booked |
| Call Booked | Intro call scheduled | Confirm use of funds and explain structure | Docs requested or declined |
| Docs Requested | Secure document request sent | Request statements, existing contracts, entity docs, and ID through secure channel | Complete file received |
| Underwriting | File is being reviewed | Run cash-flow, position, lien, and identity checks | Offer sent or declined |
| Offer Sent | Terms delivered for review | Explain factor, total purchased amount, discount, reconciliation, and remittance | Funded, expired, or declined |
| Funded | Agreement signed and funds sent | Start servicing record and remittance schedule | Servicing |
| Servicing | Active receivables purchase | Monitor payments and revenue changes | Paid off or reconciliation requested |
| Reconciliation Requested | Merchant requests review or sales changed | Compare actual revenue to remittance | Adjust, maintain, or escalate |
| Paid Off | Purchased amount satisfied | Close file and request review/referral | Archive |
| Declined | Not a fit or risk too high | Send neutral decline note | Archive |

## Required Lead Fields

- Business legal name
- Owner/contact name
- Phone and email
- Business location/state
- Industry
- Monthly gross revenue range
- Time in business
- Desired funding amount
- Existing funding positions
- Use of funds
- Lead type
- Source page
- Lead source and campaign UTM
- Initial eligibility result
- Next follow-up date

## CRM Rules

- Do not store SSNs, bank logins, raw IDs, or full bank statements in the CRM notes.
- Store sensitive documents only in the approved secure document system.
- Do not score or decline based on protected characteristics or inferred sensitive traits.
- Keep notes factual: revenue, balances, NSFs, positions, documents received, calls completed, and stated business need.
- Every funded file should have a servicing owner and reconciliation instructions attached before funds go out.

## Suggested Tags

- `nj-fit`
- `manual-review`
- `first-position`
- `second-position`
- `existing-mca`
- `contractor`
- `restaurant`
- `salon`
- `repair-shop`
- `ai-audit-lead`
- `seo-lead`
- `meta-lead`
- `resource-lead`
- `checklist-lead`
- `outside-nj`
