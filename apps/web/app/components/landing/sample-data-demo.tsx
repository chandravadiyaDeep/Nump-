"use client";

import { useEffect, useMemo, useState } from "react";

type Cell = string | number;
type SampleRow = Record<string, Cell>;
type Tab = "Overview" | "Quality" | "Visualize" | "Cleaning preview" | "ML readiness" | "Compare";
const tabs: Tab[] = ["Overview", "Quality", "Visualize", "Cleaning preview", "ML readiness", "Compare"];
const columns = ["customer_id", "age", "income", "last_purchase_days", "total_spent", "category", "region", "purchases", "satisfaction", "churn", "signup_month", "support_tickets"];
const numericColumns = ["age", "income", "last_purchase_days", "total_spent", "purchases", "satisfaction", "support_tickets"];

function parseCsv(source: string): SampleRow[] {
  // The bundled demonstration CSV has simple, unquoted fields; this parser also handles quoted commas.
  const lines = source.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.match(/(?:^|,)(?:"((?:[^"]|"")*)"|([^,]*))/g)?.map((value) => {
      const cleaned = value.replace(/^,/, "");
      return cleaned.startsWith('"') ? cleaned.slice(1, -1).replace(/""/g, '"') : cleaned;
    }) ?? [];
    return Object.fromEntries(headers.map((header, index) => {
      const value = values[index] ?? "";
      return [header, numericColumns.includes(header) && value !== "" ? Number(value) : value];
    })) as SampleRow;
  });
}

