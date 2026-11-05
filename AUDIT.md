# NUMPA Redesign — Phase 0 Repository Audit

**Audit date:** 2026-11-03  
**Repository:** `chandravadiyaDeep/Nump-`  
**Base branch:** `main`  
**Working branch:** `redesign/minimal-intelligence` (already exists)  
**Production:** `https://numpa.online`  
**API:** `https://numpa-api.onrender.com`

## 1. Executive summary

The requested redesign should be an in-place visual and interaction redesign of the existing application, not a rewrite.

The repository already contains:
- A public landing page at `/`.
- A separate authenticated workspace at `/app`.
- A bundled synthetic sample-data demo on the landing page.
- A shared workspace shell with seven destinations and a five-item mobile navigation.
- Existing analysis, cleaning, visualization, ML readiness, ML Lab, history, and settings components.
- A production safety contract that protects Supabase, Render, Vercel, API contracts, in-memory file handling, and the production branch.

**Important scope correction:** The route migration and initial landing/demo work described in the supplied redesign brief are already substantially present in the current `main` branch. Do not recreate them or move routes again. The remaining redesign work should focus on the existing workspace shell and workspace dashboards, with only targeted landing fixes if QA finds a concrete defect.

## 2. Confirmed technology stack

| Area | Confirmed repository evidence |
|---|---|
| Framework | Next.js 15.5.28 |
| UI | React 19.1.2 |
| Language | TypeScript 5.9.2, with JavaScript model modules |
| Styling | Existing global CSS and landing CSS; no Tailwind dependency declared in `apps/web/package.json` |
| Charts | Visualization is implemented in the existing workspace component/model; no chart package is declared in the web package manifest |
| Authentication | `@supabase/ssr` and `@supabase/supabase-js` |
| Backend | Python FastAPI under `apps/api` (confirmed by repository README) |
| Hosting | Vercel frontend, Render API (documented in production safety contract) |
| Frontend scripts | `npm run build`, `npm run lint` |

No dependency addition is justified for the visual redesign at this stage. Reuse the current stack and chart implementation.

## 3. Production safety contract

Read `PRODUCTION_SAFETY.md` in full before this audit. Its binding protections include:
- Supabase project, authentication, schema, RLS, policies, redirect URLs, and production environment variables are read-only.
- Render service settings, API URL, health endpoint, and environment variables are read-only.
- Vercel production project, domain, environment variables, build settings, and production branch are read-only.
- Preserve these API routes and their request/response contracts:
  - `GET /api/v1/health`
  - `POST /api/v1/datasets/inspect`
  - `POST /api/v1/cleaning/preview`
  - `POST /api/v1/cleaning/execute`
  - `POST /api/v1/ml-readiness/score`
  - `POST /api/v1/ml-labs/compare`
- Keep raw uploaded datasets in memory; do not introduce raw dataset persistence.
- Never deploy to production without explicit authorization.

This task is frontend presentation work. It must not require Supabase, Render, database, API-contract, or production environment changes.

## 4. Confirmed route and information architecture

| Route | Current role | Audit status |
|---|---|---|
| `/` | Public landing and discovery page | Confirmed in `apps/web/app/page.tsx` |
| `/app` | Main workspace; owns active dataset and workflow state | Confirmed in `apps/web/app/app/page.tsx` |
| `/login` | Authentication entry point | Referenced by landing navigation; route file not separately inspected in this pass |
| `/learn` | Learning hub | Referenced by landing navigation |
| `/services/*` | Service discovery pages | Three service destinations are linked from landing source |
| `/explore`, `/resources`, `/community`, `/company` | Public knowledge, resource, community, and company areas | Existing product navigation documented in project context; perform a complete route-tree inventory before touching these pages |

Do not implement a second route migration. The supplied brief's `/` landing and `/app` workspace separation is already in place.

## 5. Workspace component inventory

