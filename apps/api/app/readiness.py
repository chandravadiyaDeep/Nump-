"""Deterministic, explainable baseline ML-readiness scoring."""
from __future__ import annotations

from typing import Any
import pandas as pd


def score_readiness(frame: pd.DataFrame, task: str = "classification", target: str | None = None) -> dict[str, Any]:
    """Score data quality and task prerequisites without implying guaranteed accuracy."""
    task = task.lower().strip()
    allowed = {"classification", "regression", "forecasting", "clustering"}
    if task not in allowed:
        raise ValueError(f"Task must be one of: {', '.join(sorted(allowed))}.")
    n_rows, n_cols = frame.shape
    missing_rate = float(frame.isna().to_numpy().sum() / max(n_rows * n_cols, 1))
    duplicate_rate = float(frame.duplicated().sum() / max(n_rows, 1))
    numeric = frame.select_dtypes(include="number").columns.tolist()
    dimensions: list[dict[str, Any]] = []
    issues: list[str] = []
    quality = max(0.0, 100.0 - 100.0 * missing_rate - 20.0 * min(duplicate_rate, 1.0))
    dimensions.append({"name": "data_quality", "score": round(quality, 1), "weight": 0.35, "explanation": "Penalizes missing cells and exact duplicate rows."})
    if missing_rate:
        issues.append(f"{missing_rate:.1%} of cells are missing.")
    if duplicate_rate:
        issues.append(f"{duplicate_rate:.1%} of rows are exact duplicates.")
    shape_score = min(100.0, 35.0 + 12.0 * min(n_rows, 10) + 2.0 * min(n_cols, 15))
    dimensions.append({"name": "dataset_size_and_shape", "score": round(shape_score, 1), "weight": 0.20, "explanation": "Coarse shape heuristic; larger data is not automatically better."})
    if n_rows < 30:
        issues.append("Fewer than 30 rows: validation estimates and model comparisons may be unstable.")
    target_score = 70.0
    if task != "clustering":
        if not target or target not in frame.columns:
            target_score = 20.0
            issues.append("Choose a valid target column before supervised model training.")
        else:
            values = frame[target].dropna()
            target_score = 100.0 if len(values) == n_rows else 65.0
            if values.nunique() < 2:
                target_score = 0.0
                issues.append("Target has fewer than two observed values.")
            if task == "classification" and values.nunique() > max(20, int(n_rows * 0.5)):
                issues.append("Target has many unique values; verify that classification is intended.")
    dimensions.append({"name": "task_and_target", "score": round(target_score, 1), "weight": 0.25, "explanation": "Checks target selection, completeness and basic variation."})
    feature_score = 75.0 if n_cols > (1 if task != "clustering" and target in frame.columns else 0) else 20.0
    if task in {"regression", "forecasting"} and not numeric:
        feature_score = 25.0
        issues.append("No numeric columns were detected; numeric feature preparation may be needed.")
    dimensions.append({"name": "feature_availability", "score": round(feature_score, 1), "weight": 0.20, "explanation": "Checks whether candidate feature columns appear to be present."})
    score = round(sum(d["score"] * d["weight"] for d in dimensions))
    return {
        "task": task, "target": target, "score": score,
        "status": "Good starting point" if score >= 75 else "Needs preparation" if score >= 50 else "Significant issues",
        "dimensions": dimensions, "issues": issues,
        "caveat": "This is a heuristic data-preparation score, not a prediction of model accuracy or business value.",
    }
