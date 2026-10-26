# NUMPA MVP — Initial Architecture

## Principles

- Modular, testable, deterministic core logic.
- Clear API contracts between UI and backend.
- Treat uploads as untrusted: enforce size limits, file checks, safe extraction, timeouts and compute limits.
- Never commit credentials; use example environment placeholders.
- Separate ingestion, profiling, cleaning, visualization summaries, readiness scoring and model evaluation.
- Record chosen options and cleaning operations so results can be audited and reproduced.

## Repository structure

    apps/api/app/        Python API and workflow modules
    apps/api/tests/      API and engine tests
    apps/api/            requirements and local instructions
    docs/                product requirements and architecture
    .github/workflows/   API test workflow

A web application will be added after the backend API shape stabilizes.

## Backend modules

- ingestion: supported-format validation and dataframe loading
- profiling: overview, schema, missingness, duplicates and summaries
- cleaning: recommendations, preview, execute, validation and audit report
- readiness: deterministic and explainable readiness heuristic
- ml_labs: leakage-aware baseline training and metrics
- main: HTTP routes, request limits and error normalization

## Current API routes

- GET /api/v1/health
- POST /api/v1/datasets/inspect
- POST /api/v1/cleaning/preview
- POST /api/v1/cleaning/execute
- POST /api/v1/ml-readiness/score
- POST /api/v1/ml-labs/compare

## Development order

1. Build and test secure ingestion/profiling.
2. Test cleaning recommendations, options and audit report.
3. Build visual UI and workflow state.
4. Improve readiness scoring and task selection.
5. Harden model comparison, validation and resource limits.
6. Add additional dataset formats with fixtures.
7. Deploy only after CI and end-to-end acceptance tests pass.
