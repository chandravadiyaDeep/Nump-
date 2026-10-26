"""Conservative, explainable data-cleaning suggestions and execution."""
from __future__ import annotations

from typing import Any

import pandas as pd


def propose_cleaning(frame: pd.DataFrame) -> dict[str, Any]:
    """Suggest safe, reviewable actions instead of silently mutating user data."""
    actions: list[dict[str, Any]] = []
    for column in frame.columns:
        series = frame[column]
        missing = int(series.isna().sum())
        if missing:
            if pd.api.types.is_numeric_dtype(series):
                valid = pd.to_numeric(series, errors="coerce").dropna()
                if valid.empty:
                    strategy, reason = "leave_unchanged", "Entirely missing columns should not be filled with invented data."
                else:
                    skew = float(valid.skew()) if len(valid) > 2 else 0.0
                    strategy = "median" if abs(skew) > 1 else "mean"
                    reason = "Median is robust to skew." if strategy == "median" else "Mean is a reasonable baseline for this numeric distribution."
            else:
                valid = series.dropna()
                strategy = "mode" if not valid.empty and valid.nunique() < 30 else "unknown_category"
                reason = "Use the most frequent category for this low-cardinality column." if strategy == "mode" else "An explicit Unknown category preserves missingness."
            actions.append({
                "column": str(column), "issue": "missing_values", "count": missing,
                "strategy": strategy, "reason": reason, "requires_approval": True,
            })
    duplicate_count = int(frame.duplicated().sum())
    if duplicate_count:
        actions.append({
            "column": None, "issue": "exact_duplicate_rows", "count": duplicate_count,
            "strategy": "drop_exact_duplicates",
            "reason": "Rows identical across every column may be redundant; review before applying.",
            "requires_approval": True,
        })
    for column in frame.select_dtypes(include="number").columns:
        values = pd.to_numeric(frame[column], errors="coerce").dropna()
        if len(values) >= 8:
            q1, q3 = values.quantile([0.25, 0.75])
            spread = q3 - q1
            if spread > 0:
                outliers = int(((values < q1 - 1.5 * spread) | (values > q3 + 1.5 * spread)).sum())
                if outliers:
                    actions.append({
                        "column": str(column), "issue": "potential_outliers", "count": outliers,
                        "strategy": "flag_only",
                        "reason": "IQR flags unusual values but does not prove they are errors; no values are changed.",
                        "requires_approval": False,
                    })
    return {
        "strategy": "conservative_general_rules", "actions": actions,
        "action_count": len(actions),
        "note": "Recommendations are heuristics. Confirm business meaning before destructive changes.",
    }


def clean_dataframe(
    frame: pd.DataFrame, *, fill_missing: bool = True,
    drop_exact_duplicates: bool = False, normalize_text: bool = True,
) -> tuple[pd.DataFrame, dict[str, Any]]:
    """Apply explicit safe actions and return a before/after audit report."""
    cleaned = frame.copy(deep=True)
    operations: list[dict[str, Any]] = []
    before_rows, before_columns = cleaned.shape
    before_missing, before_duplicates = int(cleaned.isna().sum().sum()), int(cleaned.duplicated().sum())

    if normalize_text:
        for column in cleaned.select_dtypes(include=["object", "string"]).columns:
            original = cleaned[column]
            # Trimming is safer than case-folding, which can alter labels or identifiers.
            cleaned[column] = original.map(lambda v: v.strip() if isinstance(v, str) else v)
            changed = int((original.fillna("\0") != cleaned[column].fillna("\0")).sum())
            if changed:
                operations.append({"operation": "trim_whitespace", "column": str(column), "changed_cells": changed})

    if fill_missing:
        for column in cleaned.columns:
            series = cleaned[column]
            missing = int(series.isna().sum())
            if not missing:
                continue
            if pd.api.types.is_numeric_dtype(series):
                valid = pd.to_numeric(series, errors="coerce").dropna()
                if valid.empty:
                    operations.append({"operation": "skipped_all_missing_column", "column": str(column), "cells": missing})
                    continue
                skew = float(valid.skew()) if len(valid) > 2 else 0.0
                method = "median" if abs(skew) > 1 else "mean"
                value = valid.median() if method == "median" else valid.mean()
                cleaned[column] = series.fillna(value)
                operations.append({"operation": "impute_numeric", "column": str(column), "method": method, "filled_cells": missing, "value": float(value)})
            else:
                valid = series.dropna()
                if not valid.empty and valid.nunique() < 30:
                    value = valid.mode(dropna=True).iloc[0]
                    method = "mode"
                else:
                    value, method = "Unknown", "unknown_category"
                cleaned[column] = series.fillna(value)
                operations.append({"operation": "impute_categorical", "column": str(column), "method": method, "filled_cells": missing, "value": str(value)})

    if drop_exact_duplicates:
        removed = int(cleaned.duplicated().sum())
        cleaned = cleaned.drop_duplicates().reset_index(drop=True)
        operations.append({"operation": "drop_exact_duplicates", "removed_rows": removed})

    report = {
        "operations": operations,
        "before": {"rows": int(before_rows), "columns": int(before_columns), "missing_cells": before_missing, "duplicate_rows": before_duplicates},
        "after": {"rows": int(len(cleaned)), "columns": int(len(cleaned.columns)), "missing_cells": int(cleaned.isna().sum().sum()), "duplicate_rows": int(cleaned.duplicated().sum())},
        "validation": {"column_count_preserved": len(cleaned.columns) == before_columns, "remaining_missing_cells": int(cleaned.isna().sum().sum())},
    }
    return cleaned, report
