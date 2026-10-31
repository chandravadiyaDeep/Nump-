# Codex Execution Prompt — NUMPA Commercial V1, Phase 2 Only

Copy the complete prompt below into Codex after Phase 1 has been completed, reviewed and accepted.

---

You are working in the existing NUMPA repository. Your task is to implement **NUMPA Commercial V1 — Phase 2: Data Analysis and Preprocessing Experience**.

This phase builds on the accepted Phase 1 workspace shell. It must improve the Data Analysis and Data Preprocessing / Cleaning workspaces while preserving the existing working product, production safety contract, authentication and hosting integrations.

## Read these files first, completely

1. `PRODUCTION_SAFETY.md`
2. `docs/commercial-v1/README.md`
3. `docs/commercial-v1/PRODUCT_REQUIREMENTS.md`
4. `docs/commercial-v1/WORKSPACE_UX.md`
5. `docs/commercial-v1/WORKFLOW_AND_DATA_LIFECYCLE.md`
6. `docs/commercial-v1/SAFETY_AND_ARCHITECTURE.md`
7. `docs/commercial-v1/IMPLEMENTATION_ROADMAP.md`
8. `docs/commercial-v1/VERIFICATION_PLAN.md`
9. `docs/commercial-v1/CODEX_PHASE_1_PROMPT.md` (for the Phase 1 baseline and constraints)

## Phase 1 prerequisite gate — mandatory

Before coding:
1. Inspect Git branch, working tree, recent commits and open/merged PRs.
2. Identify the accepted Phase 1 implementation commit and review its diff and test results.
3. Confirm the workspace shell, sidebar, seven-item navigation, themes and existing authentication flow are present and working.
4. Confirm the existing Data Analysis upload/inspection workflow still works.
5. Run the current baseline tests/build before Phase 2 changes.
6. If Phase 1 is not merged/accepted, its implementation cannot be found, or the baseline is broken, STOP. Report the missing prerequisite and do not begin Phase 2.
7. Do not discard, overwrite or reset uncommitted user work.

Use a new focused feature branch from the latest accepted `main`, for example `feature/commercial-v1-phase-2-analysis-cleaning`. If the branch exists, inspect it before using it. Do not work directly on `main`, force-push, or merge automatically.

## Mission

Deliver a polished, usable **Data Analysis** and **Data Preprocessing / Cleaning** experience inside the Phase 1 workspace shell.

### A. Data Analysis workspace

Inspect the actual API response and current frontend capabilities first. Use only real fields and validated calculations.

Implement or improve:

- Clear dataset upload area with supported file types and current upload-size limitations.
- Dataset identity panel showing file name, file type, dimensions and processing status.
- Dataset overview: row count, column count, data types, missing values and duplicate information when supplied by the API.
- Column-level profiling table using available response data: column name, data type, non-null/missing counts, missing percentage, distinct values and relevant numeric/categorical summaries where available.
- Useful quality observations based on actual data, with explanations and clear severity.
- Search, sort or filter for column profiles when useful and performant.
- Loading skeletons, empty states, invalid-file states, upload progress if supported, API errors and retry actions.
- Clear indication when a statistic is unavailable, sampled or estimated.
- Preserve the current upload and inspect endpoint contract.

Do not invent statistics or infer values not present in the response. If a useful metric requires backend work, document the gap and propose the smallest backward-compatible addition; do not change the API in this phase without approval.

### B. Data Preprocessing / Cleaning workspace

Build a clear, reviewable cleaning experience using existing backend behaviour:

- Show cleaning recommendations/actions actually returned or supported by the current API.
- Explain why each recommendation may be useful and what data it affects.
- Allow users to select/deselect supported operations and configure parameters only where the backend supports them.
- Distinguish recommended, selected, skipped and unsupported actions.
- Provide a preview before execution, including available before/after counts or examples.
- Require explicit user confirmation before executing changes.
- Show a clear processing state and prevent duplicate submissions.
- Display the cleaning result/report with operations applied, skipped operations, affected columns/rows and warnings where available.
- Keep original source data immutable and clearly distinguish source from cleaned output.
- Provide cleaned dataset download using the existing supported export behaviour.
- Handle preview or execution failure without replacing the source or showing false success.
- Preserve current cleaning preview and execute endpoint request/response contracts.

If the existing backend returns a CSV regardless of source file type, clearly label the actual download format; do not claim the original format is preserved.

### C. Connected workflow behaviour

- Make the handoff from Data Analysis to Data Preprocessing intuitive.
- Retain active workspace/session state when moving between these two sections, using the accepted Phase 1 architecture.
- Do not ask the user to upload the same file again if the existing frontend state and API design can safely retain it.
- Identify whether each result refers to the original source or cleaned output.
- Provide clear navigation back to Data Analysis.
- Do not claim state survives refresh/browser closure unless this has been implemented and tested.
- Do not introduce raw dataset persistence to solve state continuity.

## Protected services — do not modify

### Supabase
Do not change project URL, keys, auth providers, email confirmation, callbacks, redirect URLs, client initialization, database schema, tables, RLS, policies, triggers, functions or migrations. Do not add tables. Preserve sign-in/session/sign-out.