| Component / module | Confirmed responsibility |
|---|---|
| `apps/web/app/components/workspace-shell.tsx` | Sidebar, section switching, mobile drawer, theme preference, account navigation, history/settings destinations |
| `apps/web/app/components/workspace-data-panels.tsx` | Data Analysis and Data Preprocessing/Cleaning UI |
| `apps/web/app/components/workspace-data-visualization.tsx` | Histogram, bar, line, scatter, box, and correlation heatmap UI and chart summaries |
| `apps/web/app/components/workspace-ml-workspaces.tsx` | ML Readiness and ML Lab UI |
| `apps/web/app/components/workspace-data-model.mjs` | Upload validation and data-profile presentation helpers |
| `apps/web/app/components/workspace-visualization-model.mjs` | Visualization data preparation and chart calculations |
| `apps/web/app/components/workspace-ml-model.mjs` | Readiness/comparison response parsing and selection validation |
| `apps/web/app/components/workspace-history.tsx` | Analysis History workspace |
| `apps/web/app/components/workspace-settings.tsx` | Settings workspace |
| `apps/web/app/components/auth-nav.tsx` | Account/authentication navigation |
| `apps/web/app/components/landing/sample-data-demo.tsx` | Public synthetic-data demonstration |

The workspace shell currently exposes Data Analysis, Data Preprocessing/Cleaning, Data Visualization, ML Readiness, ML Lab, Analysis History, and Settings. The mobile navigation exposes the first five destinations, with remaining destinations accessible through the full navigation.

## 6. Workflow state and API integration

The active workflow is orchestrated in `apps/web/app/app/page.tsx`. Dataset and result state is held above the workspace section switch, including:
- Selected source `File`.
- Selected ML task and target.
- Cleaning operation selections.
- Dataset inspection overview.
- Readiness result.
- Cleaning preview and cleaned output.
- Before/after readiness comparison.
- ML comparison result and dataset version.
- Busy, error, and notice states.

This state placement is intentional: switching workspace sections should not discard the active dataset or results.

The frontend uses `NEXT_PUBLIC_NUMPA_API_URL` and does not fall back to localhost in a deployed browser. Preserve the existing request paths, payloads, response parsing, upload validation, and download behavior. The previous CORS/API issue is explicitly out of scope for this redesign unless a visual change exposes a reproducible regression; do not modify the backend to solve a visual issue.

## 7. Current design/theme observations

Confirmed:
- The workspace shell has an expanded/collapsed sidebar state.
- It has a mobile navigation drawer with keyboard focus handling and Escape-to-close behavior.
- It supports light and dark theme state and persists only the theme preference under `numpa-theme`.
- The existing components use semantic sections, buttons, labels, status/error regions, and data tables.
- The current styling is custom CSS, with legacy green-oriented tokens in parts of the workspace; the redesign brief calls for a restrained violet/cyan Minimal Intelligence system.

Required redesign direction:
- Light surfaces: near-white background, white cards, subtle neutral borders, high-contrast text.
- Dark surfaces: deep charcoal/navy background, raised dark panels, subtle borders.
- Violet for primary actions and active navigation only; cyan as a secondary data accent.
- Clear typography hierarchy, consistent spacing, calm cards, readable tables, and charts with no decorative 3D effects.
- Preserve both themes and respect reduced-motion preferences.
- Retain mobile drawer accessibility and keyboard behavior.

## 8. Existing capabilities and truthful product boundaries

| Workspace | Confirmed capability boundary |
|---|---|
| Data Analysis | Upload and inspect structured datasets; show dataset overview and column profiles |
| Data Cleaning | Review cleaning options, preview changes, confirm execution, and download cleaned CSV |
| Data Visualization | Histogram, bar, line, scatter, box plot, correlation heatmap |
| ML Readiness | Task-aware assessment for classification, regression, forecasting, and clustering (as specified in the product contract; verify each UI path against tests) |
| ML Lab | Baseline algorithm comparison is currently limited to classification and regression |
| Analysis History | Do not invent persisted history; preserve the honest unavailable state if there is no real storage |
| Settings | Account and appearance preferences |

Do not present ML Lab forecasting or clustering comparisons as implemented unless the backend and tests confirm them. Readiness is an explainable heuristic, not a guarantee of model performance.

## 9. Existing landing page and demo

The public landing page already exists in `apps/web/app/page.tsx`. It contains:
- Public navigation and primary workspace CTA.
- Product explanation and workflow.
- Service cards for Dataset Analysis, Data Cleaning, and ML Readiness.
- A link to the learning area.
- A sample-data demo component.

