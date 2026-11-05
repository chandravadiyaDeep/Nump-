# NUMPA Domain Handoffs and Producer–Consumer Matrix

**Status:** PROPOSED — UNDER REVIEW  
**Date:** 2026-11-05

This defines logical exchanges between squads, not final endpoint paths or database schemas.

## 1. Ownership matrix
| Capability / record | Authoritative owner | Consumers | Contract rule |
|---|---|---|---|
| Project identity and membership | P0 | S1–S7 | Reference canonical project IDs; enforce resource authorization |
| Dataset identity and registry primitive | P0; S1 owns ingestion meaning | S1–S7 as authorized | P0 supplies common identity; S1 supplies source provenance |
| Source connection and ingestion result | S1 | S2, S3, S4, S5, S7 | Share dataset/version references, never credentials or raw payloads in events |
| Dataset profile and analysis results | S2 | S3, S4, S7 | Read-only artifacts reference exact dataset version |
| Cleaning plan, quality result, transformed dataset version | S3 | S2, S4, S5, S7 | Publish new immutable version and transformation provenance |
| Feature set, readiness, experiment, candidate model | S4 | S5, S6, S7 | Include exact dataset/feature/config/experiment versions and evaluation evidence |
| AI app, prompt, RAG/agent/forecast run | S5 | S6 where deployable, S7, authorized S2 | Publish versioned configuration and run/artifact references |
| Registered model, deployment, endpoint, monitoring events | S6 | S5 where integrated, S7, authorized S4 | S6 owns operational lifecycle; endpoint access is policy-controlled |
| Workflow definition/run and schedule | S7 | P0 and S1–S6 through operation contracts | Orchestrates; never bypasses domain validation or permissions |
| Governance report and lineage projection | S7 | User and authorized squads | Projection links to authoritative records; is not their source of truth |
| Job, artifact registry, event envelope, identity primitives | P0 | S1–S7 | P0 owns mechanism; domain squad owns payload meaning |

## 2. Main end-to-end handoffs

### H1 — Ingestion to analysis or cleaning
1. User selects a source in S1.
2. S1 validates source access and import configuration.
3. S1 registers the dataset through P0's common resource primitives and records ingestion provenance.
4. S1 publishes an ingestion-completed fact containing dataset/version references.
5. S2 or S3 obtains the data through its authorized read interface.
6. Consumers never access S1's private connector credentials or ingestion internals.

### H2 — Analysis to transformation
1. S2 analyzes an exact dataset version and publishes a profile/finding artifact with provenance.
2. User selects an issue or action for cleaning.
3. S3 receives the dataset-version reference and optional analysis-finding reference.
4. S3 revalidates access and input state, previews the operation, and executes only after approval.
5. S3 publishes a new immutable dataset version and cleaning report.
6. S2 can analyze the new version; old versions and findings remain traceable.

### H3 — Prepared data to ML
1. S4 selects a specific dataset version and defines task, target if applicable, and validation strategy.
2. S4 requests supporting profile/quality artifacts from S2/S3.
3. S4 computes deterministic, versioned readiness and leakage checks.
4. S4 creates ML-specific feature sets with lineage and launches experiments.
5. S4 publishes evaluation evidence and candidate model artifact references.
6. Successful experimentation does not mean production deployment.

### H4 — Candidate model to operations
1. S4 or S5 submits a candidate/deployable artifact and handoff metadata to S6.
2. S6 validates integrity, provenance, evaluation evidence, dependencies/security posture, model interface, and release requirements.
3. S6 accepts or rejects with explicit reasons.
4. With required authorization, S6 registers the model version and manages deployment/rollout.
5. S6 publishes deployment status, endpoint reference, monitoring events, and rollback facts.
6. S7 can report or orchestrate approved operations but cannot promote a model itself.

### H5 — AI application and advanced-AI workflow
1. S5 configures a versioned AI app, prompt, knowledge source, agent, or advanced-AI workflow.
2. S5 requests source/data access through S1/S3 contracts where required.
3. S5 executes using P0 job, secrets, policy, and artifact primitives.
4. S5 publishes versioned run traces and result artifact references.
5. Deployable models needing operational lifecycle management are handed to S6.
6. S7 may schedule published S5 operations and include results in reports.

### H6 — Cross-domain automation
1. S7 defines a workflow using published operations from S1–S6 only.
2. S7 invokes each operation with caller identity and delegated project/resource scope.
3. The owning squad validates request, inputs, permissions, idempotency, and preconditions.
4. S7 coordinates dependencies, waits for jobs, and records orchestration state.
5. Domain squads remain responsible for correctness and domain side effects.
6. P0 supplies shared job/event/identity substrate; S7 owns workflow semantics.

### H7 — Reports, lineage, governance
1. Domain squads publish authoritative artifacts and lifecycle facts.
2. S7 consumes references/events to build lineage projections and reports.
3. Reports record source artifact IDs/versions, generation time, filters, and permissions context.
4. S7 rechecks access at view/export time.
5. Source corrections happen in the owning squad; S7 refreshes its projection rather than rewriting source facts.

## 3. Ambiguous boundary resolutions proposed

### Dataset identity versus dataset meaning
P0 owns common resource identity, access primitives, and registry mechanism. S1 owns ingestion semantics and provenance. S3 owns transformation semantics and derived dataset-version lineage. Consumers use stable references and do not infer storage details.

### Forecasting: S4 versus S5
S4 owns forecasting as an ML experiment when the user defines target, split strategy, features, candidate algorithms, and ML evaluation. S5 owns forecasting as an advanced-AI application/workflow with its own application and orchestration semantics. Both use shared time-series data references. Workflow research may recommend consolidating this boundary later.

### Audit substrate versus governance
P0 owns secure capture/integrity of audit facts, common event envelope, access enforcement, and retention mechanisms. S7 owns audit exploration, lineage visualization, approval presentation, governance reports, and evidence assembly. S7 cannot modify source audit facts.

### AI provider integrations versus platform secrets
S5 owns provider adapters and AI application configuration. P0 owns shared secret storage, access control, and secret delivery primitives. Provider-specific code must remain replaceable.

### Job infrastructure versus workflow orchestration
P0 owns generic job submission/status/cancellation substrate. Domain squads own operation meaning and validity. S7 owns multi-step workflow graphs, triggers, schedules, dependencies, and orchestration state.

## 4. Failure and compensation ownership
- Producer validates its domain request and domain-side idempotency.
- P0 owns reliability of shared job/event/artifact primitives.
- Consumer handles unavailable dependencies, stale references, and unsupported contract versions.
- S7 owns workflow-level retry/timeout/compensation policy, but calls domain-owned compensating operations; it cannot directly undo another squad's state.
- Failed operations expose stable error code, safe message, retryability, and correlation reference.
- Partial success is explicit; no cross-squad all-or-nothing guarantee is assumed unless documented.

## 5. Handoff acceptance checklist
For every handoff document producer/consumer, purpose, IDs and versions, authorization, preconditions, sync/async behavior, idempotency, success/failure states, retry/compensation owner, events/artifacts, compatibility, observability, and support correlation.