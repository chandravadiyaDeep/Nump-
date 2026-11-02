# NUMPA Public API Reference (V1)

**Version:** 0.1.0  
**Base URL:** `https://numpa-api.onrender.com`  
**Content-Type:** `multipart/form-data` (file uploads) / `application/json` (responses)  
**Safety Notice:** NUMPA processes all tabular data in-memory. Uploaded datasets are never persisted to disk or cloud databases.

---

## 1. Overview & General Principles

NUMPA provides high-performance tabular data inspection, explainable data cleaning, ML readiness assessments, and baseline model comparison through a RESTful API.

### 1.1 Supported File Formats
The API supports the following tabular formats up to **50 MB** in file size:
- **CSV** (`.csv`) — Delimiter-separated tabular data
- **Excel** (`.xlsx`) — Standard openpyxl spreadsheet format
- **JSON** (`.json`) — Tabular array of records or columnar JSON
- **Apache Parquet** (`.parquet`) — Columnar storage format
- **Apache Arrow / Feather** (`.arrow`, `.feather`) — Arrow IPC stream / file format

### 1.2 Rate Limits & Constraints
- Maximum upload size: **50 MB** (`52,428,800 bytes`). Files exceeding this size receive `413 Payload Too Large`.
- Maximum inspected preview rows: **50,000 rows** sampled deterministically for statistical profiling.
- Request Timeout: Render enforces a 100-second HTTP timeout on inbound requests. Large files or computationally heavy model comparisons should be kept under 50 MB.

### 1.3 Authentication
- **Current Browser Client Access:** Requests from authorized origins (`https://numpa.online`, `https://numpa.vercel.app`) are handled via CORS.
- **Programmatic Developer Access (Upcoming V1 Commercial):** Bearer token authentication (`Authorization: Bearer numpa_live_...`) is planned. Refer to `API_ACCESS_DESIGN.md` for specification.

---

## 2. Endpoints

### 2.1 System Health Check

```http
GET /api/v1/health
```

Checks the availability and operational status of the NUMPA API service.

#### Request Headers
None required.

#### Response Example (`200 OK`)
```json
{
  "status": "ok",
  "service": "numpa-api",
  "version": "0.1.0"
}
```

#### Example cURL
```bash
curl -X GET "https://numpa-api.onrender.com/api/v1/health"
```

---

### 2.2 Inspect Dataset

```http
POST /api/v1/datasets/inspect
```

Performs in-memory quality profiling, schema inference, missingness calculation, and heuristic cleaning recommendations on the uploaded dataset.

#### Request Parameters (Multipart Form-Data)
| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | Binary | Yes | The tabular file to inspect (CSV, XLSX, JSON, Parquet, Arrow, Feather). |

#### Response Schema (`200 OK`)
```json
{
  "dataset": {
    "filename": "synthetic_sales.csv",
    "format": "csv",
    "processing": "in-memory; no server-side dataset persistence"
  },
  "summary": {
    "rows": 1000,
    "columns": 5,
    "missing_cells": 12,
    "duplicate_rows": 2
  },
  "columns": [
    {
      "name": "customer_id",
      "dtype": "int64",
      "inferred_type": "numeric",
      "missing_count": 0,
      "missing_ratio": 0.0,
      "unique_count": 998,
      "summary": {
        "min": 1,
        "max": 1000,
        "mean": 500.5,
        "median": 500.5
      }
    },
    {
      "name": "region",
      "dtype": "object",
      "inferred_type": "categorical",
      "missing_count": 4,
      "missing_ratio": 0.004,
      "unique_count": 4,
      "top_values": { "North": 350, "South": 280, "East": 210, "West": 156 }
    }
  ],
  "cleaning_plan": [
    {
      "action": "fill_missing",
      "target_columns": ["region"],
      "strategy": "mode",
      "reason": "Categorical column has 0.4% missing values."
    },
    {
      "action": "drop_exact_duplicates",
      "target_columns": ["all"],
      "reason": "Dataset contains 2 redundant identical rows."
    }
  ]
}
```

#### Example cURL (Synthetic Data)
```bash
# Create synthetic sample CSV
cat << 'EOF' > sample.csv
customer_id,region,revenue,signup_date
101,North,250.50,2025-01-15
102,South,,2025-01-16
103,North,120.00,2025-01-17
103,North,120.00,2025-01-17
EOF

curl -X POST "https://numpa-api.onrender.com/api/v1/datasets/inspect" \
  -F "file=@sample.csv;type=text/csv"
```

---

### 2.3 Preview Cleaning Operations

```http
POST /api/v1/cleaning/preview
```

Simulates the requested cleaning operations on the uploaded dataset and returns a 20-row preview alongside an audit report of changes made. The original dataset remains untouched.

#### Request Parameters (Multipart Form-Data)
| Parameter | Type | Default | Description |
|---|---|---|---|
| `file` | Binary | Required | Tabular dataset file. |
| `fill_missing` | Boolean | `true` | Impute missing values (median for numeric, mode for categorical). |
| `drop_exact_duplicates` | Boolean | `false` | Remove exact duplicate rows across all columns. |
| `normalize_text` | Boolean | `true` | Strip whitespace and standardize text case in string columns. |

#### Response Schema (`200 OK`)
```json
{
  "report": {
    "rows_before": 4,
    "rows_after": 3,
    "duplicates_removed": 1,
    "missing_values_filled": 1,
    "text_cells_normalized": 3
  },
  "columns": ["customer_id", "region", "revenue", "signup_date"],
  "preview": [
    { "customer_id": 101, "region": "North", "revenue": 250.50, "signup_date": "2025-01-15" },
    { "customer_id": 102, "region": "South", "revenue": 185.25, "signup_date": "2025-01-16" },
    { "customer_id": 103, "region": "North", "revenue": 120.00, "signup_date": "2025-01-17" }
  ],
  "download_available": true
}
```

