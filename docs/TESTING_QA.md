# Testing and Quality Strategy

## Unit tests
- Each supported file loader, malformed inputs and empty files.
- Profiling counts, missingness, duplicates and JSON serialization.
- Cleaning suggestions, selected operations and audit reports.
- Readiness score bounds, weights, task/target edge cases and deterministic output.
- Model-selection rules and metric calculations.

## API contract tests
- Valid, empty, malformed, oversized and unsupported uploads.
- Invalid task/target values and missing fields.
- Response schema and HTTP status codes.
- Download headers and file content.
- Errors must not expose private server details.

## End-to-end tests
- Upload → inspect → assess → preview → clean → reassess → export.
- Original data remains unchanged.
- Downloaded output can be reopened and has expected schema.
- UI handles loading, empty results and errors.

## ML correctness
- Preprocessing is fitted on training data only.
- Metrics match trusted small examples.
- AUC is absent/null when undefined, never fabricated.
- Forecasting preserves chronological order before it is declared supported.
- Tiny, single-class, all-null and high-cardinality data fail gracefully.

## Performance and resilience
- Benchmark representative small, medium and maximum-size files.
- Measure wall time, peak memory and concurrent requests.
- Test timeouts and recovery after parser errors.
- Add stress tests before increasing limits.

## Fixtures
Use synthetic or public, licensed, deterministic, non-sensitive samples. Include numeric/categorical data, missing values, duplicates, outliers, dates, Unicode column names, all-null/constant columns, malformed files, imbalanced classification and regression targets.

## CI gates
- Install dependencies in a clean environment.
- Run unit and API tests.
- Add lint, dependency and secret scans as configured.
- Record the commit tested and inspect actual CI results.
- Require passing CI before release.

## Definition of done
A feature is done only when behaviour, limitations, tests, errors and documentation agree. Unit tests alone do not prove production readiness.
