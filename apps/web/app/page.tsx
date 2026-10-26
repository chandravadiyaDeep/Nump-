"use client";

import { ChangeEvent, useMemo, useState } from "react";

type ApiObject = Record<string, unknown>;

const API_BASE = (
  process.env.NEXT_PUBLIC_NUMPA_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

// Keep API error messages readable instead of showing an unhelpful generic failure.
async function readApiResponse(response: Response): Promise<ApiObject> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail =
      typeof payload.detail === "string"
        ? payload.detail
        : `Request failed with status ${response.status}`;
    throw new Error(detail);
  }
  return payload as ApiObject;
}

function asObject(value: unknown): ApiObject {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiObject)
    : {};
}

function displayNumber(value: unknown): string {
  return typeof value === "number" ? value.toLocaleString() : "—";
}

function downloadBlob(blob: Blob, filename: string) {
  // Use a temporary browser URL so the downloaded dataset never needs a storage account.
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [task, setTask] = useState("classification");
  const [target, setTarget] = useState("");
  const [fillMissing, setFillMissing] = useState(true);
  const [dropDuplicates, setDropDuplicates] = useState(false);
  const [normalizeText, setNormalizeText] = useState(true);
  const [overview, setOverview] = useState<ApiObject | null>(null);
  const [readiness, setReadiness] = useState<ApiObject | null>(null);
  const [cleaning, setCleaning] = useState<ApiObject | null>(null);
  const [comparison, setComparison] = useState<{ before: ApiObject; after: ApiObject } | null>(null);
  const [cleanedCsv, setCleanedCsv] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");

  const overviewData = useMemo(() => asObject(overview?.overview), [overview]);
  const score = readiness?.score;
  const scoreLabel =
    typeof score === "number"
      ? score >= 80
        ? "Strong starting point"
        : score >= 60
          ? "Some improvements recommended"
          : "Needs preparation"
      : "Assessment not run yet";

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    // Clear stale results so the UI never shows the previous file's report as current.
    setOverview(null);
    setReadiness(null);
    setCleaning(null);
    setComparison(null);
    setCleanedCsv(null);
    setError("");
    setNotice("");
  }

  async function inspectDataset() {
    if (!file) {
      setError("Choose a dataset file before continuing.");
      return;
    }
    setBusy("inspect");
    setError("");
    setNotice("");
    try {
      const form = new FormData();
      form.append("file", file);
      const result = await readApiResponse(
        await fetch(`${API_BASE}/api/v1/datasets/inspect`, {
          method: "POST",
          body: form,
        }),
      );
      setOverview(result);
      setCleaning(null);
      setReadiness(null);
      setNotice("Dataset inspected. Review the overview, then assess readiness or preview cleaning.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to inspect this dataset.");
    } finally {
      setBusy("");
    }
  }

  async function calculateReadiness() {
    if (!file) {
      setError("Choose a dataset file before assessing ML readiness.");
      return;
    }
    if (task !== "clustering" && !target.trim()) {
      setError("Enter the target column for classification, regression, or forecasting.");
      return;
    }
    setBusy("readiness");
    setError("");
    setNotice("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("task", task);
      if (target.trim()) form.append("target", target.trim());
      const result = await readApiResponse(
        await fetch(`${API_BASE}/api/v1/ml-readiness/score`, {
          method: "POST",
          body: form,
        }),
      );
      setReadiness(result);
      setComparison(null);
      setNotice("Readiness assessment completed. The score is a heuristic, not a guarantee of model performance.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to assess readiness.");
    } finally {
      setBusy("");
    }
  }

  async function previewCleaning() {
    if (!file) {
      setError("Choose a dataset file before previewing cleaning.");
      return;
    }
    setBusy("cleaning");
    setError("");
    setNotice("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("fill_missing", String(fillMissing));
      form.append("drop_exact_duplicates", String(dropDuplicates));
      form.append("normalize_text", String(normalizeText));
      const result = await readApiResponse(
        await fetch(`${API_BASE}/api/v1/cleaning/preview`, {
          method: "POST",
          body: form,
        }),
      );
      setCleaning(result);
      setComparison(null);
      setCleanedCsv(null);
      setNotice("Cleaning preview is ready. Your original upload has not been overwritten.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to preview cleaning.");
    } finally {
      setBusy("");
    }
  }

  async function applyCleaningAndCompare() {
    if (!file) {
      setError("Choose a dataset file before applying cleaning.");
      return;
    }
    if (task !== "clustering" && !target.trim()) {
      setError("Enter the target column before comparing readiness.");
      return;
    }
    setBusy("compare");
    setError("");
    setNotice("");
    try {
      // Execute the exact options the user selected, keeping the source file untouched.
      const cleanForm = new FormData();
      cleanForm.append("file", file);
      cleanForm.append("fill_missing", String(fillMissing));
      cleanForm.append("drop_exact_duplicates", String(dropDuplicates));
      cleanForm.append("normalize_text", String(normalizeText));
      const cleanResponse = await fetch(`${API_BASE}/api/v1/cleaning/execute`, {
        method: "POST",
        body: cleanForm,
      });
      if (!cleanResponse.ok) {
        const payload = await cleanResponse.json().catch(() => ({}));
        throw new Error(typeof payload.detail === "string" ? payload.detail : "Could not apply cleaning.");
      }
      const blob = await cleanResponse.blob();
      const stem = file.name.replace(/\.[^.]+$/, "") || "dataset";
      const cleanedFilename = `${stem}-cleaned.csv`;
      const cleanedFile = new File([blob], cleanedFilename, { type: "text/csv" });

      // Score both versions using the same task and target for a fair comparison.
      const scoreFile = async (candidate: File): Promise<ApiObject> => {
        const form = new FormData();
        form.append("file", candidate);
        form.append("task", task);
        if (target.trim()) form.append("target", target.trim());
        return readApiResponse(await fetch(`${API_BASE}/api/v1/ml-readiness/score`, {
          method: "POST",
          body: form,
        }));
      };
      const [before, after] = await Promise.all([scoreFile(file), scoreFile(cleanedFile)]);
      setComparison({ before, after });
      setReadiness(after);
      setCleanedCsv({ blob, filename: cleanedFilename });
      setNotice("Cleaning applied to a temporary copy. Before/after readiness scores are ready; your original file was not overwritten.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to compare readiness before and after cleaning.");
    } finally {
      setBusy("");
    }
  }

  async function downloadCleanedCsv() {
    if (!file) return;
    if (cleanedCsv) {
      downloadBlob(cleanedCsv.blob, cleanedCsv.filename);
      setNotice("Cleaned CSV downloaded to your device.");
      return;
    }
    setBusy("download");
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("fill_missing", String(fillMissing));
      form.append("drop_exact_duplicates", String(dropDuplicates));
      form.append("normalize_text", String(normalizeText));
      const response = await fetch(`${API_BASE}/api/v1/cleaning/execute`, {
        method: "POST",
        body: form,
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
          typeof payload.detail === "string" ? payload.detail : "Download failed.",
        );
      }
      const blob = await response.blob();
      const stem = file.name.replace(/\.[^.]+$/, "") || "dataset";
      downloadBlob(blob, `${stem}-cleaned.csv`);
      setNotice("Cleaned CSV downloaded to your device.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to download cleaned data.");
    } finally {
      setBusy("");
    }
  }

  const previewRows = Array.isArray(cleaning?.preview)
    ? (cleaning.preview as ApiObject[])
    : [];
  const previewColumns = Array.isArray(cleaning?.columns)
    ? (cleaning.columns as string[])
    : [];
  const scoreDimensions = Array.isArray(readiness?.dimensions)
    ? readiness.dimensions
    : [];

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">N</span>
          <span>NUMPA</span>
        </div>
        <div className="top-pill"><span className="status-dot" /> Dataset Quality Studio</div>
      </header>

      <section className="hero">
        <div className="eyebrow">● Your data, ready for what comes next</div>
        <h1>Make your data <span>model-ready.</span></h1>
        <p>
          Find data quality issues, review smart cleaning suggestions, and understand
          how prepared your dataset is for machine learning — before you build a model.
        </p>
      </section>

      <nav className="workflow" aria-label="NUMPA workflow">
        {["Upload & inspect", "Assess readiness", "Review cleaning", "Export results"].map(
          (step, index) => (
            <div className={`workflow-step ${(index === 0 && !overview) || (index === 1 && overview && !readiness) || (index === 2 && readiness && !cleaning) || (index === 3 && cleaning) ? "active" : ""}`} key={step}>
              <span className="step-num">{index + 1}</span>{step}
            </div>
          ),
        )}
      </nav>

      {error && <div className="alert" role="alert">{error}</div>}
      {notice && <div className="alert success" role="status">{notice}</div>}

      <div className="layout">
        <div className="stack">
          <section className="panel">
            <div className="panel-head">
              <div className="panel-icon">↥</div>
              <div>
                <h2>Start with your dataset</h2>
                <p>Choose a supported tabular file to inspect its quality.</p>
              </div>
            </div>
            <div className="panel-body">
              <div className="dropzone">
                <div className="upload-symbol">▤</div>
                <strong>Upload your data file</strong>
                <small>CSV, XLSX, JSON, Parquet, Arrow IPC or Feather · up to 50 MB</small>
                <input
                  className="file-input"
                  type="file"
                  accept=".csv,.xlsx,.json,.parquet,.arrow,.feather,.ipc"
                  onChange={handleFileChange}
                  aria-label="Choose dataset file"
                />
              </div>
              {file && (
                <div className="file-chip">
                  <span>▣</span>
                  <div><strong>{file.name}</strong><br /><span>{(file.size / 1024 / 1024).toFixed(2)} MB selected</span></div>
                </div>
              )}
              <button className="primary" style={{ marginTop: 16 }} onClick={inspectDataset} disabled={!file || !!busy}>
                {busy === "inspect" ? <span className="loading-line"><span className="spinner" /> Inspecting dataset…</span> : "Inspect dataset →"}
              </button>
              <p className="hint">Files are sent to your configured NUMPA API for in-memory processing. The MVP does not intentionally persist uploaded datasets on the server.</p>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div className="panel-icon">◈</div>
              <div>
                <h2>ML readiness assessment</h2>
                <p>Choose the intended ML task so the assessment can use relevant checks.</p>
              </div>
            </div>
            <div className="panel-body">
              <div className="field">
                <label htmlFor="task">Intended ML task</label>
                <select id="task" value={task} onChange={(event) => { setTask(event.target.value); setComparison(null); }}>
                  <option value="classification">Classification</option>
                  <option value="regression">Regression</option>
                  <option value="forecasting">Time-series forecasting</option>
                  <option value="clustering">Clustering (no target column)</option>
                </select>
              </div>
              {task !== "clustering" && (
                <div className="field">
                  <label htmlFor="target">Target column name</label>
                  <input id="target" value={target} onChange={(event) => { setTarget(event.target.value); setComparison(null); }} placeholder="e.g. churn, price, outcome" />
                </div>
              )}
              <button className="primary" style={{ marginTop: 17 }} onClick={calculateReadiness} disabled={!file || !!busy}>
                {busy === "readiness" ? <span className="loading-line"><span className="spinner" /> Calculating score…</span> : "Calculate readiness score →"}
              </button>
              {task === "forecasting" && <p className="hint">Forecasting is supported by the current readiness heuristic; time-aware model validation is not yet part of model comparison.</p>}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div className="panel-icon">✳</div>
              <div>
                <h2>Smart cleaning controls</h2>
                <p>Choose the transformations you want to preview. The source file remains unchanged.</p>
              </div>
            </div>
            <div className="panel-body">
              <label className="check-row"><input type="checkbox" checked={fillMissing} onChange={(event) => { setFillMissing(event.target.checked); setComparison(null); setCleanedCsv(null); }} /><span><strong>Fill missing values</strong><br />Use safe column-based defaults from the cleaning engine.</span></label>
              <label className="check-row"><input type="checkbox" checked={dropDuplicates} onChange={(event) => { setDropDuplicates(event.target.checked); setComparison(null); setCleanedCsv(null); }} /><span><strong>Remove exact duplicate rows</strong><br />Keep this off if duplicate records may be meaningful.</span></label>
              <label className="check-row"><input type="checkbox" checked={normalizeText} onChange={(event) => { setNormalizeText(event.target.checked); setComparison(null); setCleanedCsv(null); }} /><span><strong>Normalize text whitespace</strong><br />Trim leading and trailing spaces in text values.</span></label>
              <div className="button-row">
                <button className="primary" onClick={previewCleaning} disabled={!file || !!busy}>
                  {busy === "cleaning" ? <span className="loading-line"><span className="spinner" /> Preparing…</span> : "Preview cleaning"}
                </button>
                <button className="secondary" onClick={downloadCleanedCsv} disabled={!file || !!busy}>
                  {busy === "download" ? "Preparing…" : "↓ Download CSV"}
                </button>
              </div>
              <p className="hint">Review the report before using cleaned data in a real project. Automated cleaning cannot know every domain-specific rule.</p>
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="panel">
            <div className="panel-head">
              <div className="panel-icon">▦</div>
              <div>
                <h2>Dataset overview</h2>
                <p>A quick read on structure and quality before any changes.</p>
              </div>
            </div>
            {overview ? (
              <div className="results">
                <div className="metric-grid">
                  <div className="metric"><span>Rows</span><strong>{displayNumber(overviewData.row_count)}</strong></div>
                  <div className="metric"><span>Columns</span><strong>{displayNumber(overviewData.column_count)}</strong></div>
                  <div className="metric"><span>Missing cells</span><strong>{displayNumber(overviewData.total_missing_cells)}</strong></div>
                </div>
                <div className="detail-list">
                  <div className="detail-row"><span>Exact duplicate rows</span><strong>{displayNumber(overviewData.duplicate_row_count)}</strong></div>
                  <div className="detail-row"><span>Source file</span><strong>{String(asObject(overview.dataset).filename ?? file?.name ?? "—")}</strong></div>
                  <div className="detail-row"><span>Processing mode</span><strong>In-memory</strong></div>
                </div>
                <div className="result-title"><h3>Inspection response</h3><span className="mini-label">API report</span></div>
                <pre className="json-box">{JSON.stringify(overview, null, 2)}</pre>
                <button className="secondary" style={{ width: "100%" }} onClick={() => window.print()}>Print / Save report as PDF</button>
              </div>
            ) : (
              <div className="empty-state"><div className="empty-graphic">▤</div><h3>Your data story starts here</h3><p>Upload a dataset and select “Inspect dataset” to see its size, missing values, duplicate signals, and profile.</p></div>
            )}
          </section>

          <section className="panel">
            <div className="panel-head">
              <div className="panel-icon">◉</div>
              <div>
                <h2>Readiness score</h2>
                <p>Understand strengths and quality gaps for your chosen ML task.</p>
              </div>
            </div>
            {readiness ? (
              <div className="results">
                <div className="score-wrap">
                  <div className="score-ring">{typeof score === "number" ? Math.round(score) : "—"}</div>
                  <div className="score-copy"><strong>{scoreLabel}</strong><p>Out of 100 · deterministic heuristic. This is not a model-performance guarantee.</p></div>
                </div>
                {comparison && (
                  <div>
                    <div className="result-title"><h3>Before vs after cleaning</h3><span className="mini-label">Same task and target</span></div>
                    <div className="metric-grid" style={{ marginTop: 10 }}>
                      <div className="metric"><span>Before</span><strong>{displayNumber(comparison.before.score)}<small>/100</small></strong></div>
                      <div className="metric"><span>After</span><strong>{displayNumber(comparison.after.score)}<small>/100</small></strong></div>
                      <div className="metric"><span>Score change</span><strong>{typeof comparison.before.score === "number" && typeof comparison.after.score === "number" ? `${comparison.after.score - comparison.before.score > 0 ? "+" : ""}${comparison.after.score - comparison.before.score}` : "—"}</strong></div>
                    </div>
                    <p className="hint">A higher score is not a guarantee of better model performance. Review the cleaning report and preserve domain meaning.</p>
                  </div>
                )}
                {scoreDimensions.length > 0 ? (
                  <div className="detail-list">
                    {scoreDimensions.map((item, index) => {
                      const dimension = asObject(item);
                      return <div className="detail-row" key={String(dimension.name ?? index)}><span>{String(dimension.name ?? dimension.dimension ?? `Dimension ${index + 1}`)}</span><strong>{typeof dimension.score === "number" ? `${dimension.score}/100` : String(dimension.value ?? "See details")}</strong></div>;
                    })}
                  </div>
                ) : null}
                <pre className="json-box">{JSON.stringify(readiness, null, 2)}</pre>
                <button className="secondary" style={{ width: "100%" }} onClick={() => window.print()}>Print / Save report as PDF</button>
              </div>
            ) : (
              <div className="empty-state"><div className="empty-graphic">◉</div><h3>Know before you train</h3><p>Choose a task and target column, then calculate the readiness score to see the factors affecting your dataset.</p></div>
            )}
          </section>

          <section className="panel">
            <div className="panel-head">
              <div className="panel-icon">✳</div>
              <div>
                <h2>Cleaning preview</h2>
                <p>Check the proposed output before downloading the cleaned CSV.</p>
              </div>
            </div>
            {cleaning ? (
              <div className="results">
                <div className="result-title"><h3>Preview sample</h3><span className="mini-label">First 20 rows</span></div>
                {previewRows.length > 0 && previewColumns.length > 0 ? (
                  <div className="table-wrap">
                    <table>
                      <thead><tr>{previewColumns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
                      <tbody>{previewRows.map((row, index) => <tr key={index}>{previewColumns.map((column) => <td key={column}>{row[column] == null ? "—" : String(row[column])}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                ) : <p className="hint">No preview rows were returned. Review the report below for details.</p>}
                <div className="result-title"><h3>Cleaning report</h3><span className="mini-label">Preview only</span></div>
                <pre className="json-box">{JSON.stringify(cleaning.report ?? cleaning, null, 2)}</pre>
                <button className="primary" onClick={applyCleaningAndCompare} disabled={!file || !!busy}>{busy === "compare" ? <span className="loading-line"><span className="spinner" /> Applying & comparing…</span> : "Apply cleaning & compare readiness"}</button>
                <button className="secondary" style={{ width: "100%", marginTop: 9 }} onClick={downloadCleanedCsv} disabled={!file || !!busy}>{busy === "download" ? "Preparing download…" : "↓ Download cleaned CSV"}</button>
              </div>
            ) : (
              <div className="empty-state"><div className="empty-graphic">✳</div><h3>Nothing changes without review</h3><p>Select your cleaning options and preview the report. The original upload is never overwritten by this workflow.</p></div>
            )}
          </section>
        </div>
      </div>

      <footer className="footer">
        <span><strong>NUMPA</strong> · Dataset Quality Studio · MVP</span>
        <span>Designed for explainable, review-first data preparation</span>
      </footer>
    </main>
  );
}
