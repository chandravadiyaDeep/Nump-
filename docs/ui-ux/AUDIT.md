# NUMPA UI/UX Redesign Audit

**Date:** 2026-11-03  
**Branch:** `redesign/minimal-intelligence`  
**Base:** `main` at `80d0848e718ed5a08a8081652dd5fd87b8562077`  
**Specification:** `turn662file0`, *NUMPA — Implementation-Ready UI/UX Redesign Prompt for Codex* (14 pages)

## 1. Executive summary

The current application is a Next.js App Router application. The root route `/` currently renders the authenticated-capable NUMPA workspace, not a public landing page. Public discovery routes already exist for services, learning, blog, resources, explore, community, about and contact.

The workspace is a single client-rendered page with section switching managed by React state inside `WorkspaceShell`. It does not currently expose the proposed individual `/app/analysis`, `/app/clean`, `/app/visualize`, `/app/readiness`, `/app/lab`, `/app/history` and `/app/settings` route structure. Introducing that route structure is therefore a routing and state-preservation change, not just a visual restyle.

The safest initial route migration is to preserve the existing workspace implementation as a single `/app` route and introduce the public landing page at `/`. Existing public content routes remain unchanged. Do not create artificial subroutes for each workspace panel until deep-link behavior and shared in-memory dataset state have been designed and tested.

## 2. Confirmed technology stack

Source: `apps/web/package.json`, `apps/web/app/layout.tsx`, current source tree.

| Area | Confirmed implementation |
|---|---|
| Framework | Next.js 15.5.28 |
| UI | React 19.1.2 |
| Language | TypeScript 5.9.2 |
| Routing | Next.js App Router |
| Styling | Global CSS in `apps/web/app/globals.css`; component-specific CSS also exists |
| Tailwind | Not listed as a dependency; do not assume Tailwind is installed |
| Chart library | No chart library listed in the web package dependencies; inspect existing visualization implementation before choosing a library |
| Authentication client | `@supabase/ssr` 0.7.x and `@supabase/supabase-js` 2.57.x |
| Lint | ESLint 9.36.0 via `npm run lint` |
| Build | `next build` via `npm run build` |
| Backend | Python / FastAPI hosted on Render |
| Frontend hosting | Vercel |

No dependency additions are justified by the audit alone. Prefer existing CSS and browser primitives unless an implementation need is demonstrated.

## 3. Repository / application map

Relevant web paths:

- `apps/web/app/layout.tsx` — root document and metadata defaults.
- `apps/web/app/page.tsx` — current full workspace page and workflow orchestration.
- `apps/web/app/globals.css` — global visual system and workspace/public styling.
- `apps/web/app/components/workspace-shell.tsx` — workspace navigation, theme, shell and section switching.
- `apps/web/app/components/workspace-data-panels.tsx` — data analysis and preprocessing/cleaning panels.
- `apps/web/app/components/workspace-data-visualization.tsx` — visualization workspace.
- `apps/web/app/components/workspace-ml-workspaces.tsx` — ML Readiness and ML Lab workspaces.
- `apps/web/app/components/workspace-history.tsx` — Analysis History destination.
- `apps/web/app/components/workspace-settings.tsx` — Settings.
- `apps/web/app/components/auth-nav.tsx` and `auth-styles.css` — authentication navigation and styling.
- `apps/web/app/components/site-footer.tsx` — discovery footer.
- `apps/web/app/components/public-site.tsx` and `public-content.ts` — public-page primitives and content registry.
- `apps/web/app/sitemap.ts` and `robots.ts` — search discovery metadata routes.
- `apps/web/app/auth/callback/route.ts` — auth callback route.
- `apps/web/app/login/page.tsx`, `login/login-form.tsx`, `reset-password/page.tsx` — authentication pages.

## 4. Current route inventory

Confirmed from the Git tree on `main`:

| Route | Current role |
|---|---|
| `/` | Workspace (current root page) |
| `/about` | Public About page |
| `/contact` | Public Contact page |
| `/services` | Services directory |
| `/services/[slug]` | Service detail |
| `/learn` | Learning hub |
| `/learn/[slug]` | Learning topic detail |
| `/blog` | Blog index |
| `/blog/[slug]` | Blog article |
| `/resources` | Resources directory |
| `/resources/[slug]` | Resource detail |
| `/explore/[slug]` | Explore topic page |
| `/community/[slug]` | Community topic page |
| `/login` | Login |
| `/reset-password` | Password reset |
| `/auth/callback` | Authentication callback |
| `/sitemap.xml` | Next metadata sitemap route |
| `/robots.txt` | Next metadata robots route |

