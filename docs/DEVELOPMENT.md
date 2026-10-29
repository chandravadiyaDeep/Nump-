# NUMPA Development Guide

## Prerequisites

- Git
- Python 3.12 recommended
- Node.js 20 or newer and npm
- Windows PowerShell commands below are written for the current Windows development setup

## Run the API

From the repository root:

```powershell
# Create a virtual environment for backend dependencies.
cd apps/api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Run automated API tests before starting the service.
python -m pytest -q

# Start the API used by the web application.
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API documentation is available at http://127.0.0.1:8000/docs while the service is running.

## Run the web UI

Open a second terminal from the repository root:

```powershell
cd apps/web
npm install
npm run dev
```

Open http://localhost:3000. The UI calls http://localhost:8000 by default. To use a hosted API, create `apps/web/.env.local` with:

```dotenv
NEXT_PUBLIC_NUMPA_API_URL=https://your-api-host.example.com
```

Replace the example with the actual API origin. Never place secret keys in a `NEXT_PUBLIC_*` variable because these values are exposed to the browser.

## Current MVP boundary

- The web UI supports inspection, readiness scoring, cleaning preview, and cleaned CSV download.
- The API supports CSV, XLSX, JSON, Parquet, Arrow IPC, and Feather tabular files.
- Image/audio folders, WebDataset archives, raw text corpora, authentication, billing, PDF exports, and persistent saved projects are not implemented by this slice.
- Uploads are processed in memory; hosting must still enforce request-size, timeout, concurrency, and resource limits.
- Forecasting readiness is a heuristic only. Forecasting model comparison needs a chronological validation design.

## Configuration and secrets

- Keep credentials in local ignored environment files or the hosting provider's secret manager.
- Never commit API keys, Supabase secrets, passwords, private customer data, or real client datasets.
- Keep `.env.example` placeholders only.

## Definition of done per feature

- Inspect existing code and applicable files in `docs/` before changing architecture.
- Add tests for normal, invalid, empty, and meaningful edge-case inputs.
- Ensure the source data is not mutated by cleaning previews.
- Return useful errors without exposing sensitive internals.
- Run the relevant tests/build and report their actual result.
- Update documentation to match implemented behavior.
- Do not mark a feature complete based only on a successful commit.
