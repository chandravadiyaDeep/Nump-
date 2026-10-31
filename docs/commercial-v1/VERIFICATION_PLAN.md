# NUMPA Commercial V1 — Verification Plan

## 1. Before implementation

Record:
- Current branch and working tree state.
- Latest commit SHA.
- Existing app routes and components.
- Existing authentication entry points.
- Existing API base URL configuration.
- Existing build, lint, type-check and test commands.
- Current baseline results before changing files.

Do not overwrite uncommitted work. If Git state is unclear, stop and ask.

## 2. Phase 1 automated checks

Run the repository's existing commands, not invented substitutes:
- Frontend dependency/install integrity check where appropriate.
- Lint.
- TypeScript type check.
- Production frontend build.
- Existing API tests if backend files were touched.
- Relevant component/unit tests if present.

Do not upgrade dependencies just to silence a check. Report pre-existing failures separately from regressions.

## 3. Phase 1 UI checks

- Sidebar starts expanded on suitable desktop widths.
- Collapse/expand works and preserves active navigation.
- Collapsed icons have accessible labels/tooltips.
- Mobile drawer opens, navigates and closes correctly.
- Seven primary destinations appear in exact order.
- Active destination is visible.
- Light and dark themes render all key controls legibly.
- Theme changes do not reset active workflow state.
- Layout has no major horizontal overflow at desktop/tablet/mobile widths.
- Keyboard navigation and visible focus work.
- Loading, empty, error and disabled states are clear.
- Coming-soon destinations do not pretend to perform real operations.

## 4. Existing workflow regression checks

Use a synthetic, non-sensitive CSV:
1. Open Data Analysis.
2. Upload the CSV.
3. Confirm dataset inspection and summary render.
4. Navigate between workspace destinations and return.
5. Confirm active in-memory workflow state is retained where the current architecture supports it.
6. Confirm theme switching does not reset dataset state.
7. Confirm existing auth UI remains functional.
8. Confirm no raw data is written to localStorage or logs.

If existing behaviour requires a re-upload after navigation or refresh, document it; do not silently invent persistence.

## 5. Protected service checks

For Phase 1, verify no changes were made to:
- Supabase schema, RLS, auth providers, redirect settings or credentials.
- Render service configuration, env vars, CORS or endpoint contracts.
- Vercel project/domain/build settings or environment variables.

If a preview environment is available, verify the actual deployed preview. Do not use production as the first test target for a high-impact UI rewrite.

## 6. Diff review

Before PR:
- Inspect all changed files.
- Confirm no secrets, datasets, build artifacts or local env files.
- Confirm no unrelated refactors.
- Confirm no database migration or hosting config changes.
- Confirm no endpoint contract changes.
- Confirm tests were actually run and report exact results.

## 7. Release gates

Do not merge or deploy until:
- Phase 1 acceptance criteria pass.
- The owner has reviewed the preview/PR.
- Production safety contract is satisfied.
- Rollback path is documented.
- The exact commit has passing relevant CI.
