# NUMPA Squad Map

**Stage:** 1 — Finalize squad organization  
**Status:** ORGANIZATION DESIGN COMPLETE — awaiting explicit product-owner sign-off  
**Version:** 1.0  
**Date:** 2026-11-05

This document defines the recommended starting organization for NUMPA's unified Data & AI platform. The structure is intentionally organized around coherent professional workflows rather than creating one squad for every sidebar workspace.

## 1. Organization at a glance

- **1 shared platform squad**
- **7 product squads**
- **8 squads total**
- Multiple LLMs and coding tools may contribute directly at repository level, according to the task and available capabilities.
- No LLM or tool is permanently assigned to a squad, workspace, or project layer.
- NUMPA's architecture, contracts, documentation, and workflows must remain independent of any particular LLM or provider.
- The product owner retains final approval authority.

The seven product squads own product-domain outcomes. The shared platform squad owns capabilities that must be consistent across all domains.

## 2. Shared platform squad

### P0 — Core Platform & Developer Experience

**Mission:** Provide secure, reliable, reusable foundations so product squads can deliver features without independently rebuilding infrastructure.

**Platform capability areas (not detailed squad boundaries yet):**
- Identity and access integration
- Shared project, dataset, and artifact foundations
- Execution infrastructure and job lifecycle conventions
- API, event, and schema standards
- Security and secrets-handling standards
- Observability, logging, metrics, and tracing foundations
- Shared testing, CI/CD, developer tooling, and engineering standards

This squad is a horizontal enabler. Its detailed ownership and interfaces will be defined in Stage 2 and Stage 3.

## 3. Product squads

### S1 — Data Foundation & Connectivity
**Mission:** Make data from supported sources safely accessible to NUMPA projects.

**Primary workspace:** Data Connect.

**Domain focus:** File ingestion, database connectivity, cloud storage, APIs, source credentials, schema discovery, import configuration, and connection health.

### S2 — Data Intelligence
**Mission:** Help users understand, explore, and communicate what their data contains.

**Primary workspaces:** Data Analysis and Data Visualization.

**Domain focus:** Dataset profiling, exploratory data analysis, descriptive statistics, SQL-oriented exploration, charting, dashboards, interactive analysis, and analytical reporting views.

**Why these work together:** Visualization is frequently the communication and exploration layer of analysis. Keeping them together supports a continuous inspect → explore → explain workflow.

### S3 — Data Transformation & Quality
**Mission:** Turn source datasets into trustworthy, reproducible, well-documented data products.

**Primary workspace:** Data Cleaning.

**Domain focus:** Data quality checks, missing values, duplicates, outliers, type correction, encoding, scaling, transformations, validation rules, reusable pipelines, preview/execute behavior, and transformation history.

### S4 — Data Science & ML
**Mission:** Help users prepare data for machine learning, assess suitability, develop experiments, and evaluate candidate models.

**Primary workspaces:** Data Science, ML Readiness, and ML Lab.

**Domain focus:** Feature engineering, experiment design, task-aware readiness assessment, leakage prevention, training workflows, algorithm comparison, validation strategies, metrics, tuning, and model evaluation.

**Why these work together:** Readiness, feature engineering, experimentation, and model evaluation form one connected applied-ML lifecycle. The squad can be split later if workload or specialist complexity justifies it.

### S5 — AI Engineering
**Mission:** Enable users to build, evaluate, and operate AI-powered applications and advanced analytical workflows within NUMPA.

**Primary workspaces:** AI Studio and Forecasting & Advanced AI.

**Domain focus:** LLM applications, prompt and model workflows, RAG, agents, evaluation, time-series forecasting, NLP, computer vision, anomaly detection, and advanced AI workflow composition.

**Why these work together initially:** These capabilities share advanced model integration, evaluation, and workflow orchestration concerns. Reassess the grouping after workflow research.

### S6 — ML Platform & Operations
**Mission:** Move models from experiments into controlled, observable, maintainable operational use.

**Primary workspace:** MLOps.

**Domain focus:** Model packaging, registry, deployment lifecycle, versioning, serving integration, monitoring, drift/performance checks, rollback, and operational governance for models.

### S7 — Workflow Automation & Governance
**Mission:** Let users automate repeatable work and maintain trustworthy records of what happened, when, why, and under whose authority.

**Primary workspaces:** Automation Studio and Reports & Governance.

**Domain focus:** Schedules, triggers, workflow orchestration, integrations, run history, lineage views, audit trails, report generation, sharing, access governance, and compliance-oriented evidence.

