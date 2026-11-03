"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { filterAndSortProfiles, getColumnProfiles, getProfileSummary, getQualityObservations, selectionLabel, validateUpload } from "./workspace-data-model.mjs";

type ApiObject = Record<string, unknown>;
type CleaningOutput = { blob: Blob; filename: string } | null;
type AnalysisWorkspaceProps = {
  file: File | null;
  overview: ApiObject | null;
  busy: string;
  error: string;
  notice: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onInspect: () => void;
  onUseSampleDataset: () => void;
  sampleBusy: boolean;
};

type CleaningWorkspaceProps = {
  file: File | null;
  overview: ApiObject | null;
  cleaning: ApiObject | null;
  cleanedCsv: CleaningOutput;
  fillMissing: boolean;
  dropDuplicates: boolean;
  normalizeText: boolean;
  busy: string;
  error: string;
  notice: string;
  onToggle: (operation: "fillMissing" | "dropDuplicates" | "normalizeText", selected: boolean) => void;
  onPreview: () => void;
  onExecute: () => void;
  onDownload: () => void;
  confirming: boolean;
  onBeginConfirmation: () => void;
  onCancelConfirmation: () => void;
};

function asObject(value: unknown): ApiObject {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiObject)
    : {};
}

function displayNumber(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value) ? value.toLocaleString() : "—";
}

function fileType(file: File | null, dataset: ApiObject): string {
  const format = dataset.format;
  if (typeof format === "string" && format) return format.toUpperCase();
  const suffix = file?.name.split(".").pop();
  return suffix && suffix !== file?.name ? suffix.toUpperCase() : "Unknown";
}

function countLabel(value: unknown, noun: string): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return `${noun} count not returned`;
  return `${displayNumber(value)} ${noun}${value === 1 ? "" : "s"} reported`;
}

