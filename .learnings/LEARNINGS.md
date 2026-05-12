# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice
**Areas**: frontend | backend | infra | tests | docs | config
**Statuses**: pending | in_progress | resolved | wont_fix | promoted | promoted_to_skill

---

## [LRN-20260505-001] best_practice

**Logged**: 2026-05-05T14:33:33Z
**Priority**: medium
**Status**: promoted
**Area**: docs

### Summary
Verify the current nested repo state before acting on stale FORZA automation memory.

### Details
The active FORZA app repo is `/Users/moof/Projects/Forza Capital LLC Business Workspace/ForzaVentures`. Automation memory from earlier runs referenced an existing `.learnings` journal and `outputs/codex-skills/SKILL_PROGRESSION_MAP.md`, but the current filesystem did not contain those artifacts. Future self-improvement runs should trust live repo inspection over older automation notes when deciding whether to create skills, validate skill packs, or append learning entries.

### Suggested Action
Start self-improvement runs by checking `pwd`, `git rev-parse --show-toplevel`, `.learnings/`, `AGENTS.md`, and any referenced skill-pack paths before editing.

### Metadata
- Source: investigation
- Related Files: AGENTS.md, .learnings/LEARNINGS.md
- Tags: self-improvement, automation-memory, forza
- See Also: none
- Pattern-Key: forza.self_improve.verify_current_repo
- Recurrence-Count: 1

---
