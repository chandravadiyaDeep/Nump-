"""Smoke tests for the public NUMPA API contract."""
from __future__ import annotations

import csv
from io import StringIO

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint_returns_ok() -> None:
    """The hosting health check must be cheap and independent of uploaded files."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_inspect_csv_dataset() -> None:
    """A small CSV should return a useful profile and a cleaning plan."""
    response = client.post(
        "/api/v1/datasets/inspect",
        files={"file": ("sample.csv", "age,city\n20,Ahmedabad\n,Surat\n", "text/csv")},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["overview"]["row_count"] == 2
    assert body["overview"]["column_count"] == 2
    assert body["overview"]["total_missing_cells"] == 1
    assert "cleaning_plan" in body


def test_cleaning_preview_does_not_require_saving_source() -> None:
    """Preview should return an audit report and a sample of cleaned values."""
    response = client.post(
        "/api/v1/cleaning/preview",
        files={"file": ("sample.csv", "age,city\n20, Ahmedabad \n,Surat\n", "text/csv")},
        data={"fill_missing": "true", "drop_exact_duplicates": "false", "normalize_text": "true"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "report" in body
    assert body["download_available"] is True
    assert body["preview"][0]["city"] == "Ahmedabad"


def test_readiness_rejects_unknown_task() -> None:
    """Bad task values should be a clear client error rather than a server crash."""
    response = client.post(
        "/api/v1/ml-readiness/score",
        files={"file": ("sample.csv", "x,label\n1,a\n2,b\n", "text/csv")},
        data={"task": "unknown", "target": "label"},
    )
    assert response.status_code == 400
    assert "Task must be one of" in response.json()["detail"]


def test_unsupported_upload_returns_client_error() -> None:
    """Unsupported extensions should never become an internal server error."""
    response = client.post(
        "/api/v1/datasets/inspect",
        files={"file": ("sample.exe", "not a dataset", "application/octet-stream")},
    )
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]


def test_empty_upload_returns_client_error() -> None:
    """Empty uploads should return a helpful 400 response."""
    response = client.post(
        "/api/v1/datasets/inspect",
        files={"file": ("empty.csv", "", "text/csv")},
    )
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_phase2_profile_preview_and_cleaning_contracts() -> None:
    """The Phase 2 UI consumes only returned profiles and existing cleaning options."""
    source = "age,city\n10, Boston \n,Chicago\n10, Boston \n"
    upload = {"file": ("sample.csv", source, "text/csv")}

    inspected = client.post("/api/v1/datasets/inspect", files=upload)
    assert inspected.status_code == 200
    profile = inspected.json()
    assert profile["dataset"]["filename"] == "sample.csv"
    assert profile["dataset"]["format"] == "csv"
    assert profile["overview"]["row_count"] == 3
    assert profile["overview"]["column_count"] == 2
    assert profile["overview"]["total_missing_cells"] == 1
    assert profile["overview"]["duplicate_row_count"] == 1
    columns = {column["name"]: column for column in profile["columns"]}
    assert columns["age"]["missing_count"] == 1
    assert "numeric_summary" in columns["age"]
    assert "top_values" in columns["city"]
    assert any(action["issue"] == "missing_values" for action in profile["cleaning_plan"]["actions"])
    assert any(action["issue"] == "exact_duplicate_rows" for action in profile["cleaning_plan"]["actions"])

    preview = client.post(
        "/api/v1/cleaning/preview",
        files={"file": ("sample.csv", source, "text/csv")},
        data={"fill_missing": "true", "drop_exact_duplicates": "false", "normalize_text": "true"},
    )
    assert preview.status_code == 200
    preview_body = preview.json()
    assert preview_body["report"]["before"]["rows"] == 3
    assert preview_body["report"]["after"]["rows"] == 3
    assert preview_body["report"]["after"]["missing_cells"] == 0
    assert preview_body["preview"][0]["city"] == "Boston"
    assert any(item["operation"] == "impute_numeric" for item in preview_body["report"]["operations"])

    duplicate_preview = client.post(
        "/api/v1/cleaning/preview",
        files={"file": ("sample.csv", source, "text/csv")},
        data={"fill_missing": "false", "drop_exact_duplicates": "true", "normalize_text": "false"},
    )
    assert duplicate_preview.status_code == 200
    assert duplicate_preview.json()["report"]["after"]["rows"] == 2
    assert duplicate_preview.json()["report"]["after"]["missing_cells"] == 1
    assert duplicate_preview.json()["preview"][0]["city"] == " Boston "

    exported = client.post(
        "/api/v1/cleaning/execute",
        files={"file": ("sample.csv", source, "text/csv")},
        data={"fill_missing": "true", "drop_exact_duplicates": "false", "normalize_text": "true"},
    )
    assert exported.status_code == 200
    assert exported.headers["content-type"].startswith("text/csv")
    assert exported.text.startswith("age,city\n")
    exported_rows = list(csv.reader(StringIO(exported.text)))
    assert exported_rows[0] == ["age", "city"]
    assert len(exported_rows) == 4

    source_after = client.post("/api/v1/datasets/inspect", files=upload).json()
    assert source_after["overview"] == profile["overview"]


def test_malformed_csv_returns_client_error() -> None:
    """Malformed tabular input should be reported as a user error."""
    response = client.post(
        "/api/v1/datasets/inspect",
        files={"file": ("malformed.csv", 'a,b\n"unterminated,1\n', "text/csv")},
    )
    assert response.status_code == 400
    assert "Could not read this dataset" in response.json()["detail"]


def test_oversized_upload_returns_payload_too_large() -> None:
    """The existing API limit rejects a synthetic upload above 50 MB."""
    from app.ingestion import MAX_UPLOAD_BYTES

    response = client.post(
        "/api/v1/datasets/inspect",
        files={"file": ("large.csv", b"x" * (MAX_UPLOAD_BYTES + 1), "text/csv")},
    )
    assert response.status_code == 413
    assert "50 MB" in response.json()["detail"]
