# NUMPA API — MVP Slice 1

## Implemented in this slice

- Health check
- In-memory inspection of CSV, XLSX, JSON, Parquet, Arrow IPC and Feather uploads
- Dataset overview, column profiles, preview and chart-ready summaries
- Conservative cleaning recommendations
- Cleaning preview and downloadable cleaned CSV
- Deterministic readiness score with dimension explanations
- Classification/regression baseline comparison with applicable metrics
- Basic API contract tests

Folder-based ImageFolder/AudioFolder, WebDataset archives, raw text corpora and specialized optimized-Parquet variants are not supported by this initial tabular loader yet. They need explicit loaders and fixtures.

## Run locally on Windows PowerShell

    cd apps/api
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    python -m pip install -r requirements.txt
    pytest
    uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Open http://127.0.0.1:8000/docs to try endpoints.

## Upload API

- POST /api/v1/datasets/inspect — multipart field file
- POST /api/v1/cleaning/preview — multipart file, optional fields fill_missing, drop_exact_duplicates, normalize_text
- POST /api/v1/cleaning/execute — same options; returns cleaned CSV
- POST /api/v1/ml-readiness/score — multipart file, fields task and optional target
- POST /api/v1/ml-labs/compare — multipart file, fields task and target

Requests are processed in memory; uploaded files are not intentionally persisted. Configure proxy/request-size limits in hosted deployments too. Model training is compute-intensive; add timeouts, concurrency limits and job orchestration before exposing this API publicly.
