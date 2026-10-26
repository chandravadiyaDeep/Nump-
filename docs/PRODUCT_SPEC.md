# NUMPA MVP — Product Requirements

## Product goal

Provide an understandable, end-to-end workflow that helps a user inspect a dataset, improve its quality, understand ML suitability, and compare a small set of appropriate baseline models.

## Workflow

1. Upload a dataset.
2. Generate a concise overview: rows/records where determinable, columns/features, data types, sample preview, memory/file details where available, missingness, duplicate signals, and basic distributions.
3. Preprocessing diagnostics: infer likely feature types, surface parsing issues, and explain transformations that may be required.
4. Smart cleaning: detect issues, recommend conservative actions, explain every recommendation, preview the effects, and produce a cleaning report. Never silently destroy the original dataset.
5. Visualization: generate meaningful, type-aware summaries and charts for supported tabular data.
6. ML readiness: score the dataset for a selected task and explain contributing factors; do not present a readiness score as a guarantee of model performance.
7. ML Labs: where task, target and data size permit, select up to three suitable baseline algorithms; evaluate them fairly and display applicable metrics.

## Formats

Requested formats:
- JSON
- CSV
- Parquet
- Optimized Parquet
- ImageFolder
- SoundFolder / AudioFolder
- WebDataset
- Text
- Arrow

Implementation note: format labels do not all represent a single-file format. Folder datasets and WebDataset can require directories, multiple files, archive uploads, metadata and task-specific loaders. The UI and API must clearly indicate accepted upload forms and reject unsupported files with useful errors. Implement formats in stages and never claim a format is supported until tests prove it.

## Smart-cleaning principles

Required loop: detect → decide → explain → preview → apply → validate.

General policies:
- Missing numeric values: choose mean, median, or another strategy based on distribution, missingness and context; do not assume one rule fits every column.
- Missing categorical values: consider mode or an explicit unknown category, based on semantics.
- Duplicates: identify exact duplicates; present likely duplicates separately when the definition of identity is ambiguous.
- Types: identify parseable values and conversions without silently losing data.
- Text/categories: normalize whitespace and obvious formatting safely; avoid merging distinct labels based on guesses.
- Outliers: detect and explain; do not automatically delete legitimate rare observations.
- Invalid values: use known constraints when supplied; otherwise report assumptions.
- Scaling/encoding: use for model pipelines as needed, not as an irreversible default cleaning step.
- Target: preserve target semantics; transformations affecting labels or target values require explicit justification.
- Keep source data intact; record operations and before/after quality measures.
- Validate output shape, types and remaining quality issues.

## ML evaluation principles

- Infer a task only when evidence is adequate; otherwise ask the user to choose.
- Supported tabular tasks should be incrementally implemented: classification and regression first; forecasting and clustering require task-specific validation and metrics.
- Select up to three candidate algorithms appropriate for the data and task, not a fixed universal set.
- Use a reproducible split or cross-validation plan appropriate to sample size and task. Time series must respect chronology.
- Fit imputers, scalers, encoders and feature selectors inside training pipelines/folds to prevent leakage.
- Classification metrics can include ROC-AUC (when scores and class structure support it), accuracy (CA), precision, recall and F1. State averaging and positive-class conventions.
- Regression metrics can include MSE, RMSE, MAE and R². Explain undefined metrics and small-sample caveats.
- Never fill in unavailable/inapplicable metrics with fabricated values.
- Show validation strategy and enough context to interpret model comparisons. Performance is a baseline estimate, not a guarantee of future results.

## MVP non-goals

- Autonomous production deployment of trained models.
- Claims of universal support for all file/dataset formats before each has a tested ingestion path.
- Silent destructive transformations.
- Using an LLM as the source of truth for numeric scores or evaluation metrics.
