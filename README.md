# NUMPA — Automated Data Workflow (MVP)

NUMPA is an MVP for an end-to-end dataset preparation workflow: dataset overview → preprocessing insights → smart cleaning → visualization → ML readiness → comparison of suitable ML algorithms.

## MVP now in the repository

- FastAPI backend under apps/api
- In-memory tabular inspection for CSV, JSON, Parquet, Arrow IPC and Feather uploads
- Dataset overview with rows, columns, data types, missingness, duplicates, profiles and chart-ready summaries
- Explainable cleaning recommendations and cleaning preview/report
- Downloadable cleaned CSV
- Deterministic, explainable readiness score
- Baseline classification and regression comparison using task-appropriate metrics
- Initial pytest suite and GitHub Actions test workflow

## Format scope

The long-term requested formats include CSV, JSON, Parquet, optimized Parquet, ImageFolder, AudioFolder/SoundFolder, WebDataset, text and Arrow. The initial loader currently supports tabular CSV, JSON, Parquet, Arrow IPC and Feather files. Folder datasets, WebDataset archives, raw text corpora and specialized optimized-Parquet variations require separate loaders and are not claimed as implemented.

## Start the API locally

See apps/api/README.md. Install apps/api/requirements.txt, run tests with pytest, and start the API with Uvicorn. Interactive API docs are available at /docs when running locally.

## Workflow

1. Upload and inspect dataset.
2. Review quality profile and proposed cleaning actions.
3. Preview cleaning and download a cleaned CSV.
4. Calculate readiness for a selected ML task and target.
5. Compare three baseline algorithms for classification or regression.

## Safety and validity

- Files are processed in memory by the API; file persistence is not intentionally implemented.
- Keep real secrets out of Git and use local environment variables.
- Cleaning decisions are heuristics and should be reviewed for domain context.
- Model evaluation uses a reproducible 80/20 holdout and fits preprocessing inside sklearn pipelines. Forecasting requires a chronological validation strategy and is not yet included in model comparison.
- Baseline model metrics are not guarantees of production performance.

## Status

Backend starter files are committed. GitHub Actions should execute the API test suite on the next workflow run; check the Actions tab for its actual pass/fail result. The web UI and deployment are not implemented yet.
