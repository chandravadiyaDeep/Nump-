# Codex Execution Prompt — NUMPA Commercial V1, Phase 1 Only

Copy the complete prompt below into Codex. This prompt authorizes Phase 1 only.

---

You are working in the existing NUMPA repository. Your task is to implement **NUMPA Commercial V1 — Phase 1: Commercial Workspace Foundation**.

## Read these files first, completely

1. `PRODUCTION_SAFETY.md`
2. `docs/commercial-v1/README.md`
3. `docs/commercial-v1/SAFETY_AND_ARCHITECTURE.md`
4. `docs/commercial-v1/PRODUCT_REQUIREMENTS.md`
5. `docs/commercial-v1/WORKSPACE_UX.md`
6. `docs/commercial-v1/WORKFLOW_AND_DATA_LIFECYCLE.md`
7. `docs/commercial-v1/IMPLEMENTATION_ROADMAP.md`
8. `docs/commercial-v1/VERIFICATION_PLAN.md`

These documents are the product and engineering requirements. The repository-root `PRODUCTION_SAFETY.md` is mandatory and authoritative.

## Mission

Build the new NUMPA application shell:
- Collapsible left sidebar on desktop.
- Icon-only collapsed state with accessible tooltips/labels.
- Mobile navigation drawer.
- Right-side workspace with a consistent top bar and content area.
- Both light and dark themes.
- Light theme as the initial default.
- Exact primary navigation order:
  1. Data Analysis
  2. Data Preprocessing / Cleaning
  3. Data Visualization
  4. ML Readiness
  5. ML Lab
  6. Analysis History
  7. Settings
- Integrations belongs inside Settings, not as an eighth primary item.
- Keep the existing working Data Analysis upload/inspection experience functional inside the new shell.
- Other destinations may have honest, polished "Coming soon" or planned states until their dedicated phase. Never show fake results or fake connected integrations.

## Mandatory inspect-first workflow

Before editing:
1. Inspect the current Git branch, working tree and latest commit. Do not overwrite or discard uncommitted user work.
2. Read the actual current app implementation, global styles, layout, routes, auth navigation, Supabase client and package scripts.
3. Inspect existing API call logic and identify the exact state/handlers used by dataset upload and inspection.
4. Run the existing relevant baseline checks before changes if possible.
5. Compare the real repository with the product documents. If there is a material mismatch, stop and report it rather than inventing a new architecture.

Use a focused feature branch, not `main`. Suggested name: `feature/commercial-v1-workspace-shell`. If the branch already exists, inspect it before using it. Never force-push.

## Protected services — do not modify

### Supabase
Do not change project URL, keys, auth providers, email confirmation, callbacks, redirect URLs, client initialization, database schema, tables, RLS, policies, triggers, functions or migrations. Do not add tables. Preserve existing sign-in/session/sign-out behaviour.

### Render
Do not change service configuration, environment variables, CORS, health check, build/start commands, runtime, deployment settings, API base URL or endpoint contracts. Do not add backend routes or dependencies for this phase.

### Vercel
Do not change project settings, production domain, production branch, build settings or environment variables. Do not modify hosting configuration.

### Existing API
Continue to use the existing configured `NEXT_PUBLIC_NUMPA_API_URL` and preserve current request/response behaviour for:
- `GET /api/v1/health`
- `POST /api/v1/datasets/inspect`
- `POST /api/v1/cleaning/preview`
- `POST /api/v1/cleaning/execute`
- `POST /api/v1/ml-readiness/score`
- `POST /api/v1/ml-labs/compare`

Do not hardcode a new API URL or rewrite the backend integration.

## Implementation guidance

- Prefer small, reusable components: application shell, sidebar, navigation item, top bar, theme control and mobile drawer.
- Reuse the existing stack and dependencies. Do not introduce a new UI framework or global state library without a concrete need and owner approval.
- Refactor the existing page carefully. Preserve the working upload/inspection logic, request handlers, validation, response parsing and auth component.
- Keep the active dataset/workflow state intact when switching navigation sections within the same active session where the current architecture permits.
- Do not store uploaded file bytes, raw rows, tokens or secrets in localStorage.
- Theme preference may be stored locally using a safe minimal preference value only. Theme switching must not reset the active dataset state.
- Keep the original upload immutable.
- Make navigation keyboard accessible; provide accessible names and focus states.
- Ensure mobile drawer closes after navigation and supports escape/appropriate focus behaviour.
- Use semantic design tokens for both themes.
- Use existing icon packages if already installed. Do not add dependencies without justification.
- Add comments to code where they clarify non-obvious logic and state transitions.
- Do not implement future phase features merely because their navigation entries exist.

## Explicitly out of scope

Do NOT implement:
- New Supabase tables, migrations, RLS or auth changes.
- Raw dataset persistence or cloud storage.
- Analysis History persistence.
- New API endpoints or API contract changes.
- Render or Vercel settings changes.
- Public API keys, webhooks or live third-party integrations.
- Zapier, Make, n8n, Google Drive or GitHub connections.
- Billing, subscriptions or payment gateway.
- New ML algorithms, model training or new visualization engine.
- SEO/blog/CMS work.
- Broad dependency upgrades or unrelated refactors.

## Required tests and verification

Follow `docs/commercial-v1/VERIFICATION_PLAN.md`. At minimum:
1. Run existing frontend lint/type-check/build commands.
2. Run relevant existing API tests if backend files were changed; ideally do not change backend files at all.
3. Verify sidebar expanded/collapsed and mobile drawer.
4. Verify all seven navigation items and exact order.
5. Verify light and dark themes.
6. Verify theme switching does not reset current workflow state.
7. Upload and inspect a synthetic, non-sensitive CSV using the existing workflow.
8. Verify the existing Supabase auth UI/session/sign-out path has not been broken. Do not change auth configuration.
9. Inspect the final diff for secrets, unrelated changes, endpoint changes and protected config changes.
10. Report any test you could not run. Never claim a test or deployment succeeded without evidence.

## Definition of done

- The new shell is implemented and responsive.
- Both themes work; light is the default.
- Navigation order matches the product specification.
- Existing Data Analysis upload/inspection works.
- Existing authentication integration is preserved.
- No Supabase, Render or Vercel configuration/schema changes.
- No API contract changes.
- Relevant checks pass.
- Changes are on a feature branch and ready for owner review via pull request; do not merge to main or deploy to production automatically.

## Final report format

When finished, report:
1. Branch name and commit SHA(s).
2. Files created/changed.
3. What was implemented.
4. Existing workflows preserved.
5. Tests/checks run with exact pass/fail results.
6. Any tests not run and why.
7. Confirmation that Supabase, Render, Vercel and API contracts were not changed.
8. Preview/PR URL if one exists.
9. Known limitations.
10. Rollback instructions.

If any task requires a protected change, stop and ask for explicit approval. Do not continue by guessing.

---

End of Codex prompt.
