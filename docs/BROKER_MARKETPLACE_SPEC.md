# FORZA ClearMatch Operating Spec

## Goal

FORZA ClearMatch is an NJ-first MCA broker marketplace: merchants pay **$500/month** for a private offer dashboard, deal shopping, outside-offer review, file packaging, and funding support. If they fund through FORZA, the broker fee is capped at **1% of funded amount**.

Merchant promise: **one monthly funding desk, transparent MCA offers, no oversized broker commission.**

## V1 Product

Merchant dashboard:

- Business profile, funding request, document checklist, secure uploads, and deal timeline.
- FORZA-branded offer comparisons from funding partners; funder identities stay internal.
- Offer math: advance, factor rate, payback, payment, frequency, fees, term estimate, broker-fee disclosure, renewal/payoff notes, and cash-pressure score.
- Outside-offer review path so merchants keep FORZA as their comparison point.

Admin deal desk:

- Review leads, merchant profiles, document status, attribution, and funnel intent.
- Enter internal funders and offers.
- Publish/unpublish offers; only published offers appear to merchants.

## Acquisition

Primary CTA: **Create Your Offer Dashboard**.

Secondary CTA: **Compare An Offer You Already Received**.

Paid traffic should route to website funnels, preserve attribution, create a lead, and hand the merchant to `/login` with email, lead id, and intent prefilled.

## FORZA Offer Checker

Future opt-in Chrome extension lead magnet after the website and ad funnels are live.

- Promise: decode MCA offer math before signing.
- Trigger: merchant clicks the extension on an offer page, PDF, email, portal, or pasted text.
- Output: advance, factor rate, payback, payment cadence, fees, term estimate, renewal/payoff notes, and cash-pressure score.
- CTA: send the snapshot to the merchant's FORZA dashboard or request competing offers.
- Guardrails: user-initiated only, prefer `activeTab`, no background browsing monitor, no unsolicited popups, no competitor-page interception claims, and clear privacy disclosure.

## Not V1

- Funder logins.
- HubSpot as source of truth.
- Owner-funded deal positioning.
- AI audit consulting.
- Investor pages or deck.
- WordPress fallback theme.
- Newsletter research tooling.
