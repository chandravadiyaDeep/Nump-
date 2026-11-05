# S4 — Data Science & ML

**Status:** PROPOSED — UNDER REVIEW  
**Primary workspaces:** Data Science, ML Readiness, ML Lab

## Mission
Help users move from prepared data to defensible machine-learning experiments by designing features, assessing task-specific readiness, training candidates, and evaluating results without data leakage.

## Owns
- ML problem/task setup: classification, regression, time-series forecasting where it is part of supervised ML experimentation, and clustering.
- Target definition where applicable, task configuration, split/validation strategy selection, and experiment assumptions.
- ML-specific feature engineering, feature sets, feature selection, and feature transformation semantics.
- ML Readiness assessment: task-aware dimensions, deterministic scoring, explainable findings, configurable weights/thresholds, and versioned assessment configurations.
- Leakage prevention checks and warnings covering target leakage, temporal leakage, split contamination, preprocessing leakage, and inappropriate validation.
- Experiment design, training orchestration requests, algorithm comparison, hyperparameter tuning, metrics, evaluation, and reproducibility.
- Experiment tracking metadata and candidate model/evaluation artifacts up to the handoff to S6.

## Does not own
- Source connectors and data ingestion (S1).
- General EDA, descriptive statistics, or charting framework (S2), though S4 may request analytical computations.
- General-purpose data cleaning and canonical dataset transformations (S3).
- LLM applications, RAG, agent frameworks, AI app evaluation, and advanced AI workflows outside the ML experiment lifecycle (S5).
- Production model registry, deployment, serving, monitoring, rollback, and operational lifecycle (S6).
- Cross-domain schedules and governance/report distribution (S7).
- Shared execution, identity, artifact, and project primitives (P0).

## Frontend responsibilities
Problem/task setup, target and validation configuration, feature engineering workspace, readiness assessment explanation, experiment builder, algorithm comparison, training/evaluation views, metric visualizations, and experiment comparison.

## Backend and data responsibilities
Task-specific assessment engine; deterministic score calculation; feature-set generation; leakage checks; experiment orchestration; training/evaluation adapters; metric computation; experiment metadata and candidate artifact publication.

## Owned concepts and records
ML task definition, target specification, validation strategy, feature set, readiness configuration/version, readiness assessment, leakage finding, experiment, run, model candidate, evaluation result, metric bundle.

## Interfaces and dependencies
- Consumes dataset versions and cleaning/quality metadata from P0/S1/S3.
- May consume S2 analytical outputs as supporting context, never as a substitute for its own ML validation.
- Uses P0 job and artifact infrastructure for training/evaluation jobs and artifact references.
- Publishes candidate model artifacts and evaluation metadata to S6 through a formal handoff contract.
- S7 may schedule experiments via published S4 operations; S7 does not own training semantics.
- S5 may consume approved model artifacts through contracts for AI applications; it does not redefine S4 experiment history.

## Decision rights
Owns ML task semantics, readiness scoring methodology, feature engineering rules, validation strategy defaults, experiment metrics, and evaluation methodology within approved governance. Score formula changes require versioning, documentation, and regression tests.

## Deliverables
Task-aware ML readiness engine; explainable score reports; feature engineering tools; leakage checks; experiment builder; algorithm comparison; evaluation reports; model-candidate handoff specification.

## Quality gates
No data leakage; correct train/validation/test separation; deterministic and versioned readiness scores; task-appropriate metrics; reproducible experiment configuration; baseline comparisons; class imbalance/temporal considerations; traceability to exact dataset and feature versions.

## Success measures
Experiment reproducibility; leakage detection coverage; assessment explainability; reliable task-specific scoring; reduction in invalid experiments; time from dataset to evaluated candidate.

## Boundary test
S4 owns the path from ML problem definition through evaluated candidate model. Once a model is accepted for controlled operational release, S6 owns its registry, deployment, serving, and monitoring lifecycle.
