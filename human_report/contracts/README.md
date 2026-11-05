# NUMPA Inter-Squad Contract Architecture

**Stage:** 3 — Inter-squad contracts and governance  
**Status:** PROPOSED — UNDER REVIEW  
**Date:** 2026-11-05  
**Technology posture:** Technology-neutral; no transport, database, queue, or framework selected.

## Purpose
Define how P0 and S1–S7 exchange capabilities and information while remaining independently changeable. These are logical contracts and governance rules, not implementation-ready API schemas.

## Non-negotiable principles
1. **Single authoritative owner:** Each domain record has one owning squad. Other squads reference it; they do not create competing authoritative copies.
2. **Contract over internals:** Cross-squad communication uses published APIs, commands, events, or artifact references. No direct imports of private modules or reads/writes of another squad's private tables.
3. **Stable identity:** Cross-domain references use canonical resource identifiers and exact versions, not filenames, display names, row positions, or transient UI state.
4. **Project-scoped authorization:** Every operation is authorized against the acting principal, project, resource, and action. A valid identifier is not proof of access.
5. **Explicit lifecycle:** Long-running work has a defined request, accepted, running, succeeded/failed/cancelled lifecycle and an inspectable result.
6. **Idempotency and safe retry:** Repeating a request must not silently duplicate an import, transformation, deployment, or external side effect.
7. **Versioned contracts:** APIs, events, artifact formats, and domain state transitions are versioned and compatibility-managed.
8. **Provenance by default:** Durable outputs identify their producer, inputs, exact input versions, configuration/version, timestamps, and relevant execution.
9. **No hidden coupling:** Consumers rely only on documented fields and guarantees.
10. **Provider independence:** LLM providers are replaceable contributors or integrations, never an architectural owner or mandatory control plane.

## Contract types
| Type | Purpose | Owner |
|---|---|---|
| Query/API | Read a resource or request bounded work | Domain squad |
| Command/operation | Request an authorized domain action | Domain squad |
| Domain event | Notify that an owned state transition occurred | Producing domain squad; P0 provides shared event infrastructure |
| Artifact reference | Share a durable result without copying its source record | Producing squad; P0 provides registry primitives |
| Job contract | Submit and inspect long-running execution | P0 provides substrate; domain squad owns job meaning |
| Handoff contract | Transfer responsibility between lifecycle stages | Sending and receiving squads jointly |
| Authorization contract | Check and enforce access | P0 primitives plus resource-owner policy |

## Canonical resources
P0 provides common identity and metadata primitives for organization/tenant where applicable, project, dataset, dataset version, artifact, job, workflow/run, experiment, model/model version, deployment, and report. These are conceptual resource types, not finalized schema fields. Stage 6 decides physical schema and storage.

Domain metadata remains with its owner: S1 connector/source/ingestion; S2 analysis/query/chart/dashboard; S3 quality/cleaning/pipeline/transformation; S4 feature/readiness/experiment/evaluation; S5 AI application/prompt/retrieval/agent/advanced-AI; S6 registered model/deployment/endpoint/release/monitoring; S7 workflow/report/lineage projection. P0 owns shared identity, authorization, job, artifact-registry, and event-envelope primitives, not domain meaning.

### Dataset version rule
A published dataset version is immutable. A transformation creates a new version or separately governed derived artifact. Consumers identify the exact version used. Corrections create a new version rather than silently rewriting history.

### Artifact reference rule
Consumers receive an artifact reference and metadata needed to locate, authorize, and interpret it. They must not assume physical storage location, format, or object layout unless specified by its contract.

## Standard operation lifecycle
1. Caller submits operation with project/resource references, parameters, caller identity context, and idempotency key.
2. Owning squad validates authorization, input state/version, parameters, quotas, and preconditions.
3. Operation is accepted or rejected with a structured response.
4. If asynchronous, a job reference is returned.
5. Owner publishes lifecycle changes and makes status/result retrievable.
6. On success, outputs are registered with provenance.
7. On failure/cancellation, a structured terminal state and safe diagnostic are exposed.
8. Retrying the same logical action reuses its idempotency identity; a materially new action uses a new key.

P0 provides generic job primitives; it does not decide whether cleaning, training, or deployment is valid.

## Event envelope
Each event conceptually carries event ID/type/version, occurrence timestamp, producer, project scope, subject resource type and ID, correlation ID, causation ID where known, actor reference subject to privacy rules, minimal event data, and schema reference. Do not put raw datasets, secrets, access tokens, or large model payloads in events. Use authorized artifact references.

## Error contract
Errors expose a stable code/category, safe actionable message, structured diagnostics with sensitive values removed, retryable indicator, and correlation/support reference. Never expose stack traces, credentials, raw secrets, private source data, or internal host details to clients.

## Security and trust boundaries
P0 provides identity, authorization primitives, service identity, shared secret-management integration, and audit-capture substrate. Each domain owner enforces resource-level authorization; hiding a UI control is not authorization. Service calls carry authenticated caller identity and delegated project/resource scope. Apply least privilege, input validation, redaction, resource limits, and data minimization. S7 can present audit evidence but cannot rewrite source audit facts.

## Versioning and compatibility
Every consumed API, event, artifact format, and lifecycle contract has an owner, version, status, changelog, examples, and compatibility tests. Prefer additive compatible changes. Do not silently rename/remove fields, change units/meaning/defaults, or change state semantics. Breaking changes require a new major contract version, consumer inventory, migration/deprecation plan, and product-owner approval. Consumers tolerate unknown optional fields and safely reject unknown critical states.

## Change process
1. Producer proposes a contract change and identifies consumers and impact.
2. Affected consumers review compatibility, migration, and rollback.
3. P0 reviews shared identity/job/artifact/event/security implications.
4. Product owner approves breaking, security-sensitive, cross-domain ownership, or architecture-level changes.
5. Contract is documented and versioned before implementation.
6. Producer and consumers implement compatible rollout steps and monitor deprecation.

## Disputes
Domain owners first document the conflict and propose a narrow boundary. P0 advises on shared primitives/security. If unresolved, pause the affected change and escalate to the product owner. Never resolve disputes by duplicating canonical state or accessing private storage.

## Explicitly deferred
No choice is made here about REST, GraphQL, RPC, message broker, database topology, object storage, workflow engine, event bus, schema registry, serialization format, or microservices versus modular monolith. These require workflow research, technology research, and architecture review.