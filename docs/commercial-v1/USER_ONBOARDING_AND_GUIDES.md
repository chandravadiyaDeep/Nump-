# NUMPA Commercial V1 — User Onboarding & Operational Guide

**Product:** NUMPA — Automated Data Workflow  
**Release Target:** Commercial V1  
**Audience:** End Users, Analysts, Data Scientists, Developers  

---

## 1. Introduction & Core Philosophy

NUMPA is an automated tabular data workbench designed for fast, reproducible, and privacy-preserving data preparation.

### Core Architecture & Privacy Principles
- **In-Memory Ephemerality:** All data operations execute strictly in system RAM. Uploaded datasets are never written to permanent disks or database storage.
- **Explainable Automation:** Cleaning and readiness recommendations are deterministic and explainable. No hidden black-box transformations are applied.
- **Connected Pipeline:** Once a dataset is uploaded, it is automatically shared across all 7 workspace stages without re-uploading.

---

## 2. Workspace Navigation Walkthrough

```text
1. Data Analysis ------------> In-memory profiling, quality heuristics, column statistics
      |
      v
2. Data Cleaning ------------> Configure imputation, duplicate dropping, text normalization
      |                        Preview audit & export cleaned CSV
      v
3. Data Visualization -------> Distribution histograms, bar aggregations, scatter & correlation
      |
      v
4. ML Readiness -------------> Deterministic 0–100 score evaluating task & target feasibility
      |
      v
5. ML Lab -------------------> Benchmark baseline scikit-learn models using 80/20 holdout
      |
      v
6. Analysis History ---------> View past analysis metadata (requires persistence approval)
      |
      v
7. Settings -----------------> Account, light/dark theme, API access info, commercial plans
```

---

## 3. Step-by-Step Workflow Guides

### 3.1 Step 1: Uploading & Inspecting Datasets
1. Drag and drop your tabular file into the upload zone or click "Browse files".
2. **Supported Formats:**
   - Comma-Separated Values (`.csv`)
   - Microsoft Excel (`.xlsx`)
   - JavaScript Object Notation (`.json`)
   - Apache Parquet (`.parquet`)
   - Apache Arrow IPC & Feather (`.arrow`, `.feather`)
3. **File Size Limit:** Up to 50 MB per file.
4. **Inspecting the Quality Profile:**
   - **Overview:** Row count, column count, missing cell ratio, and duplicate rows.
   - **Column Profiler:** Inspect data types (numeric, categorical, datetime), unique value distributions, min/max/mean/median, and top category frequencies.
   - **Cleaning Recommendations:** Review automated suggestions (e.g., fill missing values, drop duplicates).

---

### 3.2 Step 2: Data Preprocessing & Cleaning
1. Navigate to **Data Preprocessing / Cleaning** in the left sidebar.
2. Configure your cleaning options:
   - **Fill Missing Values:** Imputes numeric features using column median; imputes categorical features using column mode.
   - **Drop Exact Duplicates:** Removes duplicate rows across all features, retaining the first occurrence.
   - **Normalize Text:** Strips leading/trailing whitespace and standardizes casing in text columns.
3. Click **Preview Cleaning** to inspect the 20-row preview and transformation audit report.
4. Click **Download Cleaned CSV** to export the cleaned dataset directly to your local computer.

---

### 3.3 Step 3: Data Visualization
1. Navigate to **Data Visualization**.
2. Select between the **Source Dataset** or **Cleaned Version**.
3. Choose a chart type:
   - **Histogram:** Visualize frequency distribution and skewness of any numeric column.
   - **Bar Chart:** Compare categorical group frequencies. High-cardinality categories are automatically grouped into "Other".
   - **Line Chart:** Inspect chronological trends over valid ISO-8601 date columns.
   - **Scatter Plot:** Analyze bivariate relationships between two numeric features with deterministic sampling.
   - **Box Plot:** Inspect Tukey five-number summaries (median, quartiles, whiskers, outliers).
   - **Correlation Heatmap:** Compute pairwise Pearson correlation coefficients with color-coded intensity.

---

### 3.4 Step 4: ML Readiness Assessment
1. Navigate to **ML Readiness**.
2. Select your intended Machine Learning task:
   - **Classification:** Predict discrete categories or labels.
   - **Regression:** Predict continuous numerical quantities.
   - **Clustering:** Discover natural group partitions (unsupervised; target column optional).
   - **Time Series:** Model temporal dependencies (requires chronological date indexing).
3. Select the **Target Column** (for supervised tasks).
4. Review the **Readiness Score (0–100)**:
   - **Sample Adequacy:** Evaluates whether sample size supports generalization.
   - **Feature Integrity:** Checks missingness rates and feature validity.
   - **Target Balance / Variance:** Checks class imbalance (classification) or target variance (regression).
   - **Multicollinearity:** Detects severe feature correlation that could destabilize linear models.
5. Review **Blockers & Actionable Recommendations** before training models.

---

### 3.5 Step 5: ML Lab (Model Benchmarking)
1. Navigate to **ML Lab**.
2. Select task (`Classification` or `Regression`) and the `Target Column`.
3. Click **Compare Models**.
4. The system executes reproducible scikit-learn baseline pipelines:
   - Evaluated using an 80% train / 20% test holdout split.
   - Preprocessing transformers (imputation, one-hot encoding, scaling) are strictly fitted on the train split to prevent data leakage.
5. Benchmark table displays:
   - Classification: Accuracy, Macro F1, Precision, Recall, ROC-AUC.
   - Regression: RMSE, MAE, R² Score.

---

## 4. Understanding Heuristic Scores vs. Actual Model Performance

> [!IMPORTANT]
> - The **ML Readiness Score** is a heuristic diagnostic metric measuring dataset quality, balance, and feature characteristics. A high readiness score indicates data sanity, but does **not** guarantee high model accuracy in production.
> - **ML Lab Benchmarks** represent baseline standard estimators (e.g., Logistic Regression, Random Forest) trained on un-tuned hyperparameters. Production applications typically require domain-specific feature engineering, hyperparameter tuning, and cross-validation.

---

## 5. Troubleshooting & FAQ

### Q: Why did my upload receive a 413 error?
The file exceeds the 50 MB in-memory upload limit. Compress your dataset or sample rows before uploading.

### Q: Why did my browser session reset when I refreshed?
NUMPA does not persist datasets to a server database or localStorage for privacy and security reasons. Refreshing the browser clears in-memory state. Keep your cleaned CSV exports downloaded locally.

### Q: Why is Analysis History showing "Unavailable"?
Persistent history requires database schema approval from the repository owner to prevent unapproved cloud data storage.
