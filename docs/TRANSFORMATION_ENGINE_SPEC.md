# NUMPA Transformation Engine — Phase 2A

**Status:** Implemented on a feature branch; pending CI and review.
**Scope:** Deterministic, allow-listed, previewable table transformations.
**Data lifecycle:** In-memory only; no raw dataset persistence.

## Supported operations

Each operation is a JSON object in an ordered array:

| Type | Required fields | Behavior |
|---|---|---|
| `rename_column` | `column`, `new_name` | Rename one existing column; destination collisions are rejected |
| `drop_column` | `column` | Remove one column; dropping the final column is rejected |
| `cast_numeric` | `column` | Convert to numeric; non-empty invalid values reject the entire request |
| `cast_datetime` | `column` | Parse datetimes; non-empty invalid values reject the entire request |
| `filter_rows` | `column`, `operator`, optional `value` | Filter using the operators below |

Filter operators:
- Scalar comparisons: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`.
- Text match: `contains` (literal substring, not a regular expression).
- Missingness: `is_null`, `not_null`.

## API contracts

### Preview

`POST /api/v1/transformations/preview`

Multipart fields:
- `file`: supported dataset upload, using existing ingestion limits and parser.
- `operations_json`: JSON-encoded ordered operation array; maximum 64 KB.

Returns:
- `report.before` and `report.after`: dimensions and column names.
- `report.operations`: ordered audit details.
- `report.validation`: source immutability, non-empty output and rows removed.
- `preview`: at most 25 transformed rows.
- `columns`: output column names.

### Execute

`POST /api/v1/transformations/execute`

Accepts the same multipart fields and returns a separate `*-transformed.csv` download. The source upload is never overwritten or persisted.

## Safety and correctness

- At most 25 operations per request.
- Only explicit allow-listed operation types are accepted; no Python, SQL, shell, or expression execution.
- Missing columns, name collisions, incompatible comparisons, invalid casts, zero-row outputs and zero-column outputs are rejected.
- Casts fail closed rather than silently replacing invalid non-empty values with nulls.
- Filter `contains` treats user text literally (regex disabled).
- Operations run in order against a deep copy of the source DataFrame.
- Preview and execute share the same transformation function.
- Existing inspection, cleaning, readiness and model-evaluation routes are unchanged.

## Not included in this increment

No join/merge, group-by aggregation, pivot/unpivot, formula language, learned encoders/scalers, feature selection, target-aware transformations, reusable saved pipelines, connector ingestion, persistent history, or background jobs. Those require separate contracts, tests and UI work.

## Verification

Automated tests cover ordered operations, source immutability, rename collisions, invalid casts, safe literal filtering, empty-output protection, allow-list enforcement, preview response and CSV export. CI must pass before merge. Browser UI integration is a subsequent increment.
