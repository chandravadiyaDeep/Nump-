# NUMPA Web MVP

The first browser UI for NUMPA's dataset inspection, smart-cleaning preview, and ML-readiness workflow.

## Requirements

- Node.js 20 or newer
- NUMPA FastAPI backend running locally

## Run locally

Terminal 1 — API:

```powershell
cd apps/api
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Terminal 2 — web UI:

```powershell
cd apps/web
npm install
npm run dev
```

Open http://localhost:3000.

## API configuration

By default, the UI calls `http://localhost:8000`. To use a hosted API, create `.env.local` in this directory:

```dotenv
NEXT_PUBLIC_NUMPA_API_URL=https://your-api-host.example.com
```

Replace the example with the actual HTTPS API origin. Never put secret keys in a `NEXT_PUBLIC_*` variable.

## Current scope

The page supports a single-file workflow: inspect a supported tabular upload, calculate an ML-readiness heuristic, preview selected cleaning actions, and download cleaned CSV. It does not yet include account management, billing, saved projects, or PDF report exports. The API's actual supported file formats and limits remain authoritative.