The workspace's Data Analysis, Preprocessing/Cleaning, Visualization, ML Readiness, ML Lab, Analysis History and Settings sections are currently selected within the same `/` client page. They are not separate URL routes in the audited tree.

## 5. Current workspace behavior and state

- `apps/web/app/page.tsx` is a client component.
- It owns the active source `File`, selected ML task/target, analysis overview, readiness result, cleaning preview/output, comparisons, errors, notices and busy state.
- This state is intentionally above the workspace section switch so navigation between sections does not discard the active source.
- `WorkspaceShell` uses local React state to switch sections.
- The theme preference is stored as `numpa-theme` in browser localStorage. The code comments state that only appearance preference is persisted; uploaded files and results remain in memory.
- The shell has a collapsible sidebar, mobile drawer, focus management, and a theme toggle.
- Authentication UI is integrated through `AuthNav`.
- The existing page directly calls the hosted API using the configured `NEXT_PUBLIC_NUMPA_API_URL`; it does not silently fall back to localhost.

**Critical migration constraint:** Moving the workspace to `/app` must preserve the single owner of active in-memory dataset state. Do not split the current workflow into separate pages that remount and lose the selected File or computed results. A persistent shared client layout/provider would need an explicit design and regression tests before multi-route workspace navigation is attempted.

## 6. Existing design system observations

- The current global CSS imports DM Sans and Manrope from Google Fonts.
- The visual identity currently uses a green palette (for example `--green: #176b4d`), off-white background, white panels, muted green/gray borders, amber warning and red error tokens.
- The workspace uses component classes such as `workspace-shell`, `workspace-sidebar`, `workspace-nav-item`, `workspace-main` and related responsive styles.
- The public content styles and workspace styles share the global stylesheet.
- The PDF proposes a violet/cyan Minimal Intelligence palette. This is a new visual direction and should be implemented through carefully scoped design tokens rather than ad-hoc overrides.
- Both light and dark themes already exist in the workspace shell. Audit and preserve all existing theme behavior when extending the public site.

## 7. Component inventory

Confirmed component modules:

- Workspace shell/navigation: `WorkspaceShell`
- Authentication navigation: `AuthNav`
- Public footer: `SiteFooter`
- Public page layout/content: components in `public-site.tsx`
- Analysis and cleaning: `DataAnalysisWorkspace`, `DataPreprocessingWorkspace`
- Visualization: `DataVisualizationWorkspace`
- ML: `MlReadinessWorkspace`, `MlLabWorkspace`
- History: `AnalysisHistoryWorkspace`
- Settings: `SettingsWorkspace`
- Domain/UI model helpers and tests for data, ML, settings and visualization are colocated under `components/`.

Do not assume a dedicated reusable Button/Card/DataTable/UploadZone design-system package exists. Inspect and reuse current component markup and styles before extracting new primitives.

## 8. API and authentication boundaries

The current frontend calls these API routes:

- `GET /api/v1/health` (service health contract; not used as a substitute for workflow verification)
- `POST /api/v1/datasets/inspect`
- `POST /api/v1/cleaning/preview`
- `POST /api/v1/cleaning/execute`
- `POST /api/v1/ml-readiness/score`
- `POST /api/v1/ml-labs/compare`

The PDF's shorthand endpoint names (`/upload`, `/analyze`, `/clean`, etc.) do not match the actual production endpoint paths. Preserve the actual paths and request/response contracts above.

Supabase auth code and callback routes are present. This UI task must not change Supabase project settings, keys, providers, redirect URLs, RLS or schema.

## 9. Public discovery content already present

The following public sections were introduced before this redesign:

- Services directory and service detail pages.
- Learning hub and topic detail pages.
- Blog index and two starter articles.
- Resources directory and resource details.
- Explore topic routes.
- Community topic routes.
- About and Contact.
- Sitemap, robots and shared footer.