### Render
Do not change service configuration, environment variables, CORS, health check, build/start commands, runtime, deployment settings, API base URL or endpoint contracts. Do not add backend routes or dependencies in this phase.

### Vercel
Do not change project settings, production domain, production branch, build settings or environment variables.

### Existing API contracts
Use the existing configured `NEXT_PUBLIC_NUMPA_API_URL`. Preserve request/response behaviour for:
- `GET /api/v1/health`
- `POST /api/v1/datasets/inspect`
- `POST /api/v1/cleaning/preview`
- `POST /api/v1/cleaning/execute`
- `POST /api/v1/ml-readiness/score`
- `POST /api/v1/ml-labs/compare`

Do not hardcode a new API URL. Do not silently alter schemas, HTTP methods, routes, limits or response semantics.

## Technical and UX constraints

- Inspect existing components and extract reusable components where helpful.
- Keep the Phase 1 app shell, navigation order and theme system intact.
- Support both light and dark themes in every new component.
- Reuse existing dependencies and design tokens. Do not introduce a new UI library, charting package or state library without a clear need and owner approval.
- Keep TypeScript types aligned with the actual API response.
- Avoid unsafe `any`; if unavoidable at an API boundary, validate and narrow the data before rendering.
- Keep components accessible, keyboard usable and responsive.
- Add comments to code where they explain non-obvious logic or state transitions.
- Avoid broad refactors and unrelated cleanup.
- Do not log raw rows, sensitive column values, uploaded file contents or credentials.
- Do not store uploaded file bytes or raw dataset values in localStorage, URLs, analytics or Supabase.
- Never mutate the original upload.
- Do not fabricate demo data in the real workspace. If visual examples are needed for tests, keep them in isolated test fixtures.

## Explicitly out of scope

Do NOT implement:
- Data Visualization charts or a new charting engine (Phase 3).
- New ML readiness scoring algorithms or ML Lab model comparison features (Phase 4).
- Analysis History persistence or new Supabase tables (Phase 5).
- API keys, webhooks, Zapier, Make, n8n, Google Drive or GitHub connections (Phase 6).
- Billing, subscriptions or payment gateway.
- Raw dataset storage or cloud object storage.
- New backend endpoints, API contract changes, database migrations or auth changes.
- Render, Vercel or production configuration changes.
- SEO/blog/CMS features.
- Broad dependency upgrades or unrelated refactors.

## Required verification

Follow `docs/commercial-v1/VERIFICATION_PLAN.md` and add phase-specific tests.

At minimum:
1. Run frontend lint, type-check and production build.
2. Run existing API tests if any backend file was touched; ideally do not touch backend code.
3. Add/adjust component or unit tests for dataset summary, column profile rendering, quality observations and cleaning selections.
4. Test a synthetic CSV with numeric and categorical columns, missing values and duplicates.
5. Test empty, malformed, unsupported and oversized uploads using safe fixtures.
6. Verify all displayed statistics match the API response or a deterministic calculation.
7. Verify selecting/deselecting cleaning actions changes the preview request correctly.
8. Verify preview does not mutate the source.
9. Verify execution requires confirmation and prevents duplicate submissions.
10. Verify failed preview/execution leaves the source intact.
11. Verify the cleaned download is valid and labelled with its actual format.
12. Verify source-versus-cleaned context is clear.
13. Verify navigation between Data Analysis and Data Preprocessing retains state where supported.
14. Verify both light and dark themes and responsive layouts.
15. Verify existing authentication navigation still works.
16. Inspect the final diff for secrets, unrelated changes, protected config edits and API contract changes.
17. Report all tests not run and why. Do not claim success without evidence.

Use synthetic, non-sensitive test datasets only. Do not upload private client data to test environments.

## Definition of done

- Data Analysis is a polished standalone workspace with trustworthy overview and column-level information based on real data.
- Data Preprocessing / Cleaning has an understandable recommendation → selection → preview → approval → execution → report/download flow.
- Original source remains unchanged.
- The two workspaces hand off dataset context without unnecessary re-upload where current architecture supports it.
- Existing API contracts, authentication, Phase 1 shell and themes remain intact.
- No Supabase, Render, Vercel, production settings or database changes.
- Relevant automated checks and manual smoke tests pass.
- Changes are on a focused feature branch and ready for owner review in a PR.
- Do not merge to main or deploy to production automatically.

## Final report format

Report:
1. Phase 1 prerequisite evidence and accepted base commit.
2. Feature branch and commit SHA(s).
3. Files created/changed.
4. Data Analysis improvements.
5. Data Preprocessing / Cleaning improvements.
6. How source immutability and active dataset context are preserved.
7. Existing API/auth/hosting behaviour preserved.
8. Tests/checks run with exact pass/fail results.
9. Tests not run and why.
10. Confirmation that Supabase, Render, Vercel, database schema and API contracts were not changed.
11. PR/preview URL if one exists.
12. Known limitations.
13. Rollback instructions.

If a protected change or new endpoint appears necessary, STOP and explain the smallest proposed change and why approval is required. Do not proceed by guessing.

---

End of Codex prompt.
