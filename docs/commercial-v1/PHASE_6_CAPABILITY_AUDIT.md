# NUMPA Commercial V1 — Phase 6 Capability & Architecture Audit

**Status:** Completed Architecture & Capability Audit  
**Date:** March 2026 / Release Baseline  
**Scope:** NUMPA Commercial V1 Phase 6 (Integrations, API Access, Monetization Readiness, Launch Preparation)  
**Parent Baseline:** `feature/commercial-v1-phase-5-history-settings` (commit `4d2cb24af0e97c2ca34f44a17c2de9744b39f39d`)  
**Target Branch:** `feature/commercial-v1-phase-6-commercial-readiness`  

---

## 1. Executive Summary

NUMPA is an automated tabular data workflow tool providing data analysis, automated preprocessing/cleaning, data visualization, explainable ML readiness assessment, and baseline ML model comparison.

The application currently operates with a **privacy-first, in-memory architecture**:
- Datasets are processed exclusively in RAM on the backend and held temporarily in React client memory during an active session.
- No raw dataset rows, uploaded files, or customer data are persisted to disk or database.
- Production hosting is split between **Vercel** (Next.js frontend), **Render** (FastAPI backend), and **Supabase** (authentication and session management).

This audit establishes the ground truth of implemented capabilities versus planned commercial capabilities to ensure Phase 6 adds only verified, safe features and clear, uncompromised roadmaps without breaking production systems.

---

## 2. Existing Architecture & Production Service Map

```text
                               +--------------------------------------------------+
                               |                 USER / BROWSER                   |
                               +--------------------------------------------------+
                                                        |
                                                        v
+------------------------------------------------------------------------------------------------------------------+
| VERCEL HOSTING                                                                                                   |
| Next.js 15.5.28 / React 19.1.2 / TypeScript 5.9.2                                                                |
| Domains: https://numpa.online, https://numpa.vercel.app                                                          |
|                                                                                                                  |
|  - Workspace Shell: 7 sequential destinations (Data Analysis, Cleaning, Visualization, ML Readiness,            |
|                     ML Lab, Analysis History, Settings)                                                          |
|  - State Management: In-memory React state (ephemeral per session)                                               |
|  - Local Storage: strictly limited to 'numpa-theme' preference ('light' | 'dark')                                |
|  - Auth Navigation: AuthNav queries session status via Supabase client                                           |
+------------------------------------------------------------------------------------------------------------------+
          |                                                                    |
          | Auth cookies & session tokens                                      | Multipart form-data API requests
          v                                                                    v
+---------------------------------------------+      +-------------------------------------------------------------+
| SUPABASE (Project: xjkulfyetcvuuhxhuevp)    |      | RENDER HOSTING (`numpa-api`)                                |
| https://xjkulfyetcvuuhxhuevp.supabase.co    |      | FastAPI 0.115 / Python 3.12 / Pandas 2.2 / Scikit-learn 1.5  |
|                                             |      | URL: https://numpa-api.onrender.com                         |
|  - User Authentication (Email/Password)     |      |                                                             |
|  - Session cookies refreshed via middleware |      |  - In-Memory Ingestion (CSV, XLSX, JSON, Parquet, Arrow)    |
|  - Password reset flows                     |      |  - Tabular Quality Profiling & Cleaning Engine              |
|  - No application tables or raw datasets    |      |  - Deterministic ML Readiness Assessment (4 task families)  |
|    stored in database                       |      |  - Baseline ML Estimator Comparison (Holdout 80/20)         |
|                                             |      |  - No disk persistence; in-memory streaming responses       |
|                                             |      |  - CORS scoped to production domains & preview URLs         |
+---------------------------------------------+      +-------------------------------------------------------------+
```

---

## 3. Detailed Component Audit

### 3.1 Frontend (`apps/web`)

