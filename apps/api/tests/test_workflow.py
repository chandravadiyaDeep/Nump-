"""Small contract tests for NUMPA's first supported tabular workflow."""
import io
import pandas as pd
from fastapi.testclient import TestClient
from app.main import app
from app.cleaning import clean_dataframe, propose_cleaning
from app.readiness import score_readiness

client = TestClient(app)


def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_csv_inspection_reports_shape_and_missing_values():
    response = client.post("/api/v1/datasets/inspect", files={"file": ("people.csv", io.BytesIO(b"age,city\n20,Ahmedabad\n,Surat\n30,Ahmedabad\n"), "text/csv")})
    assert response.status_code == 200
    data = response.json()
    assert data["overview"]["row_count"] == 3
    assert data["overview"]["column_count"] == 2
    assert data["overview"]["total_missing_cells"] == 1
    assert "cleaning_plan" in data


def test_unsupported_extension_is_rejected():
    response = client.post("/api/v1/datasets/inspect", files={"file": ("images.zip", io.BytesIO(b"not a supported archive"), "application/zip")})
    assert response.status_code == 400


def test_cleaning_is_audited_without_mutating_input():
    source = pd.DataFrame({"amount": [10.0, None, 12.0], "name": [" A ", "B", "B"]})
    original = source.copy(deep=True)
    plan = propose_cleaning(source)
    cleaned, report = clean_dataframe(source)
    pd.testing.assert_frame_equal(source, original)
    assert report["after"]["missing_cells"] == 0
    assert any(action["issue"] == "missing_values" for action in plan["actions"])
    assert cleaned.loc[0, "name"] == "A"


def test_readiness_score_is_bounded_and_explained():
    frame = pd.DataFrame({"feature": [1, 2, 3, 4], "label": ["a", "b", "a", "b"]})
    result = score_readiness(frame, task="classification", target="label")
    assert 0 <= result["score"] <= 100
    assert result["dimensions"]
    assert "caveat" in result
