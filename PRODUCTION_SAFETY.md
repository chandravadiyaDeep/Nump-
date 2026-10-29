# NUMPA PRODUCTION SAFETY CONTRACT
Version: 1.0
Status: Mandatory project rules
Applies to: every developer, Codex session, ChatGPT session, Claude session, agent, contributor, script, and deployment workflow.

## 0. Prime directive
NUMPA's currently working production application is the baseline. Do not break production in pursuit of a feature, refactor, cleanup, dependency update, or deployment improvement. Prefer the smallest reversible change. A working deployment is more valuable than an untested improvement.

## 1. Protected production services
Treat these as protected resources:
- Supabase project, authentication, database schema, data, Row Level Security (RLS), policies, triggers, functions, storage settings, redirect URLs, and production environment variables.
- Render service `numpa-api`, its service settings, health-check path, environment variables, deployment configuration, and API URL.
- Vercel production project, production domain(s), production environment variables, production branch, build settings, and the live application.
- API contracts consumed by the frontend and any existing user data.
Never delete, recreate, reset, migrate destructively, rename, rotate, or replace any of these without an explicit, specific approval from the repository owner for that exact operation.

## 2. Required change workflow
Before changing anything:
1. Read this contract completely.
2. Inspect the relevant code, configuration, tests, current Git state, and the production behavior.
3. Identify affected services, API contracts, environment variables, database objects, and rollback path.
4. State the intended change and risks in the pull request/commit description or task notes.
5. Make the smallest change that solves the issue.
6. Add or update tests where feasible.
7. Run available lint, type-check, unit, integration, and build checks relevant to the change.
8. Review the complete diff for unrelated or destructive changes.
9. Deploy only after checks pass. Prefer a preview/staging deployment first when available.
10. Verify the real user workflow after deployment; a successful build alone is not proof of working behavior.

## 3. Database and Supabase guardrails
- Do not run destructive SQL in production: DROP, TRUNCATE, broad DELETE, destructive ALTER, project reset, or replacement schema.
- Do not disable RLS or weaken existing policies to make a feature work.
- Do not expose service-role keys, database passwords, private API keys, or secrets in source control, client-side code, logs, screenshots, or prompts.
- Do not change auth providers, email confirmation, OAuth settings, production Site URL, redirect URLs, schema, migrations, policies, or table definitions without documenting the impact and receiving explicit approval.
- Use additive, backward-compatible migrations wherever possible. Prefer expand → migrate → contract. Do not remove columns/tables or change semantics until code and data compatibility are verified and explicit approval is granted.
- Do not put raw client datasets in Supabase or other storage unless that is an explicitly approved product decision.
- Before any approved migration, ensure a verified backup/export and a rollback/recovery plan exist. A migration that cannot be safely reversed must be flagged and approved before execution.

## 4. Render and Python API guardrails
- Keep the existing Python/FastAPI processing engine unless the owner explicitly changes this decision.
- Preserve the existing health endpoint: GET /api/v1/health.
- Preserve the deployed API base URL: https://numpa-api.onrender.com.
- Preserve existing endpoint paths and request/response contracts unless a coordinated backward-compatible change is approved:
  - POST /api/v1/datasets/inspect
  - POST /api/v1/cleaning/preview
  - POST /api/v1/cleaning/execute
  - POST /api/v1/ml-readiness/score
  - POST /api/v1/ml-labs/compare
- Keep production CORS origins working for https://numpa.online, https://www.numpa.online, https://numpa.vercel.app and the current project's Vercel preview deployment hostname pattern. Do not replace a permissive required origin list with localhost-only defaults.
- Do not change Render root directory, build/start commands, health-check path, runtime, plan, or environment variables without explicit approval.
- After API/CORS changes, verify the API health endpoint and a real browser-origin POST request. Health check 200 alone does not prove CORS works.
- Do not log uploaded file contents, credentials, tokens, or sensitive customer data. Preserve in-memory processing and avoid intentional raw-file persistence.