function missingCount(rows: SampleRow[]): number {
  return rows.reduce((sum, row) => sum + columns.filter((column) => row[column] === "").length, 0);
}
function duplicatesCount(rows: SampleRow[]): number {
  const seen = new Set<string>();
  let duplicates = 0;
  rows.forEach((row) => {
    const key = columns.map((column) => String(row[column] ?? "")).join("|");
    if (seen.has(key)) duplicates += 1;
    else seen.add(key);
  });
  return duplicates;
}
function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
function cleanRows(rows: SampleRow[], removeDuplicates: boolean, fillMissing: boolean, trimOutliers: boolean): SampleRow[] {
  let result = rows.map((row) => ({ ...row }));
  if (removeDuplicates) {
    const seen = new Set<string>();
    result = result.filter((row) => {
      const key = columns.map((column) => String(row[column] ?? "")).join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  if (fillMissing) {
    numericColumns.forEach((column) => {
      const values = result.map((row) => row[column]).filter((value): value is number => typeof value === "number" && Number.isFinite(value));
      const fill = median(values);
      result.forEach((row) => { if (row[column] === "") row[column] = fill; });
    });
  }
  if (trimOutliers) {
    // A transparent demo-only rule: remove rows outside the documented sample bounds.
    result = result.filter((row) => !(typeof row.age === "number" && row.age > 85) && !(typeof row.income === "number" && row.income > 200000) && !(typeof row.total_spent === "number" && row.total_spent > 80000));
  }
  return result;
}
function readinessScore(rows: SampleRow[]): number {
  if (!rows.length) return 0;
  const cells = rows.length * columns.length;
  const missingRate = missingCount(rows) / cells;
  const duplicateRate = duplicatesCount(rows) / rows.length;
  const score = 100 - missingRate * 420 - duplicateRate * 120;
  return Math.max(0, Math.min(100, Math.round(score)));
}
function fmt(value: number): string { return value.toLocaleString("en-IN", { maximumFractionDigits: 1 }); }

export default function SampleDataDemo() {
  const [rows, setRows] = useState<SampleRow[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [fillMissing, setFillMissing] = useState(true);
  const [trimOutliers, setTrimOutliers] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/data/sample/ecommerce_customers_synthetic.csv")
      .then((response) => {
        if (!response.ok) throw new Error("The sample dataset could not be loaded.");
        return response.text();
      })
      .then((csv) => { if (active) setRows(parseCsv(csv)); })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Unable to load the sample dataset."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const cleaned = useMemo(() => cleanRows(rows, removeDuplicates, fillMissing, trimOutliers), [rows, removeDuplicates, fillMissing, trimOutliers]);
  const beforeScore = readinessScore(rows);
  const afterScore = readinessScore(cleaned);
  const missingByColumn = useMemo(() => columns.map((column) => ({
    column,
    count: rows.filter((row) => row[column] === "").length,
  })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count), [rows]);
  const ageValues = rows.map((row) => row.age).filter((value): value is number => typeof value === "number");
  const incomeValues = rows.map((row) => row.income).filter((value): value is number => typeof value === "number");
  const spendValues = rows.map((row) => row.total_spent).filter((value): value is number => typeof value === "number");
  const maxIncome = Math.max(...incomeValues, 1);
  const maxSpend = Math.max(...spendValues, 1);

  return (
    <section className="demo-section" id="live-demo" aria-labelledby="demo-title">
      <div className="landing-section-heading">
        <p className="landing-eyebrow">INTERACTIVE PRODUCT TOUR</p>
        <h2 id="demo-title">Try NUMPA without uploading a file.</h2>
        <p>Explore a bundled synthetic customer dataset and see how inspection, data quality checks and cleaning previews work.</p>
      </div>
      <div className="demo-window">
        <div className="demo-window-bar">
          <div className="demo-window-brand"><span className="landing-brand-mark">N</span><strong>NUMPA demo</strong></div>
          <span className="demo-sample-label"><span aria-hidden="true">●</span> Synthetic sample · 100 rows</span>
        </div>
        {loading ? <div className="demo-state" role="status">Loading the sample dataset…</div> : error ? (
          <div className="demo-state demo-state-error" role="alert">{error} The rest of NUMPA remains available.</div>
        ) : (
          <>
            <div className="demo-tabs" role="tablist" aria-label="Sample dataset demonstration">
              {tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "is-active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}
            </div>
            <div className="demo-content">
              {activeTab === "Overview" && (
                <>
                  <div className="demo-metrics">
                    <div><span>Rows</span><strong>{fmt(rows.length)}</strong></div>
                    <div><span>Columns</span><strong>{columns.length}</strong></div>
                    <div><span>Missing cells</span><strong>{fmt(missingCount(rows))}</strong></div>
                    <div><span>Duplicate rows</span><strong>{fmt(duplicatesCount(rows))}</strong></div>
                  </div>
                  <div className="demo-subheading"><h3>Dataset preview</h3><span>First 6 records</span></div>
                  <div className="demo-table-wrap"><table className="demo-table"><thead><tr>{columns.slice(0, 6).map((column) => <th key={column}>{column.replaceAll("_", " ")}</th>)}</tr></thead><tbody>{rows.slice(0, 6).map((row, index) => <tr key={index}>{columns.slice(0, 6).map((column) => <td key={column}>{row[column] === "" ? <span className="demo-missing">Missing</span> : String(row[column])}</td>)}</tr>)}</tbody></table></div>
                </>
              )}
              {activeTab === "Quality" && (
                <div className="demo-two-col">
                  <div><h3>Missing values by column</h3><p className="demo-muted">The sample includes intentional gaps to demonstrate quality checks.</p>
                    {missingByColumn.map((item) => <div className="demo-bar-row" key={item.column}><span>{item.column.replaceAll("_", " ")}</span><div><i style={{ width: (item.count / rows.length * 100) + "%" }} /></div><b>{item.count}</b></div>)}
                  </div>
                  <div className="demo-quality-card"><span className="demo-kicker">DATA QUALITY SNAPSHOT</span><strong>{fmt(missingCount(rows))}</strong><p>missing cells across {columns.length} columns</p><strong>{duplicatesCount(rows)}</strong><p>duplicate records detected</p><strong>2</strong><p>intentional numeric outlier values in the sample</p></div>
                </div>
              )}
              {activeTab === "Visualize" && (
                <div className="demo-two-col">
                  <div className="demo-chart-card"><h3>Age distribution</h3><div className="demo-histogram" role="img" aria-label="Histogram of sample customer ages">{Array.from({ length: 8 }, (_, index) => { const low = index * 12 + 18; const high = low + 12; const count = ageValues.filter((value) => value >= low && value < high).length; return <div key={index}><i style={{ height: (count / Math.max(...Array.from({ length: 8 }, (_, j) => ageValues.filter((value) => value >= j * 12 + 18 && value < j * 12 + 30).length), 1) * 100) + "%" }} /><span>{low}–{high}</span></div>; })}</div></div>
                  <div className="demo-chart-card"><h3>Income vs. total spent</h3><svg viewBox="0 0 360 220" role="img" aria-label="Scatter plot comparing customer income and total spent"><line x1="35" y1="12" x2="35" y2="185" /><line x1="35" y1="185" x2="345" y2="185" />{rows.filter((row) => typeof row.income === "number" && typeof row.total_spent === "number").map((row, index) => <circle key={index} cx={35 + (Number(row.income) / maxIncome) * 300} cy={180 - (Number(row.total_spent) / maxSpend) * 160} r="3.5" />)}</svg><p className="demo-muted">Each point represents one synthetic customer record.</p></div>
                </div>
              )}
              {activeTab === "Cleaning preview" && (
                <div className="demo-cleaning">
                  <div><h3>Choose sample cleaning operations</h3><p className="demo-muted">These transformations affect only this demo copy.</p>
                    <label><input type="checkbox" checked={removeDuplicates} onChange={(event) => setRemoveDuplicates(event.target.checked)} /> Remove exact duplicate rows <small>3 repeated records in this sample</small></label>
                    <label><input type="checkbox" checked={fillMissing} onChange={(event) => setFillMissing(event.target.checked)} /> Fill numeric missing values <small>Median imputation, calculated from sample values</small></label>
                    <label><input type="checkbox" checked={trimOutliers} onChange={(event) => setTrimOutliers(event.target.checked)} /> Trim extreme sample values <small>Demo bounds: age above 85, income above 200,000 or spend above 80,000</small></label>
                  </div>
                  <div className="demo-preview-result"><span>PREVIEW RESULT</span><strong>{cleaned.length} rows</strong><p>{rows.length - cleaned.length} rows removed</p><strong>{missingCount(cleaned)} missing cells</strong><p>Remaining missing cells in the sample copy</p><strong>{duplicatesCount(cleaned)} duplicates</strong><p>Remaining exact duplicate rows</p></div>
                </div>
              )}
              {activeTab === "ML readiness" && (
                <div className="demo-readiness">
                  <div><span className="demo-kicker">DEMO DATA-QUALITY INDICATOR</span><strong>{beforeScore}<small>/100</small></strong><p>Calculated from sample missing-cell and duplicate rates. This is not NUMPA's production ML Readiness score.</p></div>
                  <div><h3>What affects this indicator?</h3><ul><li>{missingCount(rows)} missing cells are present in the source sample.</li><li>{duplicatesCount(rows)} exact duplicate records are present.</li><li>Target choice, leakage, task-specific checks and validation strategy are not evaluated in this landing-page demo.</li></ul></div>
                </div>
              )}
              {activeTab === "Compare" && (
                <div className="demo-compare">
                  <div><span>Before sample cleaning</span><strong>{beforeScore}/100</strong><small>{rows.length} rows · {missingCount(rows)} missing · {duplicatesCount(rows)} duplicates</small></div>
                  <div className="demo-compare-arrow" aria-hidden="true">→</div>
                  <div><span>After selected demo operations</span><strong>{afterScore}/100</strong><small>{cleaned.length} rows · {missingCount(cleaned)} missing · {duplicatesCount(cleaned)} duplicates</small></div>
                  <p>Illustrative data-quality indicator only. It is not a production ML Readiness assessment or a guarantee of model performance.</p>
                </div>
              )}
            </div>
            <div className="demo-disclaimer">Synthetic dataset · Bundled with NUMPA · Updated 03 Nov 2026 · Demonstration only · No visitor upload required</div>
          </>
        )}
      </div>
    </section>
  );
}
