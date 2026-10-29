# NUMPA API

FastAPI service for dataset inspection, conservative cleaning, ML-readiness heuristics, and baseline model comparisons.

## Run locally

From the repository root:

```powershell
cd apps/api
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Health check: `http://127.0.0.1:8000/api/v1/health`.

## Deploy to Render

The repository root contains `render.yaml`. In Render, create a new Blueprint and select this repository. The Blueprint configures the service root as `apps/api`, installs `requirements.txt`, starts Uvicorn on Render's assigned port, and uses `/api/v1/health` for health checks.

Set `NUMPA_CORS_ORIGINS` in Render to a comma-separated list of exact web origins, for example:

```text
https://your-project.vercel.app
```

If you use a custom domain, include that origin too. Do not include a path or trailing slash. Keep local origins only if you need local development. The API currently does not use cookie-based authentication, so CORS credentials are disabled.

## Tests

```powershell
python -m pytest -q
```

## Production limits and caveats

- Upload size is limited to 50 MB; datasets are also limited to 1,000,000 rows and 2,000 columns.
- Uploaded files are processed in memory and are not intentionally persisted by these endpoints.
- The API is currently public and does not require user authentication or rate limiting. Do not use it for sensitive datasets until access controls and abuse protections are implemented.
- Readiness scores are deterministic heuristics, not guarantees of model accuracy.
- Cleaning output is currently CSV, even when the source file is Excel, JSON, or Parquet.
- Model comparison is compute-intensive; add rate limiting, timeouts, and concurrency controls before broad public use.
