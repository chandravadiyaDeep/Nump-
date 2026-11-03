"""Leakage-conscious, stateless feature engineering operations.

This module deliberately avoids learned transforms. Operations are row-wise and
deterministic; the exact target column is protected from use or modification.
"""
from __future__ import annotations

from typing import Any
import pandas as pd

MAX_FEATURE_OPERATIONS = 20
MAX_NAME_LENGTH = 120
DATE_PARTS = {"year", "month", "day", "dayofweek"}
NUMERIC_OPERATORS = {"add", "subtract", "multiply"}


class FeatureEngineeringError(ValueError):
    """Raised when a feature operation violates its safe contract."""


def _name(frame: pd.DataFrame, value: Any, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise FeatureEngineeringError(f"'{field}' must be a non-empty column name.")
    value = value.strip()
    if value not in frame.columns:
        raise FeatureEngineeringError(f"Column '{value}' does not exist.")
    return value


def _new_name(frame: pd.DataFrame, value: Any) -> str:
    if not isinstance(value, str) or not value.strip():
        raise FeatureEngineeringError("Every feature operation requires 'new_column'.")
    value = value.strip()
    if len(value) > MAX_NAME_LENGTH:
        raise FeatureEngineeringError(f"Feature name exceeds {MAX_NAME_LENGTH} characters.")
    if value in frame.columns:
        raise FeatureEngineeringError(f"Feature column '{value}' already exists.")
    return value


def apply_feature_operations(
    frame: pd.DataFrame,
    operations: list[dict[str, Any]],
    *,
    target: str | None,
    task: str,
) -> tuple[pd.DataFrame, dict[str, Any]]:
    """Create deterministic features without fitting statistics on the full dataset."""
    if task not in {"classification", "regression", "forecasting", "clustering"}:
        raise FeatureEngineeringError("Task must be classification, regression, forecasting, or clustering.")
    if task == "clustering" and target:
        raise FeatureEngineeringError("Clustering does not use a target column.")
    if task != "clustering" and (not isinstance(target, str) or not target.strip()):
        raise FeatureEngineeringError("Select a target column for this task.")
    if not isinstance(operations, list) or not 1 <= len(operations) <= MAX_FEATURE_OPERATIONS:
        raise FeatureEngineeringError(f"Provide between 1 and {MAX_FEATURE_OPERATIONS} feature operations.")
    if any(not isinstance(item, dict) for item in operations):
        raise FeatureEngineeringError("Each feature operation must be a JSON object.")

    protected_target = target.strip() if isinstance(target, str) and target.strip() else None
    if protected_target and protected_target not in frame.columns:
        raise FeatureEngineeringError(f"Target column '{protected_target}' does not exist.")

    result = frame.copy(deep=True)
    audit: list[dict[str, Any]] = []
    for index, operation in enumerate(operations):
        kind = operation.get("type")
        if kind == "date_parts":
            source = _name(result, operation.get("column"), "column")
            if source == protected_target:
                raise FeatureEngineeringError("The target column is protected and cannot be used as a feature source.")
            parts = operation.get("parts")
            if not isinstance(parts, list) or not parts or any(part not in DATE_PARTS for part in parts) or len(set(parts)) != len(parts):
                raise FeatureEngineeringError("Date parts must be a non-empty unique list from year, month, day, dayofweek.")
            parsed = pd.to_datetime(result[source], errors="coerce", format="mixed")
            invalid = result[source].notna() & parsed.isna()
            if invalid.any():
                raise FeatureEngineeringError(f"Date feature source '{source}' contains {int(invalid.sum())} invalid non-empty value(s).")
            created = []
            for part in parts:
                name = f"{source}_{part}"
                if name in result.columns:
                    raise FeatureEngineeringError(f"Feature column '{name}' already exists.")
                result[name] = getattr(parsed.dt, part)
                created.append(name)
            audit.append({"operation": kind, "source": source, "created": created})
        elif kind == "numeric_interaction":
            left = _name(result, operation.get("left_column"), "left_column")
            right = _name(result, operation.get("right_column"), "right_column")
            if left == protected_target or right == protected_target:
                raise FeatureEngineeringError("The target column is protected and cannot be used as a feature source.")
            output = _new_name(result, operation.get("new_column"))
            operator = operation.get("operator")
            if operator not in NUMERIC_OPERATORS:
                raise FeatureEngineeringError("Numeric interaction operator must be add, subtract, or multiply.")
            left_values = pd.to_numeric(result[left], errors="coerce")
            right_values = pd.to_numeric(result[right], errors="coerce")
            invalid_left = result[left].notna() & left_values.isna()
            invalid_right = result[right].notna() & right_values.isna()
            if invalid_left.any() or invalid_right.any():
                raise FeatureEngineeringError("Numeric interaction sources contain invalid non-empty values.")
            if operator == "add":
                result[output] = left_values + right_values
            elif operator == "subtract":
                result[output] = left_values - right_values
            else:
                result[output] = left_values * right_values
            audit.append({"operation": kind, "left": left, "right": right, "operator": operator, "created": output})
        elif kind == "missing_indicator":
            source = _name(result, operation.get("column"), "column")
            if source == protected_target:
                raise FeatureEngineeringError("The target column is protected and cannot be used as a feature source.")
            output = _new_name(result, operation.get("new_column") or f"{source}_is_missing")
            result[output] = result[source].isna().astype("int8")
            audit.append({"operation": kind, "source": source, "created": output})
        else:
            raise FeatureEngineeringError(f"Unsupported feature operation '{kind}' at position {index + 1}.")

    report = {
        "task": task,
        "target_protected": protected_target,
        "operation_count": len(audit),
        "operations": audit,
        "before": {"rows": int(len(frame)), "columns": int(len(frame.columns)), "column_names": [str(c) for c in frame.columns]},
        "after": {"rows": int(len(result)), "columns": int(len(result.columns)), "column_names": [str(c) for c in result.columns]},
        "validation": {"source_unchanged": True, "row_count_unchanged": len(frame) == len(result),
                       "no_fitted_parameters": True, "target_values_unchanged": not protected_target or result[protected_target].equals(frame[protected_target])},
        "note": "Only deterministic row-wise features were created. No scaler, encoder, imputer, selector, or other fitted transform was applied.",
    }
    return result, report
