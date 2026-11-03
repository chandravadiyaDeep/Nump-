# NUMPA Unified Data Intelligence Workflow

**Status:** Approved product direction; incremental implementation.
**Branch:** `feature/unified-data-intelligence-workflow`
**Parent UI foundation:** `redesign/minimal-intelligence`

## 1. Product outcome

NUMPA should guide a user through one connected, trustworthy workflow:

Upload / Connect → Validate → Inspect & Profile → Clean → Transform & Format → Feature Engineer → Analyze → Visualize → Assess ML Readiness → Compare Models → Report → Export / Integrate.

This is a product journey, not a requirement to expose every stage as a separate navigation item. Existing workspaces remain the primary product surfaces.

## 2. Current implementation baseline

The repository currently provides:
- File upload and sample dataset selection in the Data Analysis workspace.
- API-backed dataset inspection, overview and column profiles.
- API-backed conservative cleaning recommendations, preview, explicit execution and separate cleaned CSV download.
- Existing visualization workspace with six chart types.
- Task-aware ML readiness scoring.
- Baseline model comparison for classification and regression.
- A workspace shell, analysis history placeholder and settings.

The current baseline does not establish that database/API connectors, general-purpose transformation pipelines, feature engineering, data enrichment, labeling, governance, forecasting model comparison, clustering model comparison, or persistent project history are implemented. UI must not imply otherwise.

## 3. Workflow stages and capability contracts

| Stage | User outcome | Initial scope | Later extension |
|---|---|---|---|
| 1. Ingest | Bring data into NUMPA | Existing supported file uploads and sample data | Database, API, Sheets and cloud-storage connectors |
| 2. Validate | Know whether input can be processed safely | Existing parser/format checks; make validation feedback clearer | Reusable schemas, drift checks and configurable rules |
| 3. Inspect | Understand structure and quality | Existing overview, profiles, missingness and duplicate signals | Advanced profiling, distribution and relationship diagnostics |
| 4. Clean | Resolve data-quality issues safely | Existing recommendations, preview, approval and separate output | Per-column rules, configurable strategies and richer operations |
| 5. Transform | Standardize and reshape data | Define requirements before implementing new transformations | Rename, cast, filter, join, reshape and reusable pipelines |
| 6. Feature engineer | Prepare task-relevant features | Explain the gap and design task-aware safe operations | Date parts, interaction features, encoding, scaling and selection |
| 7. Analyze | Find statistical and business insights | Existing dataset analysis foundations | Statistical tests, segments, trends and guided analysis |
| 8. Visualize | Communicate patterns | Existing six chart types and summaries | Saved dashboards and shareable views |
| 9. Assess readiness | Understand suitability for an ML task | Existing deterministic task-aware assessment | More diagnostics, configuration profiles and detailed reports |
| 10. Compare models | Evaluate candidate baselines | Existing classification/regression comparisons | Forecasting/clustering workflows only after correct validation design |
| 11. Report | Explain work and results | Existing report/print surfaces where available | Dedicated PDF reports and reproducible run summaries |
| 12. Export / integrate | Reuse outputs | Existing cleaned CSV download | Additional formats, authenticated API, connectors and automation |

## 4. Navigation principles

Keep navigation organized around customer jobs:
1. Dashboard
2. Data Workspace
3. Data Preparation
4. Data Analysis
5. Data Visualization
6. ML Readiness
7. ML Lab
8. Reports & History
9. Integrations
10. Settings

Do not expose a destination until it has a meaningful, working experience. A workflow stage can be shown as planned or unavailable only when its status is explicit and it does not look like a working action.

## 5. Data lifecycle and safety invariants

- Source uploads remain immutable.
- Processing remains in memory by default; do not persist raw dataset contents.
- Every value-changing operation must be previewable and explicitly approved.
- Outputs are separate from source inputs.
- Every transformation records a human-readable operation summary and validation result.
- Unsupported or skipped operations are reported honestly.
- Do not silently infer business meaning, target semantics, date formats or category equivalence.
- Fit learned preprocessing only inside the training split/pipeline to prevent leakage.
- Readiness scores remain deterministic, explainable and separate from model performance.
- Existing API paths, schemas, status codes and error semantics remain backward-compatible.
- Do not change Supabase schema/RLS/auth, Render production settings, Vercel production settings, secrets or deployment configuration in this work.

## 6. Delivery phases

### Phase 1 — Workflow foundation
- Publish this workflow contract and an explicit current-vs-planned capability map.
- Add a consistent workflow navigator/progress context to existing workspace screens.
- Make the next valid action clear based on actual state (file selected, inspection completed, cleaned output available, readiness result available, model comparison available).
- Keep unavailable stages informational; do not create fake actions or fake data.
- Preserve existing workspace routes and behavior.

### Phase 2 — Validation and transformation design
- Define typed, versionable transformation operation contracts.
- Add validation preview and transformation preview as separate concepts.
- Add tests for source immutability, schema preservation, deterministic operations and output validation.
- Implement only operations that have explicit API contracts and tests.

### Phase 3 — Feature engineering
- Add task-aware, user-approved feature operations.
- Keep target columns protected by default.
- Record fitted parameters and ensure train/validation separation for learned transforms.
- Add regression tests for leakage and reproducibility.

### Phase 4 — Reporting and export
- Standardize report metadata and before/after comparisons.
- Add dedicated export formats only after format support and resource limits are verified.
- Keep export independent of persistent raw-data storage.

### Phase 5 — Integrations (separate approval)
- Design connector scopes, authentication, timeouts, retries, retention and user consent.
- Start with read-only connections and one provider at a time.
- Any Supabase schema, auth, secrets, production configuration or new external data-transfer change requires the appropriate owner approval.

## 7. Acceptance criteria for Phase 1

- Every existing workspace identifies the current dataset and its workflow state consistently.
- Users can see completed, current, next and unavailable stages without being misled.
- Navigation never enables a stage whose required inputs do not exist.
- Existing inspection, cleaning preview/execution, visualization, readiness and model comparison behavior remains unchanged.
- Source data remains unchanged and no raw data is persisted.
- Existing API contracts and production configuration remain unchanged.
- Lint, type/build, unit and API regression checks pass.
- Browser review covers desktop/mobile and light/dark themes before merge.

## 8. Explicit non-goals

- No web scraping engine, data labeling marketplace, generative-AI agent, data warehouse, full ETL platform or governance suite in this phase.
- No new pricing, billing, metering or paid plan enforcement.
- No automatic connection to external services.
- No changes to the Search Intelligence Agent priority.
- No production merge or deployment as part of implementation.
