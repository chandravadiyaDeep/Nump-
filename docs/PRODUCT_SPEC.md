# NUMPA MVP — Product Requirements

## Product goal

NUMPA's first customer-facing MVP focuses on two outcomes: **Smart Data Cleaning** and an **explainable ML Readiness Assessment**. It helps analysts understand a tabular dataset, review conservative cleaning changes, and see how the assessment changes after cleaning.

## Core user workflow

1. Upload a supported CSV, XLSX, JSON, Parquet, Arrow IPC, or Feather dataset.
2. Show a dataset overview: rows, columns, types, missingness, duplicate signals, column profiles, and a small preview.
3. Select the intended ML task and target column when applicable, then calculate an explainable readiness score.
4. Review suggested cleaning operations and select which supported transformations to preview.
5. Inspect the cleaning report and output preview; never overwrite the source upload.
6. Download the cleaned dataset as CSV.
7. Re-run the readiness assessment on the cleaned dataset and compare before/after scores. The first UI slice exposes the assessment and cleaning independently; a guided before/after comparison is a remaining MVP integration task.

## Smart-cleaning principles

Required loop: detect → decide → explain → preview → apply → validate.

- Missing numerical values: consider mean, median or another method based on distribution and context.
- Missing categorical values: consider mode or explicit Unknown when appropriate.
- Duplicates: distinguish exact duplicates from ambiguous near-duplicates.
- Types: identify parseable values without silent data loss.
- Text/categories: normalize whitespace safely; avoid guessing that different labels mean the same thing.
- Outliers: detect and explain; do not automatically delete legitimate rare observations.
- Invalid values: apply known domain constraints only when available; otherwise explain assumptions.
- Scaling/encoding: apply inside model pipelines when needed; do not treat them as irreversible default cleaning.
- Target: preserve target semantics and avoid accidental target transformations.
- Preserve source data; audit operations and before/after quality.
- Validate resulting shape, types and remaining issues.

## ML readiness principles

- Support task-aware readiness checks for classification, regression, forecasting and clustering.
- Let the user select the task; do not infer it silently when evidence is weak.
- Keep scoring deterministic and auditable. Explain dimensions, weights and issues.
- AI may explain findings or suggest actions, but must not silently change numerical scores or thresholds.
- Treat readiness as data-preparation guidance, not a prediction of model accuracy or business value.
- Prevent target leakage when adding deeper evaluation.

## Current implementation boundary

Implemented in the initial backend and web branch: supported-file inspection, cleaning recommendations, preview and cleaned CSV export, and task-aware readiness scoring. XLSX support uses openpyxl.

Remaining work before calling the MVP complete:
- Build an integrated before/after readiness comparison using the same cleaning options and target/task.
- Add explicit per-action approval controls and richer explanations in the UI.
- Add dedicated downloadable cleaning/readiness report PDFs beyond the browser print-to-PDF action currently available for visible results.
- Add end-to-end browser/API tests and verify CI.
- Improve error handling, upload/resource limits, and deployment configuration.

## Future or non-goals for this MVP

- Customer-facing model training and algorithm leaderboard; the existing baseline-comparison API is not part of the primary UI workflow yet.
- Visualization as a standalone product feature.
- Production deployment of trained models.
- Authentication, billing, usage metering, public API keys, automation connectors, and white-label embeds.
- ImageFolder/AudioFolder, WebDataset archives, raw text corpora and specialized optimized-Parquet variants.
- Silent destructive transformations or AI-generated numerical scores.
