# S2 — Data Intelligence

**Status:** PROPOSED — UNDER REVIEW  
**Primary workspaces:** Data Analysis, Data Visualization

## Mission
Help users understand, explore, validate, and communicate what their data contains through trustworthy analytical computation and visual explanation.

## Owns
- Dataset overview and descriptive profiling after ingestion or transformation.
- Exploratory data analysis (EDA), descriptive statistics, distributions, correlations, relationships, group summaries, and analytical diagnostics.
- Interactive analytical exploration and read-only SQL-style querying, subject to approved query safety and execution contracts.
- Chart specification and rendering behavior: histograms, bar/line/scatter plots, box plots, heatmaps, and other supported analytical visuals.
- Analysis views, dashboards, chart configurations, filters, and reusable analytical workspaces.
- Analytical interpretation metadata and user-facing explanations of statistical outputs, with clear distinction between computed facts and generated narrative.
- Analytical report views that explain data and visual findings; formal cross-domain report generation and governance packs belong to S7.

## Does not own
- Source connection and ingestion (S1).
- Mutating canonical datasets, cleaning pipelines, or transformation history (S3).
- ML task readiness, feature engineering, model training, or experiment evaluation (S4).
- LLM app building, RAG, agents, or forecasting/advanced AI workflows (S5).
- Model registry, deployment, or operational monitoring (S6).
- Cross-domain scheduling, workflow orchestration, audit/lineage governance, or formal report distribution (S7).
- Shared project, artifact, execution, or authorization primitives (P0).

## Frontend responsibilities
Dataset overview, profiling panels, analysis workspace, query editor or query builder, chart builder, visualization canvas, dashboards, filters, drill-downs, exportable chart views, and analytical explanations.

## Backend and data responsibilities
Read-only analytical query services; profiling/statistics computation; safe query planning; chart-ready aggregation; caching of reproducible analytical results; analytical view definitions; provenance references to exact dataset versions.

## Owned concepts and records
Analysis session, profile result, statistic result, analytical query, query result metadata, chart specification, dashboard/view definition, analysis finding, visualization configuration.

## Interfaces and dependencies
- Consumes datasets and versions registered through P0 and ingested by S1.
- Consumes cleaned dataset versions and quality summaries from S3.
- Publishes analysis artifacts and findings through P0's artifact registry.
- S4 may consume selected analysis outputs as context, but ML readiness calculations remain S4-owned.
- S7 may assemble S2 outputs into reports through published artifact references.
- S2 must use read-only dataset access and must not silently change canonical data.

## Decision rights
Owns analytical semantics, supported statistical operations, chart behavior, and analysis UX within approved correctness, privacy, and performance constraints. Statistical method changes must be documented and tested.

## Deliverables
Dataset profiling; EDA tools; safe analytical query capability; chart/visualization catalogue; dashboard definitions; reproducible analysis artifacts; statistical method documentation.

## Quality gates
Numerical correctness; reproducibility; null/type/edge-case handling; query isolation and resource limits; chart accessibility; clear units and sample sizes; version provenance; large dataset performance; explicit uncertainty/limitations.

## Success measures
Time to understand a dataset; correctness and reproducibility of statistics; successful analytical exploration; chart usability/accessibility; low query failure rate; percentage of outputs traceable to a dataset version.

## Boundary test
S2 reads, analyzes, and explains data. If an operation creates a new canonical dataset version, it belongs to S3. If it evaluates suitability for a defined ML task, it belongs to S4.
