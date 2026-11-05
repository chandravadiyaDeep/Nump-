"""Regression tests for safe deterministic transformations."""
import pandas as pd
import pytest
from app.transformations import TransformationError, apply_transformations


def test_rename_cast_and_filter_are_applied_in_order_without_mutating_source():
    source = pd.DataFrame({"old age": ["20", "31", "17"], "city": ["Surat", "Ahmedabad", "Surat"]})
    original = source.copy(deep=True)
    transformed, report = apply_transformations(source, [
        {"type": "rename_column", "column": "old age", "new_name": "age"},
        {"type": "cast_numeric", "column": "age"},
        {"type": "filter_rows", "column": "age", "operator": "gte", "value": 20},
    ])
    pd.testing.assert_frame_equal(source, original)
    assert transformed["age"].tolist() == [20, 31]
    assert report["before"]["rows"] == 3 and report["after"]["rows"] == 2
    assert report["validation"]["source_unchanged"] is True


def test_drop_column_and_literal_contains_filter():
    source = pd.DataFrame({"city": ["New York", "Yorkshire", "Pune"], "unused": [1, 2, 3]})
    transformed, _ = apply_transformations(source, [
        {"type": "drop_column", "column": "unused"},
        {"type": "filter_rows", "column": "city", "operator": "contains", "value": "York"},
    ])
    assert transformed.to_dict(orient="records") == [{"city": "New York"}, {"city": "Yorkshire"}]


def test_invalid_numeric_cast_is_rejected_instead_of_silently_coerced():
    with pytest.raises(TransformationError, match="non-empty value"):
        apply_transformations(pd.DataFrame({"amount": ["10", "not-a-number"]}),
                              [{"type": "cast_numeric", "column": "amount"}])


def test_rename_collision_is_rejected():
    with pytest.raises(TransformationError, match="already exists"):
        apply_transformations(pd.DataFrame({"a": [1], "b": [2]}),
                              [{"type": "rename_column", "column": "a", "new_name": "b"}])


def test_cannot_drop_last_column_or_remove_all_rows():
    source = pd.DataFrame({"a": [1, 2]})
    with pytest.raises(TransformationError, match="last remaining column"):
        apply_transformations(source, [{"type": "drop_column", "column": "a"}])
    with pytest.raises(TransformationError, match="zero rows"):
        apply_transformations(source, [{"type": "filter_rows", "column": "a", "operator": "gt", "value": 10}])


def test_filter_contains_treats_user_text_as_literal_not_regex():
    source = pd.DataFrame({"code": ["A.1", "AB1", "A.2"]})
    transformed, _ = apply_transformations(source, [{"type": "filter_rows", "column": "code", "operator": "contains", "value": "."}])
    assert transformed["code"].tolist() == ["A.1", "A.2"]


def test_unknown_operation_and_excessive_operations_are_rejected():
    source = pd.DataFrame({"a": [1, 2]})
    with pytest.raises(TransformationError, match="Unsupported transformation"):
        apply_transformations(source, [{"type": "execute_python", "code": "1+1"}])
    with pytest.raises(TransformationError, match="maximum"):
        apply_transformations(source, [{"type": "rename_column", "column": "a", "new_name": "a"}] * 26)
