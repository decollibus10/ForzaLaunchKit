# FORZA Broker Marketplace Spec

## Product Positioning

FORZA is a commercial financing broker. The product is **FORZA ClearMatch**, a $500/month merchant membership for a private MCA offer dashboard, deal shopping, outside-offer review, file packaging, and funding support.

If a merchant funds through FORZA, FORZA may receive or retain a broker fee capped at 1% of the funded amount.

## Merchant Promise

One monthly funding desk. Transparent MCA offers. No oversized broker commission.

## Merchant Dashboard V1

- Business profile and funding request.
- Document checklist and secure upload.
- Deal timeline.
- FORZA-branded offers from funding partners.
- Side-by-side math: advance, factor, total payback, payment, frequency, fees, estimated term, broker-fee disclosure, renewal/payoff notes.
- Cash-pressure indicator based on payment vs. estimated weekly revenue.
- Outside-offer comparison path.

## Admin Deal Desk V1

- Lead and merchant file review.
- Internal funder and offer entry.
- Draft, published, and archived offer status.
- Published offers visible to merchants.
- Draft and archived offers hidden from merchants.
- Ad source and UTM fields stored on lead records.

## Future Lead Magnet: FORZA Offer Checker

Build an opt-in Chrome extension after the website and ad funnels are live. The extension should position FORZA as the comparison layer merchants use when another broker or funder sends terms.

Product concept:

- Name: **FORZA Offer Checker**.
- Promise: decode MCA offer math before signing.
- Merchant action: click the extension while viewing an offer, PDF, portal page, email, or pasted text.
- Output: estimated advance, factor rate, total payback, payment cadence, fees, term estimate, renewal/payoff notes, and cash-pressure score.
- CTA: send the offer snapshot to the merchant's FORZA ClearMatch dashboard.
- Follow-up CTA: get competing offers through FORZA funding partners.

MVP guardrails:

- User-initiated only; do not monitor browsing in the background.
- Prefer `activeTab` and explicit merchant clicks over broad host permissions.
- No unsolicited popups, notification ads, or automatic interception of competitor pages.
- No funder identity claims unless the merchant provides the offer.
- Privacy policy must explain what page text, selected text, screenshots, or documents are collected.
- Counsel should review extension copy, data collection, permissions, privacy terms, and Chrome Web Store submission language.

## Explicit V1 Exclusions

- Funder logins.
- HubSpot as source of truth.
- Owner-funded deal posture.
- AI audit consulting.
- Investor relations pages or deck.
- WordPress fallback theme.
- Newsletter research tooling.