The sample demo is backed by `/data/sample/ecommerce_customers_synthetic.csv` and presents Overview, Quality, Visualize, Cleaning preview, ML readiness, and Compare tabs. Its scoring/cleaning logic is demo-only and must remain clearly distinguished from the production API workflow. Do not treat demo values as live production results.

## 10. Issues observed during source inspection

1. The Data Analysis component source contains a literal visible `\n` fragment after the file input markup. Verify whether this is rendered in the current UI and remove only the stray text node if confirmed.
2. Some workspace styling still uses the earlier green visual language; replace presentation tokens carefully without changing domain logic.
3. The existing components combine substantial UI and calculation/presentation logic. Prefer focused style/layout refactors over broad rewrites.
4. Full route-tree enumeration and full Lighthouse/bundle measurements were not available through this source pass. Do not invent those metrics; capture them during local/preview QA.

## 11. Redesign implementation sequence

### Phase 1 — Design foundation and shell
- Establish shared Minimal Intelligence tokens in the existing CSS architecture.
- Redesign sidebar, top bar, page containers, buttons, cards, forms, tables, alerts, empty/loading states.
- Preserve collapse behavior, mobile drawer focus trap, theme persistence, and all navigation labels.
- Fix the confirmed stray newline text if reproduced.
- Do not change route structure or add dependencies.

### Phase 2 — Data Analysis and Cleaning
- Improve hierarchy of dataset summary, quality signals, column profiles, operation selection, preview, confirmation, and export.
- Keep source and cleaned dataset states distinct.
- Preserve every existing action and API contract.

### Phase 3 — Visualization
- Improve chart selection, axis controls, chart canvas, explanations, and data table.
- Preserve existing chart calculations and clearly communicate sampling/limitations.
- Do not add unsupported chart types or claim forecasts from line charts.

### Phase 4 — ML Readiness and ML Lab
- Improve readiness score hierarchy, task selection, dimension evidence, warnings, and before/after comparison.
- Improve comparison leaderboard and metric explanations for supported classification/regression workflows only.
- Do not change formulas, thresholds, algorithm logic, or backend payloads.

### Phase 5 — History, Settings, responsive QA
- Polish history/settings without inventing persistence or account capabilities.
- Verify desktop, tablet, and mobile.
- Verify light and dark themes, keyboard navigation, focus states, and reduced motion.

### Phase 6 — Regression verification and handoff
- Run `npm run lint` and `npm run build` from `apps/web`.
- Run existing API/backend tests if available, without changing backend code.
- Review the complete diff and confirm protected files/configuration are untouched.
- Write `CHANGES.md` with files changed, tests actually run, limitations, and rollback steps.
- Request review through a PR. Do not merge or deploy.

## 12. Acceptance criteria

- [ ] Existing `/` landing and `/app` workspace remain available.
- [ ] Every existing workspace destination remains accessible.
- [ ] Active dataset and results survive section switching.
- [ ] Upload validation and sample dataset flow remain functional.
- [ ] Cleaning preview remains separate from execution/confirmation.
- [ ] Cleaned CSV export remains functional.
- [ ] All six existing visualization types remain functional.
- [ ] Readiness explanations and task boundaries remain accurate.
- [ ] ML Lab remains truthful about classification/regression support.
- [ ] Analysis History does not fabricate saved records.
- [ ] Light/dark theme and mobile navigation work.
- [ ] No raw dataset is persisted in localStorage or added to Supabase/storage.
- [ ] No API contract, Supabase configuration, Render configuration, Vercel production configuration, or production domain changes.
- [ ] Lint and production build pass.
- [ ] No production deployment or merge without explicit authorization.

## 13. Rollback

All work must remain isolated on `redesign/minimal-intelligence`. If the redesign is not acceptable, leave `main` unchanged and close/revert the feature PR. Do not force-push or rewrite `main`. Production rollback, if a later separately authorized deployment ever occurs, must use the Vercel previous-known-good deployment procedure described in `PRODUCTION_SAFETY.md`.

## 14. Audit limitations

This document records only facts verified from repository files fetched during the audit. The full route tree, local browser rendering, Lighthouse score, bundle size, and end-to-end production workflows have not been independently measured in this pass. They must be verified during local/preview QA before claiming completion.
