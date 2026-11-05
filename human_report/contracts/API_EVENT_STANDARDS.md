# NUMPA API, Event, Artifact and Lifecycle Standards

**Status:** PROPOSED — UNDER REVIEW  
**Date:** 2026-11-05  
**Purpose:** Common logical rules for cross-squad interfaces. Concrete schemas and technologies are deferred.

## 1. API/operation contract minimum
Every published operation specifies contract ID, owner squad, version, status, purpose, caller roles/scopes and project/resource authorization, input schema and limits, output schema or accepted job reference, preconditions, sync/async behavior, idempotency semantics, stable errors, side effects, emitted events, produced artifacts, resource limits, observability, compatibility guarantees, examples, and contract tests. Operation names/routes are not final until architecture and implementation-specification stages.

## 2. Request identity and idempotency
Every mutating operation carries authenticated principal/service identity, project context, resource references and exact versions, request/correlation ID, idempotency key, and explicit parameters. The producer defines idempotency scope and retention. Replaying the same logical request with the same key returns the original outcome or current operation reference, not a duplicate side effect. A materially different operation requires a new key.

## 3. Event publication and consumption
- Events describe facts that have already occurred; commands request work.
- Event names describe completed facts, such as dataset ingestion completed, dataset version created, experiment completed, or model deployment rolled back.
- The owning domain squad is responsible for event correctness and publication intent.
- P0 provides common envelope, authenticated transport integration, delivery observability, and shared reliability primitives.
- Consumers tolerate duplicate delivery and process idempotently.
- Consumers do not rely on ordering unless the contract explicitly guarantees it for a defined aggregate.
- Events are minimal; large payloads and sensitive data are referenced through authorized artifacts.
- Consumers record processed event identity or equivalent deduplication state.
- Unprocessable events are quarantined or surfaced for operator review, never silently discarded.

## 4. Artifact contract
Every durable cross-squad artifact exposes, conceptually, artifact ID/type, owner squad, project ID and access classification, artifact schema version, creation timestamp and status, exact input resource/artifact IDs and versions, producing operation/job/run reference, configuration/model/rule version where relevant, content reference or retrieval operation, retention/deletion policy reference, and integrity metadata where required. Artifact owner controls content semantics and lifecycle. P0 supplies common registration, identity, access, and retrieval primitives. Consumers do not assume physical storage path or format unless specified.

## 5. Job lifecycle contract
Conceptual states: requested → accepted → queued → running → succeeded / failed / cancelled. Optional states such as waiting for input, retrying, or partially succeeded are allowed only where defined by the operation contract.

Each job exposes identity, owner, project, operation type, requester, timestamps, current state, safe progress, cancellation semantics, terminal result/error reference, output artifact references, retry policy, attempt history, and appropriate quota visibility. Domain squad defines progress and terminal success; P0 provides generic lifecycle substrate.

## 6. Dataset contract
- Dataset identity and dataset-version identity are separate.
- Published versions are immutable.
- Metadata distinguishes source/ingestion, transformation, and consumer-specific analytical/ML metadata.
- A consumer specifies dataset ID and exact version ID when reproducibility matters.
- Schema changes are versioned and observable.
- Access checks occur at every read and operation boundary.
- Dataset content is not placed in event messages or logs by default.
- A derived dataset version records parent input version(s), producing transformation/run, and relevant configuration version.

## 7. Model lifecycle contract
- S4/S5 produce candidate/deployable model artifacts with provenance and evidence.
- S6 owns operational registration and deployment lifecycle.
- Handoff includes artifact reference, integrity, model interface/signature, runtime requirements, training/evaluation provenance, intended use, known limitations, and approval status.
- S6 may reject incomplete or unsafe handoffs with actionable reasons.
- S6 owns deployment states and promotion approvals.
- S4 retains experiment/evaluation records; S5 retains AI app/model configuration; S6 retains operational release/endpoint/monitoring records.

## 8. Security and privacy contract
- Authentication identifies caller; authorization decides whether caller may perform the requested action.
- Project membership alone may not grant access to every resource.
- Enforce least privilege and scoped delegated access.
- Secrets never appear in API responses, logs, events, reports, or LLM prompts by default.
- Raw data is minimized in telemetry; use resource references and redacted diagnostics.
- External integrations and AI tools receive only explicitly authorized data.
- Cross-tenant isolation and authorization bypass tests are mandatory.
- S7 reports re-evaluate permissions at view/export time.

## 9. Compatibility and deprecation
Additive optional fields are preferred. Breaking changes require a new major contract version and migration plan. Producers publish compatibility guarantees and test fixtures; consumers test against producer fixtures or compatible test environments. Deprecation requires consumer inventory, notice, migration guide, transition period, and removal approval. Never silently change units, defaults, nullability, ordering, or meaning.

## 10. Observability and support
Every cross-squad operation is traceable using correlation and causation references. Logs/metrics/traces identify producer, consumer, operation, project scope without leaking sensitive values, contract version, job/run ID, latency, and outcome. User-facing errors contain a support reference.

## 11. Contract review authority
- Domain owner approves its own non-breaking domain contract details.
- All known consumers review changes that affect them.
- P0 reviews shared identity, authorization, job, artifact, event, telemetry, and security primitives.
- Product owner approves breaking changes, cross-domain ownership changes, security-sensitive changes, and architecture-level changes.
- No squad unilaterally modifies another squad's contract or private storage assumptions.