# NUMPA Public API Reference (V1 Baseline)

**Service Name:** `numpa-api`  
**API Version:** `0.1.0`  
**Base URL:** `https://numpa-api.onrender.com`  
**Transport & Encoding:** HTTPS / HTTP/1.1  
**Request Format:** `multipart/form-data` (file uploads + form fields)  
**Response Format:** `application/json` (except `/api/v1/cleaning/execute` which streams `text/csv`)  

---

## 1. Access, Authentication & Network Model

### 1.1 Current Access Model vs. Future Developer API Access
- **Current Browser Client Access (Operational):** The FastAPI service accepts incoming requests from origins permitted by its CORS configuration (`https://numpa.online`, `https://www.numpa.online`, `https://numpa.vercel.app`, `localhost:3000`, and authorized Vercel preview hostnames matching `https://numpa-*-depochandravadiya-6509s-projects.vercel.app`).
- **CRITICAL DISTINCTION — CORS Is Not Authentication:** CORS is a browser-enforced origin isolation header. It does **not** authenticate requests, identify tenants, or prevent non-browser HTTP clients (cURL, Python scripts, Postman) from calling endpoints.
- **Future Developer API Access (Planned · Approval-Gated):** User-owned Bearer token authentication (`Authorization: Bearer numpa_live_...`), server-side token hashing, and per-key rate limits are fully designed in `API_ACCESS_DESIGN.md` but are **not yet active**. Currently, endpoints do not validate Bearer tokens or enforce API key scopes.

---

## 2. Ingestion Boundaries & Technical Constraints

The loader in `apps/api/app/ingestion.py` enforces the following hard constraints:

| Constraint | Limit | Behavior if Exceeded |
|---|---|---|
| **Accepted File Extensions** | `.csv`, `.json`, `.xlsx`, `.parquet`, `.arrow`, `.feather` | HTTP 400 (`Unsupported file format '...'. Supported formats: .arrow, .csv, .feather, .json, .parquet, .xlsx.`) |
| **Maximum Upload File Size** | 50 MB (`52,428,800 bytes`) | HTTP 413 (`File exceeds the 50 MB MVP upload limit.`) |
| **Maximum Row Count** | 1,000,000 rows | HTTP 413 (`Dataset exceeds the 1,000,000-row MVP limit.`) |
| **Maximum Column Count** | 2,000 columns | HTTP 413 (`Dataset exceeds the 2,000-column MVP limit.`) |
| **Empty File / Empty Dataset** | 0 bytes or 0 rows | HTTP 400 (`The uploaded file is empty.` / `The dataset has no rows.`) |
| **Duplicate Column Headers** | Permitted | Automatically deduplicated with `_2`, `_3` suffix notation to ensure deterministic indexing. |
| **JSON Structure** | Records array or JSON lines | Unparseable or nested non-tabular JSON raises HTTP 400. |

---

## 3. Detailed Endpoint Reference

### 3.1 Service Health Check

```http
GET /api/v1/health
```

#### Request
No parameters or headers required.

#### Response (`200 OK`)
```json
{
  "status": "ok",
  "service": "numpa-api",
  "version": "0.1.0"
}
```

---

### 3.2 Tabular Dataset Inspection & Quality Profiling

```http
POST /api/v1/datasets/inspect
```

Parses the uploaded tabular file into memory, computes overview statistics, column summaries, preview records, histogram/bar distributions, and generates conservative cleaning recommendations.

#### Request Parameters (Multipart Form-Data)
| Field | Type | Required | Description |
|---|---|---|---|
| `file` | Binary | Yes | The tabular file to inspect (`.csv`, `.json`, `.xlsx`, `.parquet`, `.arrow`, `.feather`). |

