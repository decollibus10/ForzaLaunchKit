# Product Spec / MVP

## Product Concept

ResearchOps software for operator-led newsletters in opaque markets. The product turns proprietary observations into scored ideas, evidence-backed memos, channel-native distribution, and subscriber-driven editorial learning.

## Primary User

A solo operator or small research desk writing from real deal flow, underwriting work, investing work, consulting work, or domain-specific operating experience.

## Core Promise

```text
Capture what you notice.
Prove what matters.
Publish what compounds trust.
Learn what converts.
```

## Feature Map

| Feature | MVP Behavior |
| --- | --- |
| Capture Inbox | Add raw observations with source, taxonomy, and confidentiality |
| Idea Scoring | Score with the 100-point model and steering priority |
| Evidence Vault | Link sources to claims and gate private evidence |
| Editorial Steering | Track allocation drift and rank what to write next |
| Agent Workbench | Run Capture, Deal Scout, Skeptic, Ghostwriter, Editor, Repurposer, Analytics prompts |
| Memo Workbench | Track thesis, counterargument, reader action, claim register |
| Distribution Pack | Generate Substack, LinkedIn, X, paid teaser, lead magnet, next seed |
| Analytics Feedback | Import metrics and convert behavior into topic allocation changes |
| Approval Trail | Record private-data, thesis, claim, and distribution approvals |

## MVP User Workflows

### Quick Capture

1. Operator records a raw observation.
2. System assigns taxonomy and default confidentiality.
3. Private observations are blocked until approved.
4. Idea enters `captured` status.

### Weekly Triage

1. Operator reviews top 10 ideas.
2. System calculates base score and priority score.
3. Dashboard shows allocation gaps and readiness blockers.
4. Operator selects one flagship memo candidate.

### Evidence Pack

1. Deal Scout extracts facts, anomaly, signal, and evidence gaps.
2. Evidence records are linked to exact claims.
3. Sensitive facts are blocked from draft use.
4. Operator approves the evidence pack.

### Adversarial Review

1. Skeptic tests base rates, selection bias, hidden incentives, and claim risk.
2. Weak theses return to evidence collection.
3. Surviving theses move to draft.

### Memo Production

1. Ghostwriter drafts from approved evidence only.
2. Editor tightens claims and performs dead-angle review.
3. Operator approves final memo.

### Distribution And Feedback

1. Repurposer generates channel assets.
2. Operator approves assets.
3. Metrics are imported after publication.
4. Analytics Agent creates next seeds and allocation recommendations.

## MVP Roadmap

| Week | Build |
| --- | --- |
| 1 | Database schema, CSV templates, local dashboard |
| 2 | Capture form, score model, human gates |
| 3 | Agent prompt library and evidence pack workflow |
| 4 | Memo workbench and distribution pack generator |
| 5 | Metrics import and analytics feedback loop |
| 6 | Package as repeatable template with product onboarding notes |

## Productization Triggers

Move from local/no-code to SaaS when at least three are true:

- 8 to 12 weekly cycles completed.
- 100+ ideas scored.
- 20+ memos or distribution packs created.
- Paid conversion is attributable to specific topic categories.
- Another operator wants to use the same workflow.
- Manual approval tracking becomes a bottleneck.

## Anti-Features For v1

Do not build these first:

- Fully autonomous publishing.
- Multi-tenant billing.
- Complex social scheduling.
- Scraping-heavy social ingestion.
- Fine-grained permissions beyond approval gates.
- Custom analytics warehouse before Substack/manual export pain is proven.
