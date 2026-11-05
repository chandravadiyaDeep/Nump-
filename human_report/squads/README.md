# NUMPA Squad Charters

**Stage:** 2 — Squad boundaries and charters  
**Status:** PROPOSED — UNDER REVIEW  
**Date:** 2026-11-05

This folder defines proposed ownership boundaries for the eight-squad NUMPA organization. These charters are a working baseline, not implementation authorization. They do not select a technology stack or authorize production changes.

## Charter index

- [P0 — Core Platform & Developer Experience](P0_CORE_PLATFORM.md)
- [S1 — Data Foundation & Connectivity](S1_DATA_FOUNDATION_CONNECTIVITY.md)
- [S2 — Data Intelligence](S2_DATA_INTELLIGENCE.md)
- [S3 — Data Transformation & Quality](S3_DATA_TRANSFORMATION_QUALITY.md)
- [S4 — Data Science & ML](S4_DATA_SCIENCE_ML.md)
- [S5 — AI Engineering](S5_AI_ENGINEERING.md)
- [S6 — ML Platform & Operations](S6_ML_PLATFORM_OPERATIONS.md)
- [S7 — Workflow Automation & Governance](S7_WORKFLOW_AUTOMATION_GOVERNANCE.md)

## Rules common to every squad

1. A squad owns its domain behavior end-to-end: user experience, domain rules, APIs, tests, documentation, and operational readiness.
2. A squad owns only its domain concepts and state. It must not create a competing copy of another squad's canonical records.
3. Shared platform primitives belong to P0; product-specific meaning and workflows belong to the relevant product squad.
4. Use published contracts to consume another squad's capabilities. Do not import private modules, query private tables, or modify another squad's internals.
5. Every durable artifact must identify its project context and provenance, and reference exact input versions where applicable. Exact schemas and contracts are Stage 3.
6. Squads may propose libraries, engines, algorithms, and infrastructure, but technology selection belongs to later research and architecture stages.
7. LLMs are interchangeable contributors, not squad owners. Any LLM/tool may work on any squad's repository tasks under the same rules.
8. A squad may not unilaterally change shared contracts, identity/security foundations, deployment infrastructure, or production data structures.
9. Each squad must provide unit, integration, contract, security, and failure-path tests appropriate to its domain.
10. Product-owner approval is required for material scope changes, architecture decisions, production-impacting changes, and unresolved cross-squad ownership disputes.

## Boundary vocabulary

- **Owns:** authoritative responsibility for domain rules, behavior, and domain state.
- **Consumes:** uses another squad's capability through an agreed contract.
- **Contributes:** supplies information or artifacts without owning the receiving domain's lifecycle.
- **Does not own:** explicitly excluded responsibility.
- **Shared primitive:** reusable technical capability provided centrally; it does not transfer product-domain ownership to P0.

## Cross-cutting ownership summary

| Capability | Accountable owner | Boundary |
|---|---|---|
| Identity, authorization primitives, shared project context, canonical IDs, artifact/job substrate | P0 | Product squads define domain permissions and semantics; P0 supplies common mechanisms |
| Source connectors and ingestion | S1 | S1 registers incoming data through shared platform contracts |
| Profiling, EDA, SQL exploration, analytical charts | S2 | Read/inspect/explain; does not mutate canonical datasets |
| Data quality rules and transformations | S3 | Creates validated dataset versions |
| Features, readiness assessments, ML experiments and evaluation | S4 | Owns pre-production applied-ML lifecycle |
| AI applications, LLM workflows, forecasting and advanced AI workflows | S5 | Owns AI application and advanced-AI behavior |
| Model registry lifecycle, deployment, serving operations and monitoring | S6 | Owns operational model lifecycle after handoff |
| Cross-domain automation, schedules, reports, lineage and governance UX | S7 | Orchestrates through contracts; does not reimplement domain logic |

## Stage 2 exit criteria

- Every squad has an explicit mission, scope, exclusions, owned concepts, interfaces, decision rights, deliverables, quality gates, and metrics.
- Shared-versus-domain ownership conflicts are identified.
- The product owner reviews and approves or revises the charters.
- Stage 3 then defines concrete API, event, schema, artifact, and lifecycle contracts.
