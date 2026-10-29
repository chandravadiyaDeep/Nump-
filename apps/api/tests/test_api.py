"""Smoke tests for the public NUMPA API contract."""
from __future__ import annotations

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