| Component / File | Responsibility | Current Implementation State | Safety / Integrity Notes |
|---|---|---|---|
| `app/page.tsx` | Main application coordinator | Integrates file upload, API calls, and renders WorkspaceShell | In-memory dataset lifecycle; no local persistence of raw files. |
| `components/workspace-shell.tsx` | ChatGPT-style collapsible navigation shell | 7 destinations; handles desktop collapsible sidebar and mobile drawer | Theme stored in `localStorage.numpa-theme`. Retains active dataset across views. |
| `components/workspace-data-panels.tsx` | Data Analysis & Cleaning views | Tabular profile, column summaries, cleaning action toggles, cleaned CSV export | Pure presentational and reactive dispatch. |
| `components/workspace-data-visualization.tsx` | Visualization workspace | Histogram, Bar, Line, Scatter, Box plot, Correlation matrix | Zero external chart dependencies; renders pure accessible SVG. |
| `components/workspace-ml-workspaces.tsx` | ML Readiness & ML Lab views | Task/target selector, readiness dimension cards, algorithm benchmark table | Enforces backend-supported task families and metrics. |
| `components/workspace-history.tsx` | Analysis History view | Displays explicit unavailable state | Does not invent records; accurately reports absence of persistence store. |
| `components/workspace-settings.tsx` | Settings & Integrations view | General subnav (Account, Appearance, Usage, Privacy, Support) & Integrations subnav | Displays authenticated email; labels integrations as `Planned · not connected`. |
| `components/auth-nav.tsx` | Auth header controls | Displays sign-in/sign-out state and user email | Safe Supabase client calls; does not expose tokens or secrets. |
| `lib/supabase/client.ts` & `server.ts` | Supabase SSR integration | Standard `@supabase/ssr` browser and server client factories | Reads env variables; throws if not configured. |
| `middleware.ts` | Next.js cookie refresh middleware | Refreshes auth tokens across navigation | Non-blocking if env vars are missing. |

### 3.2 Backend (`apps/api`)

| Endpoint | Method | Input | Output | Current Status |
|---|---|---|---|---|
| `/api/v1/health` | `GET` | None | `{"status": "ok", "service": "numpa-api", "version": "0.1.0"}` | Operational |
| `/api/v1/datasets/inspect` | `POST` | `file: UploadFile` (Multipart) | JSON profile, column types, statistics, missingness, cleaning recommendations | Operational (In-memory) |
| `/api/v1/cleaning/preview` | `POST` | `file: UploadFile`, `fill_missing: bool`, `drop_exact_duplicates: bool`, `normalize_text: bool` | JSON cleaning audit report and 20-row preview | Operational (In-memory) |
| `/api/v1/cleaning/execute` | `POST` | `file: UploadFile`, cleaning flags | Streaming CSV file (`text/csv`) | Operational (In-memory) |
| `/api/v1/ml-readiness/score` | `POST` | `file: UploadFile`, `task: str`, `target: str | None` | JSON readiness score (0-100), dimensions, blockers | Operational (In-memory) |
| `/api/v1/ml-labs/compare` | `POST` | `file: UploadFile`, `task: str`, `target: str` | JSON model benchmark metrics (accuracy, F1, RMSE, R2, etc.) | Operational (In-memory) |

**Backend Limits & Constraints:**
- `MAX_UPLOAD_BYTES`: 52,428,800 bytes (50 MB limit enforced in `_read_upload`).
- Authentication: None currently enforced on backend endpoints. Backend relies on CORS origin validation.
- Concurrency / Worker: Single-process synchronous FastAPI handlers running inside Uvicorn. Long-running ML operations run synchronously in the request-response thread.

---

## 4. Phase 6 Capability Matrix