export function DataAnalysisWorkspace({ file, overview, busy, error, notice, onFileChange, onInspect, onUseSampleDataset, sampleBusy }: AnalysisWorkspaceProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"name" | "missing" | "distinct">("name");
  const [page, setPage] = useState(0);
  const pageSize = 25;
  const dataset = asObject(overview?.dataset);
  const overviewData = asObject(overview?.overview);
  const profiles = useMemo(() => getColumnProfiles(overview?.columns), [overview]);
  useEffect(() => {
    setPage(0);
    setQuery("");
  }, [overview]);
  const visibleProfiles = useMemo(() => filterAndSortProfiles(profiles, query, sort), [profiles, query, sort]);
  const qualityObservations = getQualityObservations(overviewData);
  const pageCount = Math.max(1, Math.ceil(visibleProfiles.length / pageSize));
  const pageProfiles = visibleProfiles.slice(page * pageSize, (page + 1) * pageSize);
  const missing = overviewData.total_missing_cells;
  const duplicates = overviewData.duplicate_row_count;
  const cleaningPlan = asObject(overview?.cleaning_plan);
  const actions = Array.isArray(cleaningPlan.actions) ? cleaningPlan.actions : [];

  return (
    <div className="shell analysis-workspace">
      <section className="hero">
        <div className="eyebrow">NUMPA · DATA ANALYSIS</div>
        <h1>Understand your <span>dataset.</span></h1>
        <p>Inspect its structure and quality before deciding what to do next. Reported values come from the configured NUMPA API.</p>
      </section>

      {error && <div className="alert" role="alert">{error}</div>}
      {notice && <div className="alert success" role="status">{notice}</div>}

      {!overview && (
        <section className="workspace-onboarding panel" aria-labelledby="workspace-onboarding-title">
          <div className="workspace-onboarding-copy">
            <span className="workspace-onboarding-kicker">GET STARTED</span>
            <h2 id="workspace-onboarding-title">{file ? "Your dataset is ready to inspect." : "Start with a dataset. NUMPA will guide the next steps."}</h2>
            <p>{file ? "Your selected file stays in this browser session. Inspect it to see its structure and quality checks." : "Upload a supported file or explore the synthetic sample. Your source file is kept separate from any cleaned output."}</p>
            {!file && <button className="primary workspace-onboarding-action" type="button" onClick={onUseSampleDataset} disabled={sampleBusy || !!busy}>{sampleBusy ? "Loading sample…" : "Explore the sample dataset →"}</button>}
          </div>
          <ol className="workspace-onboarding-steps">
            <li><span>01</span><div><strong>Choose</strong><small>Upload a CSV, Excel or supported dataset.</small></div></li>
            <li><span>02</span><div><strong>Inspect</strong><small>Review structure, missing values and duplicates.</small></div></li>
            <li><span>03</span><div><strong>Prepare</strong><small>Preview cleaning and assess ML readiness.</small></div></li>
          </ol>
        </section>
      )}

      <div className="analysis-grid">
        <div className="stack">
          <section className="panel">
            <div className="panel-head"><div className="panel-icon" aria-hidden="true">↥</div><div><h2>Dataset</h2><p>Upload one supported tabular file for in-memory inspection.</p></div></div>
            <div className="panel-body">
              <div className="dropzone">
                <strong>Choose a dataset file</strong>
                <small>CSV, JSON, XLSX, Parquet, Arrow or Feather · maximum 50 MB</small>
                <input className="file-input" type="file" accept=".csv,.json,.xlsx,.parquet,.arrow,.feather" onChange={onFileChange} aria-label="Choose dataset file" />
                <button className="secondary" type="button" onClick={onUseSampleDataset} disabled={sampleBusy || !!busy}>{sampleBusy ? "Loading sample…" : "Try a sample dataset"}</button>
              </div>
              {file && <div className="file-chip"><span aria-hidden="true">▣</span><div><strong>{file.name}</strong><br /><span>{(file.size / 1024 / 1024).toFixed(2)} MB · {overview ? "Inspected" : "Selected"}</span></div></div>}
              <button className="primary" style={{ marginTop: 16 }} onClick={onInspect} disabled={!file || !!busy}>
                {busy === "inspect" ? <span className="loading-line"><span className="spinner" /> Inspecting…</span> : overview ? "Inspect again" : "Inspect dataset →"}
              </button>
              <p className="hint">The source file stays in this browser session and is sent to the configured API for temporary in-memory processing. It is not stored in this workspace.</p>
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="panel">
            <div className="panel-head"><div className="panel-icon" aria-hidden="true">▦</div><div><h2>Dataset overview</h2><p>Dimensions and quality values returned by inspection.</p></div></div>
            {overview ? <div className="results">
              <div className="dataset-identity"><div><span>Source dataset</span><strong>{String(dataset.filename ?? file?.name ?? "Unknown file")}</strong></div><div><span>File type</span><strong>{fileType(file, dataset)}</strong></div><div><span>Processing</span><strong>{typeof dataset.processing === "string" ? dataset.processing : "Status not returned"}</strong></div></div>
              <div className="metric-grid"><div className="metric"><span>Rows</span><strong>{displayNumber(overviewData.row_count)}</strong></div><div className="metric"><span>Columns</span><strong>{displayNumber(overviewData.column_count)}</strong></div><div className="metric"><span>Missing cells</span><strong>{displayNumber(missing)}</strong></div></div>
              <div className="detail-list"><div className="detail-row"><span>Numeric columns</span><strong>{displayNumber(overviewData.numeric_column_count)}</strong></div><div className="detail-row"><span>Non-numeric columns</span><strong>{displayNumber(overviewData.non_numeric_column_count)}</strong></div><div className="detail-row"><span>Exact duplicate rows</span><strong>{displayNumber(duplicates)}</strong></div></div>
              <div className="quality-observations" aria-label="Data quality observations">
                <h3>Quality observations</h3>
                {qualityObservations.map((item) => <p className={`quality-${item.tone}`} key={item.id}>{item.message}</p>)}
                {Array.isArray(overview.columns) && <p>{profiles.length.toLocaleString()} of {overview.columns.length.toLocaleString()} returned column profiles are available below.</p>}
              </div>
            </div> : <div className="empty-state"><div className="empty-graphic" aria-hidden="true">▤</div><h3>No inspected dataset</h3><p>Select a file and inspect it to see dimensions, missing values, duplicates, and column profiles.</p></div>}
          </section>

          {overview && <section className="panel">
            <div className="panel-head"><div className="panel-icon" aria-hidden="true">☷</div><div><h2>Column profiles</h2><p>Profile values returned by the API. Missing summaries are shown as unavailable.</p></div></div>
            {profiles.length ? <div className="results">
              <div className="profile-controls"><label htmlFor="profile-search">Search columns</label><input id="profile-search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Column name or type" /><label htmlFor="profile-sort">Sort by</label><select id="profile-sort" value={sort} onChange={(event) => { const value = event.target.value; if (value === "name" || value === "missing" || value === "distinct") setSort(value); setPage(0); }}><option value="name">Column name</option><option value="missing">Missing count</option><option value="distinct">Distinct count</option></select></div>
              <div className="table-wrap"><table className="profile-table"><thead><tr><th scope="col">Column</th><th scope="col">Type</th><th scope="col">Missing</th><th scope="col">Distinct</th><th scope="col">Summary returned by API</th></tr></thead><tbody>{pageProfiles.map((profile, index) => <tr key={`${String(profile.name)}-${index}`}><th scope="row">{String(profile.name)}</th><td>{String(profile.dtype)}</td><td>{displayNumber(profile.missing_count)}{typeof profile.missing_percent === "number" ? ` (${profile.missing_percent}%)` : ""}</td><td>{displayNumber(profile.unique_count)}</td><td>{getProfileSummary(profile)}</td></tr>)}</tbody></table></div>
              <div className="pagination"><span>{visibleProfiles.length ? `${(page * pageSize + 1).toLocaleString()}–${Math.min((page + 1) * pageSize, visibleProfiles.length).toLocaleString()} of ${visibleProfiles.length.toLocaleString()} profiles` : "No matching columns"}</span><div><button className="secondary" type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0}>Previous</button><button className="secondary" type="button" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={page >= pageCount - 1}>Next</button></div></div>
            </div> : <div className="empty-state"><h3>No column profiles returned</h3><p>The inspection response did not include usable column profile data.</p></div>}
          </section>}

          {!overview && <section className="panel"><div className="empty-state"><div className="empty-graphic" aria-hidden="true">⌕</div><h3>Analysis begins with inspection</h3><p>Choose a dataset file to view trustworthy overview and column-level information.</p></div></section>}
        </div>
      </div>
    </div>
  );
}