#### Example cURL
```bash
curl -X POST "https://numpa-api.onrender.com/api/v1/cleaning/preview" \
  -F "file=@sample.csv" \
  -F "fill_missing=true" \
  -F "drop_exact_duplicates=true" \
  -F "normalize_text=true"
```

---

### 2.4 Execute Cleaning & Download Cleaned CSV

```http
POST /api/v1/cleaning/execute
```

Executes the specified cleaning transformations and streams the cleaned dataset back as a downloadable CSV file.

#### Request Parameters (Multipart Form-Data)
Same parameters as `/api/v1/cleaning/preview`.

#### Response
- **Status:** `200 OK`
- **Content-Type:** `text/csv`
- **Content-Disposition:** `attachment; filename="<filename>-cleaned.csv"`

#### Example cURL
```bash
curl -X POST "https://numpa-api.onrender.com/api/v1/cleaning/execute" \
  -F "file=@sample.csv" \
  -F "fill_missing=true" \
  -F "drop_exact_duplicates=true" \
  -o cleaned_output.csv
```

---

### 2.5 Calculate ML Readiness Score

```http
POST /api/v1/ml-readiness/score
```

Evaluates tabular dataset readiness for a specified machine learning task and target column, producing a deterministic, explainable readiness score from 0 to 100.

#### Request Parameters (Multipart Form-Data)
| Parameter | Type | Default | Description |
|---|---|---|---|
| `file` | Binary | Required | Tabular dataset file. |
| `task` | String | `"classification"` | Target task: `classification`, `regression`, `clustering`, or `time_series`. |
| `target` | String | `None` | Name of target column (required for supervised tasks, optional for clustering). |

#### Response Schema (`200 OK`)
```json
{
  "task": "classification",
  "target": "region",
  "overall_readiness_score": 84.5,
  "status": "ready_with_recommendations",
  "dimensions": {
    "sample_adequacy": { "score": 90, "assessment": "Sample size is adequate for baseline classification." },
    "feature_integrity": { "score": 85, "assessment": "Low missingness detected across features." },
    "target_balance": { "score": 78, "assessment": "Class distribution is moderately balanced." },
    "multicollinearity": { "score": 85, "assessment": "No severe feature correlation observed." }
  },
  "blockers": [],
  "recommendations": [
    "Encode categorical feature 'region' using one-hot or target encoding.",
    "Scale continuous numeric features before training distance-based models."
  ]
}
```

#### Example cURL
```bash
curl -X POST "https://numpa-api.onrender.com/api/v1/ml-readiness/score" \
  -F "file=@sample.csv" \
  -F "task=classification" \
  -F "target=region"
```

---

### 2.6 ML Lab: Baseline Model Comparison

```http
POST /api/v1/ml-labs/compare
```

Fits reproducible scikit-learn baseline pipelines using an 80/20 train-test holdout and benchmarks standard estimators on the dataset. Preprocessing is fitted strictly on the training partition to prevent data leakage.

#### Request Parameters (Multipart Form-Data)
| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | Binary | Yes | Tabular dataset file. |
| `task` | String | Yes | Either `"classification"` or `"regression"`. |
| `target` | String | Yes | Target column name. |

#### Supported Estimators & Metrics
- **Classification:** Logistic Regression, Random Forest, Decision Tree, Support Vector Classifier (SVC).  
  *Metrics:* Accuracy, Precision (macro), Recall (macro), F1-Score (macro), ROC-AUC (binary).
- **Regression:** Ridge Regression, Random Forest Regressor, Decision Tree Regressor, Gradient Boosting.  
  *Metrics:* RMSE (Root Mean Squared Error), MAE (Mean Absolute Error), R² Score.

#### Response Schema (`200 OK`)
```json
{
  "task": "classification",
  "target": "region",
  "train_samples": 800,
  "test_samples": 200,
  "models": [
    {
      "model_name": "Random Forest",
      "metrics": {
        "accuracy": 0.885,
        "f1_score": 0.879,
        "precision": 0.890,
        "recall": 0.871,
        "roc_auc": null
      },
      "rank": 1
    },
    {
      "model_name": "Logistic Regression",
      "metrics": {
        "accuracy": 0.820,
        "f1_score": 0.812,
        "precision": 0.825,
        "recall": 0.805,
        "roc_auc": null
      },
      "rank": 2
    }
  ]
}
```

---

## 3. Standard HTTP Error Codes

| Status Code | Reason | Typical Cause |
|---|---|---|
| `400 Bad Request` | Invalid input or parameters | Unsupported task, missing target column, unparseable file syntax, empty file. |
| `413 Payload Too Large` | File exceeds 50 MB | The uploaded payload exceeds `MAX_UPLOAD_BYTES` (52,428,800 bytes). |
| `422 Unprocessable Entity` | Schema validation error | Missing required multipart form field or incorrect data type. |
| `500 Internal Server Error` | Backend execution fault | Unhandled computation error during matrix calculation or model fitting. |

---

## 4. Privacy & Data Handling Guarantees

1. **Zero Storage:** Files are streamed into RAM (`io.BytesIO`) and converted directly into pandas DataFrames. No temporary files are written to host storage.
2. **No Data Leakage:** Server logs record only metadata (HTTP method, path, response status, duration). Raw rows, column values, and file contents are never logged.
3. **Reproducibility:** All random operations (train/test splits, model initializations) use fixed random states for scientific reproducibility.
