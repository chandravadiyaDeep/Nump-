# NUMPA Commercial V1 — Workflow and Data Lifecycle

## 1. Intended end-to-end workflow

Exact stage order:

1. Data Analysis
2. Data Preprocessing / Cleaning
3. Data Visualization
4. ML Readiness
5. ML Lab
6. Analysis History
7. Settings

The first five are workflow workspaces. Analysis History and Settings are supporting destinations.

## 2. Stage responsibilities

### Data Analysis
Input: uploaded dataset.  
Output: validated dataset context, profile/inspection result and dataset overview.

### Data Preprocessing / Cleaning
Input: active source dataset and inspection context.  
Output: user-approved cleaned output, selected operation list and cleaning report.

### Data Visualization
Input: source dataset or explicitly selected cleaned output.  
Output: chart configurations and visual summaries. The UI must identify which dataset version is being visualized.

### ML Readiness
Input: selected dataset version, task, target where applicable and assessment configuration.  
Output: deterministic score, dimensions, warnings and recommendations.

### ML Lab
Input: selected dataset version, task, target and validation configuration.  
Output: supported algorithm comparison results and metrics. Training/evaluation must follow leakage-safe practices.

### Analysis History
Input: explicit metadata/report save operation when available.  
Output: list of prior analysis records and report references. Original raw datasets are not retained by default.

## 3. Active workspace context

The active workspace context should eventually track:
- Workspace/session identifier (non-secret, opaque).
- Original file name for display only.
- Detected file type.
- Upload timestamp.
- Current source dataset reference in memory.
- Current cleaned dataset reference in memory, if created.
- Inspection result.
- Cleaning plan and execution report.
- Selected dataset version (source or cleaned).
- Readiness task, target and result.
- ML Lab task, validation setup and result.
- Client-side chart configuration.
- Processing/version metadata.

Do not store raw data in browser localStorage, URL parameters, analytics events or logs. Prefer in-memory application state for Phase 1. If refresh persistence is later requested, design it explicitly with user consent, security, retention and deletion controls.

## 4. Source immutability and versioning

- Uploaded source is immutable.
- Every cleaning operation produces a separate output.
- Preview is non-destructive.
- Execute only after user approval.
- The active selected dataset version must be visible.
- A downstream score or chart must record whether it used source or cleaned output.
- Re-running a cleaning plan should be reproducible when the same input and operation configuration are used.

## 5. Data transfer and backend boundaries

- Keep the existing FastAPI service as the processing API.
- Keep the existing frontend API base URL configuration.
- Reuse current endpoints and request/response schemas.
- Do not introduce new endpoint contracts in Phase 1 unless the current UI cannot be safely composed without one; if so, stop and propose the smallest backward-compatible change.
- Avoid sending the same file repeatedly when existing client state can retain it safely.
- If current backend endpoints require re-uploading between operations, document that limitation before proposing a change; do not claim seamless persistence until verified.

## 6. Privacy defaults

- Raw uploads remain temporary and are not saved to Supabase by default.
- Supabase remains for authentication and approved account/metadata use.
- No dataset contents in logs, telemetry, prompts or error reports.
- Analysis History first stores metadata and reports only, after its own design and approval.
- If the user later chooses to save a dataset, require a separate explicit product decision, storage design, retention policy and authorization review.

## 7. Failure and recovery behaviour

- If upload/inspection fails, retain no misleading active-dataset state.
- If cleaning preview fails, keep the source unchanged.
- If cleaning execution fails, do not replace the source or show a false success.
- If navigation changes while a request is running, avoid duplicate submissions and preserve a clear pending state.
- If in-memory state is lost on refresh or tab closure, explain that re-upload may be required.
- Do not imply that history records can reconstruct a raw dataset.
