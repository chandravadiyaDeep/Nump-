# S3 — Data Transformation & Quality

**Status:** PROPOSED — UNDER REVIEW  
**Primary workspace:** Data Cleaning

## Mission
Convert source datasets into trustworthy, reproducible, validated dataset versions through transparent user-approved quality and transformation workflows.

## Owns
- Data quality rules, checks, diagnostics, and quality issue classification.
- Missing-value handling, duplicate handling, outlier treatment, type correction, normalization, encoding, scaling, and general-purpose transformations.
- User-configurable cleaning plans, transformation steps, pipeline composition, preview, approval, execution, and rollback/recovery behavior.
- Before/after comparisons for cleaning operations and transformation-level reports.
- Dataset version creation and transformation provenance for outputs created by cleaning/transformation operations.
- Validation of transformation preconditions and postconditions.
- Reusable cleaning recipes and transformation pipeline templates.

## Does not own
- Initial source access, connectors, or ingestion (S1).
- General descriptive analysis and visualization workspace behavior (S2), though S3 may show focused previews and cleaning diagnostics.
- ML-specific feature engineering and task-dependent readiness logic (S4). General transformations may be reused through contracts.
- AI application workflows or advanced forecasting (S5).
- Model lifecycle and monitoring (S6).
- Cross-domain orchestration, schedules, formal governance reports, or global lineage UI (S7).
- Canonical resource identity, artifact registry, job substrate, or authorization primitives (P0).

## Frontend responsibilities
Quality assessment panels for cleaning, issue inspection, transformation builder, step configuration, preview/approval screens, pipeline management, before/after comparison, execution progress, and cleaning reports.

## Backend and data responsibilities
Transformation planning and execution; deterministic operation implementations; validation engine integration; dataset version output registration; transformation logs; reproducibility metadata; safe execution and resource limits.

## Owned concepts and records
Quality rule, quality issue, cleaning plan, transformation step, pipeline definition, transformation run, validation result, cleaning report, output dataset version metadata.

## Interfaces and dependencies
- Consumes source or existing dataset versions registered through P0/S1.
- Uses P0 job and artifact mechanisms to execute and register outputs.
- Provides new dataset versions and quality summaries to S2, S4, and other authorized consumers.
- S4 may request task-specific preparation, but owns ML feature semantics and leakage-safe feature engineering.
- S7 may schedule a cleaning pipeline through S3's published execution contract; it does not implement cleaning operations.
- Must not mutate an existing immutable dataset version in place; transformations produce a new version or explicitly governed derived artifact.

## Decision rights
Owns general-purpose cleaning and data-quality semantics, operation parameters, preview/execute behavior, and transformation reproducibility. Domain-specific quality rules may be configured by users or downstream squads but must execute through documented interfaces.

## Deliverables
Quality rule catalogue; transformation operation catalogue; pipeline builder; preview/execute engine; immutable versioning behavior; cleaning report; validation and reproducibility documentation.

## Quality gates
Deterministic behavior where promised; no silent destructive mutation; exact input/output version tracking; type and schema validation; edge-case tests; leakage-safe defaults where relevant; resource limits; preview/execution consistency; failure recovery and auditability.

## Success measures
Reduction in unresolved data-quality issues; transformation success rate; reproducibility; low data-loss incidents; preview-to-execution consistency; percentage of outputs with complete provenance.

## Boundary test
S3 owns general data quality and transformations that create dataset versions. S4 owns feature transformations whose meaning depends on an ML task, target, validation strategy, or leakage constraints.
