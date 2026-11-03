"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

type Task = "classification" | "regression" | "forecasting" | "clustering";
type FeatureOperation =
  | { type: "date_parts"; column: string; parts: string[] }
  | { type: "numeric_interaction"; left_column: string; right_column: string; operator: "add" | "subtract" | "multiply"; new_column: string }
  | { type: "missing_indicator"; column: string; new_column: string };

const API_BASE = (process.env.NEXT_PUBLIC_NUMPA_API_URL || "").trim().replace(/\/$/, "");

export function DataFeatureEngineeringStudio({ file, columns, task, target }: {
  file: File | null; columns: string[]; task: string; target: string;
}) {
  const [kind, setKind] = useState<FeatureOperation["type"]>("date_parts");
  const [column, setColumn] = useState("");
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [operator, setOperator] = useState<"add" | "subtract" | "multiply">("multiply");
  const [newColumn, setNewColumn] = useState("");
  const [parts, setParts] = useState<string[]>(["year", "month"]);
  const [operations, setOperations] = useState<FeatureOperation[]>([]);
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function addOperation() {
    let operation: FeatureOperation;
    if (kind === "date_parts") {
      if (!column || !parts.length) { setError("Choose a date column and at least one date part."); return; }
      operation = { type: kind, column, parts };
    } else if (kind === "missing_indicator") {
      if (!column) { setError("Choose a source column."); return; }
      operation = { type: kind, column, new_column: newColumn.trim() || `${column}_is_missing` };
    } else {
      if (!left || !right || !newColumn.trim()) { setError("Choose two numeric columns and a new feature name."); return; }
      operation = { type: kind, left_column: left, right_column: right, operator, new_column: newColumn.trim() };
    }
    setOperations((current) => [...current, operation]);
    setPreview(null); setError(""); setNotice("");
    setNewColumn("");
  }

  async function request(action: "preview" | "execute") {
    const selectedTask = task as Task;
    if (!file || !["classification", "regression", "forecasting", "clustering"].includes(task)) {
      setError("Select an ML task in ML Readiness before creating features.");
      return;
    }
    if (selectedTask !== "clustering" && !target) { setError("Select a target column in ML Readiness first."); return; }
    if (!operations.length || !API_BASE) { setError(!API_BASE ? "NUMPA API is not configured." : "Add at least one feature operation."); return; }
    setBusy(action); setError(""); setNotice("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("operations_json", JSON.stringify(operations));
      form.append("task", selectedTask);
      if (selectedTask !== "clustering") form.append("target", target);
      const response = await fetch(`${API_BASE}/api/v1/features/${action}`, { method: "POST", body: form });
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => ({}));
        const detail = body && typeof body === "object" && "detail" in body && typeof body.detail === "string" ? body.detail : `Feature request failed (${response.status}).`;
        throw new Error(detail);
      }
      if (action === "preview") {
        setPreview(await response.json() as Record<string, unknown>);
        setNotice("Feature preview is ready. Review target protection and the audit before export.");
      } else {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url; link.download = `${file.name.replace(/\.[^.]+$/, "") || "dataset"}-features.csv`;
        document.body.appendChild(link); link.click(); link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setNotice("Separate feature-engineered CSV download started. Source file remains unchanged.");
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Feature engineering failed."); }
    finally { setBusy(""); }
  }

  return <section className="panel" aria-labelledby="feature-engineering-title">
    <div className="panel-head"><div className="panel-icon" aria-hidden="true">✳</div><div><h2 id="feature-engineering-title">Feature engineering</h2><p>Create deterministic features with exact target-column protection.</p></div></div>
    {!file ? <div className="empty-state"><h3>Inspect a dataset first</h3><p>Feature engineering uses the active source file.</p></div> : <div className="panel-body">
      {error && <div className="alert" role="alert">{error}</div>}
      {notice && <div className="alert success" role="status">{notice}</div>}
      <p className="hint">Current ML task: {task || "not selected"} · Target: {task === "clustering" ? "not used" : target || "not selected"}. Select these in ML Readiness.</p>
      <label htmlFor="feature-kind">Feature operation</label>
      <select id="feature-kind" value={kind} onChange={(event) => setKind(event.target.value as FeatureOperation["type"])}>
        <option value="date_parts">Extract date parts</option><option value="numeric_interaction">Numeric interaction</option><option value="missing_indicator">Missing-value indicator</option>
      </select>
      {kind !== "numeric_interaction" ? <>
        <label htmlFor="feature-source">Source column</label>
        <select id="feature-source" value={column} onChange={(event) => setColumn(event.target.value)}><option value="">Select column</option>{columns.map((name) => <option key={name} value={name}>{name}</option>)}</select>
      </> : <>
        <label htmlFor="feature-left">First numeric column</label>
        <select id="feature-left" value={left} onChange={(event) => setLeft(event.target.value)}><option value="">Select column</option>{columns.map((name) => <option key={name} value={name}>{name}</option>)}</select>
        <label htmlFor="feature-right">Second numeric column</label>
        <select id="feature-right" value={right} onChange={(event) => setRight(event.target.value)}><option value="">Select column</option>{columns.map((name) => <option key={name} value={name}>{name}</option>)}</select>
        <label htmlFor="feature-operator">Interaction</label>
        <select id="feature-operator" value={operator} onChange={(event) => setOperator(event.target.value as "add" | "subtract" | "multiply")}><option value="multiply">Multiply</option><option value="add">Add</option><option value="subtract">Subtract</option></select>
        <label htmlFor="feature-new-name">New feature name</label><input id="feature-new-name" value={newColumn} onChange={(event) => setNewColumn(event.target.value)} />
      </>}
      {kind === "date_parts" && <fieldset><legend>Date parts to extract</legend>{["year", "month", "day", "dayofweek"].map((part) => <label key={part} className="check-row"><input type="checkbox" checked={parts.includes(part)} onChange={(event) => setParts((current) => event.target.checked ? [...current, part] : current.filter((item) => item !== part))} /><span>{part}</span></label>)}</fieldset>}
      {kind === "missing_indicator" && <><label htmlFor="missing-feature-name">New feature name (optional)</label><input id="missing-feature-name" value={newColumn} onChange={(event) => setNewColumn(event.target.value)} placeholder={column ? `${column}_is_missing` : "column_is_missing"} /></>}
      <button className="secondary" type="button" onClick={addOperation} disabled={!!busy || operations.length >= 20}>Add feature operation</button>
      {operations.length > 0 && <div className="detail-list"><h3>Feature plan · {operations.length}/20</h3>{operations.map((item, index) => <div className="detail-row" key={index}><span>{index + 1}. {item.type.replaceAll("_", " ")} · {"column" in item ? item.column : `${item.left_column} ${item.operator} ${item.right_column}`}</span><button className="secondary" type="button" onClick={() => { setOperations((current) => current.filter((_, i) => i !== index)); setPreview(null); }} disabled={!!busy}>Remove</button></div>)}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}><button className="primary" type="button" onClick={() => request("preview")} disabled={!operations.length || !!busy}>Preview features</button><button className="primary" type="button" onClick={() => request("execute")} disabled={!preview || !!busy}>Approve & export CSV</button></div>
      {preview && <div className="results"><h3>Feature preview audit</h3><pre style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}>{JSON.stringify(preview.report, null, 2)}</pre><div className="table-wrap"><table className="profile-table"><thead><tr>{(Array.isArray(preview.columns) ? preview.columns : []).map((item) => <th key={String(item)}>{String(item)}</th>)}</tr></thead><tbody>{(Array.isArray(preview.preview) ? preview.preview : []).map((row, index) => <tr key={index}>{(Array.isArray(preview.columns) ? preview.columns : []).map((name) => <td key={String(name)}>{String(row && typeof row === "object" ? (row as Record<string, unknown>)[String(name)] ?? "" : "")}</td>)}</tr>)}</tbody></table></div><p className="hint">These are stateless row-wise features. Learned preprocessing must be fitted only on training data after splitting.</p></div>}
    </div>}
  </section>;
}
