from __future__ import annotations

import numpy as np
import pandas as pd
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.readiness import score_readiness
import app.ml_labs as ml_labs

client = TestClient(app)


def _classification_frame(rows: int = 60) -> pd.DataFrame:
    return pd.DataFrame({
        "signal": [float(index % 11) for index in range(rows)],
        "group": ["north" if index % 2 else "south" for index in range(rows)],
        "label": ["yes" if index % 2 else "no" for index in range(rows)],
    })


def _regression_frame(rows: int = 60) -> pd.DataFrame:
    return pd.DataFrame({
        "signal": [float(index % 13) for index in range(rows)],
        "group": ["north" if index % 2 else "south" for index in range(rows)],
        "value": [float(index * 2 + index % 5) for index in range(rows)],
    })


@pytest.mark.parametrize("task,target", [
    ("classification", "label"),
    ("regression", "value"),
    ("forecasting", "value"),
    ("clustering", None),
])
def test_readiness_task_families_return_deterministic_dimensions(task: str, target: str | None) -> None:
    frame = _classification_frame()
    if task in {"regression", "forecasting"}:
        frame["value"] = np.arange(len(frame), dtype=float)
        target = "value"
    first = score_readiness(frame, task=task, target=target)
    second = score_readiness(frame, task=task, target=target)
    assert first == second
    assert first["task"] == task
    assert first["target"] == target
    assert 0 <= first["score"] <= 100
    assert [dimension["name"] for dimension in first["dimensions"]] == ["data_quality", "dataset_size_and_shape", "task_and_target", "feature_availability"]
    assert first["caveat"]


def test_readiness_clustering_accepts_no_target() -> None:
    result = client.post("/api/v1/ml-readiness/score", files={"file": ("cluster.csv", _classification_frame().to_csv(index=False), "text/csv")}, data={"task": "clustering"})
    assert result.status_code == 200
    assert result.json()["task"] == "clustering"
    assert result.json()["target"] is None


@pytest.mark.parametrize("task,frame,target,expected_algorithms,expected_metrics", [
    ("classification", _classification_frame(), "label", ["Logistic Regression", "Random Forest", "Extra Trees"], {"CA", "Precision", "Recall", "F1-Score", "AUC"}),
    ("regression", _regression_frame(), "value", ["Linear Regression", "Ridge Regression", "Random Forest Regressor"], {"MSE", "RMSE", "MAE", "R2"}),
])
def test_ml_lab_contract_reports_supported_algorithms_metrics_and_holdout(task, frame, target, expected_algorithms, expected_metrics) -> None:
    response = client.post("/api/v1/ml-labs/compare", files={"file": ("baseline.csv", frame.to_csv(index=False), "text/csv")}, data={"task": task, "target": target})
    assert response.status_code == 200
    result = response.json()
    assert result["task"] == task and result["target"] == target
    assert result["validation"]["method"] == "80/20 holdout"
    assert result["validation"]["random_state"] == 42
    assert [model["algorithm"] for model in result["models"]] == expected_algorithms
    for model in result["models"]:
        assert model["status"] in {"ok", "failed"}
        if model["status"] == "ok":
            assert set(model["metrics"]) == expected_metrics


def test_ml_lab_rejects_forecasting_and_clustering() -> None:
    frame = _classification_frame()
    for task in ("forecasting", "clustering"):
        with pytest.raises(ml_labs.ModelEvaluationError, match="supports classification and regression"):
            ml_labs.compare_models(frame, task=task, target="label")


def test_ml_lab_excludes_target_and_fits_pipeline_on_training_rows(monkeypatch: pytest.MonkeyPatch) -> None:
    frame = _classification_frame()
    frame.loc[48:, "group"] = "holdout-only-category"
    training_indices: set[int] = set()
    holdout_indices: set[int] = set()
    predictor_columns: list[str] = []
    fitted_indices: list[set[int]] = []
    pipelines: list[object] = []

    def record_split(X, y, **kwargs):
        # Hold out the last 12 rows deterministically so the category is test-only.
        X_train, X_test = X.iloc[:-12], X.iloc[-12:]
        y_train, y_test = y.iloc[:-12], y.iloc[-12:]
        training_indices.update(X_train.index)
        holdout_indices.update(X_test.index)
        predictor_columns.extend(X.columns)
        return X_train, X_test, y_train, y_test

    original_pipeline = ml_labs.Pipeline

    class RecordingPipeline(original_pipeline):
        def fit(self, X, y=None, **params):
            fitted_indices.append(set(X.index))
            result = super().fit(X, y, **params)
            pipelines.append(self)
            return result

    monkeypatch.setattr(ml_labs, "train_test_split", record_split)
    monkeypatch.setattr(ml_labs, "Pipeline", RecordingPipeline)
    result = ml_labs.compare_models(frame, task="classification", target="label")
    assert len(result["models"]) == 3
    assert "label" not in predictor_columns
    assert training_indices.isdisjoint(holdout_indices)
    assert len(training_indices | holdout_indices) == len(frame)
    assert len(fitted_indices) == 3
    assert all(indices == training_indices for indices in fitted_indices)
    # The actual comparison pipelines never learn a category found only in held-out rows.
    for fitted in pipelines:
        encoder = fitted.named_steps["preprocessor"].named_transformers_["categorical"].named_steps["encoder"]
        assert all("holdout-only-category" not in categories for categories in encoder.categories_)