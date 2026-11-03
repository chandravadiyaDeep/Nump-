# NUMPA Core Protection Contract

**Status:** Mandatory engineering contract  
**Applies to:** Employees, contractors, open-source contributors, Codex, Claude, Antigravity, autonomous agents, CI jobs and deployment workflows.  
**Canonical production branch:** `main`  
**Parent safety contract:** [PRODUCTION_SAFETY.md](../../PRODUCTION_SAFETY.md)

## 1. Purpose

NUMPA must be easy to extend without making its essential product behavior fragile. Contributors should be able to make routine improvements independently. The rules in this document protect the business logic and production boundaries; they are not a requirement to ask the owner about every ordinary implementation choice.

This contract supplements and does not weaken `PRODUCTION_SAFETY.md`. If documents conflict, the stricter production-safety rule wins.

## 2. Protected core

The following behavior is core product logic and must remain correct, explainable and backward-compatible:

- Dataset ingestion, format validation, limits, parsing and in-memory lifecycle.
- Dataset inspection, profiling, statistics and validation.
- Cleaning recommendations, preview, execution, audit reporting and export.
- ML Readiness task-specific scoring, dimensions, thresholds, caveats and deterministic behavior.
- ML Lab model selection, preprocessing, split/validation strategy, leakage prevention and metrics.
- Shared workflow state and source-versus-cleaned dataset semantics.
- API endpoint paths, input/output schemas, status codes and error semantics used by clients.
- Authentication/session behavior, authorization boundaries, privacy controls and secret handling.
- Existing production deployment assumptions and service connectivity.

The exact implementation may be improved. The observable behavior and safety guarantees must not be silently changed.

## 3. Invariants that every change must preserve

1. Uploaded source data is not silently overwritten by cleaning.
2. Raw dataset rows/files are not persisted by default; processing remains in memory unless a separately approved product decision changes this.
3. Cleaning is user-reviewed and produces a separate output.
4. Readiness scores remain deterministic, explainable heuristics, not guarantees of model performance.
5. Scoring is task-aware. AI suggestions must not silently modify deterministic scoring rules.
6. Model evaluation must avoid data leakage; preprocessing is fitted only within the appropriate training/validation pipeline.
7. Existing API consumers continue to work. Breaking changes require versioning or an approved migration path.
8. Errors and unsupported capabilities are represented honestly; no fake records, connected integrations, usage numbers or billing states.
9. Secrets, access tokens and customer data never enter source control, test fixtures, logs or documentation examples.
10. A green build is not proof of end-to-end production behavior.

## 4. Change classification

### Green — independent contributor work

No owner approval is required for routine changes that stay within established interfaces:

- UI layout, styling, accessibility and responsive behavior.
- New isolated presentational components and non-core pages.
- Copy, help text, tutorials, blog content and documentation.
- SEO metadata, canonical tags, sitemap/robots content and structured data, provided claims are accurate.
- New tests, test fixtures using synthetic data, developer tooling and non-production scripts.
- New independent modules that consume existing contracts without modifying them.
- Bug fixes that preserve documented behavior and pass relevant regression tests.

Contributors still need to follow repository review and CI rules.

### Amber — core-adjacent work requiring technical review

A maintainer/core reviewer must review the design and tests before merge:

- Changes to ingestion, cleaning, analysis, visualization data models or ML workflows.
- Changes to shared state, data lifecycle, API client behavior or error handling.
- New dependencies that affect runtime, bundle size, security or deployment.
- New endpoints or additive API fields.
- Changes to performance limits, supported formats, model lists, metrics or score interpretation.
- New persistence of metadata, user activity or analysis history.
- Changes to shared contracts or extension interfaces.

This is a code-review gate, not a requirement to ask the owner about every implementation detail. The owner is involved only if a product or protected-resource decision is needed.

### Red — explicit repository-owner approval required

Stop and request approval for the exact operation before proceeding:

- Supabase project, production schema, migrations, RLS, policies, auth providers, redirects, keys or secrets.
- Render production settings, environment variables, runtime, start/build commands, health checks, API URL or CORS policy.
- Vercel production project, domains, production environment variables, build settings or production branch.
- Destructive or irreversible database/data operations.
- Secret rotation, access-policy changes, permission expansion or weakening security controls.
- Changing privacy promises or enabling raw dataset persistence.
- Breaking API contracts, changing core scoring semantics or removing supported behavior.
- Production deployment, release, merge to protected production branch or rollback when repository rules require owner control.

Approval is specific to the described resource and operation. A general request to "improve NUMPA" is not authorization for a red change.

## 5. Required tests for core changes

Select tests appropriate to the changed behavior:

- Unit tests for deterministic functions and validation.
- Contract tests for API request/response/status-code compatibility.
- Regression tests for source immutability, cleaning output, task-specific readiness and ML evaluation.
- Security tests for auth, authorization, input handling and secrets where relevant.
- Integration tests for frontend/API behavior.
- Build, lint and type checks for changed applications.
- Synthetic end-to-end smoke tests for critical user workflows.

Every bug fix should add a regression test where practical. Test data must be synthetic or explicitly approved and sanitized.

## 6. Core change review checklist

A core-adjacent PR must state:

- What user-visible behavior changes and what remains unchanged.
- Which core modules and API contracts are affected.
- How source-data immutability and in-memory processing are preserved.
- How scoring validity and leakage prevention are preserved, if ML-related.
- Tests run and their actual results.
- Migration/compatibility and rollback plan, if applicable.
- Any remaining unverified production behavior.

## 7. Extension rule

Prefer adding a new module behind a stable interface over editing a core implementation. Extensions must not import private internals from unrelated core modules. The interface owner should expose the smallest stable contract needed.

No extension may bypass authentication, data validation, usage controls, privacy guarantees or API validation.

## 8. Authority and precedence

- `PRODUCTION_SAFETY.md` remains mandatory for production services and deployment.
- This contract defines core behavior and contribution risk classes.
- `NUMPA_ARCHITECTURE_CONTRACT.md` defines module boundaries and dependency direction.
- `CONTRIBUTOR_GUIDELINES.md` defines the everyday contribution workflow.
- Product decisions and approved release notes define intended customer-facing scope.

When uncertain, preserve current behavior, create a focused issue/PR and ask for review rather than guessing.
