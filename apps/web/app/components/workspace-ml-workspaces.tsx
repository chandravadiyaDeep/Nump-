"use client";
import { LAB_ALGORITHMS, LAB_METRICS, getMlColumns, targetOptions, validateComparisonSelection, validateReadinessSelection } from "./workspace-ml-model.mjs";
type CleaningOutput = { blob: Blob; filename: string } | null;
type Result = Record<string, unknown>;
type Props = {
  file: File | null; overview: Result | null; cleaning: Result | null; cleanedCsv: CleaningOutput;
  version: "source" | "cleaned"; onVersionChange: (version: "source" | "cleaned") => void;
  task: string; target: string; onTaskChange: (task: string) => void; onTargetChange: (target: string) => void;
  readiness: Result | null; comparison: Result | null; busy: string; error: string; notice: string;
  onReadiness: () => void; onStartComparison: () => void; onCancelComparison: () => void; onConfirmComparison: () => void;
  confirmingComparison: boolean;
};
const object = (value: unknown): Result => value && typeof value === "object" && !Array.isArray(value) ? value as Result : {};
const finiteText = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value.toLocaleString() : "Not returned";
const TASK_LABELS: Record<string, string> = { classification: "Classification", regression: "Regression", forecasting: "Time-series forecasting", clustering: "Clustering" };

function Context({ props, dimensions }: { props: Props; dimensions: { rows: unknown; columns: unknown } }) {
  const fileName = props.version === "cleaned" && props.cleanedCsv ? props.cleanedCsv.filename : props.file?.name ?? "No dataset selected";
  return <section className={"panel ml-dataset-context" + (props.cleanedCsv ? " has-cleaned-version" : "")}><div><p className="eyebrow">ACTIVE DATASET</p><h2>{fileName}</h2><p>{props.version === "cleaned" && props.cleanedCsv ? "Cleaned CSV · separate output; source remains unchanged" : "Source upload · retained in this browser session"}</p></div><div className="ml-context-dimensions"><span>Rows <strong>{finiteText(dimensions.rows)}</strong></span><span>Columns <strong>{finiteText(dimensions.columns)}</strong></span></div>{props.cleanedCsv && <label className="field ml-version-select">Dataset version<select value={props.version} onChange={(event) => props.onVersionChange(event.target.value as "source" | "cleaned")}><option value="source">{props.file?.name ?? "Source dataset"} · source</option><option value="cleaned">{props.cleanedCsv.filename} · cleaned CSV</option></select></label>}</section>;
}

function TaskTarget({ props, comparisonOnly = false }: { props: Props; comparisonOnly?: boolean }) {
  const columns = getMlColumns(props.overview);
  const choices = targetOptions(columns, props.task);
  return <div className="ml-form-grid">
    <label className="field">Intended ML task<select value={props.task} onChange={(event) => props.onTaskChange(event.target.value)}>{!props.task && <option value="">Choose a task</option>}{comparisonOnly && !["classification", "regression"].includes(props.task) && <option disabled value={props.task}>{TASK_LABELS[props.task] ?? props.task} · unavailable in ML Lab</option>}{(comparisonOnly ? ["classification", "regression"] : ["classification", "regression", "forecasting", "clustering"]).map((task) => <option key={task} value={task}>{TASK_LABELS[task]}</option>)}</select></label>
    {props.task && props.task !== "clustering" && <label className="field">Target column<select value={props.target} onChange={(event) => props.onTargetChange(event.target.value)}><option value="">Choose an inspected column</option>{choices.map((column) => <option key={String(column.name)} value={String(column.name)}>{String(column.name)} · {String(column.dtype ?? "type unavailable")}</option>)}</select></label>}
    {props.task === "clustering" && !comparisonOnly && <p className="hint">The current readiness endpoint accepts clustering without a target. This is a dataset heuristic; the API does not train or evaluate a clustering model.</p>}
  </div>;
}

