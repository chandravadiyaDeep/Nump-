# NUMPA — Automated Data Workflow (MVP)

NUMPA is an MVP for an end-to-end dataset preparation workflow: dataset overview → preprocessing insights → smart cleaning → visualization → ML readiness → comparison of suitable ML algorithms.

## MVP now in the repository

- FastAPI backend under apps/api
- In-memory tabular inspection for CSV, XLSX, JSON, Parquet, Arrow IPC and Feather uploads
- Dataset overview with rows, columns, data types, missingness, duplicates, profiles and chart-ready summaries
- Explainable cleaning recommendations, cleaning preview/report, and browser print-to-PDF for visible results
- Downloadable cleaned CSV
- Deterministic, explainable readiness score
- Baseline classification and regression comparison using task-appropriate metrics
- Initial pytest suite and GitHub Actions test workflow

## Format scope

The long-term requested formats include CSV, JSON, Parquet, optimized Parquet, ImageFolder, AudioFolder/SoundFolder, WebDataset, text and Arrow. The initial loader currently supports tabular CSV, XLSX, JSON, Parquet, Arrow IPC and Feather files. Folder datasets, WebDataset archives, raw text corpora and specialized optimized-Parquet variations require separate loaders and are not claimed as implemented.

## Start the applications locally

- Web UI: see [apps/web/README.md](apps/web/README.md); run `npm install` and `npm run dev` from `apps/web`.
- API: see [apps/api/README.md](apps/api/README.md); run the FastAPI service on port 8000.

The UI uses `NEXT_PUBLIC_NUMPA_API_URL` when set; otherwise it calls `http://localhost:8000`.

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

The backend and first Next.js web workflow are committed on the `mvp/web-workflow` branch. The UI has not been merged or deployed yet. Use GitHub Actions to confirm actual API-test and web-build results before calling the MVP verified.


## Project handbook

These documents define how NUMPA should be built and scaled:

- [Scaling roadmap](docs/SCALING_ROADMAP.md)
- [Architecture decisions](docs/ARCHITECTURE_DECISIONS.md)
- [Smart cleaning specification](docs/CLEANING_ENGINE_SPEC.md)
- [ML readiness specification](docs/ML_READINESS_SPEC.md)
- [Dataset format support matrix](docs/DATA_FORMAT_SUPPORT.md)
- [Security and privacy](docs/SECURITY_PRIVACY.md)
- [Testing and QA](docs/TESTING_QA.md)
- [Deployment and operations](docs/DEPLOYMENT_OPERATIONS.md)
- [API and integrations](docs/API_AND_INTEGRATIONS.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)
- [Research library](resources/README.md)
- [Official technical references](resources/OFFICIAL_TECH_REFERENCES.md)
- [Competitor watch](resources/COMPETITOR_WATCH.md)
- [Research backlog](resources/RESEARCH_BACKLOG.md)
