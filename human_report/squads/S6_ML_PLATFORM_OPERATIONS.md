# S6 — ML Platform & Operations

**Status:** PROPOSED — UNDER REVIEW  
**Primary workspace:** MLOps

## Mission
Take approved model artifacts into controlled operational use and keep deployed models secure, reliable, observable, versioned, and maintainable.

## Owns
- Model intake and production-readiness checks at the deployment boundary.
- Operational model registry lifecycle: registration, immutable versions, stage/status transitions, approvals, lineage links, and retirement.
- Packaging, environment/dependency specification, deployment configuration, serving integration, and endpoint lifecycle.
- Release strategies, rollout controls, health checks, rollback, and decommissioning.
- Model-specific monitoring: service health, latency, throughput, errors, resource use, prediction quality where labels are available, drift and data-quality signals.
- Model operational alerts, incident workflow integration, retraining triggers as operational events, and deployment audit history.
- Model operational governance: approval gates, release evidence, version traceability, and access to deployed endpoints.

## Does not own
- Initial data ingestion/connectors (S1).
- Analysis and visualization product behavior (S2).
- Data cleaning and transformation logic (S3).
- Feature engineering, readiness scoring, experiment design, and candidate evaluation (S4).
- AI app/prompt/RAG/agent semantics and advanced-AI research workflows (S5), except when an AI model is handed over for deployment under an agreed contract.
- General workflow orchestration and enterprise report/lineage UX (S7).
- Shared job, identity, secrets, artifact, telemetry, and execution primitives (P0).

## Frontend responsibilities
Model registry, model version detail, deployment configuration, environment and endpoint views, rollout controls, operational dashboards, drift/performance views, alert history, rollback and retirement workflows.

## Backend and data responsibilities
Model artifact intake; registry lifecycle; packaging/build orchestration; deployment adapters; serving integration; endpoint state; monitoring collection and evaluation; rollout/rollback automation; operational event publication.

## Owned concepts and records
Registered model, model version, deployment, serving endpoint, release, rollout, monitoring policy, operational metric, drift event, incident reference, rollback event, model retirement record.

## Interfaces and dependencies
- Receives candidate model artifacts and evaluation evidence from S4, or approved deployable artifacts from S5 where relevant.
- Uses P0 identity, authorization, secrets, jobs, artifact references, telemetry, and security primitives.
- May consume S1/S3/S4 data-quality and evaluation signals for monitoring, without owning their source logic.
- Publishes deployment status, endpoint references, monitoring events, and operational metrics to S7 for automation/reporting.
- S7 can trigger approved deployment operations through S6's contract; it cannot bypass S6 release controls.

## Decision rights
Owns operational model lifecycle and release mechanics within product-owner-approved risk and security policy. Production rollout, endpoint exposure, rollback, and retirement must follow explicit authorization policy; the squad cannot silently promote unapproved models.

## Deliverables
Model registry lifecycle; deployment and serving integrations; release/rollback controls; monitoring and drift detection; operational runbooks; incident and release evidence.

## Quality gates
Artifact integrity; dependency/security scanning; reproducible packaging; staged rollout; health checks; rollback validation; access controls; monitoring coverage; alert quality; disaster/recovery procedures; auditable promotion approvals.

## Success measures
Deployment success rate; mean time to recovery; rollback reliability; endpoint availability/latency; monitoring coverage; model version traceability; reduction in undetected model degradation.

## Boundary test
S4/S5 produce and evaluate model artifacts. S6 controls their operational release and lifecycle. S7 may orchestrate approved actions but cannot override S6 deployment policy.
