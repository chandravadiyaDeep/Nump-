# S7 — Workflow Automation & Governance

**Status:** PROPOSED — UNDER REVIEW  
**Primary workspaces:** Automation Studio, Reports & Governance

## Mission
Connect NUMPA capabilities into repeatable workflows and give users trustworthy visibility into execution history, lineage, approvals, reports, and governance evidence.

## Owns
- User-authored cross-domain workflows that invoke published squad operations.
- Workflow definitions, nodes/edges, input/output mappings, triggers, schedules, conditions, retries at the orchestration level, and run history.
- Integration configuration for external automation systems and outbound notifications, subject to P0 security and connector boundaries.
- Workflow templates, reusable orchestration patterns, approvals and human-in-the-loop steps.
- Cross-domain lineage presentation and navigation across datasets, transformations, analyses, experiments, AI runs, models, deployments, and reports.
- Governance workspace UX: audit exploration, approval evidence, access review views, policy status presentation, and compliance-oriented report composition.
- Formal report generation, report templates, sharing/export workflows, and scheduled report delivery.
- Cross-domain operational summaries and evidence packages assembled from authoritative artifacts/events.

## Does not own
- Shared job scheduler substrate, event transport, identity, audit-event capture mechanism, or security primitives (P0).
- Connector implementations and source-specific sync semantics (S1).
- Statistical calculations and visualization engine (S2).
- Cleaning/transform operations (S3).
- ML readiness, training, experiment semantics, and metrics (S4).
- AI agent/prompt/RAG/forecasting semantics (S5).
- Model registry, deployment policy, serving, or drift algorithms (S6).
- Authoritative domain records from other squads. S7 references and presents them; it does not copy or redefine them.

## Frontend responsibilities
Workflow canvas/editor; trigger/schedule configuration; run history; integration setup; approval queues; lineage explorer; audit and governance dashboards; report builder; export/share/scheduled delivery screens.

## Backend and data responsibilities
Workflow definition and orchestration logic; cross-domain operation invocation through contracts; trigger evaluation; schedule definitions; workflow state and retries; report composition from versioned artifacts; lineage graph projection; governance evidence aggregation.

## Owned concepts and records
Workflow definition/version, trigger, schedule, workflow run, orchestration step, integration binding, approval task, lineage projection, governance report, report template, report delivery record.

## Interfaces and dependencies
- Uses P0 job/event/identity/authorization/secrets/notification primitives.
- Invokes S1–S6 published operations; does not access their private databases or internal modules.
- Consumes authoritative artifact references and events from all squads to construct lineage and reports.
- Publishes workflow status, approval events, and report artifacts through P0 shared contracts.
- Product squads remain responsible for domain-specific retry safety, validation, and business outcomes; S7 coordinates execution but does not replace their logic.

## Decision rights
Owns workflow composition, trigger semantics, cross-domain report templates, lineage presentation, and governance UX. Cannot create new domain operations by reaching into another squad's internals, bypass authorization, or approve a deployment/data access action beyond the user's permissions.

## Deliverables
Workflow builder and runtime integration; schedules and triggers; integration catalogue/bindings; run history; lineage explorer; audit/governance views; report builder; export and delivery capabilities.

## Quality gates
Idempotent orchestration; safe retry/compensation behavior; permission propagation; no secret leakage; durable run history; lineage completeness; report provenance; approval enforcement; workflow versioning; failure visibility and recovery.

## Success measures
Workflow completion/recovery rates; automation setup time; reduction in manual repetitive steps; lineage coverage; report accuracy and provenance; governance evidence completeness; low unauthorized-action rate.

## Boundary test
S7 coordinates and explains cross-domain work. It does not perform the underlying cleaning, analysis, model training, AI inference, or deployment itself; it calls the owning squad's published capability.
