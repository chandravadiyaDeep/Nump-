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


## Supabase authentication setup

The app includes email/password sign-up and sign-in, email confirmation callback handling, password-reset requests, and sign-out. Configure the variables below in `apps/web/.env.local` for local development, or in the Vercel project environment settings for deployment:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_NUMPA_API_URL=https://your-api-service.onrender.com
```

See [the Supabase setup guide](../../docs/SUPABASE_SETUP.md) for the dashboard settings and smoke tests. Do not commit real values or put a service-role/secret key in any `NEXT_PUBLIC_*` variable.
