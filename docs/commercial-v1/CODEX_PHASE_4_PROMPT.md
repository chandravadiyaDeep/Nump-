# Codex Execution Prompt — NUMPA Commercial V1, Phase 4 Only

Copy the complete prompt below into Codex only after Phase 3 has been implemented, reviewed and accepted.

---

You are working in the existing NUMPA repository. Your task is to implement **NUMPA Commercial V1 — Phase 4: ML Readiness and ML Lab**.

This phase brings the existing ML Readiness and ML Lab capabilities into the Commercial V1 workspace. Build on the accepted Phase 1 shell, Phase 2 dataset workflow and Phase 3 visualization workspace. Do not rewrite the existing scoring or model-comparison engine merely to fit the UI.

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
11. `docs/commercial-v1/CODEX_PHASE_3_PROMPT.md`

## Phase 3 prerequisite gate — mandatory

Before coding:

1. Inspect Git branch, working tree, recent commits and pull requests.
2. Identify the accepted Phase 3 implementation commit and review its diff and test results.
3. Confirm Phase 1 workspace shell, Phase 2 Data Analysis and Data Preprocessing / Cleaning, and Phase 3 Data Visualization are present and working.
4. Confirm dataset context correctly distinguishes original source from cleaned output and that supported visualizations use real values.
5. Run current baseline checks before making changes.
6. If Phase 3 is not merged/accepted, any earlier phase is incomplete, or baseline checks are broken, STOP and report. Do not begin Phase 4.
7. Do not discard, overwrite or reset uncommitted user work.

Create a focused feature branch from the latest accepted `main`, for example `feature/commercial-v1-phase-4-ml-workspaces`. Inspect any existing branch before reuse. Never work directly on `main`, force-push or merge automatically.

## Mission

Implement two connected workspaces:

- **ML Readiness** — a transparent, task-aware assessment of whether the selected dataset is suitable for a specified machine-learning task.
- **ML Lab** — a controlled comparison experience for algorithms that the existing backend demonstrably supports.

The UI must reflect verified engine capabilities. Do not invent support for tasks, algorithms, metrics, validation methods or model training.

## A. Shared dataset and task context

- Reuse the active dataset context from earlier phases.
- Allow source-versus-cleaned selection only when both versions are actually available.
- Show the selected dataset label/version, dimensions and relevant context.
- Preserve the source dataset as immutable.
- Do not require a second upload when the active dataset is still available.
- If session data is lost, explain that the user must re-upload; do not imply persistence across refresh or browser closure unless verified.
- Never place raw rows, file bytes or sensitive dataset values in localStorage, URLs, analytics or logs.
- Make the ML task explicit before task-dependent scoring or comparison.
- Do not silently infer a target column or override a user selection.

## B. ML Readiness workspace

Inspect the current backend scoring implementation, tests, request/response schemas and endpoint behaviour before designing the UI.

The intended task families are:

- Classification
- Regression
- Time-series forecasting
- Clustering

Only expose a task when the current scoring engine actually implements and tests it. If a task is unsupported or only partially implemented, label it as unavailable/not yet supported and explain the limitation. Do not create a frontend-only score to fill the gap.

### Configuration and inputs

Where supported by the real engine, let the user configure:

- ML task type.
- Target column for supervised tasks.
- No target column for clustering, if the backend contract supports that mode.
- Intended algorithm or algorithm family, only if the scoring engine uses it.
- Validation strategy, only from verified supported options.
- Any other required assessment input that exists in the actual API contract.

Validate selections against actual dataset columns and types. Prevent invalid target selection, target leakage and incompatible task/column combinations where the existing engine provides enough information to do so.

Do not add custom scoring-weight editors, saved company configurations, score version management or new assessment dimensions unless they already exist and are tested in the repository. These are not permission to expand backend scope.

### Results and explanations

- Display the actual score returned by the existing scoring endpoint.
- Explain each dimension using actual response fields and deterministic engine definitions.
- Show strengths, warnings, blockers and recommended next actions only when grounded in returned data or verified engine rules.
- Explain how task selection and available configuration affect the assessment.
- Show the scoring/engine version if the backend exposes it; otherwise do not fabricate one.
- Clearly state that an ML readiness score is a dataset diagnostic, not a guarantee of model accuracy, business value or successful deployment.
- Distinguish missing prerequisites from warnings and informational observations.
- Provide clear loading, validation, empty, unsupported-task and API-error states.
- Never manufacture example scores or present static mock results as a real assessment.

## C. ML Lab — algorithm comparison

Inspect the current `POST /api/v1/ml-labs/compare` implementation and tests. Determine exactly which tasks, algorithms, metrics, validation strategies and data shapes are supported.

