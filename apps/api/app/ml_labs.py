"""Leakage-aware baseline model comparisons for tabular classification/regression."""
from __future__ import annotations
from typing import Any
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, f1_score, mean_absolute_error, mean_squared_error, precision_score, r2_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression, LinearRegression, Ridge
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, ExtraTreesClassifier


class ModelEvaluationError(ValueError):
    """Raised when safe baseline evaluation is not feasible."""


def _build_preprocessor(features: pd.DataFrame, scale_numeric: bool) -> ColumnTransformer:
    numeric_columns = features.select_dtypes(include=["number", "bool"]).columns.tolist()
    categorical_columns = [c for c in features.columns if c not in numeric_columns]
    numeric_steps: list[tuple[str, Any]] = [("imputer", SimpleImputer(strategy="median"))]
    if scale_numeric:
        numeric_steps.append(("scaler", StandardScaler()))
    categorical = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore")),
    ])
    return ColumnTransformer(transformers=[
        ("numeric", Pipeline(steps=numeric_steps), numeric_columns),
        ("categorical", categorical, categorical_columns),
    ], remainder="drop")


def compare_models(frame: pd.DataFrame, task: str, target: str) -> dict[str, Any]:
    """Fit three baseline pipelines using an 80/20 holdout split."""
    task = task.lower().strip()
    if task not in {"classification", "regression"}:
        raise ModelEvaluationError("MVP model comparison currently supports classification and regression.")
    if not target or target not in frame.columns:
        raise ModelEvaluationError("Provide a target column that exists in the dataset.")
    work = frame.dropna(subset=[target]).copy()
    if len(work) < 20:
        raise ModelEvaluationError("At least 20 rows with a non-missing target are recommended.")
    y = work[target]
    X = work.drop(columns=[target])
    if X.empty:
        raise ModelEvaluationError("At least one feature column besides the target is required.")
    X = X.dropna(axis=1, how="all")
    if X.empty:
        raise ModelEvaluationError("All feature columns are entirely missing.")
    if task == "classification":
        if y.nunique() < 2:
            raise ModelEvaluationError("Classification requires at least two target classes.")
        counts = y.value_counts()
        stratify = y if counts.min() >= 2 and counts.size > 1 else None
        try:
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=stratify)
        except ValueError as exc:
            raise ModelEvaluationError(f"Could not create a valid holdout split: {exc}") from exc
        candidates = [
            ("Logistic Regression", LogisticRegression(max_iter=1000), True),
            ("Random Forest", RandomForestClassifier(n_estimators=120, random_state=42, n_jobs=-1), False),
            ("Extra Trees", ExtraTreesClassifier(n_estimators=120, random_state=42, n_jobs=-1), False),
        ]
    else:
        if not pd.api.types.is_numeric_dtype(y):
            try:
                y = pd.to_numeric(y, errors="raise")
            except (ValueError, TypeError) as exc:
                raise ModelEvaluationError("Regression target must be numeric.") from exc
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        candidates = [
            ("Linear Regression", LinearRegression(), True),
            ("Ridge Regression", Ridge(), True),
            ("Random Forest Regressor", RandomForestRegressor(n_estimators=120, random_state=42, n_jobs=-1), False),
        ]
    results = []
    for name, estimator, scale in candidates:
        pipeline = Pipeline(steps=[("preprocessor", _build_preprocessor(X_train, scale)), ("model", estimator)])
        try:
            pipeline.fit(X_train, y_train)
            predictions = pipeline.predict(X_test)
            if task == "classification":
                metrics: dict[str, float | None] = {
                    "CA": float(accuracy_score(y_test, predictions)),
                    "Precision": float(precision_score(y_test, predictions, average="weighted", zero_division=0)),
                    "Recall": float(recall_score(y_test, predictions, average="weighted", zero_division=0)),
                    "F1-Score": float(f1_score(y_test, predictions, average="weighted", zero_division=0)),
                    "AUC": None,
                }
                if hasattr(pipeline, "predict_proba"):
                    probabilities = pipeline.predict_proba(X_test)
                    classes = getattr(pipeline.named_steps["model"], "classes_", [])
                    try:
                        if len(classes) == 2 and len(np.unique(y_test)) == 2:
                            metrics["AUC"] = float(roc_auc_score(y_test, probabilities[:, 1]))
                        elif len(classes) > 2 and len(np.unique(y_test)) > 1:
                            metrics["AUC"] = float(roc_auc_score(y_test, probabilities, multi_class="ovr", average="weighted", labels=classes))
                    except ValueError:
                        metrics["AUC"] = None
            else:
                mse = float(mean_squared_error(y_test, predictions))
                metrics = {"MSE": mse, "RMSE": float(np.sqrt(mse)), "MAE": float(mean_absolute_error(y_test, predictions)), "R2": float(r2_score(y_test, predictions)) if len(y_test) >= 2 else None}
            results.append({"algorithm": name, "metrics": metrics, "status": "ok"})
        except Exception as exc:
            results.append({"algorithm": name, "metrics": {}, "status": "failed", "error": f"{type(exc).__name__}: {exc}"})
    if not any(r["status"] == "ok" for r in results):
        raise ModelEvaluationError("All baseline algorithms failed. Check data types and target values.")
    return {
        "task": task, "target": target,
        "validation": {"method": "80/20 holdout", "random_state": 42, "note": "Preprocessing is fitted on training data only. Forecasting requires chronological validation."},
        "models": results,
        "metric_guidance": "AUC may be unavailable if the holdout lacks classes." if task == "classification" else "MSE, RMSE, MAE and R2 are regression metrics; R2 can be negative.",
        "warning": "Baseline holdout results are estimates and may vary with data and validation strategy.",
    }
