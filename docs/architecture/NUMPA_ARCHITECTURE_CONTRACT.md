# NUMPA Architecture Contract

**Status:** Target architecture and mandatory design rules  
**Implementation approach:** Incremental, non-disruptive  
**Production baseline:** Current working `main` branch and deployed Vercel, Render and Supabase services.

## 1. Architectural goal

NUMPA is a services-first data workflow platform with supporting education, publishing, resources and community discovery. It must support independent contributors and future modules without turning the current working product into a risky rewrite.

The architecture separates:

1. Core domain logic — correctness-sensitive data and ML behavior.
2. Application orchestration — workflows that coordinate core capabilities.
3. Adapters/infrastructure — HTTP, hosting, authentication and external providers.
4. Presentation — user interface and content rendering.
5. Discovery/content — public pages, learning material and resource catalogs.
6. Extensions — optional capabilities that connect through documented interfaces.

## 2. Current runtime baseline

The repository currently contains:

- `apps/web`: Next.js/React/TypeScript frontend.
- `apps/api`: Python/FastAPI backend and data processing.
- Supabase: authentication/session integration and approved account metadata.
- Render: hosted Python API.
- Vercel: hosted web application.
- GitHub Actions: automated API tests and web build.

Do not assume a target directory structure already exists. Inspect the actual repository before moving files or introducing packages.

## 3. Target logical boundaries

### Core domain

Owns deterministic business rules and data transformations:

- ingestion and format validation
- dataset profiling and analysis
- cleaning planning, preview, execution and audit
- visualization-ready data summaries
- ML readiness assessment
- ML Lab evaluation and metrics

Core logic should be testable without a browser, hosting provider or live external service wherever practical.

### Application layer

Coordinates use cases and workflow steps. It may call core domain functions and ports, but must not duplicate domain rules.

### Adapters and infrastructure

Implements external details such as FastAPI routes, file upload handling, Supabase session integration, external connectors and hosting configuration. Adapters translate external requests into application inputs and outputs.

### Presentation layer

Contains workspace shell, pages, reusable UI, navigation, themes, forms and visualizations. It consumes public application/API contracts and must not reimplement authoritative cleaning or readiness calculations.

### Content and discovery layer

Contains service discovery pages, blog posts, tutorials, research, datasets catalogues, cheat sheets, learning roadmaps and useful-tool listings. Content pages must be useful, accessible, indexable where intended and honest about available product capabilities.

### Extension layer

Contains optional connectors and independent modules. Extensions integrate through documented interfaces and must not reach into private implementation details of core modules.

## 4. Dependency direction

Preferred dependency direction:

```text
Presentation / Public Content
          |
          v
Application Use Cases
          |
          v
Core Domain Logic
          ^
          |
Ports / Contracts
          ^
          |
Infrastructure Adapters implement ports
```

Rules:

- Core domain code must not depend on React, Next.js, FastAPI request objects, Supabase SDKs, Render or Vercel.
- Presentation must not calculate authoritative readiness scores or cleaning results itself.
- API route handlers validate/translate requests and delegate; they should not become a second domain engine.
- External provider SDKs stay behind adapters.
- Shared contracts must be explicit, typed, versioned where appropriate and tested.
- Avoid circular imports and hidden cross-module state.
- Do not create a generic abstraction until at least one real use case needs it.

## 5. API and data contracts

Existing production endpoint contracts are compatibility boundaries:

- `GET /api/v1/health`
- `POST /api/v1/datasets/inspect`
- `POST /api/v1/cleaning/preview`
- `POST /api/v1/cleaning/execute`
- `POST /api/v1/ml-readiness/score`
- `POST /api/v1/ml-labs/compare`

Any change must be checked against the actual route and schema implementation, public API reference and frontend callers. Additive changes are preferred. Breaking changes require a new version or coordinated migration and explicit approval under the Core Protection Contract.

Do not treat CORS as authentication. Do not claim public API access is protected until server-side authentication and authorization exist.

## 6. Data lifecycle and privacy

- Source uploads are temporary inputs.
- Processing is in memory by default.
- Cleaning creates a separate result; it never mutates the original upload.
- Do not persist raw datasets or their contents by default.
- Persisting analysis metadata/history requires an explicit product decision, schema/RLS design, retention rules and approval.
- Logs and telemetry must avoid raw data, secrets and sensitive user content.
- Any new external connector must request minimum scopes and explain data transfer and retention.

## 7. Extension contracts

A new extension should declare:

- Purpose and owner/maintainer.
- Public input/output types.
- Required permissions and external scopes.
- Data it reads, writes or transmits.
- Failure behavior, timeout and retry policy.
- Tests and compatibility guarantees.
- Whether it is optional and what happens when disabled.

Extensions must fail safely and must not make the core workflow unavailable when an optional provider is down.

## 8. Repository organization strategy

The intended logical organization may eventually include:

- `apps/` for deployable applications.
- `packages/` for shared contracts, UI and configuration.
- `core/` for domain logic.
- `platform/` for security and infrastructure adapters.
- `content/` for public educational and editorial content.
- `growth/` for SEO/AEO/GEO research and publishing operations.
- `docs/` for contracts, product, contribution and operations documentation.
- `tests/` for cross-module regression and contract tests.

This is a target map, not an instruction to relocate current files immediately. Before moving any file, map imports, tests, deployment roots, build configuration and ownership. Prefer small moves with compatibility shims and CI verification.

## 9. Configuration and environment

- Configuration is explicit and validated at application startup.
- Secrets remain in approved secret stores/environment settings, never in source code.
- Public client configuration is limited to values designed to be public.
- Local, preview and production settings must remain distinct.
- No contributor may silently change production environment values.

## 10. Observability and failure behavior

- Return actionable, non-sensitive errors.
- Do not swallow errors that affect correctness.
- Optional integrations should show a clear unavailable/degraded state.
- Add structured operational logs without uploaded data, credentials or tokens.
- Define health checks around actual service readiness, not merely process startup.

## 11. Architecture change process

Before a structural refactor:

1. Document current state and desired state.
2. Identify all import, runtime, test and deployment dependencies.
3. Define compatibility boundaries.
4. Create a migration plan with small reversible steps.
5. Add tests before moving core logic.
6. Migrate one bounded module at a time.
7. Compare outputs against the pre-refactor behavior using deterministic fixtures.
8. Keep production deployment settings unchanged unless separately approved.

The architecture is successful when contributors can add new capabilities independently while the core engine remains stable, testable and predictable.
