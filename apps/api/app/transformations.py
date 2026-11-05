"""Deterministic, previewable dataset transformations.

Only explicit allow-listed operations are accepted. Functions always work on a deep
copy so the caller's source DataFrame remains unchanged.
"""
from __future__ import annotations
from typing import Any
import pandas as pd

MAX_TRANSFORMATIONS = 25
MAX_OPERATION_VALUE_LENGTH = 500


class TransformationError(ValueError):
    """Raised when a transformation is invalid or cannot be applied safely."""


def _column(frame: pd.DataFrame, name: Any) -> str:
    if not isinstance(name, str) or not name.strip():
        raise TransformationError("Every operation must provide a non-empty column name.")
    if name not in frame.columns:
        raise TransformationError(f"Column '{name}' does not exist in the dataset.")
    return name


def _required_string(operation: dict[str, Any], key: str) -> str:
    value = operation.get(key)
    if not isinstance(value, str) or not value.strip():
        raise TransformationError(f"Operation '{operation.get('type', 'unknown')}' requires '{key}'.")
    if len(value) > MAX_OPERATION_VALUE_LENGTH:
        raise TransformationError(f"'{key}' exceeds the {MAX_OPERATION_VALUE_LENGTH}-character limit.")
    return value.strip()


def _filter_rows(frame: pd.DataFrame, operation: dict[str, Any]) -> tuple[pd.DataFrame, dict[str, Any]]:
    column = _column(frame, operation.get("column"))
    operator = operation.get("operator")
    allowed = {"eq", "ne", "gt", "gte", "lt", "lte", "contains", "is_null", "not_null"}
    if operator not in allowed:
        raise TransformationError(f"Unsupported filter operator '{operator}'.")
    series = frame[column]
    value = operation.get("value")
    if operator in {"is_null", "not_null"}:
        mask = series.isna()
        if operator == "not_null":
            mask = ~mask
    elif operator == "contains":
        if not isinstance(value, str):
            raise TransformationError("The 'contains' filter requires a text value.")
        mask = series.astype("string").str.contains(value, regex=False, na=False)
    else:
        if value is None or isinstance(value, (dict, list)):
            raise TransformationError(f"Filter '{operator}' requires a scalar value.")
        try:
            if operator == "eq": mask = series.eq(value)
            elif operator == "ne": mask = series.ne(value)
            elif operator == "gt": mask = series.gt(value)
            elif operator == "gte": mask = series.ge(value)
            elif operator == "lt": mask = series.lt(value)
            else: mask = series.le(value)
        except (TypeError, ValueError) as exc:
            raise TransformationError(f"Filter '{operator}' is incompatible with column '{column}'.") from exc
    mask = mask.fillna(False)
    before = len(frame)
    result = frame.loc[mask].copy(deep=True).reset_index(drop=True)
    return result, {"operation": "filter_rows", "column": column, "operator": operator,
                    "rows_before": before, "rows_after": len(result), "rows_removed": before - len(result)}


def apply_transformations(frame: pd.DataFrame, operations: list[dict[str, Any]]) -> tuple[pd.DataFrame, dict[str, Any]]:
    """Apply explicit operations to a copy and return a reproducible audit report."""
    if not isinstance(operations, list):
        raise TransformationError("Operations must be provided as a JSON array.")
    if len(operations) > MAX_TRANSFORMATIONS:
        raise TransformationError(f"A maximum of {MAX_TRANSFORMATIONS} operations is allowed per request.")
    if any(not isinstance(item, dict) for item in operations):
        raise TransformationError("Each operation must be a JSON object.")

    result = frame.copy(deep=True)
    original_columns = [str(column) for column in frame.columns]
    audit: list[dict[str, Any]] = []

    for index, operation in enumerate(operations):
        kind = operation.get("type")
        if kind == "rename_column":
            source = _column(result, operation.get("column"))
            destination = _required_string(operation, "new_name")
            if destination in result.columns and destination != source:
                raise TransformationError(f"Cannot rename '{source}' to '{destination}': that column already exists.")
            result = result.rename(columns={source: destination})
            audit.append({"operation": kind, "from": source, "to": destination})
        elif kind == "drop_column":
            column = _column(result, operation.get("column"))
            if len(result.columns) <= 1:
                raise TransformationError("Cannot drop the last remaining column.")
            result = result.drop(columns=[column])
            audit.append({"operation": kind, "column": column})
        elif kind == "cast_numeric":
            column = _column(result, operation.get("column"))
            converted = pd.to_numeric(result[column], errors="coerce")
            invalid = result[column].notna() & converted.isna()
            invalid_count = int(invalid.sum())
            if invalid_count:
                examples = result.loc[invalid, column].astype(str).head(3).tolist()
                raise TransformationError(f"Cannot convert column '{column}' to numeric: {invalid_count} non-empty value(s) are invalid (examples: {examples}).")
            result[column] = converted
            audit.append({"operation": kind, "column": column, "invalid_values": 0})
        elif kind == "cast_datetime":
            column = _column(result, operation.get("column"))
            converted = pd.to_datetime(result[column], errors="coerce", format="mixed")
            invalid = result[column].notna() & converted.isna()
            invalid_count = int(invalid.sum())
            if invalid_count:
                examples = result.loc[invalid, column].astype(str).head(3).tolist()
                raise TransformationError(f"Cannot convert column '{column}' to datetime: {invalid_count} non-empty value(s) are invalid (examples: {examples}).")
            result[column] = converted
            audit.append({"operation": kind, "column": column, "invalid_values": 0})
        elif kind == "filter_rows":
            result, item_audit = _filter_rows(result, operation)
            audit.append(item_audit)
        else:
            raise TransformationError(f"Unsupported transformation type '{kind}' at position {index + 1}.")

        if result.empty:
            raise TransformationError(f"Operation {index + 1} would leave the dataset with zero rows; no output was produced.")
        if len(result.columns) == 0:
            raise TransformationError("A transformation cannot produce a dataset with zero columns.")

    report = {
        "operation_count": len(audit), "operations": audit,
        "before": {"rows": int(len(frame)), "columns": int(len(frame.columns)), "column_names": original_columns},
        "after": {"rows": int(len(result)), "columns": int(len(result.columns)), "column_names": [str(c) for c in result.columns]},
        "validation": {"source_unchanged": True, "non_empty": not result.empty and len(result.columns) > 0,
                       "rows_removed": int(len(frame) - len(result))},
        "note": "Preview and execution use deterministic allow-listed operations. The source DataFrame is never mutated.",
    }
    return result, report
