# Skill Progression Map

Last updated: 2026-05-05

## What This Forecast Uses

- Live workspace state in `/Users/moof/Projects/Forza Capital LLC Business Workspace/ForzaVentures`
- Current FORZA launch and ad-ops docs
- Installed global skill inventory under `/Users/moof/.codex/skills`
- Prior workflow memory across FORZA, FaithNearby, Resume and Career Builder, hireme-pls.com, Ecommerce 101, and dealership-targeting work

## Already Covered Well

These do not need to be re-predicted because they already exist globally:

- `forza-launch-operator`
- `forza-paid-funnel-qa`
- `forza-supabase-dealroom`
- `forza-offer-checker-extension`
- `launch-blocker-board`
- `launch-readiness-auditor`
- `mirrored-runtime-change-auditor`
- `repo-finish-plan-rewriter`
- `source-backed-workbook-builder`
- `source-backed-workbook-maintainer`
- `supabase-live-activation-checklist`

Workspace-local coverage created after this map:

- `operator-handoff-snapshot` at `/Users/moof/Projects/codex-skills/operator-handoff-snapshot` (created 2026-05-09 as a fallback because this automation environment cannot write to `/Users/moof/.codex/skills`)

## Next Skills To Build

### 1. `operator-handoff-snapshot` - created workspace-local 2026-05-09

Why it fits:

- You repeatedly move between workspaces and ask to continue from prior state without re-explaining context.
- The recurring failure mode is stale handoff state: missing current blockers, dirty-worktree truth, missing proof links, and drift between plan files and real repo state.

What it should do:

- Capture repo root, branch, dirty files, primary blockers, next commands, and proof artifacts.
- Output a short handoff file in the active repo using a consistent template.
- Refuse to report stale paths that no longer exist.

Why now:

- This is the highest-leverage cross-workflow gap because it improves nearly every future run.

### 2. `forza-attribution-debugger`

Why it fits:

- FORZA repeatedly returns to tracking setup, UTM capture, `/api/conversions`, GA4/GTM, Google Ads labels, Meta Pixel, and Meta CAPI.
- `docs/AD_PIPELINES.md` and `docs/LAUNCH_RUNBOOK.md` show a clear recurring measurement-verification workflow, but there is no skill dedicated to proving attribution end to end.

What it should do:

- Verify query param capture and persisted attribution fields.
- Check browser event gating vs server event posting.
- Confirm required env vars and conversion labels are present without leaking secrets.
- Produce a proof table for `lead_submitted`, `calculator_lead`, and `dashboard_started`.

Why now:

- This is the main missing operator before paid spend starts.

### 3. `forza-live-operator-flow-verifier`

Why it fits:

- Your repeated live checks are no longer generic smoke tests. They are business-flow checks across homepage, funnel entry, lead submit, login handoff, dashboard access, admin review, uploads, and offer publishing.
- The current runbook already defines these surfaces, but the verification logic is still manual and scattered.

What it should do:

- Run the ordered live-flow checklist against the Worker URL or production domain.
- Record which steps are read-only vs write-enabled.
- Save a concise launch-proof result with passed, failed, and blocked states.

Why now:

- This closes the gap between technical smoke and actual operator readiness.

### 4. `career-proof-sync`

Why it fits:

- Across Resume and Career Builder, hireme-pls.com, and dealership-targeting work, the repeated problem is story drift between resume, website, portfolio proof, outreach copy, and application packets.
- Existing local resume skills cover parts of the workflow, but there is still no cross-surface synchronizer.

What it should do:

- Compare core claims, metrics, dates, and proof links across the active resume surfaces.
- Flag conflicts before a new application wave or portfolio refresh.
- Generate a short truth-lock summary for reuse in later edits.

Why now:

- This has broad reuse and reduces expensive drift across multiple career surfaces.

### 5. `dealership-target-verifier`

Why it fits:

- Your dealership workflow keeps asking for real targets, real contacts, buy-box alignment, and evidence-backed outreach lanes.
- This is distinct from generic research because the useful output is a filtered, viable target set with direct routing information.

What it should do:

- Validate candidate dealerships against role fit, contact route quality, and business-fit filters.
- Separate human decision-makers from generic business listings.
- Produce a usable target sheet with confidence labels.

Why now:

- It converts research-heavy outreach into a repeatable qualification operator.

### 6. `faithnearby-production-schema-activator`

Why it fits:

- FaithNearby repeatedly hits the same activation gap: migrations may exist locally, but production proof is blocked on whether they are actually live and correctly mirrored into app behavior.
- The existing skill coverage is strong on launch gating and public discovery, but weaker on production schema activation.

What it should do:

- Confirm the required production migration set is applied.
- Check the exact app paths affected by schema state.
- Save a blocker-oriented activation report tied to the current launch gate.

Why now:

- This is still one of the most repeated blockers in that workspace.

### 7. `launch-proof-asset-capturer`

Why it fits:

- Several projects still need screenshot or proof capture for launch, release, or handoff, and browser/runtime limitations keep surfacing as blockers.
- The repeated need is not just screenshots. It is structured launch evidence.

What it should do:

- Capture required pages, labels, and status evidence for a release candidate.
- Store outputs in a predictable folder structure with timestamps.
- Fall back cleanly when a browser path is unavailable and mark the exact blocker.

Why now:

- This supports FORZA, hireme-pls.com, FaithNearby, and portfolio-proof flows.

## Build Order

1. `operator-handoff-snapshot` - created workspace-local 2026-05-09
2. `forza-attribution-debugger`
3. `forza-live-operator-flow-verifier`
4. `career-proof-sync`
5. `dealership-target-verifier`
6. `faithnearby-production-schema-activator`
7. `launch-proof-asset-capturer`

## Decision Rule For Future Prediction Passes

- Start by subtracting installed global skills and repo-local skills from the backlog.
- Prefer cross-workflow operator skills over another repo-specific checklist skill.
- Only predict a repo-specific skill when a workflow appears in docs and memory more than once and still lacks a matching operator.
- Reject stale memory paths if the referenced skill folder or map file no longer exists in the active workspace.