#### Response Schema (`200 OK`)
```json
{
  "dataset": {
    "filename": "synthetic_sample.csv",
    "format": "csv",
    "processing": "in-memory; no server-side dataset persistence"
  },
  "overview": {
    "row_count": 100,
    "column_count": 4,
    "duplicate_row_count": 2,
    "numeric_column_count": 2,
    "non_numeric_column_count": 2,
    "total_missing_cells": 5,
    "memory_usage_bytes": 14208
  },
  "columns": [
    {
      "name": "age",
      "dtype": "int64",
      "missing_count": 2,
      "missing_percent": 2.0,
      "unique_count": 45,
      "numeric_summary": {
        "min": 18.0,
        "max": 65.0,
        "mean": 38.5,
        "median": 37.0,
        "std": 12.4
      }
    },
    {
      "name": "department",
      "dtype": "object",
      "missing_count": 3,
      "missing_percent": 3.0,
      "unique_count": 4,
      "top_values": [
        { "value": "Engineering", "count": 42 },
        { "value": "Sales", "count": 28 },
        { "value": "Marketing", "count": 15 },
        { "value": "Support", "count": 12 }
      ]
    }
  ],
  "preview": [
    { "age": 29, "department": "Engineering" }
  ],
  "visualization_summaries": [
    {
      "type": "histogram",
      "column": "age",
      "bins": [
        { "start": 18.0, "end": 22.7, "count": 12 },
        { "start": 22.7, "end": 27.4, "count": 18 }
      ]
    },
    {
      "type": "bar",
      "column": "department",
      "values": [
        { "label": "Engineering", "count": 42 },
        { "label": "Sales", "count": 28 }
      ]
    }
  ],
  "cleaning_plan": {
    "strategy": "conservative_general_rules",
    "actions": [
      {
        "column": "age",
        "issue": "missing_values",
        "count": 2,
        "strategy": "mean",
        "reason": "Mean is a reasonable baseline for this numeric distribution.",
        "requires_approval": true
      },
      {
        "column": null,
        "issue": "exact_duplicate_rows",
        "count": 2,
        "strategy": "drop_exact_duplicates",
        "reason": "Rows identical across every column may be redundant; review before applying.",
        "requires_approval": true
      }
    ],
    "action_count": 2,
    "note": "Recommendations are heuristics. Confirm business meaning before destructive changes."
  }
}
```

---

### 3.3 Cleaning Preview & Audit Report

```http
POST /api/v1/cleaning/preview
```

Simulates data-cleaning transformations on an in-memory copy of the dataset and returns a before/after audit report and a 20-row preview.

#### Request Parameters (Multipart Form-Data)
| Field | Type | Default | Description |
|---|---|---|---|
| `file` | Binary | Required | Tabular dataset file. |
| `fill_missing` | Boolean | `true` | Impute numeric missing values (median if skewed, mean otherwise) and categorical values (mode if <30 unique, "Unknown" otherwise). |
| `drop_exact_duplicates` | Boolean | `false` | Remove rows that are completely identical across every column. |
| `normalize_text` | Boolean | `true` | Trims leading and trailing whitespace on string columns (`.strip()`). Case is intentionally preserved. |

#### Response Schema (`200 OK`)
```json
{
  "report": {
    "operations": [
      {
        "operation": "trim_whitespace",
        "column": "department",
        "changed_cells": 4
      },
      {
        "operation": "impute_numeric",
        "column": "age",
        "method": "mean",
        "filled_cells": 2,
        "value": 38.5
      },
      {
        "operation": "drop_exact_duplicates",
        "removed_rows": 2
      }
    ],
    "before": {
      "rows": 100,
      "columns": 4,
      "missing_cells": 5,
      "duplicate_rows": 2
    },
    "after": {
      "rows": 98,
      "columns": 4,
      "missing_cells": 0,
      "duplicate_rows": 0
    },
    "validation": {
      "column_count_preserved": true,
      "remaining_missing_cells": 0
    }
  },
  "preview": [
    { "age": 29.0, "department": "Engineering" }
  ],
  "columns": ["age", "department", "salary", "join_date"],
  "download_available": true
}
```

---

### 3.4 Execute Cleaning & Download CSV

```http
POST /api/v1/cleaning/execute
```

Executes the selected cleaning transformations on the dataset and streams the resulting cleaned table back as a downloadable CSV.

#### Request Parameters (Multipart Form-Data)
Same parameters as `/api/v1/cleaning/preview` (`file`, `fill_missing`, `drop_exact_duplicates`, `normalize_text`).

