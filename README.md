# NUMPA — Automated Data Workflow (MVP)

NUMPA is an MVP for an end-to-end dataset preparation workflow: dataset overview → preprocessing insights → smart cleaning → visualization → ML readiness → comparison of three suitable ML algorithms for supported tabular tasks.

## MVP scope

- Start with tabular datasets: CSV, JSON, Parquet, and Arrow where supported by installed dependencies.
- Inspect packaged/multimodal formats (ImageFolder, Audio/SoundFolder, WebDataset, text, optimized Parquet) as planned extensions. These often need folder/archive ingestion and format-specific loaders; they are not claimed to be fully supported by this initial starter.
- Show concise dataset overview and quality diagnostics.
- Propose transparent, conservative cleaning actions; keep original data unchanged and let the user preview/download results.
- Compute task-aware ML readiness with an explanation.
- For supported tabular classification/regression tasks, select up to three suitable baseline models and compare applicable metrics using a consistent validation strategy.
- No data leakage: fit preprocessing only within training folds/pipelines. For time series, preserve temporal order.

## Suggested architecture

- `apps/web`: user interface.
- `apps/api`: Python API and data workflow logic.
- `packages/`: shared contracts when needed.
- `docs/`: product requirements and architecture records.

## Current repository state

This is the clean initial foundation. The MVP implementation should be built in small, testable stages, starting with the Python workflow engine and API contract, followed by UI integration.

## Local development

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for the initial development plan. Environment secrets must stay in local environment files and must never be committed.
