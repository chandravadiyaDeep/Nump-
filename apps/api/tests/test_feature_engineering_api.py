"""API contract tests for feature engineering endpoints."""
import io
import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def _upload():
    return {"file": ("sample.csv", io.BytesIO(b"date,amount,label\n2025-01-02,10,1\n2025-02-03,20,0\n"), "text/csv")}


def test_feature_preview_protects_target_and_returns_audit():
    response = client.post("/api/v1/features/preview", files=_upload(), data={
        "operations_json": json.dumps([{"type": "date_parts", "column": "date", "parts": ["year", "month"]}]),
        "task": "classification", "target": "label",
    })
    assert response.status_code == 200
    payload = response.json()
    assert "date_year" in payload["columns"]
    assert payload["report"]["validation"]["target_values_unchanged"] is True


def test_feature_preview_rejects_target_leakage_attempt():
    response = client.post("/api/v1/features/preview", files=_upload(), data={
        "operations_json": json.dumps([{"type": "missing_indicator", "column": "label"}]),
        "task": "classification", "target": "label",
    })
    assert response.status_code == 400
    assert "target column is protected" in response.json()["detail"]


def test_feature_execute_returns_separate_csv():
    response = client.post("/api/v1/features/execute", files=_upload(), data={
        "operations_json": json.dumps([{"type": "numeric_interaction", "left_column": "amount", "right_column": "amount", "operator": "multiply", "new_column": "amount_squared"}]),
        "task": "regression", "target": "label",
    })
    assert response.status_code == 200
    assert "amount_squared" in response.text
    assert "features.csv" in response.headers["content-disposition"]