export function MlReadinessWorkspace(props: Props) {
  const columns = getMlColumns(props.overview);
  const message = validateReadinessSelection({ hasDataset: !!props.file && !!props.overview, task: props.task, target: props.target, columns });
  const apiOverview = object(props.overview?.overview);
  const reportAfter = object(object(props.cleaning?.report).after);
  const dimensions = props.version === "cleaned" && props.cleanedCsv
    ? { rows: reportAfter.rows, columns: apiOverview.column_count }
    : { rows: apiOverview.row_count, columns: apiOverview.column_count };
  const readiness = object(props.readiness);
  const dimensionRows = Array.isArray(readiness.dimensions) ? readiness.dimensions.map(object) : [];
  const issues = Array.isArray(readiness.issues) ? readiness.issues.filter((issue): issue is string => typeof issue === "string") : [];
  const score = readiness.score;
  return <div className="shell ml-workspace">
    <section className="hero"><div className="eyebrow">NUMPA · ML READINESS</div><h1>Check your data <span>readiness.</span></h1><p>Run the existing task-aware dataset heuristic. It diagnoses preparation needs; it does not predict model performance.</p></section>
    {props.error && <div className="alert" role="alert">{props.error}</div>}{props.notice && <div className="alert success" role="status">{props.notice}</div>}
    <Context props={props} dimensions={dimensions} />
    <section className="panel"><div className="panel-head"><div className="panel-icon" aria-hidden="true">◉</div><div><h2>Assessment setup</h2><p>Choose the task and target explicitly before requesting a score.</p></div></div><div className="panel-body">
      <TaskTarget props={props} />
      <p className="hint">The API currently accepts classification, regression, forecasting and clustering for readiness scoring. Forecasting here is only a readiness heuristic; there is no chronological model evaluation.</p>
      <button className="primary" type="button" onClick={props.onReadiness} disabled={!!props.busy || !props.file || !props.overview || !!message}>{props.busy === "readiness" ? <span className="loading-line"><span className="spinner" /> Calculating…</span> : "Calculate readiness score →"}</button>
      {message && <p className="ml-validation" role="status">{message}</p>}
    </div></section>
    {props.readiness && <section className="panel"><div className="panel-head"><div className="panel-icon" aria-hidden="true">✓</div><div><h2>API readiness result</h2><p>Task: {TASK_LABELS[String(readiness.task)] ?? "Task not returned"} · target: {readiness.target == null ? "none" : String(readiness.target)} · dataset: {props.version === "cleaned" ? "cleaned CSV" : "source"}</p></div></div><div className="panel-body">
      <div className="score-wrap"><div className="score-ring" aria-label={typeof score === "number" ? `Readiness score ${score} out of 100` : "Readiness score unavailable"}>{typeof score === "number" ? score : "—"}</div><div className="score-copy"><strong>{String(readiness.status ?? "Assessment returned")}</strong><p>Actual score returned by the configured NUMPA API, out of 100.</p></div></div>
      {dimensionRows.length > 0 && <><div className="result-title"><h3>Score dimensions</h3><span className="mini-label">API response</span></div><div className="ml-dimension-list">{dimensionRows.map((dimension, index) => <article className="ml-dimension" key={`${String(dimension.name)}-${index}`}><div><strong>{String(dimension.name)}</strong><span>{typeof dimension.score === "number" ? `${dimension.score}/100` : "Score not returned"}{typeof dimension.weight === "number" ? ` · weight ${(dimension.weight * 100).toLocaleString()}%` : ""}</span></div><p>{String(dimension.explanation ?? "Explanation not returned by the API.")}</p></article>)}</div></>}
      {issues.length > 0 && <div className="ml-issues"><h3>API-reported observations</h3><ul>{issues.map((issue, index) => <li key={`${issue}-${index}`}>{issue}</li>)}</ul></div>}
      {props.comparison && <div className="ml-cleaning-comparison"><h3>Cleaning readiness comparison</h3><p>Existing cleaning workflow assessment, from source to cleaned CSV.</p><div className="metric-grid"><div className="metric"><span>Source</span><strong>{finiteText(object(props.comparison.before).score)}<small>/100</small></strong></div><div className="metric"><span>Cleaned CSV</span><strong>{finiteText(object(props.comparison.after).score)}<small>/100</small></strong></div></div></div>}
      {typeof readiness.caveat === "string" && <p className="hint">{readiness.caveat}</p>}
      <p className="hint">No scoring version is returned by this API. Results are not a guarantee of model accuracy, business value or deployment success.</p>
    </div></section>}
    {props.comparison && <section className="panel ml-cleaning-comparison"><div className="panel-head"><div className="panel-icon" aria-hidden="true">↔</div><div><h2>Cleaning readiness comparison</h2><p>Actual scores returned by the existing API for source and cleaned CSV.</p></div></div><div className="panel-body"><div className="metric-grid"><div className="metric"><span>Source</span><strong>{finiteText(object(props.comparison.before).score)}<small>/100</small></strong></div><div className="metric"><span>Cleaned CSV</span><strong>{finiteText(object(props.comparison.after).score)}<small>/100</small></strong></div><div className="metric"><span>Score change</span><strong>{typeof object(props.comparison.before).score === "number" && typeof object(props.comparison.after).score === "number" ? `${Number(object(props.comparison.after).score) - Number(object(props.comparison.before).score) > 0 ? "+" : ""}${Number(object(props.comparison.after).score) - Number(object(props.comparison.before).score)}` : "—"}</strong></div></div></div></section>}
    {!props.overview && <section className="panel"><div className="empty-state"><h2>No inspected dataset</h2><p>Upload and inspect a dataset in Data Analysis to begin. Dataset files do not persist across refresh or browser closure.</p></div></section>}
  </div>;
}

