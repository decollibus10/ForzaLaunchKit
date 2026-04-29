# Newsletter Research Machine Data Schema

This schema is designed to run first in Notion or Airtable, then graduate into a custom software layer.

## Core Entities

### Idea

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | text | yes | Stable ID, e.g. `idea_2026_0001` |
| `title` | text | yes | Working title |
| `status` | enum | yes | `captured`, `scored`, `evidence`, `review`, `drafting`, `editing`, `approved`, `published`, `blocked`, `archived` |
| `category` | enum | yes | Editorial allocation category |
| `score` | number | yes | 0-100 base score |
| `priority_score` | number | yes | Score plus steering logic |
| `confidence` | enum | yes | `low`, `medium`, `high` |
| `asset_class` | enum | yes | Taxonomy field |
| `signal_type` | enum | yes | Taxonomy field |
| `underwriting_theme` | enum | no | Taxonomy field |
| `market_regime` | enum | no | Taxonomy field |
| `audience_intent` | enum | yes | Taxonomy field |
| `evidence_strength` | enum | yes | Taxonomy field |
| `confidentiality` | enum | yes | `public`, `sanitized_private`, `private_not_approved`, `sensitive_do_not_use` |
| `private_flag` | boolean | yes | Blocks public use until approval |
| `approved_for_public_use` | boolean | yes | Human gate |
| `source_url_or_file` | text | no | Source anchor |
| `observation` | long text | yes | Raw or normalized observation |
| `thesis` | long text | no | Proposed memo thesis |
| `counterargument` | long text | no | Falsifiable objection |
| `reader_action` | text | no | What the reader should do or rethink |
| `next_action` | text | yes | Next operating step |
| `owner` | text | yes | Usually operator |
| `publish_window` | date/text | no | Target week |
| `created_at` | date | yes | Capture date |
| `published_at` | date | no | Used for allocation tracking |

### Evidence

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | text | yes | Stable evidence ID |
| `idea_id` | relation | yes | Linked idea |
| `source_type` | enum | yes | Deal note, filing, book, podcast, investor letter, social, reader reply, export |
| `source_title` | text | yes | Human-readable source name |
| `source_url_or_file` | text | no | URL, file path, or internal reference |
| `source_quality` | number | yes | 1-5; primary source and repeated operator data score highest |
| `claim_supported` | text | yes | The exact claim this supports |
| `quote_or_fact` | long text | no | Short excerpt or fact, not a full copyrighted source |
| `private_flag` | boolean | yes | Human gate |
| `approved_for_public_use` | boolean | yes | Required for draft use |
| `notes` | long text | no | Analyst notes |

### Draft

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | text | yes | Stable draft ID |
| `idea_id` | relation | yes | Linked idea |
| `memo_type` | enum | yes | Free, paid, hybrid, lead magnet |
| `stage` | enum | yes | Outline, draft, editor review, approved, published |
| `title` | text | yes | Current title |
| `dek` | text | no | Short summary |
| `claim_register` | long text | yes | Claims needing evidence/caveats |
| `dead_angle_review` | long text | yes | Regulator, borrower, competitor, LP/reader risk |
| `paid_free_split` | long text | no | What stays free vs paid |
| `distribution_status` | enum | yes | Not started, generated, approved, posted |

### Metrics

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | text | yes | Stable metrics ID |
| `idea_id` | relation | yes | Linked idea |
| `published_at` | date | yes | Publication date |
| `channel` | enum | yes | Substack, LinkedIn, X, referral, lead magnet |
| `impressions` | number | no | Channel-dependent |
| `opens_or_views` | number | no | Channel-dependent |
| `clicks` | number | no | UTM or platform export |
| `replies_or_comments` | number | no | Engagement quality input |
| `saves_or_shares` | number | no | Trust/utility proxy |
| `free_subscribers` | number | no | Attributed if known |
| `paid_conversions` | number | no | Attributed if known |
| `qualified_inbound` | number | no | Useful operator leads |
| `reader_signal` | long text | no | What behavior means |
| `next_seed` | text | no | Follow-up idea |

## Product API Surface

These are the minimum custom software interfaces once the system graduates from no-code.

```text
POST /captures
POST /ideas/:id/score
POST /ideas/:id/evidence-pack
POST /ideas/:id/skeptic-review
POST /memos
POST /memos/:id/repurpose
POST /analytics/import
GET  /dashboard/editorial-steering
```

All write endpoints should return:

```json
{
  "record": {},
  "human_summary": "",
  "blocked": false,
  "blockers": [],
  "next_action": ""
}
```

## MVP Acceptance Tests

| Scenario | Expected Result |
| --- | --- |
| Raw underwriting edge case is captured | Idea record is created, tagged, scored, and assigned a next action |
| Private observation is not approved | Evidence and draft use are blocked |
| Weekly dashboard is opened | One recommended memo is shown with reasons |
| Skeptic review runs | Base-rate, bias, legal/claim, and missing-evidence risks are returned |
| Memo is approved | LinkedIn post, X thread, Substack teaser, paid teaser, and next seed are generated |
| Metrics are imported | Future idea priority and allocation view update |
