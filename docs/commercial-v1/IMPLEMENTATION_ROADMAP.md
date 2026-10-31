# NUMPA Commercial V1 — Implementation Roadmap

## Delivery strategy

Ship in controlled phases. Each phase must be independently testable and reversible. Do not start a later phase merely because its navigation item exists.

## Phase 1 — Commercial workspace foundation

Goal: introduce the new application shell without changing the underlying product capabilities or protected services.

Scope:
- Read and obey `PRODUCTION_SAFETY.md`.
- Inspect current repository, routes, app page, auth navigation, styles and tests.
- Create collapsible desktop sidebar and mobile drawer.
- Use the exact seven-item navigation order.
- Add main workspace header/content frame.
- Implement light and dark theme tokens and switching.
- Default to light theme.
- Persist theme preference locally only if a safe existing mechanism is available.
- Move the existing working Data Analysis/upload/inspection workflow into the new shell without breaking its logic.
- Preserve existing Supabase-aware auth navigation and sign-out behaviour.
- Preserve API base URL and all existing endpoint contracts.
- Add honest placeholder/coming-soon states for unfinished sections, if needed to make navigation coherent.
- Add accessibility, responsive and loading/error states.

Explicitly excluded:
- No Supabase schema, RLS, policy, auth provider or redirect changes.
- No Render service, environment, CORS, health check or deployment changes.
- No Vercel project, domain, environment or build setting changes.
- No new API endpoints or endpoint contract changes.
- No raw dataset persistence or history database.
- No live third-party integrations, API key management, webhooks or billing.
- No new ML algorithms, training workflows or visual analytics engine.

Acceptance criteria:
1. Existing production URL and API base URL remain unchanged.
2. Existing login/session/sign-out flow still works.
3. Existing dataset upload and inspection workflow still works.
4. Sidebar expands/collapses and mobile navigation works.
5. All seven navigation entries appear in the specified order.
6. Light and dark themes both work without resetting active workflow state.
7. No false claims of implemented features.
8. Relevant lint/type-check/build/tests pass.
9. A real end-to-end browser smoke test is completed in a preview environment if available.
10. Diff contains no unrelated changes or protected configuration edits.

## Phase 2 — Data Analysis and Preprocessing experience

- Complete Data Analysis as a standalone workspace.
- Improve column-level profiling and dataset quality explanations.
- Improve cleaning recommendations, selection, preview, approval and audit report.
- Keep source immutable.
- Preserve existing API contracts.
- Add test coverage and UX polish.

## Phase 3 — Data Visualization

- Implement chart selection and rendering for supported data.
- Add sensible chart defaults and validation.
- Identify source versus cleaned dataset.
- Add export only after correctness and performance are tested.

## Phase 4 — ML Readiness and ML Lab

- Integrate task-aware readiness scoring.
- Explain score dimensions and caveats.
- Implement supported algorithm comparison UX based on actual backend support.
- Add leakage-safe validation and appropriate metrics.
- Forecasting/clustering only when corresponding engines are verified.

## Phase 5 — Analysis History and Settings

- Design metadata-only history persistence.
- Review Supabase schema/RLS implications separately.
- Request explicit approval before migrations.
- Add profile/preferences/usage/privacy views using approved data.
- Keep original raw datasets temporary by default.

## Phase 6 — Integrations and commercial launch

- Public API keys, scopes, quotas and usage metering.
- Webhooks and automation connectors.
- Google Drive/GitHub integrations where justified.
- Billing, plan entitlements and subscription lifecycle.
- Privacy, terms, onboarding, documentation and launch gates.

## Phase gates

A phase is complete only when:
- Acceptance criteria pass.
- Tests and build are verified on the exact commit.
- Production safety review passes.
- No protected service or contract was changed without approval.
- Documentation and known limitations match actual behaviour.
- Owner reviews and accepts the result before the next phase begins.
