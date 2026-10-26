# NUMPA MVP — Product Requirements

## Product goal

Provide an understandable end-to-end workflow that helps users inspect a dataset, improve its quality, understand ML suitability, and compare a small set of appropriate baseline models.

## Workflow

1. Upload dataset.
2. Generate overview: records, columns/features, types, preview, missingness, duplicate signals and basic distributions.
3. Show preprocessing diagnostics and inferred feature types.
4. Recommend and preview cleaning actions, explain each action, validate the output, and generate a report.
5. Generate meaningful type-aware visualization summaries for supported tabular files.
6. Calculate a task-aware readiness heuristic and explain its dimensions.
7. Where feasible, select up to three suitable baseline models and compare their metrics.

## Format requirements and implementation status

Requested: CSV, JSON, Parquet, optimized Parquet, ImageFolder, SoundFolder/AudioFolder, WebDataset, text and Arrow.

Implemented in first backend slice: CSV, JSON, Parquet, Arrow IPC and Feather.

Not yet implemented: folder-based ImageFolder/AudioFolder, WebDataset archives, raw text corpora and specialized optimized-Parquet variants. These formats have different ingestion semantics and need dedicated loaders, UI selection and test fixtures. The API must reject unsupported files with useful errors.

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
- Preserve the source data; audit operations and before/after quality.
- Validate resulting shape, types and remaining issues.

## ML evaluation principles

- Infer task only when evidence is adequate; otherwise let the user select it.
- Implement classification and regression comparisons first. Forecasting and clustering need task-specific validation and metrics.
- Select up to three candidate algorithms suited to the task; do not use a universal fixed list.
- Use reproducible validation. Time series must preserve chronology.
- Fit imputers, scalers, encoders and feature selection within training pipelines/folds to prevent leakage.
- Classification metrics may include ROC-AUC, accuracy (CA), precision, recall and F1. Document averaging and positive-class conventions.
- Regression metrics include MSE, RMSE, MAE and R². Explain undefined metrics.
- Never fabricate unavailable or inapplicable values.
- Scores and holdout metrics are estimates, not guarantees.

## MVP non-goals

- Production deployment of trained models.
- Claiming universal format support before tests prove the relevant ingestion path.
- Silent destructive transformations.
- Using generative AI as the source of truth for numerical scores or evaluation metrics.
