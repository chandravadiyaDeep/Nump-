# P0 — Core Platform & Developer Experience

**Status:** PROPOSED — UNDER REVIEW  
**Squad type:** Shared platform

## Mission
Provide secure, consistent, reusable platform foundations that let every NUMPA product squad deliver domain workflows without rebuilding identity, project context, execution infrastructure, or engineering plumbing.

## Owns
- Shared identity and access-control mechanisms, session integration, tenant/project membership primitives, and authorization enforcement infrastructure.
- Canonical project/workspace context and shared identifiers for projects, datasets, dataset versions, artifacts, jobs, and users, subject to later schema design.
- Shared artifact metadata and lifecycle substrate: registration, references, ownership metadata, retention hooks, and access enforcement. Domain meaning remains with the producing squad.
- Common execution/job substrate: job submission, status lifecycle, cancellation primitives, resource policy hooks, queue integration points, and execution isolation foundations.
- API conventions, shared error model, pagination/idempotency conventions, schema/event compatibility policy, and service-to-service authentication primitives.
- Secrets-management integration, encryption primitives, audit-event capture substrate, policy enforcement hooks, and secure configuration patterns.
- Observability foundations: structured logs, metrics, traces, health checks, alerting conventions.
- Shared developer experience: repository standards, CI templates, test harnesses, local development tooling, release automation patterns, dependency/security scanning.
- Shared notification delivery infrastructure where a common mechanism is needed.

## Does not own
- Product-specific connector behavior or source-specific credentials UX (S1).
- Analytical calculations, charts, or dashboard semantics (S2).
- Cleaning rules, transformation semantics, or quality scoring logic (S3).
- ML readiness formulas, feature engineering, experiments, or model metrics (S4).
- Prompt design, RAG behavior, AI agents, forecasting algorithms, or AI application logic (S5).
- Model-specific registry policies, rollout decisions, or drift interpretation (S6), except shared infrastructure primitives.
- User-authored workflow semantics, schedules, business reports, or governance views (S7).
- Product squad roadmaps or unilateral product decisions.

## Frontend responsibilities
- Shared application shell primitives, navigation framework, design-system foundations, accessibility primitives, common loading/error/empty states, account/session surfaces, and platform-level settings.
- Shared project selection/context controls where they are common to all workspaces.
- Reusable UI components with documented APIs; product-specific screens remain with domain squads.

## Backend and data responsibilities
- Shared identity/project/authorization services and canonical ID conventions.
- Shared metadata, artifact, job, event, and audit infrastructure.
- Platform-level migrations and compatibility tooling, only after approved schema and migration process.
- Shared storage abstraction and execution isolation interfaces; product squads decide the domain payloads and semantics of their artifacts.

## Owned concepts and records
Identity principal, membership/role primitives, project context, canonical resource identifiers, artifact registry metadata, job envelope/status, shared event envelope, platform policy, audit event envelope, platform configuration, telemetry conventions.

## Interfaces and dependencies
- Provides foundational contracts to S1–S7.
- Consumes product squads' requirements; does not dictate their domain logic.
- Works with every squad on authentication, authorization, project scoping, jobs, artifacts, events, observability, and testing.
- Stage 3 must define the exact contracts and ownership of canonical dataset/version metadata versus domain-specific metadata.

## Decision rights
May define and maintain shared engineering standards and platform implementation details within approved architecture. Must obtain cross-squad review for breaking shared contracts and product-owner approval for architecture changes, security policy changes with product impact, production migrations, or infrastructure changes.

## Deliverables
Platform capability catalogue; identity and access primitives; project/resource identity model; artifact/job/event foundations; security baseline; observability baseline; developer tooling; platform runbooks; compatibility and migration policy.

## Quality gates
Security and authorization tests; tenant/project isolation tests; contract compatibility tests; reliability and recovery tests; observability coverage; performance/resource limits; migration rollback plan; accessibility for shared UI primitives.

## Success measures
Low duplication of platform plumbing; reliable shared services; no cross-project data exposure; high contract compatibility; predictable local development and CI; reduced integration friction for product squads.

## Boundary test
If a capability is generic infrastructure needed consistently by several squads, P0 likely owns the primitive. If it expresses a domain-specific user workflow or business rule, the relevant product squad owns it.
