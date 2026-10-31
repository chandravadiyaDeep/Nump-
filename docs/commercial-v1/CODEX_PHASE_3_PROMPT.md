# Codex Execution Prompt — NUMPA Commercial V1, Phase 3 Only

Copy the complete prompt below into Codex only after Phase 2 has been implemented, reviewed and accepted.

---

You are working in the existing NUMPA repository. Your task is to implement **NUMPA Commercial V1 — Phase 3: Data Visualization Workspace**.

This phase adds an interactive, trustworthy visualization experience using the active dataset context created by the Data Analysis and Data Preprocessing / Cleaning workspaces. Preserve the accepted Phase 1 shell and Phase 2 workflow.

## Read these files first, completely

1. `PRODUCTION_SAFETY.md`
2. `docs/commercial-v1/README.md`
3. `docs/commercial-v1/PRODUCT_REQUIREMENTS.md`
4. `docs/commercial-v1/WORKSPACE_UX.md`
5. `docs/commercial-v1/WORKFLOW_AND_DATA_LIFECYCLE.md`
6. `docs/commercial-v1/SAFETY_AND_ARCHITECTURE.md`
7. `docs/commercial-v1/IMPLEMENTATION_ROADMAP.md`
8. `docs/commercial-v1/VERIFICATION_PLAN.md`
9. `docs/commercial-v1/CODEX_PHASE_1_PROMPT.md`
10. `docs/commercial-v1/CODEX_PHASE_2_PROMPT.md`

## Phase 2 prerequisite gate — mandatory

Before coding:
1. Inspect Git branch, working tree, recent commits and pull requests.
2. Identify the accepted Phase 2 implementation commit and review its diff and test results.
3. Confirm Phase 1 workspace shell and Phase 2 Data Analysis and Data Preprocessing / Cleaning workspaces are present and working.
4. Confirm dataset upload, inspection, cleaning preview, approved cleaning execution and cleaned output download work as supported by the current product.
5. Run current baseline checks before making changes.
6. If Phase 2 is not merged/accepted, implementation is missing, or the baseline is broken, STOP and report. Do not begin Phase 3.
7. Do not discard, overwrite or reset uncommitted user work.

Create a focused feature branch from the latest accepted `main`, for example `feature/commercial-v1-phase-3-visualization`. Inspect any existing branch before reuse. Never work directly on `main`, force-push or merge automatically.

## Mission

Build a polished **Data Visualization** workspace that lets users explore the currently active source dataset or cleaned dataset through appropriate charts.

The workspace must use real data and clearly identify which dataset version is being visualized.

## A. Dataset selection and context

- Reuse the active dataset/workspace context established in earlier phases.
- Allow the user to choose between the original source and cleaned output only when both are actually available.
- Show the selected dataset version and its file label.
- Keep the selection consistent with the actual in-memory dataset and processing state.
- Do not require a duplicate upload if the existing architecture can safely retain the active dataset.
- If the selected dataset is no longer available, show a clear recovery message and request re-upload as appropriate.
- Do not imply state survives refresh or browser closure unless this is implemented and verified.
- Never store raw dataset bytes or rows in localStorage, URL parameters, analytics or logs.

## B. Visualization capabilities

Inspect actual frontend state and backend response capabilities first. Implement chart types only where the data can be accurately and safely obtained.

Planned chart types:
- Histogram for numeric distributions.
- Bar chart for categorical counts or grouped summaries.
- Line chart for ordered/time-based values where ordering is meaningful.
- Scatter plot for relationships between two numeric columns.
- Box plot for numeric distribution and outlier exploration.
- Correlation heatmap for suitable numeric columns.

Requirements:
- Chart type availability must respond to selected column types and data validity.
- Provide column selectors and relevant options, with sensible defaults.
- Validate selected columns before rendering.
- Handle nulls, non-finite values, constant columns, empty columns, high-cardinality categories, duplicate labels and date parsing safely.
- Avoid misleading chart defaults, truncated axes without explanation or inappropriate aggregation.
- For categorical charts, make aggregation/count logic explicit.
- For line charts, make the sort/order rule visible and do not imply a time series when the x-axis is not meaningfully ordered.
- For scatter plots, explain any sampling used for large datasets.
- For correlation, state the method used and exclude/handle non-numeric or insufficient columns transparently.
- Label axes, units when known, legends and chart titles clearly.
- Provide helpful empty, invalid-selection, loading and error states.
- Charts must be responsive and usable in light and dark themes.
- Use accessible labels and provide a text/table alternative or concise data summary where practical.

## C. Data correctness and performance

- Use actual active dataset values or verified summaries; never fabricate chart points.
- Prefer client-side computation only if the dataset is already available in memory and the current browser processing limits are safe.
- If data is not available in the browser, inspect existing API responses before proposing new backend work.
- Do not introduce a new endpoint, backend dependency, storage layer or API contract change in this phase without stopping and requesting approval.
- Establish sensible rendering limits and sampling rules for large datasets.
- Sampling must be deterministic where possible and clearly disclosed to the user.
- Do not silently drop rows without describing the rule.
- Avoid blocking the UI on large computations; use safe chunking/memoization only if compatible with the current framework and complexity.
- Do not add a charting library or other dependency without checking the existing package first and explaining why the current stack is insufficient. Avoid broad dependency upgrades.

## D. Export and sharing

Phase 3 priority is correct interactive visualization. Export is optional and must be implemented only if it can be done reliably with existing dependencies and without new backend contracts.

