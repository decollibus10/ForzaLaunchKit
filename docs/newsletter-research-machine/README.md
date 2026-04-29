# Newsletter Research Machine

This is the operating system for a one-operator Substack focused on wealth-building, niche assets, underwriting intelligence, and operator memos.

The default operating posture is:

- One flagship memo per week.
- Private deal observations are human-gated before public use.
- Substack is the primary monetization surface.
- LinkedIn and X are distribution surfaces.
- Notion or Airtable can be the system of record until the custom software layer is justified.

## Core Loop

```text
Capture Inbox
-> Normalize
-> Score
-> Evidence Pack
-> Skeptic Review
-> Memo Draft
-> Edit and Claim Review
-> Distribution Pack
-> Analytics Feedback
-> Next Seeds
```

## Weekly Desk Rhythm

| Day | Desk Action | Output |
| --- | --- | --- |
| Monday | Import metrics, replies, comments, and conversion notes | Updated metrics table and subscriber signals |
| Tuesday | Add deal observations, reading notes, filings, podcasts, and market signals | New or enriched ideas |
| Wednesday | Score top 10 ideas and build evidence packs for top 3 | Ranked writing queue |
| Thursday | Run Deal Scout and Skeptic review on the selected idea | Scout brief, bear case, evidence requests |
| Friday | Draft, edit, approve claims, and prepare distribution pack | Substack memo and channel assets |
| Weekend | Publish or schedule, then capture replies as new seeds | New feedback loop |

## Editorial Allocation Model

| Category | Target Share | Purpose |
| --- | ---: | --- |
| Underwriting Intelligence | 40% | Proprietary edge, operator credibility, paid conversion |
| Niche Wealth / Assets | 20% | Broaden the wealth-building aperture without drifting into generic finance |
| Operator Memos | 15% | Build founder/operator trust through decision memos and systems thinking |
| Contrarian Market Observations | 10% | Create discussion and sharper positioning |
| Deal Teardowns | 10% | Convert live pattern recognition into teachable judgment |
| Reader Mail / Conversion Learnings | 5% | Turn subscriber behavior into editorial intelligence |

## Taxonomy

Every idea should be tagged with:

- `Asset Class`: MCA/private credit, receivables, local services, niche real assets, online business, collectibles, special situations, other.
- `Signal Type`: live deal observation, underwriting edge case, contrarian market observation, book note, filing note, podcast note, investor letter, social signal, reader reply, conversion signal.
- `Underwriting Theme`: cash-flow quality, remittance pressure, stacking, fraud/verification, concentration, pricing, legal/process, servicing/reconciliation, borrower psychology.
- `Market Regime`: tight credit, loose credit, rising defaults, liquidity stress, asset inflation, regulatory pressure, operator reset.
- `Audience Intent`: learn, decide, avoid mistake, compare options, find opportunity, improve underwriting, understand risk.
- `Evidence Strength`: anecdote, pattern, dataset/export, document-backed, primary source, repeatable operator rule.
- `Confidentiality`: public, sanitized private, private not approved, sensitive do not use.
- `Monetization Role`: free trust builder, paid conversion, paid retention, lead magnet, referral bait, product insight.
- `Repurpose Potential`: low, medium, high.

## Scoring Model

Use a 100-point score before prioritization:

```text
Score =
  Proprietary Edge, max 20
+ Economic Stakes, max 15
+ Timeliness, max 10
+ Contrarianity, max 10
+ Evidence Depth, max 15
+ Audience Pull, max 10
+ Subscriber Conversion Fit, max 10
+ Repurpose Leverage, max 5
+ Operator Credibility, max 5
- Risk Penalty, max 30
```

Hard kill conditions:

- Confidentiality is `sensitive do not use`.
- Private deal observation is not approved for public use.
- The thesis depends on unsupported legal, financing, investment, or performance claims.
- The piece would reveal borrower, counterparty, or proprietary deal information.

## Prioritization Formula

The weekly writing queue uses the base idea score plus editorial steering:

```text
Priority =
  Idea Score
+ Allocation Gap Boost
+ Freshness Boost
+ Paid-Fit Boost
+ Evidence-Ready Boost
- Confidentiality / Legal Risk
- Repetition Penalty
```

The selected weekly memo must have:

- One clear thesis.
- One proprietary observation.
- One falsifiable counterpoint.
- One reader action.

## Dashboard Views

| View | Filter |
| --- | --- |
| What To Write Next | Ready ideas ranked by priority |
| Allocation Drift | Target category mix vs trailing 4 and 8 published memos |
| Proprietary Edge Queue | Ideas with high proprietary edge |
| Paid Conversion Candidates | Ideas likely to convert or retain paid readers |
| Stale But Valuable | Old high-scoring ideas needing refresh |
| Needs Evidence | Ideas with good thesis but weak evidence depth |
| Do Not Publish Yet | Private, sensitive, high-risk, or unsupported ideas |

## Files In This Kit

- `agent-prompts.md`: specialist agent prompts and handoff contracts.
- `data-schema.md`: software-ready data model and API surface.
- `automation-stack.md`: no-code, intermediate, and full custom stack options.
- `content-flywheel.md`: thesis-to-asset system for Substack, LinkedIn, X, paid teasers, lead magnets, and next seeds.
- `product-spec-mvp.md`: product concept, feature map, workflows, roadmap, and anti-features.
- `idea-database-template.csv`: Notion/Airtable import starter for ideas.
- `evidence-vault-template.csv`: source and evidence tracker.
- `draft-workbench-template.csv`: memo production tracker.
- `metrics-feedback-template.csv`: analytics and subscriber behavior tracker.
- `../../tools/newsletter-research-machine/index.html`: local steering dashboard.

## Local Tool

Open:

```text
tools/newsletter-research-machine/index.html
```

Or run a local server from the project root:

```bash
python3 -m http.server 4173
```

Then visit:

```text
http://localhost:4173/tools/newsletter-research-machine/
```

The tool stores data in browser local storage and supports JSON export/import.
