# Automation Stack Options

The system should start as a one-operator desk, then graduate only when the weekly loop proves repeatable.

## Minimal No-Code Version

| Layer | Tool | Job |
| --- | --- | --- |
| Control plane | Notion or Airtable | Ideas, evidence, drafts, metrics |
| Capture | Forms, mobile quick add, email forwarding | Raw observations and reader replies |
| Automation | Zapier, Make, or Airtable Automations | Move inputs into the database |
| Agents | Saved prompts in ChatGPT or Zapier Agents | Normalize, scout, skeptic, draft, repurpose |
| Publishing | Substack manual editor | Final memo publication |
| Analytics | Manual Substack export, UTM spreadsheet | Monday feedback loop |

**When to use:** first 8 to 12 publishing cycles.

**Rule:** no agent publishes, schedules, or uses private data without human approval.

## Intermediate Operator Stack

| Layer | Tool | Job |
| --- | --- | --- |
| Control plane | Airtable or Notion | Editorial database with views and approval fields |
| Workflow engine | n8n Cloud | Scheduled ingestion, routing, and weekly brief generation |
| Agent runtime | OpenAI Agents SDK or Agent Builder | Specialist agents with structured handoffs |
| Knowledge | Vector store plus source table | Evidence retrieval and source ledger |
| Ingestion | Gmail, Google Drive, Readwise, RSS, X API, manual LinkedIn notes | Deal notes, filings, books, podcasts, social signals |
| Distribution | Manual Substack, approved LinkedIn scheduler, X queue | Channel-native assets |
| Analytics | CSV exports, UTM captures, reply parser | Feedback into scoring and allocation |

**When to use:** after the operator has a stable weekly ritual and 50+ scored ideas.

**Controls:**

- Agent traces must be retained.
- Private/sensitive records require explicit approval fields.
- External text is parsed into structured fields before it can influence tool calls.
- Analytics changes editorial allocation only after human review.

## Full Custom Newsletter Operating System

| Layer | Component | Job |
| --- | --- | --- |
| App | Next.js dashboard | Capture, steering, memo workbench, approvals |
| Database | Postgres | Ideas, evidence, drafts, assets, metrics, users |
| Retrieval | pgvector or managed vector store | Evidence search and source matching |
| Storage | Object storage | PDFs, transcripts, exports, memo artifacts |
| Agents | OpenAI Agents SDK | Typed agent workflows, handoffs, guardrails, traces |
| Jobs | Queue worker | Ingestion, scoring, scheduled analysis, exports |
| Analytics | Warehouse tables | Retention, conversion, channel performance |
| Governance | RBAC, audit logs, approval states | Multi-tenant and team controls |
| Integrations | Substack exports, X API, LinkedIn-approved APIs, Google, Notion/Airtable | Source and distribution connectors |

**When to use:** after the workflow consistently produces valuable memos and a product wedge is clear.

## Platform Constraints

- Substack is not the system of record. Treat it as publishing and monetization, with exports/manual imports feeding metrics.
- LinkedIn automation is gated and permissioned. Keep a manual or approved scheduler path.
- X is useful for search, counts, stream rules, and post metrics, but the system should budget API cost.
- Notion and Airtable are adequate control planes until multi-tenant permissions, audit logs, and agent traces matter.
- n8n is a workflow engine first. Use agents only where ambiguity exists; use deterministic steps for routing, validation, and approvals.

## Automation Recipes

| Trigger | Automation | Human Gate |
| --- | --- | --- |
| New email/reply tagged `newsletter-signal` | Create idea or subscriber signal | Review before scoring |
| New file in research folder | Create evidence record and summarize source | Approve source quality |
| Friday 9 AM | Rank top 10 ideas and generate weekly brief | Approve selected thesis |
| Draft approved | Generate distribution pack | Approve every asset |
| Monday 9 AM | Import metrics and recommend allocation change | Approve topic mix change |
