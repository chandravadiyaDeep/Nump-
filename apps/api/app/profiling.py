"""Dataset profiling primitives used by inspection and readiness endpoints."""
from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd


def _safe_value(value: Any) -> Any:
    """Convert pandas/numpy values into JSON-compatible values."""
    if pd.isna(value):
        return None
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        return float(value)
    if isinstance(value, (np.bool_,)):
        return bool(value)
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return value if isinstance(value, (str, int, float, bool)) else str(value)


def _column_profile(series: pd.Series) -> dict[str, Any]:
    missing = int(series.isna().sum())
    profile: dict[str, Any] = {
        "name": str(series.name), "dtype": str(series.dtype),
        "missing_count": missing,
        "missing_percent": round(missing * 100 / max(len(series), 1), 2),
        "unique_count": int(series.nunique(dropna=True)),
    }
    if pd.api.types.is_numeric_dtype(series):
        valid = pd.to_numeric(series, errors="coerce").dropna()
        if not valid.empty:
            profile["numeric_summary"] = {
                "min": _safe_value(valid.min()), "max": _safe_value(valid.max()),
                "mean": _safe_value(valid.mean()), "median": _safe_value(valid.median()),
                "std": _safe_value(valid.std()) if len(valid) > 1 else 0.0,
            }
    else:
        top = series.dropna().astype(str).value_counts().head(5)
        profile["top_values"] = [{"value": str(k), "count": int(v)} for k, v in top.items()]
    return profile


def profile_dataframe(frame: pd.DataFrame, preview_rows: int = 20) -> dict[str, Any]:
    """Return concise overview, quality diagnostics, preview and chart-ready summaries."""
    numeric = list(frame.select_dtypes(include="number").columns)
    categorical = [c for c in frame.columns if c not in numeric]
    preview = [
        {str(k): _safe_value(v) for k, v in row.items()}
        for row in frame.head(preview_rows).to_dict(orient="records")
    ]
    charts: list[dict[str, Any]] = []
    for column in numeric[:8]:
        values = pd.to_numeric(frame[column], errors="coerce").dropna()
        if not values.empty:
            counts, edges = np.histogram(values, bins=min(10, max(3, int(np.sqrt(len(values))))))
            charts.append({
                "type": "histogram", "column": str(column),
                "bins": [
                    {"start": round(float(edges[i]), 5), "end": round(float(edges[i + 1]), 5), "count": int(counts[i])}
                    for i in range(len(counts))
                ],
            })
    for column in categorical[:8]:
        counts = frame[column].fillna("(missing)").astype(str).value_counts().head(10)
        charts.append({
            "type": "bar", "column": str(column),
            "values": [{"label": str(k), "count": int(v)} for k, v in counts.items()],
        })
    return {
        "overview": {
            "row_count": int(len(frame)), "column_count": int(len(frame.columns)),
            "duplicate_row_count": int(frame.duplicated().sum()),
            "numeric_column_count": len(numeric), "non_numeric_column_count": len(categorical),
            "total_missing_cells": int(frame.isna().sum().sum()),
            "memory_usage_bytes": int(frame.memory_usage(deep=True).sum()),
        },
        "columns": [_column_profile(frame[c]) for c in frame.columns],
        "preview": preview, "visualization_summaries": charts,
    }
