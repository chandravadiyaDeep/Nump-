"""API contract tests for previewable transformation requests."""
import csv
from io import StringIO
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_transformation_preview_returns_audit_and_sample_without_persisting_source():
    source = "years,city\n20,Surat\n31,Ahmedabad\n17,Surat\n"
    operations = [
        {"type": "rename_column", "column": "years", "new_name": "age"},
        {"type": "cast_numeric", "column": "age"},
        {"type": "filter_rows", "column": "age", "operator": "gte", "value": 20},
    ]
    response = client.post(
        "/api/v1/transformations/preview",
        files={"file": ("people.csv", source, "text/csv")},
        data={"operations_json": __import__("json").dumps(operations)},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["report"]["before"]["rows"] == 3
    assert body["report"]["after"]["rows"] == 2
    assert body["columns"] == ["age", "city"]
    assert body["preview"][0]["age"] == 20
    assert body["download_available"] is True

    # A second inspection of the original upload must still see the original data.
    inspect = client.post("/api/v1/datasets/inspect", files={"file": ("people.csv", source, "text/csv")})
    assert inspect.status_code == 200
    assert inspect.json()["overview"]["row_count"] == 3
    assert inspect.json()["columns"][0]["name"] == "years"


def test_transformation_execute_returns_separate_csv():
    source = "name,amount\nA,10\nB,20\n"
    operations = [{"type": "cast_numeric", "column": "amount"}]
    response = client.post(
        "/api/v1/transformations/execute",
        files={"file": ("sales.csv", source, "text/csv")},
        data={"operations_json": __import__("json").dumps(operations)},
    )
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    assert "sales-transformed.csv" in response.headers["content-disposition"]
    rows = list(csv.DictReader(StringIO(response.text)))
    assert rows == [{"name": "A", "amount": "10"}, {"name": "B", "amount": "20"}]


def test_transformation_api_rejects_invalid_operation_without_500():
    response = client.post(
        "/api/v1/transformations/preview",
        files={"file": ("people.csv", "age\n20\n", "text/csv")},
        data={"operations_json": '[{"type":"run_code","code":"1+1"}]'},
    )
    assert response.status_code == 400
    assert "Unsupported transformation" in response.json()["detail"]


def test_transformation_api_rejects_malformed_json():
    response = client.post(
        "/api/v1/transformations/preview",
        files={"file": ("people.csv", "age\n20\n", "text/csv")},
        data={"operations_json": "{not-json"},
    )
    assert response.status_code == 400
    assert "valid JSON" in response.json()["detail"]