export function DataPreprocessingWorkspace({
  file, overview, cleaning, cleanedCsv, fillMissing, dropDuplicates, normalizeText, busy, error, notice,
  onToggle, onPreview, onExecute, onDownload, confirming, onBeginConfirmation, onCancelConfirmation,
}: CleaningWorkspaceProps) {
  const dataset = asObject(overview?.dataset);
  const overviewData = asObject(overview?.overview);
  const plan = asObject(overview?.cleaning_plan);
  const actions = Array.isArray(plan.actions) ? plan.actions : [];
  const report = asObject(cleaning?.report);
  const before = asObject(report.before);
  const after = asObject(report.after);
  const operations = Array.isArray(report.operations) ? report.operations : [];
  const previewRows = Array.isArray(cleaning?.preview) ? cleaning.preview.map(asObject) : [];
  const previewColumns = Array.isArray(cleaning?.columns) ? cleaning.columns.filter((column): column is string => typeof column === "string") : [];
  const canPreview = !!file && !!overview && !busy;
  const recommendationTitle = (action: ApiObject) => {
    if (action.issue === "missing_values") return `Missing values · ${String(action.column ?? "column")}`;
    if (action.issue === "exact_duplicate_rows") return "Exact duplicate rows";
    if (action.issue === "potential_outliers") return `Potential outliers · ${String(action.column ?? "column")}`;
    return typeof action.issue === "string" ? action.issue.replaceAll("_", " ") : "Data quality observation";
  };

  return (
    <div className="shell cleaning-workspace">
      <section className="hero"><div className="eyebrow">NUMPA · DATA PREPROCESSING</div><h1>Review every <span>change.</span></h1><p>Choose supported cleaning operations, inspect the proposed output, then explicitly approve creating a separate CSV copy.</p></section>
      {error && <div className="alert" role="alert">{error}</div>}
      {notice && <div className="alert success" role="status">{notice}</div>}
      <section className="panel source-context"><div className="panel-head"><div className="panel-icon" aria-hidden="true">▣</div><div><h2>Active source dataset</h2><p>Cleaning always reads the original upload. The source remains unchanged in memory.</p></div></div>
        {file && overview ? <div className="results"><div className="dataset-identity"><div><span>Source file</span><strong>{String(dataset.filename ?? file.name)}</strong></div><div><span>File type</span><strong>{fileType(file, dataset)}</strong></div><div><span>Dimensions</span><strong>{displayNumber(overviewData.row_count)} rows × {displayNumber(overviewData.column_count)} columns</strong></div><div><span>State</span><strong>Inspected source · in memory</strong></div></div>{cleanedCsv && <p className="clean-output-identity"><strong>Separate output available:</strong> {cleanedCsv.filename} · CSV. This is not the original file.</p>}</div> : <div className="empty-state"><div className="empty-graphic" aria-hidden="true">↥</div><h3>No active inspected dataset</h3><p>Return to Data Analysis, choose a supported file, and inspect it before reviewing cleaning actions.</p></div>}
      </section>

      {file && overview && <div className="cleaning-grid">
        <div className="stack">
          <section className="panel"><div className="panel-head"><div className="panel-icon" aria-hidden="true">✳</div><div><h2>API cleaning recommendations</h2><p>Recommendations below are returned for this source dataset, not generated by the browser.</p></div></div>
            <div className="results">
              {actions.length ? <><div className="detail-list">{actions.map((item, index) => { const action = asObject(item); const unsupported = action.strategy === "flag_only"; return <div className="recommendation-row" key={`${String(action.issue)}-${String(action.column ?? "all")}-${index}`}><div><strong>{recommendationTitle(action)}</strong><p>{String(action.reason ?? "Reason not returned.")}</p><span className="recommendation-meta">{countLabel(action.count, "affected row/cell")} · {unsupported ? "Unsupported by current execute options; informational only" : action.requires_approval === true ? "Review before applying" : "No value-changing operation proposed"}</span></div><span className={`mini-label${unsupported ? " is-muted" : ""}`}>{unsupported ? "Unsupported" : "API suggestion"}</span></div>; })}</div>{typeof plan.note === "string" && <p className="hint">{plan.note}</p>}</> : <div className="empty-state compact"><h3>No actions returned</h3><p>The API did not return a cleaning recommendation for this dataset.</p></div>}
            </div>
          </section>

          <section className="panel"><div className="panel-head"><div className="panel-icon" aria-hidden="true">☷</div><div><h2>Supported operations</h2><p>These controls map directly to the current cleaning preview and execute request fields.</p></div></div>
            <div className="panel-body">
              <label className="check-row"><input type="checkbox" checked={fillMissing} onChange={(event) => onToggle("fillMissing", event.target.checked)} disabled={!file || !!busy} /><span><strong>Fill missing values</strong><br />Uses the existing API defaults by column type (mean/median, mode or “Unknown”); all-missing columns are skipped.</span><span className={`operation-state${fillMissing ? " is-selected" : ""}`}>{selectionLabel(fillMissing)}</span></label>
              <label className="check-row"><input type="checkbox" checked={dropDuplicates} onChange={(event) => onToggle("dropDuplicates", event.target.checked)} disabled={!file || !!busy} /><span><strong>Drop exact duplicate rows</strong><br />Removes rows identical across every column. Keep off if duplicates may be meaningful.</span><span className={`operation-state${dropDuplicates ? " is-selected" : ""}`}>{selectionLabel(dropDuplicates)}</span></label>
              <label className="check-row"><input type="checkbox" checked={normalizeText} onChange={(event) => onToggle("normalizeText", event.target.checked)} disabled={!file || !!busy} /><span><strong>Trim text whitespace</strong><br />Trims leading and trailing spaces in supported text columns; it does not change letter case.</span><span className={`operation-state${normalizeText ? " is-selected" : ""}`}>{selectionLabel(normalizeText)}</span></label>
              <p className="hint">The execute API exposes these three dataset-level options. Per-column parameter selection and outlier modification are not supported.</p>
              <button className="primary" style={{ marginTop: 14 }} onClick={onPreview} disabled={!canPreview}>{busy === "preview" ? <span className="loading-line"><span className="spinner" /> Preparing preview…</span> : "Preview selected operations →"}</button>
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="panel"><div className="panel-head"><div className="panel-icon" aria-hidden="true">⌕</div><div><h2>Preview before approval</h2><p>Preview runs on a fresh request from the unchanged source file.</p></div></div>
            {cleaning ? <div className="results">
              <div className="dataset-identity preview-dimensions"><div><span>Before · source</span><strong>{displayNumber(before.rows ?? overviewData.row_count)} rows · {displayNumber(before.columns ?? overviewData.column_count)} columns</strong></div><div><span>Previewed output</span><strong>{displayNumber(after.rows)} rows · {displayNumber(after.columns)} columns</strong></div><div><span>Missing cells after preview</span><strong>{displayNumber(after.missing_cells)}</strong></div><div><span>Duplicates after preview</span><strong>{displayNumber(after.duplicate_rows)}</strong></div></div>
              <div className="result-title"><h3>Operations in preview report</h3><span className="mini-label">API response</span></div>
              {operations.length ? <ul className="operation-report">{operations.map((item, index) => { const operation = asObject(item); return <li key={`${String(operation.operation)}-${String(operation.column ?? "all")}-${index}`}><strong>{String(operation.operation ?? "Operation")}</strong>{typeof operation.column === "string" ? ` · ${operation.column}` : ""}{typeof operation.method === "string" ? ` · ${operation.method}` : ""}{typeof operation.changed_cells === "number" ? ` · ${operation.changed_cells.toLocaleString()} cells` : ""}{typeof operation.filled_cells === "number" ? ` · ${operation.filled_cells.toLocaleString()} cells filled` : ""}{typeof operation.removed_rows === "number" ? ` · ${operation.removed_rows.toLocaleString()} rows removed` : ""}</li>; })}</ul> : <p className="hint">The preview report returned no applied operations for these selections.</p>}
              <div className="result-title"><h3>Output sample</h3><span className="mini-label">First 20 rows returned</span></div>
              {previewRows.length && previewColumns.length ? <div className="table-wrap"><table><thead><tr>{previewColumns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{previewRows.map((row, index) => <tr key={index}>{previewColumns.map((column) => <td key={column}>{row[column] == null ? "—" : String(row[column])}</td>)}</tr>)}</tbody></table></div> : <p className="hint">The API returned no output rows in this preview.</p>}
              <p className="preview-report-note">This is the report returned by the preview endpoint. The execute endpoint returns a CSV file only and does not return a separate execution report.</p>
              {!confirming ? <button className="primary" onClick={onBeginConfirmation} disabled={!!busy}>Review and approve execution</button> : <div className="confirmation-panel" role="group" aria-labelledby="confirm-cleaning-title"><h3 id="confirm-cleaning-title">Create a separate cleaned CSV?</h3><p>The API will process the original upload again with these selections. The original file will remain unchanged. The export format is CSV, regardless of the source file type.</p><div className="button-row"><button className="primary" onClick={onExecute} disabled={!!busy}>{busy === "execute" ? <span className="loading-line"><span className="spinner" /> Creating cleaned CSV…</span> : "Confirm and create CSV"}</button><button className="secondary" onClick={onCancelConfirmation} disabled={!!busy}>Cancel</button></div></div>}
              {cleanedCsv && <div className="cleaned-output"><div><strong>Cleaned CSV ready</strong><p>{cleanedCsv.filename} · generated as a separate in-memory output.</p></div><button className="secondary" type="button" onClick={onDownload} disabled={!!busy}>↓ Download CSV</button></div>}
            </div> : <div className="empty-state"><div className="empty-graphic" aria-hidden="true">⌕</div><h3>Preview is required</h3><p>Select supported operations and request a preview. No cleaning executes until you approve it.</p></div>}
          </section>
        </div>
      </div>}
    </div>
  );
}