Preserve these URLs and their indexability. Do not duplicate, remove or silently rename them while adding the new landing page.

## 10. Gaps and design decisions required

1. Root route conflict: `/` is the workspace today; PDF wants the public landing page at `/`.
2. Workspace URL model: only one workspace URL exists today; individual panels are local state, not separate paths.
3. In-memory state: dataset and workflow state are owned by the root page; route migration must not remount/reset it.
4. No Tailwind dependency is declared.
5. No chart library dependency is declared in the web package; inspect existing chart code before choosing one.
6. The proposed sample CSV does not yet exist in the audited source tree. It must be generated and validated as synthetic, with documented provenance and deterministic calculations.
7. The PDF includes illustrative readiness numbers (78/100, 82/100, 68 → 86). These must not be copied as computed claims. Either calculate values from the sample dataset using a clearly documented deterministic demo method, or label the values as illustrative examples. Never imply the demo invokes production scoring unless it actually does.
8. The PDF proposes a "Privacy" link and "No raw data stored" statement. Verify the precise current data flow and legal/privacy content before making public legal or security claims. The existing safety contract supports in-memory processing by default and no raw dataset persistence by default, but it does not replace a reviewed privacy policy.
9. Lighthouse scores, bundle sizes, performance metrics and a visual browser review have not been measured in this audit.
10. There is no confirmed CMS, author publishing workflow, pricing page or public API-key/billing feature. Do not invent these.

## 11. Performance baseline

Not measured in this remote source audit:
- Lighthouse performance/accessibility/SEO scores.
- Production bundle size or route-level JS size.
- Real-user Core Web Vitals.
- Browser interaction/visual regression checks.

Capture these in a later QA phase. Do not claim Lighthouse >90 until a reproducible run is performed and recorded.

## 12. Proposed safe route strategy

- Introduce the public landing page at `/`.
- Move the current workspace page implementation to `/app` while preserving its existing single-page state model initially.
- Keep all current public routes (`/services`, `/learn`, `/blog`, `/resources`, `/explore`, `/community`, `/about`, `/contact`) unchanged.
- Keep login, reset-password and auth callback routes unchanged.
- Change workspace brand/home navigation to point to `/app`; add an explicit public-site link to `/`.
- Do not introduce middleware-based forced redirects for authenticated users. The PDF itself says not to aggressively redirect; show a clear "Go to workspace" action when appropriate.
- Do not claim legacy workspace deep links exist. Since the current audited implementation has no separate workspace panel routes, there are no such panel URLs to redirect. If other inbound URLs are discovered during implementation, add only verified redirects.
- Keep all workspace sections inside `/app` until a shared state architecture and route-level regression tests are ready.

## 13. Implementation guardrails

Read and follow `PRODUCTION_SAFETY.md`, `docs/architecture/NUMPA_CORE_PROTECTION_CONTRACT.md` and `docs/architecture/NUMPA_ARCHITECTURE_CONTRACT.md`.

- Keep changes frontend-only unless a separately reviewed requirement proves otherwise.
- Do not modify backend code, API contracts, Supabase, Render or Vercel production configuration.
- Do not store raw sample or uploaded customer datasets in localStorage.
- Keep the source dataset immutable; cleaning demo must create a separate derived sample.
- No fake users, testimonials, connected integrations, production live stats or invented activity.
- No new dependencies unless current capabilities demonstrably cannot satisfy the design; justify any addition.
- Use a separate branch and phased commits.
- Run the available web build and lint scripts and relevant existing tests.
- Do not deploy to production.

## 14. First implementation acceptance criteria

- The current workspace is still available at `/app`.
- The public landing page is served at `/`.
- Existing public discovery, login and auth callback routes still resolve.
- The workspace retains its active dataset and all current workflows during section navigation.
- Existing API calls and upload validation remain unchanged.
- Both themes continue to work.
- No raw uploaded dataset is written to localStorage.
- The sample demo uses documented synthetic data and computed/clearly-labelled results.
- Build, lint and relevant tests pass.
- A `CHANGES.md` documents files changed, tests, limitations and rollback.

---

**Audit status:** Source-level audit completed. Lighthouse, bundle-size measurement and real-browser visual verification remain pending because they require a running browser/build environment.
