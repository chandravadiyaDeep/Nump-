"""Safe, bounded ingestion for supported tabular dataset files.

The first MVP supports CSV, JSON, Parquet and Arrow IPC files. Folder-based and
archive-based dataset formats are intentionally not accepted by this loader yet.
"""
from __future__ import annotations

import io
import json
from pathlib import Path
from typing import Any

import pandas as pd
import pyarrow as pa
import pyarrow.ipc as ipc

ALLOWED_SUFFIXES = {".csv", ".json", ".parquet", ".arrow", ".feather"}
MAX_UPLOAD_BYTES = 50 * 1024 * 1024
MAX_ROWS = 1_000_000
MAX_COLUMNS = 2_000


class DatasetInputError(ValueError):
    """Raised when a user dataset cannot be safely interpreted."""


def load_dataframe(filename: str, raw: bytes) -> pd.DataFrame:
    """Load supported tabular bytes into a DataFrame with bounded input size."""
    suffix = Path(filename or "").suffix.lower()
    if suffix not in ALLOWED_SUFFIXES:
        allowed = ", ".join(sorted(ALLOWED_SUFFIXES))
        raise DatasetInputError(
            f"Unsupported file format '{suffix or 'unknown'}'. Supported formats: {allowed}."
        )
    if not raw:
        raise DatasetInputError("The uploaded file is empty.")
    if len(raw) > MAX_UPLOAD_BYTES:
        raise DatasetInputError("File exceeds the 50 MB MVP upload limit.")
    try:
        if suffix == ".csv":
            frame = pd.read_csv(io.BytesIO(raw), low_memory=False)
        elif suffix == ".json":
            try:
                frame = pd.read_json(io.BytesIO(raw), lines=True)
            except (ValueError, UnicodeDecodeError):
                value = json.loads(raw.decode("utf-8-sig"))
                if isinstance(value, list):
                    frame = pd.DataFrame(value)
                elif isinstance(value, dict):
                    rows = next(
                        (value[k] for k in ("data", "records", "items") if isinstance(value.get(k), list)),
                        None,
                    )
                    frame = pd.DataFrame(rows) if rows is not None else pd.json_normalize(value)
                else:
                    raise DatasetInputError("JSON must contain an object or array of records.")
        elif suffix == ".parquet":
            frame = pd.read_parquet(io.BytesIO(raw))
        else:
            try:
                with ipc.open_file(io.BytesIO(raw)) as reader:
                    table = reader.read_all()
            except (pa.ArrowInvalid, OSError):
                try:
                    with ipc.open_stream(io.BytesIO(raw)) as reader:
                        table = reader.read_all()
                except (pa.ArrowInvalid, OSError):
                    frame = pd.read_feather(io.BytesIO(raw))
                else:
                    frame = table.to_pandas()
            else:
                frame = table.to_pandas()
    except DatasetInputError:
        raise
    except Exception as exc:
        raise DatasetInputError(f"Could not read this dataset: {type(exc).__name__}: {exc}") from exc

    if not isinstance(frame, pd.DataFrame):
        raise DatasetInputError("This file did not resolve to a tabular dataset.")
    if frame.empty:
        raise DatasetInputError("The dataset has no rows.")
    if len(frame) > MAX_ROWS:
        raise DatasetInputError("Dataset exceeds the 1,000,000-row MVP limit.")
    if len(frame.columns) > MAX_COLUMNS:
        raise DatasetInputError("Dataset exceeds the 2,000-column MVP limit.")
    if frame.columns.has_duplicates:
        frame = frame.copy()
        counts: dict[str, int] = {}
        new_columns = []
        for column in map(str, frame.columns):
            counts[column] = counts.get(column, 0) + 1
            new_columns.append(column if counts[column] == 1 else f"{column}_{counts[column]}")
        frame.columns = new_columns
    else:
        frame.columns = [str(c) for c in frame.columns]
    return frame
