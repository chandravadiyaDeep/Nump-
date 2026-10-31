# NUMPA Commercial V1 — Product Requirements

## 1. Product direction

NUMPA is evolving from a working MVP into a commercial data-workspace product for analysts and data practitioners. Its central experience connects dataset understanding, cleaning, visualization and ML evaluation in one guided workspace.

The Commercial V1 interface is a workspace shell around the existing product capabilities, not a rewrite of the data engine.

## 2. Primary user outcome

A user can bring a dataset into NUMPA, understand its quality, prepare it, explore it visually, assess its readiness for machine learning, compare candidate algorithms where supported, and revisit a record of previous analyses.

The product must explain what it did, preserve the source data, expose limitations and avoid implying that a score guarantees model performance.

## 3. Primary navigation — exact order

| Order | Navigation item | Purpose |
|---|---|---|
| 1 | Data Analysis | Inspect and understand a dataset |
| 2 | Data Preprocessing / Cleaning | Review, preview and apply approved transformations |
| 3 | Data Visualization | Explore distributions, relationships and trends |
| 4 | ML Readiness | Explain dataset suitability for a selected ML task |
| 5 | ML Lab | Compare supported algorithms and evaluation metrics |
| 6 | Analysis History | Revisit saved analysis metadata and reports |
| 7 | Settings | Account, preferences, usage, privacy and integrations |

Do not reorder these items without explicit product-owner approval. Integrations belongs inside Settings.

## 4. Feature requirements

### 4.1 Data Analysis

- Accept the file formats already supported by the current application.
- Show dataset overview: rows, columns, data types, missing values, duplicates and available profile summaries.
- Show column-level information where current backend responses support it.
- Provide useful empty, loading, validation and error states.
- Do not claim support for a format unless its loader and tests confirm support.
- Keep the existing dataset inspection endpoint contract compatible.

### 4.2 Data Preprocessing / Cleaning

- Show recommended cleaning actions with explanations.
- Let the user select or reject recommendations.
- Preview proposed changes before applying them.
- Never mutate the original upload.
- Produce a cleaned output and an audit-friendly cleaning report.
- Preserve existing preview and execute endpoint contracts unless a separately approved API change is made.

### 4.3 Data Visualization

Planned chart types include histograms, bar charts, line charts, scatter plots, box plots and correlation heatmaps where statistically appropriate.

Requirements:
- Charts must be based on actual dataset values or validated backend summaries.
- Clearly identify sampled or aggregated data.
- Handle high-cardinality, missing, constant and non-numeric columns gracefully.
- Avoid misleading axes, fabricated values or inappropriate chart defaults.
- Export capability is a later-phase requirement, not Phase 1.

### 4.4 ML Readiness

- Support task-specific assessment for classification, regression, time-series forecasting and clustering only to the extent the scoring engine actually implements and tests each task.
- Explain dimensions, warnings, missing prerequisites and recommendations.
- Scores remain deterministic, versioned and auditable.
- AI may explain or suggest; it must not silently change scoring formulas or weights.
- Show limitations and clarify that readiness is not a guarantee of model performance.

### 4.5 ML Lab

- The intended user experience is algorithm comparison, not an unbounded AutoML promise.
- Show only algorithms and task/metric combinations that the backend supports and tests.
- Show validation strategy, metric definitions, train/test methodology and relevant warnings.
- Avoid data leakage: preprocessing must be fitted on training folds only.
- Forecasting comparisons must preserve time order and use chronological validation.
- Phase 1 must not add model-training or algorithm-comparison features; it only preserves the current working workflow while preparing the shell.

### 4.6 Analysis History

Initial privacy-first behaviour:
- Save metadata and reports only after the required persistence design is approved and implemented.
- Do not store original datasets by default.
- A history record should eventually identify analysis date, dataset label, file type, dimensions, workflow stages completed, task type, score/report references and processing version.
- Do not imply that a dataset can be reopened if the original file was not retained.
- History persistence is not part of Phase 1.

### 4.7 Settings

Planned sections:
- Profile and account
- Appearance: light/dark theme
- Preferences
- Usage and plan information
- Privacy and data controls
- Integrations
- Help and support

Do not modify Supabase authentication or database structure to implement a visual Settings shell.

## 5. Connected workspace behaviour

- A dataset selected in the active workspace should remain available as the user moves between workflow sections, without asking for repeated uploads.
- Preserve source file identity and distinguish source data from cleaned output.
- The user must be able to navigate backward and forward between stages.
- Stage navigation must not silently execute cleaning or training.
- If active session state is lost, explain that the user must re-upload; never pretend a dataset is still available.
- Phase 1 may use the existing page state and safe frontend state composition. Do not add database or object-storage persistence to simulate continuity.

## 6. Commercial product quality

- Consistent typography, spacing, components and interaction patterns.
- Responsive desktop, tablet and mobile layouts.
- Keyboard-accessible navigation and visible focus states.
- Clear loading, empty, error, success and disabled states.
- Helpful onboarding and contextual descriptions.
- No fake metrics, fake integration connection states or placeholder actions presented as functional.

## 7. Out of scope until later approval

- Payment gateway or subscription activation.
- New Supabase tables, policies, triggers or migrations.
- Raw dataset storage in Supabase or cloud object storage.
- Public API key issuance or third-party API access.
- Zapier, Make, n8n, Google Drive or GitHub live connections.
- Webhooks, background jobs or queues.
- Team workspaces, white-label or embeddable widgets.
- New ML algorithms or automatic model training.
- SEO/blog publishing platform or content-management features.