## 5. Vercel and frontend guardrails
- Keep the production site/domain and existing Supabase configuration working.
- NEXT_PUBLIC_NUMPA_API_URL must point to https://numpa-api.onrender.com in the appropriate production environment.
- Remember NEXT_PUBLIC_* variables are bundled into the client at build time; changing a value requires a new deployment.
- Do not point production traffic to a preview deployment or preview-only API configuration.
- Do not change the production branch or build/root-directory settings without approval.
- Preview deployment hostnames may differ from production. CORS must be configured deliberately and narrowly; never solve CORS by allowing every origin (`*`) without a security review.

## 6. Git and repository rules
- The canonical production branch is `main`.
- Keep changes focused and reviewable. Do not force-push, rewrite main history, delete branches, or overwrite unrelated changes.
- Never commit secrets, local environment files, real customer datasets, generated credentials, or database dumps.
- Do not perform broad dependency upgrades or automatic codebase-wide rewrites without a specific reason and validation.
- If the repository owner asks for a direct commit to main, make only a low-risk, narrowly scoped change after inspecting the diff. For higher-risk work, propose a branch/PR first and explain why.

## 7. Required verification checklist
For changes that touch frontend/API/deployment, verify as applicable:
- [ ] Production website loads at https://numpa.online.
- [ ] GET https://numpa-api.onrender.com/api/v1/health returns the expected healthy JSON.
- [ ] From the actual deployed website origin, the API response includes the correct Access-Control-Allow-Origin header.
- [ ] Dataset inspection succeeds with a non-sensitive sample CSV.
- [ ] Cleaning preview succeeds and leaves the original upload unchanged.
- [ ] Cleaning export downloads a valid CSV.
- [ ] ML readiness scoring succeeds for the selected task and target.
- [ ] Authentication and basic account flow still work if auth-related code/settings changed.
- [ ] No unexpected database mutations, console errors, failed network requests, or new production warnings.
- [ ] Deployment uses the intended commit from main and reports Ready/Live.
A green build or health check is not a substitute for end-to-end verification.

## 8. Rollback and incident rules
- If a deployment breaks production, stop unrelated work and restore the last known-good deployment/commit using the platform's safe rollback procedure.
- Do not attempt multiple speculative fixes or destructive changes during an incident.
- Capture the exact browser console/network error, service logs, deployment commit, and relevant config (with secrets hidden) before changing anything.
- Prefer reverting the smallest bad commit over adding layers of workarounds.
- Verify the user-facing workflow after rollback.
- Never claim something is fixed until it has been tested in the live environment.

## 9. Rules for other LLMs and coding agents
Before any code or configuration task, every LLM/agent must:
1. Read `PRODUCTION_SAFETY.md` and any relevant architecture/product contract.
2. Treat the protected services and settings above as read-only unless the task explicitly authorizes a specific change.
3. Never infer permission to modify/delete production data from a general request to "fix", "clean up", "refactor", or "make it work".
4. Ask for explicit approval before destructive database, authentication, infrastructure, domain, secrets, or production configuration changes.
5. Report files changed, tests run, deployment actions taken, known risks, and rollback instructions.
6. Never claim to have run tests, deployed, or verified production unless the tool evidence confirms it.

## 10. Change approval template
For any high-risk operation, stop and request approval with:
- What exact resource or data will change?
- Why is it necessary?
- What could break?
- What backup exists and has it been verified?
- What is the rollback plan?
- Is this production or preview/staging?
Proceed only after explicit approval for the described operation.

## 11. Product decision snapshot
- NUMPA uses Python/FastAPI for dataset processing.
- Supabase is used for authentication, profiles, feedback, and approved metadata; do not store raw datasets there by default.
- Render hosts the Python API.
- Vercel hosts the Next.js website.
- The core workflow is upload → inspect → ML readiness assessment → user-reviewed cleaning → before/after assessment → export.
- Scores are explainable heuristics, not guarantees of model performance.
- Privacy and stability take priority over unverified features.
