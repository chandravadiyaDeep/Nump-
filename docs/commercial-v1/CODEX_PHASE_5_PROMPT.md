# Codex Execution Prompt — NUMPA Commercial V1, Phase 5 Only

Copy this complete prompt into Codex only after Phase 4 has been implemented, reviewed and accepted.

---

You are working in the existing NUMPA repository. Your task is to implement **NUMPA Commercial V1 — Phase 5: Analysis History and Settings**.

Build on the accepted Phase 1 workspace shell, Phase 2 analysis/cleaning workflow, Phase 3 visualization workspace and Phase 4 ML Readiness/ML Lab workspaces. This phase adds supporting account, preference and history experiences. Preserve the existing production application and privacy-first data lifecycle.

## Read these files first, completely

1. `PRODUCTION_SAFETY.md`
2. `docs/commercial-v1/README.md`
3. `docs/commercial-v1/PRODUCT_REQUIREMENTS.md`
4. `docs/commercial-v1/WORKSPACE_UX.md`
5. `docs/commercial-v1/WORKFLOW_AND_DATA_LIFECYCLE.md`
6. `docs/commercial-v1/SAFETY_AND_ARCHITECTURE.md`
7. `docs/commercial-v1/IMPLEMENTATION_ROADMAP.md`
8. `docs/commercial-v1/VERIFICATION_PLAN.md`
9. `docs/commercial-v1/INTEGRATIONS.md`
10. `docs/commercial-v1/CODEX_PHASE_1_PROMPT.md`
11. `docs/commercial-v1/CODEX_PHASE_2_PROMPT.md`
12. `docs/commercial-v1/CODEX_PHASE_3_PROMPT.md`
13. `docs/commercial-v1/CODEX_PHASE_4_PROMPT.md`

## Phase 4 prerequisite gate — mandatory

Before coding:

1. Inspect Git branch, working tree, recent commits and pull requests.
2. Identify the accepted Phase 4 implementation commit and review its diff and test results.
3. Confirm Phase 1–4 are present and working, including ML Readiness and ML Lab.
4. Confirm the existing authentication and active dataset workflow still work.
5. Run baseline lint, type-check, tests and production build before changes.
6. If Phase 4 is not merged/accepted, any earlier phase is incomplete, or baseline checks fail, STOP and report. Do not begin Phase 5.
7. Do not discard, overwrite or reset uncommitted user work.

Create a focused feature branch from the latest accepted `main`, for example `feature/commercial-v1-phase-5-history-settings`. Inspect any existing branch before reuse. Never work directly on `main`, force-push or merge automatically.

## Mission

Deliver two supporting workspaces:

- **Analysis History:** a privacy-conscious way to view prior analysis records and reports, without retaining raw datasets by default.
- **Settings:** a reliable place for account information, appearance, preferences, usage/plan information, privacy controls and the future Integrations subsection.

Do not show fabricated history, fake usage figures, fake subscription status or controls that do not perform their advertised actions.

## A. Analysis History — persistence gate first

Before implementation, inspect the repository and Supabase project integration to establish whether an already-approved metadata-only history schema and RLS policies exist.

### Mandatory database approval boundary

- Do not create, alter, delete or migrate Supabase tables, columns, indexes, policies, triggers, functions or storage buckets in this phase without separate, explicit approval from the repository owner for the exact proposed migration.
- Do not assume that connecting the GitHub repository to Supabase authorizes schema changes.
- Do not run SQL, apply migrations, modify production data or change RLS as part of this prompt.
- Do not store raw dataset files, raw rows, credentials, access tokens or full sensitive column values in history.
- If no suitable approved schema exists, STOP all history-persistence work and report the smallest proposed additive schema/RLS design for owner review. You may continue with safe, non-persistent Settings work and a truthful History unavailable/empty-state experience, but do not simulate saved history using fake records or silently use browser storage as a substitute.
- If an approved schema exists, inspect its actual columns, constraints, ownership model and RLS policies. Use only fields and operations explicitly supported by that schema. If policy safety cannot be established, stop history integration and report.

### History record behaviour

Where approved persistence exists:

- Save a history record only after a user-triggered, successfully completed workflow action; do not save failed or partial work as completed.
- Store metadata and report references only. Raw datasets remain temporary by default.
- A record may include, if the approved schema supports it: timestamp, dataset display label, file type, row/column counts, workflow stages completed, selected source/cleaned version, ML task, readiness result summary, ML Lab comparison summary, processing/version metadata and safe report references.
- Minimize personal and dataset-identifying information. Do not store full paths, local machine paths, raw cell values, credentials or unnecessary user-entered text.
- Scope every query and mutation to the authenticated user using the existing safe auth/session pattern and enforce ownership through existing RLS. Never rely on frontend filtering as the only authorization boundary.
- Provide pagination or a safe bounded result limit if the schema/API supports it.
- Show the real date, dataset label and saved stages based on returned records.
- A history item must not imply the original dataset can be reopened when it was not stored.
- If a report reference exists, verify ownership and availability before offering it.
- Provide delete capability only if the approved schema and RLS explicitly support safe per-user deletion. Confirm before deletion and never offer bulk destructive actions without explicit user confirmation.
- Handle loading, empty, unavailable, permission, network and partial-record states honestly.
- Do not invent history entries or fabricate score values.

### History record creation

- Inspect existing workflow completion points and existing persistence contracts.
- Avoid adding new backend routes or changing API contracts.
- If saving requires a new database schema, backend endpoint, service role access or policy change, STOP and request approval. Do not build a workaround.
- Avoid duplicate records on retries or repeated renders. Use an existing idempotency mechanism only if one already exists and is verified.
- Clearly communicate when history is unavailable or not yet enabled.

## B. Settings workspace

Inspect the existing Supabase auth client, session model, user metadata and current theme/preferences implementation. Preserve them.

Implement only settings backed by real existing capabilities:

### Account and profile

- Show authenticated account information using fields actually available from the current session/profile.
- Do not expose internal identifiers unnecessarily.
- Do not invent editable profile fields.
- Do not modify email, password, OAuth provider or account deletion flows unless an existing safe, tested flow already exists.
- Do not change Supabase auth configuration, callbacks, email confirmation or redirect URLs.

### Appearance

- Provide light/dark theme selection consistent with the Phase 1 theme system.
- Keep light as the default for users without a saved preference.
- Persist the theme using the existing safe preference mechanism if present. If none exists, use a minimal client-side preference mechanism for the theme only.
- Never store dataset contents or sensitive account information in localStorage.
- Ensure theme changes do not clear active dataset state or disrupt navigation.

### Preferences

- Show and save only preferences that have a real implementation and safe persistence mechanism.
- Do not add inert toggles, fake notification settings or controls that claim to change processing behaviour without a working implementation.
- If a preference needs a new database table or schema change, defer it and report the required approval.

### Usage and plan

- Display usage or plan details only if they are returned by a real existing source and are accurate.
- Do not invent quotas, usage counts, plan names, subscription state, billing dates or upgrade eligibility.
- If billing/usage metering is not implemented, show a clear “not available yet” explanation rather than fabricated values.
- Do not add payments, subscriptions or billing in this phase.

### Privacy and data controls

- Explain current data handling accurately: raw datasets are temporary by default and are not included in history unless a separately approved product decision changes this.
- Provide data deletion/export controls only where a real, tested operation exists.
- Do not claim that data is deleted from systems if no such operation is implemented.
- Do not introduce raw dataset persistence or cloud storage.
- Do not add a consent banner that implies unsupported tracking or data collection.

### Integrations subsection

- Integrations remains inside Settings, not a new primary navigation item.
- Preserve the existing integration roadmap/catalogue if present.
- Display planned integrations as clearly labelled planned/not connected, not as live connections.
- Do not add OAuth connections, API key issuance, webhooks, Zapier, Make, n8n, Google Drive or GitHub live integration flows in Phase 5.
- Do not show a “Connected” state unless a real connection is verified.

### Help and support

- Link only to existing, verified help/support destinations.
- Do not invent support email addresses, documentation URLs or response-time promises.

## C. UX and accessibility

- Preserve the exact seven-item primary navigation order and Phase 1 shell.
- Analysis History and Settings must feel like native workspaces.
- Keep Integrations nested under Settings.
- Support desktop, tablet and mobile layouts.
- Support light and dark themes.
- Use accessible labels, semantic headings, visible focus, keyboard navigation and readable contrast.
- Provide clear loading, empty, error, unavailable and success states.
- Confirm destructive actions such as deleting an individual history record.
- Do not show fake records, fake account data, decorative controls or misleading connection badges.
- Do not break active dataset context when navigating to History or Settings and back.

## Protected services — do not modify

### Supabase

Do not change project URL, keys, auth providers, email confirmation, callbacks, redirect URLs, client initialization, database schema, tables, RLS, policies, triggers, functions, migrations or storage settings. No schema changes are authorized by this prompt. Preserve existing authentication behaviour.

### Render

Do not change service configuration, environment variables, CORS, health check, build/start commands, runtime, deployment settings, API base URL or endpoint contracts. Do not add backend routes or dependencies.

### Vercel

Do not change project settings, production domain, production branch, build settings or environment variables.

### Existing API