#### Response
- **Status:** `200 OK`
- **Content-Type:** `text/csv; charset=utf-8`
- **Headers:** `Content-Disposition: attachment; filename="<stem>-cleaned.csv"`

---

### 3.5 ML Readiness Assessment

```http
POST /api/v1/ml-readiness/score
```

Calculates deterministic, explainable heuristic scores across four fixed dimensions evaluating whether the dataset meets structural prerequisites for the specified machine learning task.

#### Request Parameters (Multipart Form-Data)
| Field | Type | Default | Constraints & Description |
|---|---|---|---|
| `file` | Binary | Required | Tabular dataset file. |
| `task` | String | `"classification"` | **Must be one of:** `"classification"`, `"regression"`, `"forecasting"`, or `"clustering"`. Any other task raises HTTP 400. |
| `target` | String | `null` | Name of the target column. Required for `"classification"`, `"regression"`, and `"forecasting"`. Optional for `"clustering"`. |

#### Response Schema (`200 OK`)
```json
{
  "task": "classification",
  "target": "department",
  "score": 82,
  "status": "Good starting point",
  "dimensions": [
    {
      "name": "data_quality",
      "score": 94.2,
      "weight": 0.35,
      "explanation": "Penalizes missing cells and exact duplicate rows."
    },
    {
      "name": "dataset_size_and_shape",
      "score": 85.0,
      "weight": 0.20,
      "explanation": "Coarse shape heuristic; larger data is not automatically better."
    },
    {
      "name": "task_and_target",
      "score": 70.0,
      "weight": 0.25,
      "explanation": "Checks target selection, completeness and basic variation."
    },
    {
      "name": "feature_availability",
      "score": 75.0,
      "weight": 0.20,
      "explanation": "Checks whether candidate feature columns appear to be present."
    }
  ],
  "issues": [
    "2.5% of cells are missing.",
    "Target has many unique values; verify that classification is intended."
  ],
  "caveat": "This is a heuristic data-preparation score, not a prediction of model accuracy or business value."
}
```

#### Status Thresholds
- `score >= 75`: `"Good starting point"`
- `50 <= score < 75`: `"Needs preparation"`
- `score < 50`: `"Significant issues"`

---

### 3.6 ML Lab: Baseline Model Comparison

```http
POST /api/v1/ml-labs/compare
```

Fits reproducible scikit-learn baseline pipelines on an 80/20 holdout split (`random_state=42`) with preprocessing (median/mode imputation, one-hot encoding, and scaling where appropriate) fitted strictly on the training partition to avoid data leakage.

#### Request Parameters (Multipart Form-Data)
| Field | Type | Required | Constraints & Description |
|---|---|---|---|
| `file` | Binary | Yes | Tabular dataset file. |
| `task` | String | Yes | **Must be either** `"classification"` or `"regression"`. (Forecasting and clustering are not supported by this endpoint). |
| `target` | String | Yes | Name of the target column present in the dataset. |

#### Actual Estimators Evaluated
- **Classification Candidates:**
  1. `"Logistic Regression"` (scikit-learn `LogisticRegression(max_iter=1000)` with `StandardScaler`)
  2. `"Random Forest"` (scikit-learn `RandomForestClassifier(n_estimators=120, random_state=42, n_jobs=-1)`)
  3. `"Extra Trees"` (scikit-learn `ExtraTreesClassifier(n_estimators=120, random_state=42, n_jobs=-1)`)
- **Regression Candidates:**
  1. `"Linear Regression"` (scikit-learn `LinearRegression()` with `StandardScaler`)
  2. `"Ridge Regression"` (scikit-learn `Ridge()` with `StandardScaler`)
  3. `"Random Forest Regressor"` (scikit-learn `RandomForestRegressor(n_estimators=120, random_state=42, n_jobs=-1)`)

#### Actual Metric Definitions
- **Classification:**
  - `CA`: Classification Accuracy (`accuracy_score(y_test, predictions)`)
  - `Precision`: Weighted Precision (`precision_score(y_test, predictions, average="weighted", zero_division=0)`)
  - `Recall`: Weighted Recall (`recall_score(y_test, predictions, average="weighted", zero_division=0)`)
  - `F1-Score`: Weighted F1 Score (`f1_score(y_test, predictions, average="weighted", zero_division=0)`)
  - `AUC`: ROC-AUC score (`float` or `null`). Calculated if predicted probabilities exist. May be `null` if holdout lacks representation of all classes.