export function MlLabWorkspace(props: Props) {
  const columns = getMlColumns(props.overview);
  const duplicates = props.version === "cleaned" && props.cleanedCsv
    ? object(object(props.cleaning?.report).after).duplicate_rows
    : object(props.overview?.overview).duplicate_row_count;
  const validation = validateComparisonSelection({ hasDataset: !!props.file && !!props.overview, task: props.task, target: props.target, columns, duplicateCount: duplicates });
  const candidates = LAB_ALGORITHMS[props.task as keyof typeof LAB_ALGORITHMS] ?? [];
  const models = Array.isArray(object(props.comparison).models) ? (object(props.comparison).models as Result[]).map(object) : [];
  const metricSpecs = LAB_METRICS[props.task as keyof typeof LAB_METRICS] ?? {};
  const allMetrics = Object.keys(metricSpecs);
  const returnedMetrics = allMetrics.filter((metric) => models.some((model) => object(model.metrics)[metric] !== undefined));
  const validationInfo = object(object(props.comparison).validation);
  return <div className="shell ml-workspace">
    <section className="hero"><div className="eyebrow">NUMPA · ML LAB</div><h1>Compare supported <span>baselines.</span></h1><p>Run the existing bounded classification or regression comparison. This is not unrestricted AutoML.</p></section>
    {props.error && <div className="alert" role="alert">{props.error}</div>}{props.notice && <div className="alert success" role="status">{props.notice}</div>}
    <Context props={props} dimensions={{ rows: props.version === "cleaned" && props.cleanedCsv ? object(object(props.cleaning?.report).after).rows : object(props.overview?.overview).row_count, columns: object(props.overview?.overview).column_count }} />
    <section className="panel"><div className="panel-head"><div className="panel-icon" aria-hidden="true">⚗</div><div><h2>Comparison setup</h2><p>Only supported task and baseline combinations are listed.</p></div></div><div className="panel-body">
      <TaskTarget props={props} comparisonOnly />
      <div className="ml-candidate-list"><strong>Algorithms included in this comparison</strong><ul>{candidates.map((name) => <li key={name}>{name}</li>)}</ul></div>
      <div className="ml-validation-info"><strong>Validation: 80/20 holdout · random_state 42</strong><p>Classification is stratified when class counts permit; otherwise the backend uses a random split. Regression uses a random split. Preprocessing is fitted inside each training pipeline and then applied to its holdout. The selected target column is excluded from predictors.</p><p>Chronological and group-aware validation are not implemented. Do not use this comparison for time-ordered or grouped observations; review predictors for target-derived information. The result is an exploratory baseline estimate, not a trustworthy estimate for those data shapes.</p></div>
      {Number.isInteger(duplicates) && Number(duplicates) > 0 && <p className="ml-validation" role="alert">This dataset has {String(duplicates)} exact duplicate rows. A random split could put copies in both train and holdout, so comparison is blocked. If appropriate, review duplicate removal in Cleaning and select its cleaned CSV.</p>}
      <button className="primary" type="button" onClick={props.onStartComparison} disabled={!!props.busy || !props.file || !props.overview || !!validation}>{props.busy === "comparison" ? <span className="loading-line"><span className="spinner" /> Comparing…</span> : "Review comparison and run →"}</button>
      {validation && <p className="ml-validation" role="status">{validation}</p>}
      {props.confirmingComparison && <div className="confirmation-panel" role="group" aria-labelledby="ml-confirm-title"><h3 id="ml-confirm-title">Run this baseline comparison?</h3><p>The selected in-memory {props.version === "cleaned" ? "cleaned CSV" : "source dataset"} will be sent to the existing API for synchronous processing. No model or dataset is saved. This may take time for larger datasets.</p><div className="button-row"><button className="primary" type="button" onClick={props.onConfirmComparison} disabled={!!props.busy}>Confirm and compare</button><button className="secondary" type="button" onClick={props.onCancelComparison} disabled={!!props.busy}>Cancel</button></div></div>}
    </div></section>
    {props.comparison && <section className="panel"><div className="panel-head"><div className="panel-icon" aria-hidden="true">▦</div><div><h2>Comparison results</h2><p>{String(object(props.comparison).task)} · target {String(object(props.comparison).target)} · {props.version === "cleaned" ? "cleaned CSV" : "source dataset"}</p></div></div><div className="panel-body">
      <div className="ml-validation-info"><strong>{String(validationInfo.method ?? "Validation method not returned")}{typeof validationInfo.random_state === "number" ? ` · random_state ${validationInfo.random_state}` : ""}</strong><p>{String(validationInfo.note ?? "Validation details not returned by the API.")}</p><p>{String(object(props.comparison).warning ?? "The API returned no comparison caveat.")}</p></div>
      {models.length > 0 ? <div className="table-wrap"><table className="ml-results-table"><caption>API-returned baseline results; unavailable cells mean the API returned null or the model failed.</caption><thead><tr><th scope="col">Algorithm</th>{returnedMetrics.map((metric) => <th scope="col" key={metric}>{(metricSpecs as Record<string, { label: string }>)[metric]?.label ?? metric}</th>)}</tr></thead><tbody>{models.map((model, index) => <tr key={`${String(model.algorithm)}-${index}`}><th scope="row">{String(model.algorithm)}{model.status === "failed" && <p className="ml-validation">Failed: {String(model.error ?? "The API did not return a reason.")}</p>}</th>{returnedMetrics.map((metric) => { const value = object(model.metrics)[metric]; return <td key={metric}>{model.status !== "ok" || value == null ? "Unavailable" : typeof value === "number" && Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 5 }) : "Unavailable"}</td>; })}</tr>)}</tbody></table></div> : <p className="hint">The API returned no supported model results.</p>}
      <div className="ml-metric-guide"><h3>Metric guide</h3>{returnedMetrics.map((metric) => { const spec = (metricSpecs as Record<string, { label: string; direction: string; units: string; explanation: string }>)[metric]; return <article key={metric}><strong>{spec.label} · {spec.direction} · {spec.units}</strong><p>{spec.explanation}</p></article>; })}</div>
      <p className="hint">These values come directly from the API. Results depend on dataset content and the fixed holdout split/seed. No model artifacts are saved or deployed.</p>
    </div></section>}
    {!props.overview && <section className="panel"><div className="empty-state"><h2>No inspected dataset</h2><p>Upload and inspect a dataset in Data Analysis to begin. Dataset files do not persist across refresh or browser closure.</p></div></section>}
  </div>;
}