- Offer only verified task/algorithm combinations.
- Display only metrics actually computed and returned by the backend.
- Explain metric meaning, direction (higher/lower is better), units and limitations.
- Show the validation strategy and split methodology actually used.
- Show train/test or fold details only if returned or verified from the engine.
- Make comparison configuration explicit before the user starts a run.
- Require deliberate user action to execute a comparison; navigation or changing a selector must not start training.
- Present results in a comparable table or chart with clear labels.
- Explain failures, skipped candidates and unavailable metrics honestly.
- Never fabricate model names, metric values, runtime, rankings or success states.
- Do not describe the product as unrestricted AutoML.
- Do not claim a model was saved, deployed or production-ready unless that functionality exists and is verified.

### Leakage and validation safeguards

Data leakage prevention is a release-critical requirement:

- Inspect the actual backend pipeline to determine when preprocessing is fitted and applied.
- Preprocessing parameters must be learned from training data/folds only and then applied to validation/test data.
- Target-derived information must not leak into predictors.
- Do not randomly shuffle time-series data when chronological validation is required.
- Forecasting evaluation must preserve time order and use chronological splits/backtesting only if implemented and tested.
- Clustering must not display supervised metrics such as accuracy unless a valid labelled evaluation method is explicitly implemented.
- Do not claim leakage safety solely because the UI displays a warning. Verify the engine implementation and tests.
- If leakage cannot be ruled out for a supported path, do not present that path as a trustworthy evaluation. Stop, document the exact risk and request approval for the smallest backend correction rather than silently expanding scope.

### Metrics and interpretation

- Use task-appropriate metrics only.
- Explain metric definitions and whether higher or lower values are better.
- Avoid comparing metrics across incompatible tasks or validation protocols.
- Explain class imbalance or other metric caveats when the engine exposes relevant evidence.
- Do not imply that a single metric fully describes model quality.
- If metric metadata is not returned, use definitions verified from the implementation and tests; do not guess.
- Make clear that benchmark results depend on dataset, split, random seed and configuration where applicable.

## D. Data lifecycle and workflow

- Keep the selected source/cleaned dataset identity consistent across Data Analysis, Cleaning, Visualization, ML Readiness and ML Lab.
- Do not mutate the source dataset.
- Do not silently change the active dataset version during an assessment or comparison.
- Make it clear which dataset version and target/task configuration produced a result.
- Do not persist raw data or model artifacts.
- Do not introduce background jobs, queues, cloud storage or new persistence to make comparisons appear more capable.
- If existing API limits make a dataset unsuitable for a comparison, show the real limit and a helpful message.

## E. UX and accessibility

- Preserve the Phase 1 sidebar, exact navigation order and theme system.
- Preserve all accepted Phase 2 and Phase 3 workflows.
- Make ML Readiness and ML Lab feel like native workspaces.
- Use clear configuration → run → results progression.
- Explain technical terms in concise plain language, with optional detail where useful.
- Provide clear confirmation before expensive or long-running comparison actions.
- Disable invalid actions with an explanation.
- Support desktop, tablet and mobile.
- Support light and dark themes.
- Ensure keyboard navigation, semantic headings, accessible form labels, visible focus, readable contrast and non-color-only status indicators.
- Provide a text/table alternative for charts or visual result summaries.
- Do not show fake/demo scores, fabricated algorithm results or decorative controls that do nothing.

## Protected services — do not modify

### Supabase

Do not change project URL, keys, auth providers, email confirmation, callbacks, redirect URLs, client initialization, database schema, tables, RLS, policies, triggers, functions or migrations. Do not add tables. Preserve existing auth behaviour.

### Render

Do not change service configuration, environment variables, CORS, health check, build/start commands, runtime, deployment settings, API base URL or existing endpoint contracts. Do not add backend routes or dependencies in this phase.

### Vercel

Do not change project settings, production domain, production branch, build settings or environment variables.

### Existing API

Use the existing configured `NEXT_PUBLIC_NUMPA_API_URL`. Preserve current request/response contracts, including:

- `GET /api/v1/health`
- `POST /api/v1/datasets/inspect`
- `POST /api/v1/cleaning/preview`
- `POST /api/v1/cleaning/execute`
- `POST /api/v1/ml-readiness/score`
- `POST /api/v1/ml-labs/compare`

Do not hardcode a new API URL or silently alter schemas, routes, limits or response semantics.

## Technical constraints