| Capability Area | Current Status in Codebase | Requirements for Full Activation | Phase 6 Safe Action |
|---|---|---|---|
| **1. Public API Access** | Partially implemented (Endpoints functional, but unauthenticated and undocumented for external developers) | Stable versioned docs, authentication middleware, client SDK/curl guides | Author comprehensive `PUBLIC_API_REFERENCE.md` with synthetic examples and accurate contract documentation. |
| **2. API Key Lifecycle** | Absent (No tables, no hashing logic, no key management UI) | Supabase `api_keys` table, secret hashing (SHA-256), RLS policies, backend FastAPI Bearer auth middleware | Produce detailed `API_ACCESS_DESIGN.md` and formal Approval Request; keep UI labeled Planned. |
| **3. Usage & Quotas** | Absent (No database metering, no plan limits enforced) | Server-side usage ledger, rate-limiting store (Redis or DB counter), Stripe/Razorpay subscription sync | Author `USAGE_AND_ENTITLEMENTS_DESIGN.md`; keep Settings display honestly noting unconfigured metering. |
| **4. Webhooks** | Absent (No event dispatcher, no HMAC signer, no background queue) | Celery/Redis background worker, HMAC-SHA256 signature generator, retry queue, SSRF destination validator | Author `WEBHOOKS_DESIGN.md` with complete payload schemas, signature specs, and SSRF rules. |
| **5. Automation (Zapier/Make/n8n)** | Absent (Listed in Settings catalog as roadmap) | Published public API, OAuth2 or API key auth, webhook triggers, marketplace approval | Keep status `Planned · not connected`; document integration architecture. |
| **6. Cloud Storage (Drive/GitHub)** | Absent (Listed in Settings catalog as roadmap) | Google Cloud OAuth App, GitHub OAuth App, backend token vault, streaming fetcher | Keep status `Planned · not connected`; document minimum-scope access designs. |
| **7. Billing & Subscriptions** | Absent (No payment gateway code or credentials in repo) | Stripe / Razorpay merchant account, webhook receiver endpoint, customer subscription DB mapping | Author comprehensive `BILLING_AND_SUBSCRIPTIONS_DESIGN.md` comparing Razorpay vs Stripe. |
| **8. Analysis History** | Deliberately Unavailable (UI displays honest placeholder) | Separate database schema approval, metadata-only storage design | Maintain honest unavailable state; document approved metadata schema proposal. |
| **9. Settings & UX** | Functional for Theme and Account email | Dedicated API Access and Usage tabs with honest status | Expand Settings navigation with dedicated honest views for API Access and Usage & Plan. |
| **10. User Onboarding & Guides** | Minimal (README only) | Comprehensive task-based user guides, explanation of ML heuristics vs model training | Author `USER_ONBOARDING_AND_GUIDES.md` covering end-to-end user workflows. |
| **11. Launch Readiness** | In Progress | Full verification matrix, rollback procedures, operational checklist | Author `FINAL_LAUNCH_READINESS.md`. |

---

## 5. Security & Threat Audit

1. **Authentication & Authorization:**
   - Supabase handles user passwords and sessions securely using PKCE and secure cookies.
   - The FastAPI backend currently accepts unauthenticated requests from any browser matching the configured CORS origins.
   - Exposing the FastAPI backend directly to the public internet for external developers without API keys or rate limiting is a DoS and resource exhaustion vulnerability.

2. **Data Privacy & Ephemerality:**
   - The privacy guarantee (no raw dataset persistence) is strictly maintained.
   - Neither the frontend nor backend logs raw tabular contents.
   - Temporary file contents are discarded immediately after request processing completes.

3. **Rate Limiting & Abuse Prevention:**
   - Render free/starter tiers have limited memory and CPU. Concurrent 50 MB uploads or heavy scikit-learn comparisons can cause Out-Of-Memory (OOM) crashes.
   - Public API access requires strict rate limiting (e.g. 10 requests/minute per key) and max file constraints.

4. **Third-Party Integrations & SSRF:**
   - Any future webhook or external URL fetching (e.g., importing CSV from a URL or delivering webhooks) must enforce strict SSRF protection:
     - Disallow IPv4 private ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`).
     - Disallow loopback, link-local, and multicast addresses.
     - Require HTTPS on default ports (443).

---

## 6. Audit Conclusion & Phase 6 Execution Strategy

All findings confirm that NUMPA's existing application baseline is solid and strictly follows its privacy and architecture contracts. 

In accordance with the **Absolute Production Safety Contract**:
- No destructive changes or unapproved migrations will be performed on Supabase.
- No unapproved routes or runtime configurations will be pushed to Render.
- No changes will be made to Vercel domains or production branch settings.
- All Phase 6 deliverables will cleanly document, design, and prepare commercial readiness while keeping user-facing controls completely truthful.
