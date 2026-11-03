"""Tests for stateless feature engineering and target protection."""
import pandas as pd
import pytest

from app.feature_engineering import FeatureEngineeringError, apply_feature_operations


def test_date_parts_are_deterministic_and_preserve_target_and_source():
    source = pd.DataFrame({"order_date": ["2025-01-02", "2025-03-04"], "revenue": [10, 20]})
    original = source.copy(deep=True)
    result, report = apply_feature_operations(
        source, [{"type": "date_parts", "column": "order_date", "parts": ["year", "month", "dayofweek"]}],
        target="revenue", task="regression",
    )
    pd.testing.assert_frame_equal(source, original)
    assert result["order_date_year"].tolist() == [2025, 2025]
    assert result["order_date_month"].tolist() == [1, 3]
    assert result["revenue"].equals(source["revenue"])
    assert report["validation"]["no_fitted_parameters"] is True


def test_numeric_interaction_and_missing_indicator():
    source = pd.DataFrame({"price": [10, 20], "quantity": [2, 3], "note": ["ok", None], "sales": [20, 60]})
    result, _ = apply_feature_operations(source, [
        {"type": "numeric_interaction", "left_column": "price", "right_column": "quantity", "operator": "multiply", "new_column": "gross"},
        {"type": "missing_indicator", "column": "note"},
    ], target="sales", task="regression")
    assert result["gross"].tolist() == [20, 60]
    assert result["note_is_missing"].tolist() == [0, 1]


@pytest.mark.parametrize("operation", [
    {"type": "date_parts", "column": "label", "parts": ["year"]},
    {"type": "missing_indicator", "column": "label"},
    {"type": "numeric_interaction", "left_column": "amount", "right_column": "label", "operator": "add", "new_column": "bad"},
])
def test_target_column_cannot_be_used_as_feature_source(operation):
    source = pd.DataFrame({"amount": [2, 3], "label": [0, 1]})
    with pytest.raises(FeatureEngineeringError, match="target column is protected"):
        apply_feature_operations(source, [operation], target="label", task="classification")


def test_clustering_has_no_target_and_forecasting_requires_target():
    source = pd.DataFrame({"amount": [1, 2]})
    with pytest.raises(FeatureEngineeringError, match="does not use a target"):
        apply_feature_operations(source, [{"type": "missing_indicator", "column": "amount"}], target="amount", task="clustering")
    with pytest.raises(FeatureEngineeringError, match="Select a target"):
        apply_feature_operations(source, [{"type": "missing_indicator", "column": "amount"}], target=None, task="forecasting")


def test_invalid_dates_collisions_and_unknown_ops_fail_closed():
    source = pd.DataFrame({"date": ["not-a-date", "2025-01-01"], "x": [1, 2], "y": [0, 1]})
    with pytest.raises(FeatureEngineeringError, match="invalid non-empty"):
        apply_feature_operations(source, [{"type": "date_parts", "column": "date", "parts": ["year"]}], target="y", task="classification")
    with pytest.raises(FeatureEngineeringError, match="already exists"):
        apply_feature_operations(source, [{"type": "missing_indicator", "column": "x", "new_column": "y"}], target="y", task="classification")
    with pytest.raises(FeatureEngineeringError, match="Unsupported feature operation"):
        apply_feature_operations(source, [{"type": "fit_scaler", "column": "x"}], target="y", task="classification")