**Why these work together:** Automation creates and runs workflows; governance and reporting make their execution traceable, reviewable, and shareable.

## 4. Supporting product destinations

These are shared product capabilities or navigation destinations, not separate squads in the initial organization:
- Analysis History
- Settings
- Account and authentication screens
- Notifications and help surfaces

Their detailed ownership will be assigned in Stage 2. A destination may be implemented by a domain squad while relying on platform-owned services.

## 5. LLM-independent collaboration model

NUMPA will use multiple LLMs and coding tools as interchangeable contributors. This is an operating principle, not a fixed allocation of ownership.

- Any approved LLM/tool may work directly with the repository at the task level, subject to repository access, capability, and the project's safety rules.
- No LLM is assigned permanent ownership of a squad, workspace, layer, or subsystem.
- Contributors may research, design, document, review, test, or implement any domain when given a clear task and the necessary context.
- Work is allocated by task fit, capability, availability, cost, and output quality—not by fixed domain ownership.
- All contributors follow the same approved architecture, human-report records, coding standards, API contracts, security requirements, and branch/PR workflow.
- Contributors must coordinate overlapping edits and use isolated branches/worktrees where appropriate.
- The project must not depend on proprietary capabilities or assumptions of one LLM provider. Provider-specific integrations, if ever added to NUMPA itself, must sit behind replaceable interfaces.
- Product-owner approval remains required for architecture decisions and consequential changes; tool access does not grant decision authority.

ChatGPT may help coordinate and synthesize work in this conversation, but that conversational role does not create exclusive repository or domain ownership. Codex is one possible repository-level contributor, not the sole implementation executor.

| Contributor/tool | Operating position |
|---|---|
| ChatGPT | May coordinate, research, review, document, and implement tasks |
| Claude | May coordinate, research, review, document, and implement tasks |
| Google AI Studio | May coordinate, research, review, document, and implement tasks |
| Codex | May inspect, research, review, test, and implement repository tasks |
| Other approved LLMs/tools | May contribute under the same project rules |
| Product owner | Sets priorities and scope; makes final decisions and approvals |

## 6. Organization-wide design principles

1. **Workflow ownership:** A squad owns a coherent domain outcome, not merely frontend, backend, or database tasks.
2. **End-to-end accountability:** A squad is expected to understand its user workflow, domain logic, APIs, tests, documentation, and operational quality. Exact boundaries are Stage 2 work.
3. **Shared foundations:** Common identity, project context, execution, security, and observability capabilities should be provided consistently rather than reimplemented by every squad.
4. **Contract-first collaboration:** Cross-squad dependencies must be expressed through documented contracts. Contract details are Stage 3 work.
5. **No silent cross-ownership:** Squads should not directly modify another squad's internals or data ownership without an agreed contract and review process.
6. **Isolated parallel work:** LLM contributors should use separate task scopes and branches/worktrees; overlapping file edits require coordination.
7. **Central review:** ChatGPT coordinates cross-squad consistency; the product owner approves major product and architecture decisions.
8. **Evidence before technology selection:** Squad names do not lock libraries, frameworks, algorithms, databases, or infrastructure choices.
9. **Evolution over premature complexity:** Start with these eight squads; split or merge only when research and delivery evidence justify it.

## 7. Why not create 12 squads?

A one-squad-per-workspace structure would create too many coordination boundaries before NUMPA has validated its workflows. Several workspaces have strong lifecycle dependencies and naturally belong together. The proposed seven product squads keep ownership understandable while leaving room to split domains later.

## 8. Stage 1 completion checklist

- [x] Define the shared platform squad.
- [x] Group all 12 workspaces under seven product squads.
- [x] Identify supporting destinations outside the product-squad count.
- [x] Explain the rationale for major workspace groupings.
- [x] Define an LLM-independent, repository-level collaboration model.
- [x] Record organization-wide principles.
- [ ] Obtain explicit product-owner sign-off.

## 9. Handoff to Stage 2

Stage 1 organization design is complete. Stage 2 must now define each squad's:
- Mission and measurable outcomes
- In-scope and out-of-scope responsibilities
- User personas and workflows
- Domain concepts and owned artifacts
- Frontend, backend, data, and operational responsibilities
- Dependencies on other squads
- Decision authority and escalation path
- Required skills and LLM/tool assignment
- Deliverables, quality gates, and success metrics

Do not start implementation from this map. Stage 2 and Stage 3 must establish boundaries and contracts first.
