# NUMPA MVP — Initial Architecture

## Principles

- Modular, testable, deterministic core logic.
- Clear API contracts between UI and backend.
- Local-first file processing for the MVP where practical; explain any server upload/retention behaviour before users submit data.
- Uploaded files are untrusted input: enforce size limits, extension and content checks, safe archive extraction, timeouts, and resource limits.
- Never commit credentials. Provide `.env.example` placeholders only.
- Separate ingestion, profiling, cleaning, visualization summaries, readiness scoring, and model evaluation.
- Preserve a reproducible workflow record with input fingerprint, chosen parameters, operations, dependency versions and output diagnostics where appropriate.

## Initial target structure

```text
Nump-/
├── apps/
│   ├── api/                 # Python API (planned)
│   └── web/                 # UI (planned)
├── packages/                # Shared contracts (as needed)
├── docs/
│   ├── PRODUCT_SPEC.md
│   ├── ARCHITECTURE.md
│   └── DEVELOPMENT.md
├── .gitignore
├── README.md
└── .env.example
```

## Backend modules (planned)

- `ingestion`: validate and load supported formats.
- `profiling`: overview, schema, missingness, duplicates and distributions.
- `preprocessing`: type parsing and feature diagnostics.
- `cleaning`: recommendation plan, preview, execute, validate and report.
- `visualization`: chart-ready aggregates (avoid sending huge raw data to browser).
- `readiness`: deterministic, task-aware, explainable score.
- `ml_labs`: train/test strategy, leakage-safe pipelines and metric calculation.
- `api`: request/response validation, limits, error handling and health endpoint.

## API design (initial proposal)

- `GET /api/v1/health`
- `POST /api/v1/datasets/inspect`
- `POST /api/v1/cleaning/preview`
- `POST /api/v1/cleaning/execute`
- `POST /api/v1/ml-readiness/score`
- `POST /api/v1/ml-labs/compare`

Final route details should be aligned with the actual implementation before clients depend on them.

## Implementation order

1. Establish backend package, dependency pinning and tests.
2. Build secure upload/ingestion and tabular profiling.
3. Build cleaning recommendations and preview/apply/report.
4. Build visualization summaries.
5. Add readiness scoring and explainability.
6. Add leakage-safe baseline model comparison.
7. Connect UI and run end-to-end acceptance tests.
8. Expand dataset formats with format-specific fixtures and tests.