If implemented:
- Clearly distinguish image export from data export.
- Ensure exported chart matches the visible chart and current dataset selection.
- Do not export raw data unless the user explicitly selects a supported data export action.
- Do not add sharing links that expose dataset values.
- If export is not safely achievable within this phase, document it as a later improvement instead of adding a fragile placeholder.

## E. Workspace UX

- Preserve the Phase 1 sidebar, exact navigation order and theme system.
- Preserve Phase 2 Data Analysis and Data Preprocessing / Cleaning functionality.
- Data Visualization should feel like a native workspace page, not a separate application.
- Provide a chart gallery or chart-type selector and a clear chart canvas.
- Provide an intuitive way to select columns and adjust chart settings.
- Clearly identify source versus cleaned dataset.
- Include concise explanations of what each chart can reveal.
- Support desktop, tablet and mobile layouts.
- Add loading, empty, invalid selection and error states.
- Do not show fake/demo charts in the real user workspace. Use synthetic fixtures only in isolated tests.

## Protected services — do not modify

### Supabase
Do not change project URL, keys, auth providers, email confirmation, callbacks, redirect URLs, client initialization, database schema, tables, RLS, policies, triggers, functions or migrations. Do not add tables. Preserve existing auth behaviour.

### Render
Do not change service configuration, environment variables, CORS, health check, build/start commands, runtime, deployment settings, API base URL or endpoint contracts. Do not add backend routes or dependencies.

### Vercel
Do not change project settings, production domain, production branch, build settings or environment variables.

### Existing API
Use the existing configured `NEXT_PUBLIC_NUMPA_API_URL`. Preserve all current request/response contracts, including:
- `GET /api/v1/health`
- `POST /api/v1/datasets/inspect`
- `POST /api/v1/cleaning/preview`
- `POST /api/v1/cleaning/execute`
- `POST /api/v1/ml-readiness/score`
- `POST /api/v1/ml-labs/compare`

Do not hardcode a new API URL or silently alter schemas, routes, limits or response semantics.

## Technical constraints

- Inspect existing components, types, package dependencies and state management before editing.
- Reuse existing design tokens and chart dependencies if already present and appropriate.
- Keep both light and dark themes fully supported.
- Preserve current active dataset and cleaning workflow state.
- Keep TypeScript types aligned with actual data structures.
- Validate all chart inputs at the boundary.
- Add comments where they clarify non-obvious calculations, sampling or state transitions.
- Keep code modular and testable.
- Avoid `any` unless narrowly justified at an external data boundary and validated immediately.
- Do not log raw data, credentials or sensitive values.
- Do not change unrelated application pages or perform broad refactors.

## Explicitly out of scope

Do NOT implement:
- ML Readiness scoring changes or ML Lab algorithm comparisons (Phase 4).
- Analysis History persistence or new Supabase tables (Phase 5).
- Public API keys, webhooks, Zapier, Make, n8n, Google Drive or GitHub integrations (Phase 6).
- Billing, subscriptions or payment gateway.
- Raw dataset persistence or cloud object storage.
- New backend endpoints or API contract changes.
- Supabase, Render, Vercel, database or authentication changes.
- SEO/blog/CMS features.
- Broad dependency upgrades or unrelated refactors.

## Required verification

Follow `docs/commercial-v1/VERIFICATION_PLAN.md` and add visualization-specific tests.

At minimum:
1. Run frontend lint, type-check and production build.
2. Run existing API tests if backend files were touched; ideally do not touch backend code.
3. Add tests for each supported chart's data transformation and validation.
4. Test numeric, categorical, date/time, mixed, empty, constant and high-cardinality columns.
5. Test missing values, non-finite values and malformed dates.
6. Verify chart values match deterministic expected results from synthetic fixtures.
7. Verify source and cleaned dataset selection uses the correct dataset version.
8. Verify sampling behaviour and disclosure on larger fixtures.
9. Verify chart labels, legends, axes and aggregation descriptions.
10. Verify light/dark themes and responsive behaviour.
11. Verify accessible labels and a non-visual chart summary/table alternative where practical.
12. Verify Phase 1 and Phase 2 workflows still work.
13. Verify authentication navigation remains functional.
14. Inspect the diff for secrets, unrelated changes, protected configuration edits and API contract changes.
15. Report tests not run and why. Never claim a test or deployment succeeded without evidence.

Use synthetic, non-sensitive fixtures only.

## Definition of done

- Data Visualization is a usable workspace with real, correct charts for supported data types.
- Users can choose the source or cleaned dataset when both are available.
- Chart inputs and data types are validated.
- Large-data sampling/limits are safe and disclosed.
- Both themes, responsive layouts and accessibility are addressed.
- Phase 1 and Phase 2 functionality remains intact.
- No Supabase, Render, Vercel, database, authentication or API contract changes.
- Relevant automated checks and manual smoke tests pass.
- Work is on a focused feature branch and ready for owner review in a PR.
- Do not merge to main or deploy to production automatically.

## Final report format

Report:
1. Phase 2 prerequisite evidence and accepted base commit.
2. Feature branch and commit SHA(s).
3. Files created/changed.
4. Chart types implemented and their data requirements.
5. How source-versus-cleaned dataset selection works.
6. Data validation, sampling and performance safeguards.
7. Accessibility and theme behaviour.
8. Phase 1/2 workflows preserved.
9. Tests/checks run with exact results.
10. Tests not run and why.
11. Confirmation that Supabase, Render, Vercel, database, auth and API contracts were not changed.
12. PR/preview URL if one exists.
13. Known limitations and deferred export work.
14. Rollback instructions.

If a protected change, new endpoint or new dependency appears necessary, STOP and request approval with the smallest proposed change and its rationale. Do not proceed by guessing.

---

End of Codex prompt.
