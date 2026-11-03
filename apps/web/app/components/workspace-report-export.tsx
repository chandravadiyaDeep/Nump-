"use client";

type ApiObject = Record<string, unknown>;

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename;
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] ?? character);
}

function metric(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value) ? value.toLocaleString() : "Not available";
}

// Construct an explicit metadata-only report. Never include preview rows or source data.
function buildReport(input: {
  file: File | null; overview: ApiObject | null; cleaning: ApiObject | null;
  readiness: ApiObject | null; comparison: ApiObject | null; mlComparison: ApiObject | null;
  task: string; target: string;
}) {
  const overview = input.overview ?? {};
  const summary = overview.overview && typeof overview.overview === "object" ? overview.overview as ApiObject : {};
  const cleaningReport = input.cleaning?.report && typeof input.cleaning.report === "object" ? input.cleaning.report as ApiObject : null;
  return {
    schema_version: 1,
    report_type: "NUMPA dataset work report",
    generated_at: new Date().toISOString(),
    data_policy: "Metadata and assessment summaries only. Raw dataset rows and preview samples are excluded.",
    dataset: {
      filename: input.file?.name ?? "Not selected",
      size_bytes: input.file?.size ?? null,
      row_count: summary.row_count ?? null,
      column_count: summary.column_count ?? null,
      missing_cells: summary.total_missing_cells ?? null,
      duplicate_rows: summary.duplicate_row_count ?? null,
      columns: Array.isArray(overview.columns) ? overview.columns.map((item) =>
        typeof item === "string" ? item : item && typeof item === "object" && "name" in item ? String((item as ApiObject).name) : null
      ).filter(Boolean) : [],
    },
    ml_context: { task: input.task || null, target: input.target || null },
    cleaning_report: cleaningReport,
    readiness_assessment: input.readiness,
    cleaning_readiness_comparison: input.comparison,
    model_comparison: input.mlComparison,
  };
}

export function ReportExportStudio(props: {
  file: File | null; overview: ApiObject | null; cleaning: ApiObject | null;
  readiness: ApiObject | null; comparison: ApiObject | null; mlComparison: ApiObject | null;
  task: string; target: string;
}) {
  const report = buildReport(props);
  const ready = !!props.file && !!props.overview;
  const stem = (props.file?.name ?? "numpa-dataset").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-");
  const json = JSON.stringify(report, null, 2);
  const sections = [
    ["Dataset", report.dataset],
    ["ML context", report.ml_context],
    ["Cleaning report", report.cleaning_report],
    ["Readiness assessment", report.readiness_assessment],
    ["Cleaning comparison", report.cleaning_readiness_comparison],
    ["Model comparison", report.model_comparison],
  ].filter(([, value]) => value !== null && value !== undefined);
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>NUMPA Dataset Report</title><style>
  body{font:15px/1.6 Arial,sans-serif;color:#20202a;max-width:900px;margin:40px auto;padding:0 22px}
  h1,h2{line-height:1.2}h1{font-size:28px}h2{font-size:18px;border-bottom:1px solid #ddd;padding-bottom:8px;margin-top:28px}
  .meta{color:#666;font-size:13px}.card{border:1px solid #ddd;border-radius:10px;padding:16px;margin:12px 0}
  pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.5 ui-monospace,monospace;background:#f7f7fa;padding:12px;border-radius:8px}
  @media print{body{margin:0 auto}.card{break-inside:avoid}button{display:none}}
  </style></head><body><h1>NUMPA Dataset Work Report</h1><p class="meta">Generated ${escapeHtml(report.generated_at)} · Schema v1</p><p>${escapeHtml(report.data_policy)}</p>${sections.map(([name, value]) => `<section class="card"><h2>${escapeHtml(name)}</h2><pre>${escapeHtml(JSON.stringify(value, null, 2))}</pre></section>`).join("")}<p class="meta">To create a PDF, open this HTML file in a browser and choose Print → Save as PDF.</p></body></html>`;

  return <section className="panel" aria-labelledby="report-export-title">
    <div className="panel-head"><div className="panel-icon" aria-hidden="true">▤</div><div><h2 id="report-export-title">Reports & export</h2><p>Generate a portable work report from the results currently available in this browser session.</p></div></div>
    <div className="panel-body">
      {!ready ? <div className="empty-state"><h3>Inspect a dataset first</h3><p>Reports become available after a dataset has been inspected.</p></div> : <>
        <div className="dataset-identity"><div><span>Source</span><strong>{props.file?.name}</strong></div><div><span>Rows</span><strong>{metric(report.dataset.row_count)}</strong></div><div><span>Columns</span><strong>{metric(report.dataset.column_count)}</strong></div></div>
        <p className="hint">Included: dataset metadata, column names, cleaning audit, readiness assessment and model-comparison results when available. Excluded: raw rows, preview samples and source file contents.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button className="primary" type="button" onClick={() => downloadText(json, `${stem}-numpa-report.json`, "application/json")}>Download JSON report</button>
          <button className="secondary" type="button" onClick={() => downloadText(html, `${stem}-numpa-report.html`, "text/html")}>Download printable HTML</button>
        </div>
        <div className="detail-list" style={{ marginTop: 16 }}><h3>Report contents</h3>{sections.map(([name]) => <div className="detail-row" key={String(name)}><span>{String(name)}</span><strong>Included when available</strong></div>)}</div>
        <p className="hint">PDF export is not generated directly in this release. Open the HTML report and use your browser's Print → Save as PDF.</p>
      </>}
    </div>
  </section>;
}
