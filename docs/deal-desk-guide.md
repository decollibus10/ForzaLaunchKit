# FORZA Deal Desk Guide

The Deal Desk tool is a local internal calculator for first-pass deal economics and risk review.

Open:

```text
tools/deal-desk/index.html
```

Or run a local server from the project root:

```bash
python3 -m http.server 4173
```

Then visit:

```text
http://localhost:4173/tools/deal-desk/
```

## What It Calculates

- Purchased receivables amount.
- Standard gross spread.
- Eligible 30-day discount amount.
- Discount gross spread.
- Deployable capital after reserve.
- Available capital capacity.
- Single-merchant exposure limit.
- Estimated monthly, weekly, and daily remittance.
- Estimated revenue holdback.
- Combined remittance load including existing weekly remittance.
- Risk score and memo prompts.

## Default Assumptions

- Capital pool: $75,000.
- Reserve: 30%.
- Single merchant exposure limit: 15% of capital pool.
- Advance: $10,000.
- Factor rate: 1.50.
- Discount factor: 1.10.
- Expected term: 90 days.

These assumptions are editable inside the tool.

## Decision Bands

| Band | Meaning |
| --- | --- |
| Pass | Inputs appear inside the launch box; still requires full underwriting and counsel-approved terms |
| Manual Review | Meaningful risk flags or policy exceptions need tighter review |
| Do Not Offer Yet | File is outside pilot box or carries too much risk based on entered facts |

## Important Limits

- This tool is not an approval engine.
- The risk score is only a first-pass operating control.
- It does not replace bank statement review, existing contract review, UCC/tax lien checks, entity verification, owner identity verification, or legal review.
- It is not legal, tax, accounting, investment, or financing advice.