Use the existing configured `NEXT_PUBLIC_NUMPA_API_URL`. Preserve all existing request/response contracts. Do not hardcode a new API URL or silently alter schemas, routes, limits or response semantics.

## Technical constraints

- Inspect current components, session handling, database access patterns, types and tests before editing.
- Reuse existing Supabase client/session patterns; do not create a second auth client.
- Never expose service-role keys or privileged database access in browser code.
- Validate data returned from external/API/database boundaries.
- Keep user ownership enforced server-side through existing RLS.
- Do not add dependencies, new backend services, new endpoints or broad refactors without stopping for approval.
- Add comments for non-obvious privacy, ownership, retention or state-transition logic.
- Avoid `any` unless narrowly justified at an external boundary and validated immediately.
- Never log raw data, credentials, tokens or sensitive values.
- Preserve all accepted Phase 1–4 functionality.
- Keep changes small, reversible and isolated.

## Explicitly out of scope

Do NOT implement:

- Any Supabase schema, table, column, index, RLS, policy, trigger, function, migration or storage change without separate explicit approval.
- Raw dataset or raw-row persistence.
- Cloud object storage or dataset reopening from history.
- Billing, payments, subscriptions or plan enforcement.
- Live third-party integrations, OAuth connections, API keys, webhooks or automation connectors.
- New backend endpoints or API contract changes.
- Changes to scoring formulas, ML algorithms or visualization engine.
- Changes to Supabase authentication configuration.
- Render/Vercel infrastructure changes.
- SEO/blog/CMS features.
- Broad dependency upgrades or unrelated refactors.

## Required verification

Follow `docs/commercial-v1/VERIFICATION_PLAN.md` and add History/Settings-specific tests.

At minimum:

1. Run frontend lint, type-check and production build.
2. Run relevant existing backend/API tests if backend files were touched; ideally do not touch backend code.
3. Verify authenticated and unauthenticated navigation states.
4. If history persistence is integrated using an existing approved schema, verify user A cannot read, update or delete user B's records; test against the actual RLS boundary without weakening it.
5. Verify history contains metadata/report references only and no raw dataset bytes or rows.
6. Verify failed workflow actions do not create completed history records.
7. Verify empty, loading, unavailable, permission and network error states.
8. Verify pagination/limits and duplicate-submit behaviour where implemented.
9. Verify individual history deletion only if safely supported, including confirmation and ownership checks.
10. Verify no fake history, usage, plan, billing or integration states appear.
11. Verify theme preference works and does not clear active dataset state.
12. Verify Settings controls only claim capabilities that actually work.
13. Verify mobile, keyboard navigation, focus, contrast and screen-reader labels.
14. Verify Phase 1–4 workflows remain intact, including auth, upload, cleaning, visualization, readiness and ML Lab.
15. Inspect the diff for secrets, raw data, unrelated changes, protected configuration edits and API contract changes.
16. Report tests not run and why. Never claim a test, migration, deployment or production verification succeeded without evidence.

Use synthetic, non-sensitive test fixtures only.

## Definition of done

- Settings is a useful, truthful workspace using only existing verified capabilities.
- Theme selection works without disrupting the active workflow.
- History displays real metadata records only when a safe, already-approved persistence path exists.
- If no approved schema exists, history persistence is not implemented; the UI clearly explains that it is not enabled and the report contains a proposed schema/RLS design for separate approval.
- Raw datasets remain temporary by default and are never stored in history.
- No fake usage, plan, billing or integration statuses are shown.
- Phase 1–4 functionality remains intact.
- No Supabase schema/auth, Render, Vercel, database, storage or API contract changes are made under this prompt.
- Relevant automated checks and manual smoke tests pass.
- Work is on a focused feature branch and ready for owner review in a PR.
- Do not merge to main or deploy to production automatically.

## Final report format

Report:

1. Phase 4 prerequisite evidence and accepted base commit.
2. Feature branch and commit SHA(s).
3. Files created/changed.
4. Analysis History implementation status and exact persistence source, if any.
5. Confirmation that no unapproved schema/RLS/migration changes were made.
6. Settings sections implemented and the real data source behind each.
7. Theme preference persistence behaviour.
8. Privacy and raw-data handling safeguards.
9. Tests/checks run with exact results.
10. Tests not run and why.
11. Confirmation that Supabase auth/schema, Render, Vercel and API contracts were not changed.
12. PR/preview URL if one exists.
13. Known limitations and any separately proposed schema/RLS design requiring approval.
14. Rollback instructions.

If safe History persistence requires a schema change, stop that portion and provide a separate approval proposal containing exact tables/columns, ownership/RLS policies, retention/deletion rules, backup requirement, rollback plan and why the change is needed. Do not apply the migration.

---

End of Codex prompt.
