"""FastAPI entry point for the NUMPA tabular MVP."""
from __future__ import annotations
import io
import os
from typing import Annotated
import pandas as pd
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from .cleaning import clean_dataframe, propose_cleaning
from .ingestion import DatasetInputError, MAX_UPLOAD_BYTES, load_dataframe
from .ml_labs import ModelEvaluationError, compare_models
from .profiling import profile_dataframe
from .readiness import score_readiness

app = FastAPI(title="NUMPA API", description="MVP for dataset inspection, cleaning, readiness and model comparison.", version="0.1.0")
# Allow the production website by default, while retaining local development origins.
# Explicit Render environment origins are added rather than replacing safe defaults.
default_origins = [
    "https://numpa.online",
    "https://www.numpa.online",
    "https://numpa.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
configured_origins = [
    origin.strip()
    for origin in os.getenv("NUMPA_CORS_ORIGINS", "").split(",")
    if origin.strip()
]
origins = list(dict.fromkeys([*default_origins, *configured_origins]))
# Permit Vercel preview deployments for this project as well as the explicit production origins.
# The regex is scoped to this project's Vercel preview hostname pattern.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://numpa-[a-z0-9-]+-depochandravadiya-6509s-projects\.vercel\.app",
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


def _load_upload(filename: str | None, content: bytes) -> pd.DataFrame:
    """Convert parser errors into readable API responses."""
    try:
        return load_dataframe(filename or "upload.csv", content)
    except DatasetInputError as exc:
        message = str(exc)
        status = 413 if "limit" in message.lower() or "exceeds" in message.lower() else 400
        raise HTTPException(status_code=status, detail=message) from exc


async def _read_upload(file: UploadFile) -> bytes:
    """Read at most the configured maximum plus one byte."""
    content = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds the 50 MB MVP upload limit.")
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    return content


@app.get("/api/v1/health")
def health() -> dict[str, str]:
    """Health check for local development and hosting."""
    return {"status": "ok", "service": "numpa-api", "version": "0.1.0"}


@app.post("/api/v1/datasets/inspect")
async def inspect_dataset(file: Annotated[UploadFile, File(...)]) -> dict:
    """Profile a supported upload in memory without persisting it."""
    frame = _load_upload(file.filename, await _read_upload(file))
    result = profile_dataframe(frame)
    result["dataset"] = {"filename": file.filename or "upload", "format": (file.filename or "").rsplit(".", 1)[-1].lower(), "processing": "in-memory; no server-side dataset persistence"}
    result["cleaning_plan"] = propose_cleaning(frame)
    return result


@app.post("/api/v1/cleaning/preview")
async def preview_cleaning(
    file: Annotated[UploadFile, File(...)],
    fill_missing: Annotated[bool, Form()] = True,
    drop_exact_duplicates: Annotated[bool, Form()] = False,
    normalize_text: Annotated[bool, Form()] = True,
) -> dict:
    """Return cleaned preview and audit report without overwriting the original."""
    frame = _load_upload(file.filename, await _read_upload(file))
    cleaned, report = clean_dataframe(frame, fill_missing=fill_missing, drop_exact_duplicates=drop_exact_duplicates, normalize_text=normalize_text)
    preview = cleaned.head(20).astype(object).where(pd.notna(cleaned.head(20)), None).to_dict(orient="records")
    return {"report": report, "preview": preview, "columns": [str(c) for c in cleaned.columns], "download_available": True}


@app.post("/api/v1/cleaning/execute")
async def execute_cleaning(
    file: Annotated[UploadFile, File(...)],
    fill_missing: Annotated[bool, Form()] = True,
    drop_exact_duplicates: Annotated[bool, Form()] = False,
    normalize_text: Annotated[bool, Form()] = True,
) -> StreamingResponse:
    """Apply options and return a downloadable CSV."""
    frame = _load_upload(file.filename, await _read_upload(file))
    cleaned, _report = clean_dataframe(frame, fill_missing=fill_missing, drop_exact_duplicates=drop_exact_duplicates, normalize_text=normalize_text)
    buffer = io.StringIO()
    cleaned.to_csv(buffer, index=False)
    stem = (file.filename or "dataset").rsplit(".", 1)[0]
    return StreamingResponse(iter([buffer.getvalue()]), media_type="text/csv", headers={"Content-Disposition": f'attachment; filename="{stem}-cleaned.csv"'})


@app.post("/api/v1/ml-readiness/score")
async def ml_readiness(file: Annotated[UploadFile, File(...)], task: Annotated[str, Form()] = "classification", target: Annotated[str | None, Form()] = None) -> dict:
    """Calculate deterministic readiness heuristics for a selected task/target."""
    frame = _load_upload(file.filename, await _read_upload(file))
    try:
        return score_readiness(frame, task=task, target=target)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/v1/ml-labs/compare")
async def ml_labs(file: Annotated[UploadFile, File(...)], task: Annotated[str, Form()], target: Annotated[str, Form()]) -> dict:
    """Compare baseline classification/regression estimators."""
    frame = _load_upload(file.filename, await _read_upload(file))
    try:
        return compare_models(frame, task=task, target=target)
    except ModelEvaluationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
