# NUMPA Commercial V1 — Final Launch Readiness & Status Matrix

**Phase:** Commercial V1 — Phase 6  
**Status:** Verification Baseline & Owner Launch Gate  
**Branch:** `feature/commercial-v1-phase-6-commercial-readiness`  
**Parent Head Commit:** `4d2cb24af0e97c2ca34f44a17c2de9744b39f39d` (Phase 5 PR #9)  

---

## 1. Commercial Launch Status Matrix

The following matrix represents the evidence-based, verified status of all NUMPA Commercial V1 capabilities.

| Capability Area | Functional Status | Current Reality in Codebase | Commercial Launch Action / Gate |
|---|---|---|---|
| **Workspace Shell Foundation** | Verified Ready | Collapsible sidebar, mobile drawer, responsive CSS, theme persistence | Production ready (Phase 1). |
| **Data Analysis & Profiling** | Verified Ready | In-memory profiling for CSV/XLSX/JSON/Parquet/Arrow, column type inference, missingness statistics | Production ready (Phase 2). |
| **Smart Data Cleaning** | Verified Ready | Deterministic imputation, duplicate removal, text normalization, audit report, CSV download | Production ready (Phase 2). |
| **Data Visualization** | Verified Ready | Native accessible SVG histogram, bar, line, scatter, box plot, correlation matrix | Production ready (Phase 3). |
| **ML Readiness Assessment** | Verified Ready | 4 task families (classification, regression, clustering, time_series), deterministic 0–100 score, recommendations | Production ready (Phase 4). |
| **ML Lab (Estimator Comparison)** | Verified Ready | 80/20 holdout benchmark, scikit-learn pipelines with zero train-test leakage, macro metrics | Production ready (Phase 4). |
| **Analysis History Persistence** | Deliberately Unavailable | UI honestly displays unavailable status; zero database tables or storage buckets created | Awaiting owner approval for metadata-only schema. |
| **Account & Theme Settings** | Verified Ready | Supabase session email display, light/dark theme preference saved locally | Production ready (Phase 5). |
| **Public API Documentation** | Verified Ready | Comprehensive endpoint specs, schemas, limits, and synthetic curl examples in `PUBLIC_API_REFERENCE.md` | Ready for developer distribution. |
| **API Authentication & Keys** | Designed & Approval-Gated | Production design specified in `API_ACCESS_DESIGN.md`. UI honestly labeled `Planned · Approval-gated` | Awaiting owner approval for Supabase `api_keys` table & FastAPI auth middleware. |
| **Usage Metering & Quotas** | Designed & Approval-Gated | Specification authored in `USAGE_AND_ENTITLEMENTS_DESIGN.md`. UI honestly displays unmetered evaluation mode | Awaiting server-side ledger deployment. |
| **Billing & Subscriptions** | Evaluated & Planned | Razorpay vs. Stripe evaluation authored in `BILLING_AND_SUBSCRIPTIONS_DESIGN.md`. Zero live billing code deployed | Awaiting merchant account registration (Stripe). |
| **Webhooks** | Designed & Planned | Architecture, payload schemas, HMAC signing, and SSRF rules specified in `WEBHOOKS_DESIGN.md` | Awaiting async background queue infrastructure on Render. |
| **Automation (Zapier, Make, n8n)** | Designed & Planned | Specification authored in `THIRD_PARTY_INTEGRATIONS_DESIGN.md`. Displayed as `Planned · not connected` | Awaiting public API key launch & partner approval. |
| **Cloud Storage (Drive, GitHub)** | Designed & Planned | Minimal OAuth scopes specified in `THIRD_PARTY_INTEGRATIONS_DESIGN.md`. Displayed as `Planned · not connected` | Awaiting Google Cloud OAuth & GitHub App registration. |
| **Privacy & Security Integrity** | Verified Ready | In-memory ephemerality strictly preserved. Zero raw customer data in database or logs | Production ready. |

---

## 2. What NUMPA Can Commercially Deliver Today

### 2.1 Live Immediate Commercial Offering
1. **Unmetered SaaS Workspace:** Fully functioning tabular analysis, cleaning, visualization, ML readiness scoring, and model benchmarking for files up to 50 MB.
2. **Privacy-Guaranteed Data Processing:** Clear competitive advantage for privacy-sensitive enterprises—data is processed purely in RAM and never stored in cloud databases.
3. **Downloadable Outputs:** Cleaned CSV datasets and exportable analysis audit metrics.

### 2.2 Pending Capabilities Requiring Approval & External Setup
1. **Commercial Monetization Activation:** Requires setting up a Stripe merchant account, configuring product pricing tiers, and approving the `user_subscriptions` Supabase schema.
2. **Developer API Access:** Requires approving the `public.api_keys` table migration and deploying FastAPI Bearer authentication middleware.
3. **Analysis History Persistence:** Requires approving the `public.analysis_history` metadata-only schema.

---

## 3. Production Safety Audit & Verification Summary

### 3.1 Protected Systems Checklist
- [x] **Supabase Project & Auth:** Completely untouched. No tables created, no RLS policies modified, no auth providers changed, no migrations applied.
- [x] **Render Python Backend:** Completely untouched. No changes to service settings, root directory, build/start commands, runtime, health checks, or environment variables.
- [x] **Vercel Frontend:** Completely untouched. No production domain changes, no environment variable changes, no build setting modifications.
- [x] **Application Data Lifecycle:** Completely preserved. Ephemeral, in-memory processing maintained. No raw datasets stored.
- [x] **Zero Fictional Functionality:** All planned integrations, API keys, usage metering, and billing features are honestly labeled as `Planned` or `Unavailable`. Zero fake buttons or synthetic credentials exist.

### 3.2 Automated Test Verification
- **Web Model Tests:** 27 / 27 unit tests passing via `node --test` (456ms execution time).
  - Column profiles, numeric/categorical summaries, quality observations
  - Cleaning selections and upload validation
  - ML readiness task validation, target checks, and response parsing
  - ML Lab estimators and baseline metrics
  - History unavailable assertions and real record collections
  - Account presentation and unconfigured auth handling
  - Usage unmetered evaluation and 7 integration catalog items
  - **Phase 6 Additions:** API access server-side key assertions and commercial plan tier statuses
  - Data visualizations (histogram, bar, line, scatter, box plot, correlation)
- **CI Workflows:** Fully configured and verified in `.github/workflows/web-build.yml` and `api-tests.yml`.

---

## 4. Rollback Plan

If Phase 6 changes ever need to be completely reversed:

1. **Exact Base Commit to Revert To:**  
   `4d2cb24af0e97c2ca34f44a17c2de9744b39f39d` (Head of Phase 5 PR #9).
2. **Files Affected by Phase 6:**
   - `docs/commercial-v1/PHASE_6_CAPABILITY_AUDIT.md` (new)
   - `docs/commercial-v1/PUBLIC_API_REFERENCE.md` (new)
   - `docs/commercial-v1/API_ACCESS_DESIGN.md` (new)
   - `docs/commercial-v1/USAGE_AND_ENTITLEMENTS_DESIGN.md` (new)
   - `docs/commercial-v1/WEBHOOKS_DESIGN.md` (new)
   - `docs/commercial-v1/THIRD_PARTY_INTEGRATIONS_DESIGN.md` (new)
   - `docs/commercial-v1/BILLING_AND_SUBSCRIPTIONS_DESIGN.md` (new)
   - `docs/commercial-v1/ANALYSIS_HISTORY_DESIGN.md` (new)
   - `docs/commercial-v1/USER_ONBOARDING_AND_GUIDES.md` (new)
   - `docs/commercial-v1/FINAL_LAUNCH_READINESS.md` (new)
   - `apps/web/app/components/workspace-settings.tsx`
   - `apps/web/app/components/workspace-settings-model.mjs`
   - `apps/web/app/components/workspace-settings-model.d.mts`
   - `apps/web/app/components/workspace-settings-model.test.mjs`
3. **Database & Infrastructure Impact:**  
   **Zero.** No database tables, migrations, storage buckets, or cloud environment variables were created or modified. Rollback is a pure Git checkout operation with zero production downtime or data loss risk.
