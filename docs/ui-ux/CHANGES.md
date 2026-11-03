# NUMPA UI/UX Redesign — Changes

**Branch:** `redesign/minimal-intelligence`  
**Pull request:** [#13](https://github.com/chandravadiyaDeep/Nump-/pull/13)  
**Specification:** `docs/ui-ux/AUDIT.md` and the supplied 14-page UI/UX implementation PDF.

## Implemented in this branch

### Phase 0 — Audit
- Added `docs/ui-ux/AUDIT.md`.
- Confirmed Next.js 15.5.28, React 19.1.2, TypeScript 5.9.2 and App Router.
- Documented all existing routes and the current root/workspace conflict.
- Identified that workspace sections currently share one client page and one in-memory dataset state owner.
- Recorded that Tailwind and a chart package are not listed as web dependencies.

### Phase 1 — Foundation and routes
- Copied the existing workspace page to `/app` without changing its workflow orchestration.
- Changed `/` into the public landing page.
- Corrected workspace-relative imports after moving the route.
- Updated the workspace brand to link to `/app`.
- Updated the public header CTA to open `/app`.
- Kept all existing public discovery, login, reset-password and auth callback routes.
- Updated successful password sign-in and email confirmation destination to `/app`. Password-reset callback remains unchanged.

### Phase 2 and 4 — Landing page and discovery
- Added responsive navigation, hero, clear product explanation and primary/secondary CTAs.
- Added services showcase; AI Tools remains explicitly Planned.
- Added workflow, audience/use-case, trust/privacy explanation, learning/resource links and final CTA.
- Aligned existing public discovery page accents with the new violet visual language.
- Added responsive mobile navigation and reduced-motion support.

### Phase 3 — Interactive sample demonstration
- Added `apps/web/public/data/sample/ecommerce_customers_synthetic.csv`.
- Dataset contains 100 rows and 12 columns, including 3 exact duplicate rows, missing values and numeric outliers.
- Added dataset provenance documentation in the sample directory.
- Added six interactive tabs: Overview, Quality, Visualize, Cleaning preview, ML readiness and Compare.
- Cleaning operations work on a copied sample in browser memory only.
- Demo readiness is a separately labelled data-quality indicator, not the production ML Readiness engine.
- Demo values are explicitly labelled synthetic and demonstrative.

### Phase 5 — Workspace navigation polish
- Added a link back to the public site and fixed the workspace link markup.
- Added a five-item mobile quick-navigation bar; Analysis History and Settings remain available in the drawer/sidebar.
- Aligned shared workspace panels, form controls, table surfaces, navigation accents and buttons with the Minimal Intelligence violet theme while retaining the light/dark theme variables.
- Added a guided first-run onboarding panel with three clear steps and a one-click synthetic sample option.
- Added the sample dataset option to the normal upload panel; selecting it creates a browser File and does not send it to the API until the user chooses Inspect.
- Preserved the current single-page workspace state model so section changes do not discard the active in-memory source dataset.

## Intentionally not done

- Did not split each workspace panel into independent routes such as `/app/analysis` or `/app/clean`. The existing workspace owns a shared in-memory `File` and workflow results in one client page. Splitting it without a shared state architecture risks losing the selected dataset. Keep the workspace at `/app` for this first migration.
- Did not modify API contracts, backend code, cleaning algorithms or ML readiness formulas.
- Did not add a production ML Readiness call to the public demo.
- Did not add a chart dependency; the landing demo uses lightweight SVG/CSS visuals.
- Did not change Supabase project settings, schema, RLS, keys, providers or redirect configuration.
- Did not change Render or Vercel production settings.
- Did not create a privacy policy or claim legal review.
- Did not add pricing, author accounts, CMS, analytics, fake testimonials, fake user counts or live production counters.
- Did not deploy to production.

## Verification

- Source-level audit completed.
- The previous verified head (`4e5bd7a83bd969e13c4065c58615f6c7e600693a`) passed the NUMPA web build, API tests and Vercel preview check.
- New workspace onboarding and shared-style commits were pushed after that verified head. Their CI checks must complete before merge; do not reuse the earlier green result as proof for the latest head.
- Vercel preview URL from the current deployment: `https://numpa-git-redesign-mini-047995-depochandravadiya-6509s-projects.vercel.app`.
- Automated preview comment check reports no unresolved feedback.
- Lighthouse scores, real-browser visual testing, keyboard walkthrough and end-to-end production API workflow verification have not been performed in this environment. The preview host is not accessible to the available page-inspection tool, so do not claim visual or Lighthouse verification.
- Do not merge or deploy until checks are green and a human reviewer verifies the preview.

## Rollback

This branch is isolated from `main`. To discard the redesign, close PR #13 without merging and continue using `main`. If the PR is merged later and causes a regression, revert the merge commit using GitHub's revert workflow and redeploy the previous known-good production deployment only with owner authorization.
