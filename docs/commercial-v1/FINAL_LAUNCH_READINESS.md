# NUMPA Commercial V1 — Final Launch Readiness & Status Matrix

**Phase:** Commercial V1 — Phase 6  
**Document Status:** Release Verification Baseline & Owner Launch Gate  
**Target Branch:** `feature/commercial-v1-phase-6-commercial-readiness`  
**Parent Phase 5 Head Commit:** `4d2cb24af0e97c2ca34f44a17c2de9744b39f39d` (Phase 5 PR #9)  

---

## 1. Three-Tier Verification Framework

To ensure absolute engineering honesty, every capability in NUMPA Commercial V1 is tracked across three distinct verification states:

1. **Implemented in Codebase:** The feature logic, React components, or FastAPI route handlers are present in the repository.
2. **Automated-Test Verified:** Verified by automated test suites (`node --test`, `pytest`, GitHub Actions CI) with reproducible assertions.
3. **Production End-to-End Verified (Owner Release Gate):** Verified in the live hosted production environment with real browser traffic between `numpa.online` (Vercel) and `numpa-api.onrender.com` (Render).

---

## 2. Comprehensive Capability Matrix

| Workspace / Capability Area | Implemented in Codebase | Automated-Test Verified | Production End-to-End Verified | Real Status & Current Reality |
|---|:---:|:---:|:---:|---|
| **Workspace Shell & Navigation** | Yes | Yes | Pending Live Smoke Test | Collapsible sidebar, mobile drawer, 7 destinations, and theme persistence verified via unit tests. |
| **Data Analysis & Profiling** | Yes | Yes | Pending Live Smoke Test | Profiling for CSV, JSON, XLSX, Parquet, Arrow, Feather up to 50 MB and 1M rows verified via test suites. |
| **Smart Data Cleaning** | Yes | Yes | Pending Live Smoke Test | Imputation (median/mode), duplicate removal, text trimming (`.strip()`), and CSV export verified via unit tests. |
| **Data Visualization** | Yes | Yes | Pending Live Smoke Test | 6 native accessible SVG charts (histogram, bar, line, scatter, box plot, correlation) verified via unit tests. |
| **ML Readiness Assessment** | Yes | Yes | Pending Live Smoke Test | 4 task families (`classification`, `regression`, `forecasting`, `clustering`) and 4 dimension scores verified via unit tests. |
| **ML Lab (Baseline Comparison)** | Yes | Yes | Pending Live Smoke Test | 80/20 holdout evaluation for 3 classification and 3 regression estimators verified via unit tests. |
| **Analysis History Store** | No | Yes (Negative assertions) | N/A | Deliberately unavailable. UI displays honest unavailable notice. Zero tables or buckets created. |
| **Account & Theme Settings** | Yes | Yes | Pending Live Smoke Test | Supabase session email display and local theme toggle verified via unit tests. |
| **Public API Reference** | Yes | Yes | N/A | Grounded in actual FastAPI source code in `PUBLIC_API_REFERENCE.md`. |
| **Developer API Authentication** | No | Yes (Negative assertions) | N/A | **Planned · Approval-Gated (Not active).** UI honestly displays `Planned · Approval-gated`. No fake client keys generated. |
| **Usage Metering & Quotas** | No | Yes (Negative assertions) | N/A | **Planned · Approval-Gated (Not active).** Application runs in unmetered evaluation mode. No billing tables deployed. |
| **Billing & Subscriptions** | No | N/A | N/A | **Planned · Awaiting Setup.** Proposed tiers (\$0, \$19, \$79, Custom) are **tentative proposals awaiting owner approval**. |
| **Webhook Delivery** | No | N/A | N/A | **Planned · Awaiting Infrastructure.** Requires asynchronous worker queue (Celery/Redis) on Render. |
| **Automation (Zapier, Make, n8n)** | No | N/A | N/A | **Planned · Not connected.** Connectors displayed honestly in Settings catalog. |
| **Cloud Storage (Drive, GitHub)** | No | N/A | N/A | **Planned · Not connected.** Scoped OAuth architectures specified; no external tokens connected. |

---

## 3. Critical Production Constraints & Limitations

### 3.1 CORS Is Not Authentication
- **FastAPI Access Reality:** The backend (`numpa-api.onrender.com`) is protected against browser cross-origin calls via CORS middleware (`allow_origins` and `allow_origin_regex`).
- **Security Clarification:** **CORS is an origin-reflection browser security mechanism, NOT authentication or access control.** Non-browser HTTP clients (cURL, Postman, scripts) can execute API requests without authentication headers. True developer API access requires the server-side API key architecture specified in `API_ACCESS_DESIGN.md`.

### 3.2 Populated-Data Workflows & Preview API Limitation
- **Vercel Preview Hostname Variability:** Vercel preview deployment hostnames (e.g. `numpa-*-depochandravadiya-6509s-projects.vercel.app`) must match the CORS regex on Render.
- **Render Cold Starts:** Render free/starter instances spin down after inactivity. Cold-start latency (30–60s) or network timeouts during preview testing can cause browser fetch errors.
- **Verification Rule:** Populated-data workflows (uploading sample data, reviewing profile, downloading cleaned CSV, running model comparisons) are **automated-test verified** locally and in CI, but must **not** be marked "Production End-to-End Verified" until the repository owner runs the live post-deployment smoke test.

### 3.3 Privacy & Data Ephemerality Verification
- **Verified Code Reality:** Code audit confirms that uploaded bytes are held in memory (`io.BytesIO`) and converted to pandas DataFrames. No disk writes (`to_csv`, `to_parquet` to disk) and no Supabase database queries for dataset rows exist in the repository.
- **Compliance Scope:** This is an architectural property verified by repository inspection. It does **not** constitute an audited compliance certification (e.g., SOC 2 Type II, HIPAA, or ISO 27001).

### 3.4 Commercial Pricing Status
- The pricing tiers outlined in `USAGE_AND_ENTITLEMENTS_DESIGN.md` and `BILLING_AND_SUBSCRIPTIONS_DESIGN.md` (Free \$0, Starter \$19/mo, Professional \$79/mo, Enterprise Custom) are **tentative engineering proposals**.
- Commercial monetization and plan pricing remain strictly approval-gated and require explicit owner confirmation before merchant account registration.

---

## 4. Verification & Testing Evidence

1. **Web Model Unit Tests (`node --test`)**:
   - `workspace-data-model.test.mjs` (5 passing)
   - `workspace-ml-model.test.mjs` (6 passing)
   - `workspace-settings-model.test.mjs` (6 passing, including negative assertions for API keys and unmetered plan state)
   - `workspace-visualization-model.test.mjs` (10 passing)
   - **Total:** **27 passing**, 0 failing, 0 skipped (duration: ~456ms).
2. **Repository Integrity**:
   - All Phase 1–5 files, components, and workflows remain completely intact.
   - Zero modifications to Supabase database, Render service settings, Vercel project configuration, or existing secrets.

---

## 5. Owner Release Gate Checklist (Pre-Merge)

Before merging this PR into `feature/commercial-v1-phase-5-history-settings` or `main`:

- [ ] Confirm automated GitHub Actions CI passes on this PR (`web-build.yml`, `api-tests.yml`).
- [ ] Review documentation in `docs/commercial-v1/` for alignment with business goals.
- [ ] If preview deployment URL is active, test `GET /api/v1/health` from the preview browser console to verify CORS connectivity.
- [ ] Verify that Settings navigation correctly displays `API Access` and `Usage & Plan` with honest `Planned` and `Unmetered` notices.