- Inspect actual frontend/backend code, types, tests and dependencies before editing.
- Treat backend implementation and tests as the source of truth for supported ML capabilities.
- Reuse existing API clients, request types, response types and UI components.
- Keep TypeScript types aligned with actual API responses; validate untrusted response data at the boundary.
- Do not weaken server-side validation or rely only on frontend validation.
- Do not introduce a new state library, charting library, ML package or backend dependency without stopping and requesting approval.
- Avoid broad refactors and dependency upgrades.
- Add comments for non-obvious metric interpretation, task compatibility, validation and state transitions.
- Avoid `any` unless narrowly justified at an external boundary and validated immediately.
- Never log raw data, credentials or sensitive values.
- Do not modify unrelated pages or existing engine formulas.
- Keep the scoring engine deterministic and auditable. AI must not silently modify formulas, weights, thresholds or results.

## Explicitly out of scope

Do NOT implement:

- New scoring formulas, weights, thresholds or dimensions.
- New ML tasks, algorithms, metrics or validation methods not already implemented and tested.
- Automatic model deployment, model registry, model artifact storage or production inference.
- Custom model builder or saved/versioned company configurations.
- Analysis History persistence or new Supabase tables (Phase 5).
- Public API keys, webhooks, Zapier, Make, n8n, Google Drive or GitHub integrations (Phase 6).
- Billing, subscriptions or payment gateway.
- Raw dataset persistence or cloud object storage.
- New backend endpoints, API contract changes or backend dependencies.
- Supabase, Render, Vercel, database or authentication changes.
- SEO/blog/CMS features.
- Broad dependency upgrades or unrelated refactors.

## Required verification

Follow `docs/commercial-v1/VERIFICATION_PLAN.md` and add ML Readiness/ML Lab-specific tests.

At minimum:

1. Run frontend lint, type-check and production build.
2. Run existing backend test suite and relevant ML scoring/comparison tests.
3. Verify task support directly against backend implementation and tests.
4. Verify each displayed score/dimension matches actual API response values.
5. Verify invalid/missing target columns and incompatible column types are handled.
6. Verify clustering does not require a target if and only if backend supports that contract.
7. Verify unsupported tasks/algorithms/metrics cannot be submitted from the UI.
8. Verify algorithm comparison results and metric labels match deterministic test fixtures where deterministic behaviour is available.
9. Verify metric direction and explanation are correct.
10. Inspect preprocessing fit/transform boundaries for train/test and cross-validation leakage.
11. Verify chronological splitting for any supported forecasting path.
12. Verify no supervised metric is misapplied to clustering.
13. Verify source-versus-cleaned selection uses the correct active dataset version.
14. Verify loading, long-running, failure, cancellation (only if truly supported) and empty states.
15. Verify light/dark themes, responsive behaviour and accessibility.
16. Verify Phase 1, Phase 2 and Phase 3 workflows remain intact.
17. Verify authentication navigation remains functional.
18. Inspect the diff for secrets, unrelated changes, protected configuration edits and API contract changes.
19. Report tests not run and why. Never claim a test or deployment succeeded without evidence.

Use synthetic, non-sensitive fixtures only.

## Definition of done

- ML Readiness presents only verified, task-supported assessments.
- Scores and explanations are grounded in actual engine responses and deterministic rules.
- ML Lab compares only verified algorithms and task/metric combinations.
- Leakage and validation behaviour has been inspected and tested; unsupported or unsafe paths are not presented as trustworthy.
- Dataset identity, task, target and validation configuration are visible with results.
- Both themes, responsive layouts and accessibility are addressed.
- Phase 1, Phase 2 and Phase 3 functionality remains intact.
- No Supabase, Render, Vercel, database, authentication or API contract changes.
- Relevant automated checks and manual smoke tests pass.
- Work is on a focused feature branch and ready for owner review in a PR.
- Do not merge to main or deploy to production automatically.

## Final report format

Report:

1. Phase 3 prerequisite evidence and accepted base commit.
2. Verified supported tasks, algorithms, metrics and validation strategies.
3. Feature branch and commit SHA(s).
4. Files created/changed.
5. ML Readiness configuration and scoring explanation behaviour.
6. ML Lab comparison behaviour and supported combinations.
7. Leakage review findings and evidence.
8. Dataset source-versus-cleaned selection behaviour.
9. Tests/checks run with exact results.
10. Tests not run and why.
11. Confirmation that Supabase, Render, Vercel, database, auth and API contracts were not changed.
12. PR/preview URL if one exists.
13. Known limitations and unsupported capabilities.
14. Rollback instructions.

If a protected change, new endpoint, new dependency, scoring-engine modification or leakage correction appears necessary, STOP and request approval with the smallest proposed change, exact files affected and rationale. Do not proceed by guessing.

---

End of Codex prompt.
