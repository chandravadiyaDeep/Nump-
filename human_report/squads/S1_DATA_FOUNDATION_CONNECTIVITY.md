# S1 — Data Foundation & Connectivity

**Status:** PROPOSED — UNDER REVIEW  
**Primary workspace:** Data Connect

## Mission
Safely connect supported data sources to NUMPA projects and turn selected source data into discoverable, validated inputs for downstream workspaces.

## Owns
- Source connector catalogue and connector-specific capability definitions.
- File upload/import workflows and supported file-format parsing at the ingestion boundary.
- Database, cloud-storage, and external API connector behavior.
- Connection setup, source selection, import configuration, schema discovery, source-side sampling, connection testing, and connection health.
- Connector-specific credential entry and lifecycle UX; secret storage and encryption mechanisms are provided by P0.
- Ingestion validation: file/source readability, supported format, structural parse errors, basic schema extraction, and import-level diagnostics.
- Ingestion jobs, retries, resumability, source sync configuration, and connector error reporting.
- Source references and ingestion provenance needed to trace where an imported dataset came from.

## Does not own
- Canonical project, user, identity, or access-control primitives (P0).
- Analytical profiling, statistical interpretation, or visualization (S2).
- Dataset cleaning, transformation pipelines, or business data-quality rules (S3).
- Feature engineering, ML readiness, or experiments (S4).
- AI/LLM model integrations or forecasting logic (S5).
- Model deployment and monitoring (S6).
- General cross-domain workflow automation, report composition, or governance policy UX (S7).

## Frontend responsibilities
Connector catalogue, upload/import wizard, source configuration, connection testing, schema preview, import progress, connector diagnostics, and source-management screens.

## Backend and data responsibilities
Connector adapters; secure connection orchestration; file/source parsing; ingestion validation; sync and retry behavior; source metadata and provenance; handoff to shared dataset/artifact registration.

## Owned concepts and records
Connector definition, connection configuration, source reference, import request, ingestion job details, import profile, source schema snapshot, ingestion diagnostics, source provenance.

## Interfaces and dependencies
- Uses P0 identity, project scoping, secret-management, job, artifact, and authorization primitives.
- Publishes successful ingestion results and dataset registration requests through P0's shared resource contracts.
- S2 consumes registered dataset versions for profiling and exploration.
- S3 consumes registered datasets for quality checks and transformations.
- S7 may trigger connector syncs through S1's published operation interface; S7 does not implement connectors.
- S1 must not write directly into S2/S3/S4 private domain stores.

## Decision rights
Chooses connector-specific behavior and supported source capabilities within approved security, privacy, and platform policies. New connector classes, sensitive data handling, new external network permissions, or shared schema changes require review.

## Deliverables
Connector capability matrix; import workflows; connector adapters; connection diagnostics; ingestion validation suite; source provenance; connector operational documentation.

## Quality gates
File size/type validation; malformed and hostile input handling; credential redaction; least-privilege source access; timeout/retry/backoff behavior; idempotent import handling; schema drift detection; large-file/resource tests; no accidental raw-data persistence beyond approved policy.

## Success measures
Successful import rate; time to first usable dataset; connector reliability; recoverable failure rate; low credential/security incidents; clear actionable import diagnostics.

## Boundary test
S1 answers: “Can NUMPA securely access and ingest this source?” It does not answer: “Is this dataset analytically good, how should it be cleaned, or is it suitable for ML?”
