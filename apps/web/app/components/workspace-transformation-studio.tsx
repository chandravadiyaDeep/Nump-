"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";

type ApiObject = Record<string, unknown>;
type OperationType = "rename_column" | "drop_column" | "cast_numeric" | "cast_datetime" | "filter_rows";
type Operation = { type: OperationType; column: string; new_name?: string; operator?: string; value?: string };
type SavedPipeline = { name: string; version: 1; operations: Operation[] };
const operationTypes: OperationType[] = ["rename_column", "drop_column", "cast_numeric", "cast_datetime", "filter_rows"];

const API_BASE = (process.env.NEXT_PUBLIC_NUMPA_API_URL || "").trim().replace(/\/$/, "");
const operators = ["eq", "ne", "gt", "gte", "lt", "lte", "contains", "is_null", "not_null"];

// Keep API errors readable without exposing implementation details to the user.
async function apiError(response: Response): Promise<string> {
  const body: unknown = await response.json().catch(() => ({}));
  if (body && typeof body === "object" && "detail" in body && typeof body.detail === "string") return body.detail;
  return `Transformation request failed (${response.status}).`;
}

export function DataTransformationStudio({ file, overview }: { file: File | null; overview: ApiObject | null }) {
  const columns = useMemo(() => {
    const raw = overview?.columns;
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "name" in item && typeof item.name === "string") return item.name;
      return "";
    }).filter(Boolean);
  }, [overview]);

  const [type, setType] = useState<OperationType>("rename_column");
  const [column, setColumn] = useState("");
  const [value, setValue] = useState("");
  const [operator, setOperator] = useState("eq");
  const [operations, setOperations] = useState<Operation[]>([]);
  const [pipelineName, setPipelineName] = useState("My transformation pipeline");
  const [savedPipelines, setSavedPipelines] = useState<SavedPipeline[]>([]);
  const [preview, setPreview] = useState<ApiObject | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Build only allow-listed operation objects; arbitrary expressions are never sent.
  function addOperation() {
    if (!column || operations.length >= 25) return;
    const operation: Operation = { type, column };
    if (type === "rename_column") operation.new_name = value.trim();
    if (type === "filter_rows") {
      operation.operator = operator;
      if (!["is_null", "not_null"].includes(operator)) operation.value = value;
    }
    if (type === "rename_column" && !operation.new_name) { setError("Enter a new column name."); return; }
    if (type === "filter_rows" && !["is_null", "not_null"].includes(operator) && !value.trim()) { setError("Enter a filter value."); return; }
    setOperations((current) => [...current, operation]);
    setPreview(null); setError(""); setMessage("");
    if (type === "rename_column" || type === "filter_rows") setValue("");
  }

  // Pipelines contain operation definitions only; source rows and files are never saved.
  function savePipeline() {
    const name = pipelineName.trim();
    if (!name || !operations.length) { setError("Give the pipeline a name and add at least one operation."); return; }
    const pipeline: SavedPipeline = { name, version: 1, operations: operations.map((item) => ({ ...item })) };
    setSavedPipelines((current) => [...current.filter((item) => item.name !== name), pipeline]);
    setMessage(`“${name}” saved for this browser session. Export JSON to reuse it later.`);
    setError("");
  }

  function loadPipeline(name: string) {
    const pipeline = savedPipelines.find((item) => item.name === name);
    if (!pipeline) return;
    setPipelineName(pipeline.name);
    setOperations(pipeline.operations.map((item) => ({ ...item })));
    setPreview(null); setError(""); setMessage(`Loaded “${pipeline.name}”. Preview it against the currently selected source before execution.`);
  }

  function exportPipeline() {
    if (!operations.length) { setError("Add operations before exporting a pipeline."); return; }
    const payload: SavedPipeline = { name: pipelineName.trim() || "NUMPA pipeline", version: 1, operations };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "numpa-transformation-pipeline.json";
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Pipeline definition exported. It contains operation settings only, not dataset data.");
  }

  async function importPipeline(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;
    try {
      if (selected.size > 65536) throw new Error("Pipeline file exceeds the 64 KB limit.");
      const parsed: unknown = JSON.parse(await selected.text());
      if (!parsed || typeof parsed !== "object") throw new Error("Pipeline file must contain a JSON object.");
      const candidate = parsed as Record<string, unknown>;
      if (candidate.version !== 1 || !Array.isArray(candidate.operations) || candidate.operations.length < 1 || candidate.operations.length > 25) {
        throw new Error("Unsupported pipeline version or operation count. Expected version 1 and 1–25 operations.");
      }
      const imported = candidate.operations.map((item): Operation => {
        if (!item || typeof item !== "object") throw new Error("Invalid operation entry.");
        const op = item as Record<string, unknown>;
        if (!operationTypes.includes(op.type as OperationType) || typeof op.column !== "string" || !op.column.trim()) throw new Error("Pipeline contains an unsupported operation or column.");
        if (op.type === "rename_column" && (typeof op.new_name !== "string" || !op.new_name.trim())) throw new Error("Rename operation is missing its new column name.");
        if (op.type === "filter_rows" && (typeof op.operator !== "string" || !operators.includes(op.operator))) throw new Error("Filter operation contains an unsupported condition.");
        if (op.value !== undefined && typeof op.value !== "string") throw new Error("Operation values must be strings.");
        return { type: op.type as OperationType, column: op.column, ...(typeof op.new_name === "string" ? { new_name: op.new_name } : {}), ...(typeof op.operator === "string" ? { operator: op.operator } : {}), ...(typeof op.value === "string" ? { value: op.value } : {}) };
      });
      const name = typeof candidate.name === "string" && candidate.name.trim() ? candidate.name.trim() : selected.name.replace(/\\.json$/i, "");
      setPipelineName(name); setOperations(imported); setPreview(null); setError("");
      setMessage(`Imported “${name}”. Review its columns and preview against the active dataset before execution.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to import this pipeline file.");
    }
  }

  async function request(kind: "preview" | "execute") {
    if (!file || !operations.length || !API_BASE) {
      setError(!API_BASE ? "NUMPA API is not configured." : "Choose an inspected dataset and add at least one operation.");
      return;
    }
    setBusy(kind); setError(""); setMessage("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("operations_json", JSON.stringify(operations));
      const response = await fetch(`${API_BASE}/api/v1/transformations/${kind}`, { method: "POST", body: form });
      if (!response.ok) throw new Error(await apiError(response));
      if (kind === "preview") {
        setPreview(await response.json() as ApiObject);
        setMessage("Preview generated from the unchanged source file. Review it before execution.");
      } else {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${file.name.replace(/\.[^.]+$/, "") || "dataset"}-transformed.csv`;
        document.body.appendChild(link); link.click(); link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setMessage("A separate transformed CSV download has started. The source file was not overwritten.");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Transformation could not be completed.");
    } finally { setBusy(""); }
  }

  return (
    <section className="panel" aria-labelledby="transformation-title">
      <div className="panel-head"><div className="panel-icon" aria-hidden="true">⇄</div><div><h2 id="transformation-title">Transformation studio</h2><p>Build a deterministic sequence of safe, previewable operations on your original dataset.</p></div></div>
      {!file || !overview ? <div className="empty-state"><h3>Inspect a dataset first</h3><p>Transformation controls become available after a source file has been inspected.</p></div> : <div className="panel-body">
        {error && <div className="alert" role="alert">{error}</div>}
        {message && <div className="alert success" role="status">{message}</div>}
        <div className="profile-controls">
          <label htmlFor="transform-operation">Operation</label>
          <select id="transform-operation" value={type} onChange={(event) => { setType(event.target.value as OperationType); setValue(""); }}>
            <option value="rename_column">Rename column</option><option value="drop_column">Drop column</option><option value="cast_numeric">Convert to number</option><option value="cast_datetime">Convert to date/time</option><option value="filter_rows">Filter rows</option>
          </select>
          <label htmlFor="transform-column">Column</label>
          <select id="transform-column" value={column} onChange={(event) => setColumn(event.target.value)}><option value="">Select column</option>{columns.map((name) => <option key={name} value={name}>{name}</option>)}</select>
          {type === "filter_rows" && <><label htmlFor="transform-operator">Condition</label><select id="transform-operator" value={operator} onChange={(event) => setOperator(event.target.value)}>{operators.map((item) => <option key={item} value={item}>{item}</option>)}</select></>}
          {(type === "rename_column" || (type === "filter_rows" && !["is_null", "not_null"].includes(operator))) && <><label htmlFor="transform-value">{type === "rename_column" ? "New column name" : "Compare value"}</label><input id="transform-value" value={value} onChange={(event) => setValue(event.target.value)} /></>}
        </div>
        <div className="detail-list" style={{ marginBottom: 16 }}>
          <h3>Reusable pipeline</h3>
          <label htmlFor="pipeline-name">Pipeline name</label>
          <input id="pipeline-name" value={pipelineName} onChange={(event) => setPipelineName(event.target.value)} maxLength={80} />
          <div className="button-row" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            <button className="secondary" type="button" onClick={savePipeline} disabled={!operations.length || !!busy}>Save in this session</button>
            <button className="secondary" type="button" onClick={exportPipeline} disabled={!operations.length || !!busy}>Export JSON</button>
            <label className="secondary" style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>Import JSON<input type="file" accept=".json,application/json" onChange={importPipeline} hidden disabled={!!busy} /></label>
          </div>
          {savedPipelines.length > 0 && <div className="detail-row" style={{ marginTop: 10 }}><label htmlFor="saved-pipeline">Saved this session</label><select id="saved-pipeline" defaultValue="" onChange={(event) => loadPipeline(event.target.value)}><option value="">Choose a pipeline</option>{savedPipelines.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></div>}
          <p className="hint">Only transformation instructions are saved/exported. Dataset contents are never included. Imported pipelines must be previewed against the active dataset.</p>
        </div>
        <button className="secondary" type="button" onClick={addOperation} disabled={!column || operations.length >= 25 || !!busy}>Add operation</button>
        <p className="hint">Maximum 25 operations. Operations run in order. Invalid casts, missing columns, collisions and empty outputs are rejected.</p>
        {operations.length > 0 && <div className="detail-list"><h3>Pipeline · {operations.length}/25</h3>{operations.map((item, index) => <div className="detail-row" key={index}><span>{index + 1}. {item.type.replaceAll("_", " ")} · {item.column}{item.new_name ? ` → ${item.new_name}` : ""}{item.operator ? ` · ${item.operator} ${item.value ?? ""}` : ""}</span><button className="secondary" type="button" onClick={() => { setOperations((current) => current.filter((_, i) => i !== index)); setPreview(null); }} disabled={!!busy}>Remove</button></div>)}</div>}
        <div className="button-row" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
          <button className="primary" type="button" onClick={() => request("preview")} disabled={!operations.length || !!busy}>{busy === "preview" ? "Preparing preview…" : "Preview transformations"}</button>
          <button className="primary" type="button" onClick={() => request("execute")} disabled={!preview || !!busy}>{busy === "execute" ? "Executing…" : "Approve & export CSV"}</button>
          <button className="secondary" type="button" onClick={() => { setOperations([]); setPreview(null); setError(""); setMessage(""); }} disabled={!operations.length || !!busy}>Clear pipeline</button>
        </div>
        {preview && <div className="results" aria-live="polite">
          <div className="detail-list"><h3>Preview report</h3>
            <div className="detail-row"><span>Before</span><strong>{String((preview.report as ApiObject | undefined)?.before ? JSON.stringify((preview.report as ApiObject).before) : "—")}</strong></div>
            <div className="detail-row"><span>After</span><strong>{String((preview.report as ApiObject | undefined)?.after ? JSON.stringify((preview.report as ApiObject).after) : "—")}</strong></div>
          </div>
          <div className="table-wrap"><table className="profile-table"><thead><tr>{(Array.isArray(preview.columns) ? preview.columns : []).map((name) => <th key={String(name)}>{String(name)}</th>)}</tr></thead><tbody>{(Array.isArray(preview.preview) ? preview.preview : []).map((row, index) => <tr key={index}>{(Array.isArray(preview.columns) ? preview.columns : []).map((name) => <td key={String(name)}>{String(row && typeof row === "object" ? (row as Record<string, unknown>)[String(name)] ?? "" : "")}</td>)}</tr>)}</tbody></table></div>
          <p className="hint">Showing up to 25 rows returned by the API. Export is enabled only after a successful preview.</p>
        </div>}
      </div>}
    </section>
  );
}
