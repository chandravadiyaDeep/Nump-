# NUMPA Commercial V1 — Safety and Architecture Constraints

## 1. Mandatory contract

The repository-root `PRODUCTION_SAFETY.md` is authoritative and takes precedence over this document. Read it in full before making any code or configuration change.

## 2. Existing architecture to preserve

- Frontend: existing Next.js/React application deployed on Vercel.
- Authentication and approved account metadata: existing Supabase project and client integration.
- Processing API: existing Python/FastAPI service on Render.
- Dataset processing: current in-memory processing behaviour and existing endpoint contracts.
- Production domain and deployment configuration: unchanged.

Do not replace these systems or introduce a new hosting provider as part of Commercial V1 Phase 1.

## 3. Protected API contracts

Preserve the current API base URL:
`https://numpa-api.onrender.com`

Preserve these existing routes and their request/response behaviour:
- `GET /api/v1/health`
- `POST /api/v1/datasets/inspect`
- `POST /api/v1/cleaning/preview`
- `POST /api/v1/cleaning/execute`
- `POST /api/v1/ml-readiness/score`
- `POST /api/v1/ml-labs/compare`

The frontend should continue to use the configured `NEXT_PUBLIC_NUMPA_API_URL`. Do not hardcode a replacement URL into components.

## 4. Supabase boundaries

- Preserve current auth client, sign-in/session handling and sign-out.
- Do not change auth providers, confirmation behaviour, redirect URLs or callback routes.
- Do not create, alter or delete tables, policies, functions, triggers or migrations in Phase 1.
- Do not weaken RLS.
- Never expose service-role keys.
- Do not store raw dataset files or raw rows in Supabase by default.
- Any future history/profile/usage persistence requires a separate schema and RLS design plus explicit approval.

## 5. Render boundaries

- Do not change service settings, runtime, root directory, build/start commands, health-check path, environment variables or CORS in Phase 1.
- Keep API calls compatible with the currently deployed service.
- Do not add backend dependencies or endpoints unless an implementation blocker is documented and the owner approves a separate change.

## 6. Vercel boundaries

- Do not change project, domain, production branch, build settings or environment variables.
- Keep preview deployments safe and ensure existing CORS behaviour remains intact.
- Do not change production deployment settings to accommodate a local UI change.

## 7. Frontend implementation constraints

- Inspect before refactoring. The current working page may contain tightly coupled state and API logic.
- Prefer extracting presentational components while preserving event handlers and request logic.
- Do not rewrite the data workflow merely to fit the new shell.
- Avoid dependency upgrades and new UI libraries unless required and approved.
- Do not introduce a global state library in Phase 1 without a measured need.
- Use accessible controls and semantic navigation.
- Do not persist uploaded file bytes or sensitive dataset values in localStorage.
- Keep theme preference separate from dataset/session state.

## 8. Git and review

- Production branch is `main`.
- Use a focused feature branch for Commercial V1 implementation.
- Do not push UI redesign directly to main.
- Do not force-push or rewrite history.
- Open a PR for owner review.
- Keep docs and code changes scoped to the authorized phase.

## 9. Stop conditions

Stop and report before proceeding if:
- The repository differs materially from the documented architecture.
- Existing auth or API behaviour cannot be preserved.
- A requested UI change requires database, auth, Render or Vercel configuration changes.
- A dependency or framework upgrade appears necessary.
- A feature requires raw dataset persistence.
- Existing tests/build fail before changes and the failure cannot be confidently isolated.
- The only apparent solution involves destructive or irreversible operations.
