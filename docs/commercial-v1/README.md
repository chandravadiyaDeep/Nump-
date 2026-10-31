# NUMPA Commercial V1 — Blueprint

Status: Planning baseline  
Branch: `docs/commercial-v1-blueprint`  
Production branch: `main`  
Audience: repository owner, Codex, Claude, developers and future agents.

## Purpose

This folder is the single source of truth for the Commercial V1 product direction and its staged implementation. Read this index, then the linked documents, before implementing any Commercial V1 work.

## Locked product decisions

1. NUMPA Commercial V1 uses a ChatGPT-inspired workspace: collapsible left navigation and a right-side working area.
2. Both light and dark themes are supported. Light is the initial default; theme preference should be stored locally in Phase 1 unless existing persistence already safely supports it.
3. Workspace navigation order is fixed:
   1. Data Analysis
   2. Data Preprocessing / Cleaning
   3. Data Visualization
   4. ML Readiness
   5. ML Lab
   6. Analysis History
   7. Settings
4. Integrations is a subsection of Settings, not an eighth primary navigation item.
5. Core workflow is a connected pipeline. Users should not need to upload the same dataset again when moving between stages in one active workspace.
6. Analysis History initially stores analysis metadata and reports only. Original datasets remain temporary by default; no raw-dataset persistence is introduced in Phase 1.
7. Build incrementally on the existing working application. Do not replace the existing authentication, API, hosting or processing architecture.

## Documents

- [Product requirements](PRODUCT_REQUIREMENTS.md) — scope, users, navigation and feature requirements.
- [Workspace UX specification](WORKSPACE_UX.md) — shell, responsive behaviour, themes and page patterns.
- [Workflow and data lifecycle](WORKFLOW_AND_DATA_LIFECYCLE.md) — pipeline state, data handling and stage contracts.
- [Integrations specification](INTEGRATIONS.md) — future integration architecture and staged rollout.
- [Implementation roadmap](IMPLEMENTATION_ROADMAP.md) — phases, dependencies and acceptance criteria.
- [Safety and architecture constraints](SAFETY_AND_ARCHITECTURE.md) — protected services, no-go changes and implementation rules.
- [Verification plan](VERIFICATION_PLAN.md) — checks and release gates.
- [Codex Phase 1 prompt](CODEX_PHASE_1_PROMPT.md) — the single prompt to run for the workspace foundation.
- [Codex Phase 2 prompt](CODEX_PHASE_2_PROMPT.md) — the single prompt to run for Data Analysis and Data Preprocessing / Cleaning.
- [Codex Phase 3 prompt](CODEX_PHASE_3_PROMPT.md) — the single prompt to run for the Data Visualization workspace.
- [Codex Phase 4 prompt](CODEX_PHASE_4_PROMPT.md) — the single prompt to run for ML Readiness and ML Lab.
- [Codex Phase 5 prompt](CODEX_PHASE_5_PROMPT.md) — the single prompt to run for Analysis History and Settings.
- [Codex Phase 6 prompt](CODEX_PHASE_6_PROMPT.md) — the single prompt to run for integrations and commercial launch readiness.

## Mandatory reading order for an implementation agent

1. `/PRODUCTION_SAFETY.md`
2. This file
3. `SAFETY_AND_ARCHITECTURE.md`
4. `PRODUCT_REQUIREMENTS.md`
5. `WORKSPACE_UX.md`
6. `WORKFLOW_AND_DATA_LIFECYCLE.md`
7. `IMPLEMENTATION_ROADMAP.md`
8. `VERIFICATION_PLAN.md`
9. The phase-specific execution prompt.

## Scope control

Each phase-specific prompt authorizes only that phase. Later phases are planning documents, not permission to implement all features at once. Phase 2 must not begin until Phase 1 is implemented, tested and accepted. Phase 3 must not begin until Phase 2 is implemented, tested and accepted. Phase 4 must not begin until Phase 3 is implemented, tested and accepted. Phase 5 must not begin until Phase 4 is implemented, tested and accepted. Phase 6 must not begin until Phase 5 is implemented, tested and accepted. Do not implement integrations, billing, new database tables or raw dataset persistence in earlier phases. Phase 4 may expose only ML tasks, algorithms, metrics and validation strategies already implemented and tested by the existing engine; it does not authorize new scoring formulas, algorithms, backend endpoints or database changes. Phase 5 does not authorize Supabase schema, RLS, migration, storage, authentication, infrastructure or API changes; obtain separate explicit approval before proposing or applying any database migration. Phase 6 is approval-gated: it does not grant blanket permission to modify production services, database/auth, secrets, external provider accounts, payment processing or API contracts. Implement only verified capabilities after the required separate approvals.

## Change control

If code inspection reveals that a requirement conflicts with the actual repository, stop and report the conflict. Do not silently invent a replacement architecture. Update this blueprint through a reviewed documentation change before changing a locked product decision.
