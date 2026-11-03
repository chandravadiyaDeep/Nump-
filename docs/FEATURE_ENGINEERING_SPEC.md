# NUMPA Feature Engineering — Phase 3

**Status:** Stateless feature-engineering engine and additive API implemented on a feature branch; UI and CI pending.
**Supported tasks:** classification, regression, forecasting, clustering.

## Supported operations

- `date_parts`: create year, month, day and day-of-week features from a date column.
- `numeric_interaction`: add, subtract or multiply two numeric columns into a new feature.
- `missing_indicator`: create a 0/1 feature indicating whether a source column is missing.

These operations are deterministic and row-wise. They do not estimate parameters from the dataset.

## Target protection

- Classification, regression and forecasting require an existing target column.
- Clustering does not accept a target column.
- The exact target column cannot be used as a source for date parts, numeric interactions or missing indicators.
- The original target values are checked unchanged in the audit report.
- Feature names must be new; existing columns cannot be overwritten.
- Source data is deep-copied and row count is preserved.

## Leakage boundary

This phase deliberately does **not** implement scaling, imputation, encoding, feature selection, target encoding, or any other learned transform. Those operations must be fitted on training data only and then applied to validation/test data using training-fitted parameters. They must not be fitted on the full dataset before splitting.

Exact target-column protection is a safety guard, not a guarantee against semantic target leakage. NUMPA cannot automatically determine whether a user-created feature is a proxy for the outcome or whether a timestamp encodes future information. Users must review feature meaning and temporal availability.

Forecasting validation, time-aware splits, and lag/rolling-window feature generation are not implemented in this phase.

## API

- `POST /api/v1/features/preview`
- `POST /api/v1/features/execute`

Multipart fields: `file`, `operations_json`, `task`, and optional `target` for clustering only. Instructions are limited to 64 KB and 20 operations. Preview returns an audit and at most 25 rows; execute returns a separate CSV.

## Not included

No train/test splitting, model fitting, fitted preprocessing, automatic feature selection, feature importance, lag features, rolling windows, persistent feature store, or raw-data persistence.
