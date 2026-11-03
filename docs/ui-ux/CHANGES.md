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
- Added a link back to the public site.
- Added a five-item mobile quick-navigation bar; remaining sections stay available in the existing drawer/sidebar.
- Aligned workspace primary accents with the Minimal Intelligence violet theme while retaining existing light/dark theme behavior.
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
- GitHub Actions API tests: latest run is pending/in progress at the time of this document; an earlier run on the branch passed.
- GitHub Actions web build: latest run is pending/in progress at the time of this document; earlier web build on the initial implementation commit passed before later route/theme polish.
- Vercel preview check: pending at the time of this document.
- Lighthouse, browser visual testing and production workflow verification have not been performed.
- Do not merge or deploy until checks are green and a reviewer verifies the preview.

## Rollback

This branch is isolated from `main`. To discard the redesign, close PR #13 without merging and continue using `main`. If the PR is merged later and causes a regression, revert the merge commit using GitHub's revert workflow and redeploy the previous known-good production deployment only with owner authorization.