- **Regression:**
  - `MSE`: Mean Squared Error (`mean_squared_error(y_test, predictions)`)
  - `RMSE`: Root Mean Squared Error (`sqrt(MSE)`)
  - `MAE`: Mean Absolute Error (`mean_absolute_error(y_test, predictions)`)
  - `R2`: Coefficient of Determination (`r2_score(y_test, predictions)` if len(y_test) >= 2 else `null`). Note: R² can be negative for models performing worse than horizontal mean prediction.

#### Response Schema (`200 OK`)
```json
{
  "task": "classification",
  "target": "department",
  "validation": {
    "method": "80/20 holdout",
    "random_state": 42,
    "note": "Preprocessing is fitted on training data only. Forecasting requires chronological validation."
  },
  "models": [
    {
      "algorithm": "Random Forest",
      "metrics": {
        "CA": 0.85,
        "Precision": 0.86,
        "Recall": 0.85,
        "F1-Score": 0.852,
        "AUC": 0.912
      },
      "status": "ok"
    },
    {
      "algorithm": "Logistic Regression",
      "metrics": {
        "CA": 0.80,
        "Precision": 0.79,
        "Recall": 0.80,
        "F1-Score": 0.794,
        "AUC": 0.875
      },
      "status": "ok"
    },
    {
      "algorithm": "Extra Trees",
      "metrics": {
        "CA": 0.83,
        "Precision": 0.84,
        "Recall": 0.83,
        "F1-Score": 0.831,
        "AUC": 0.898
      },
      "status": "ok"
    }
  ],
  "metric_guidance": "AUC may be unavailable if the holdout lacks classes.",
  "warning": "Baseline holdout results are estimates and may vary with data and validation strategy."
}
```

---

## 4. Error Handling & HTTP Status Codes

The API raises standard HTTP status codes with informative JSON detail messages:

| Status Code | Exception Type | Cause | Example Response |
|---|---|---|---|
| `400 Bad Request` | `DatasetInputError` / `ValueError` / `ModelEvaluationError` | File parse error, unsupported format, empty dataset, unsupported task, target column missing or having fewer than 2 classes. | `{"detail": "Classification requires at least two target classes."}` |
| `413 Payload Too Large` | `HTTPException(status_code=413)` | Upload payload exceeds 50 MB, or the dataset exceeds the 1,000,000-row / 2,000-column limits. | `{"detail": "File exceeds the 50 MB MVP upload limit."}` |
| `422 Unprocessable Entity` | FastAPI request validation | Missing required form field or incorrect type. | Standard FastAPI validation payload |
| `500 Internal Server Error` | Unhandled runtime exception | Out of memory or unexpected crash. | `{"detail": "Internal Server Error"}` |

---

## 5. Synthetic cURL Testing Examples

### Inspect Dataset
```bash
# Create synthetic tabular CSV
cat << 'EOF' > synthetic_data.csv
id,department,salary,experience
1,Engineering,95000,4
2,Engineering,110000,7
3,Sales,72000,2
4,Sales,81000,3
5,Marketing,68000,1
6,Marketing,,2
7,Engineering,125000,10
8,Sales,75000,3
EOF

curl -s -X POST "https://numpa-api.onrender.com/api/v1/datasets/inspect" \
  -F "file=@synthetic_data.csv;type=text/csv"
```

### Score ML Readiness (Classification)
```bash
curl -s -X POST "https://numpa-api.onrender.com/api/v1/ml-readiness/score" \
  -F "file=@synthetic_data.csv;type=text/csv" \
  -F "task=classification" \
  -F "target=department"
```

### ML Lab Baseline Comparison (Regression)
```bash
curl -s -X POST "https://numpa-api.onrender.com/api/v1/ml-labs/compare" \
  -F "file=@synthetic_data.csv;type=text/csv" \
  -F "task=regression" \
  -F "target=salary"
```
