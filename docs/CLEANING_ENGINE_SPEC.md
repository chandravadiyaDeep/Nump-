# Smart Cleaning Engine Specification

## Contract
Detect → Recommend → Explain → Preview → Apply with approval → Validate → Report.

Original uploads are immutable. The engine returns a new result and audit record; it never silently overwrites the source.

## Recommendation fields
Each recommendation should include a stable rule ID/version, affected columns or rows, issue evidence/count, proposed action/parameters, rationale, assumptions, risk level, approval requirement, estimated impact, reversibility and validation checks.

## Conservative rules
- Missing values: distinguish numeric, categorical, datetime and text-like columns. Consider distribution and domain context before mean/median/mode imputation.
- Entirely empty columns: do not invent values without explicit approval.
- Duplicates: separate exact duplicates from possible duplicates; require approval before row removal.
- Type parsing: preview coercion failures; avoid silent precision loss and timezone/date ambiguity.
- Outliers: flag unusual values; do not delete or cap by default.
- Invalid values: apply bounds only when grounded in user-provided or documented domain constraints.
- Text/categories: whitespace trimming can be offered; do not merge similar labels or case-fold identifiers automatically.
- Scaling, encoding and feature selection usually belong in leakage-safe model pipelines, not irreversible source cleaning.
- Protect target semantics and avoid target leakage.

## Post-clean validation
Compare row/column counts, types, parse failures, missing cells, exact duplicates, category cardinality, unexpected values and relevant numeric distribution changes. Warn or fail if schema changes unexpectedly.

## Reproducibility
Record rule version, options, operation order and before/after summaries. Same input, version and options should yield the same result when deterministic behaviour is expected.
