"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import WorkspaceShell from "../components/workspace-shell";
import { DataAnalysisWorkspace, DataPreprocessingWorkspace } from "../components/workspace-data-panels";
import { DataVisualizationWorkspace } from "../components/workspace-data-visualization";
import { MlLabWorkspace, MlReadinessWorkspace } from "../components/workspace-ml-workspaces";
import { getMlColumns, parseComparisonResponse, parseReadinessResponse, validateComparisonSelection, validateReadinessSelection } from "../components/workspace-ml-model.mjs";
import { validateUpload } from "../components/workspace-data-model.mjs";

type ApiObject = Record<string, unknown>;
type ReadinessComparison = { before: ApiObject; after: ApiObject } | null;
type CleaningOutput = { blob: Blob; filename: string } | null;

// Never fall back to localhost in a deployed browser; require the hosted API URL.
const API_BASE = (process.env.NEXT_PUBLIC_NUMPA_API_URL || "").trim().replace(/\/$/, "");

async function readApiResponse(response: Response): Promise<ApiObject> {
  const payload: unknown = await response.json().catch(() => ({}));
  const result = payload && typeof payload === "object" && !Array.isArray(payload)
    ? payload as ApiObject
    : {};
  if (!response.ok) {
    const detail = typeof result.detail === "string"
      ? result.detail
      : `Request failed with status ${response.status}`;
    throw new Error(detail);
  }
  return result;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function HomePage() {
  // Keep workflow state above the section switch so navigation never discards the active source.
  const [file, setFile] = useState<File | null>(null);
  const [task, setTask] = useState("");
  const [target, setTarget] = useState("");
  const [fillMissing, setFillMissing] = useState(true);
  const [dropDuplicates, setDropDuplicates] = useState(false);
  const [normalizeText, setNormalizeText] = useState(true);
  const [overview, setOverview] = useState<ApiObject | null>(null);
  const [readiness, setReadiness] = useState<ApiObject | null>(null);
  const [cleaning, setCleaning] = useState<ApiObject | null>(null);
  const [comparison, setComparison] = useState<ReadinessComparison>(null);
  const [mlComparison, setMlComparison] = useState<ApiObject | null>(null);
  const [mlDatasetVersion, setMlDatasetVersion] = useState<"source" | "cleaned">("source");
  const [confirmingMlComparison, setConfirmingMlComparison] = useState(false);
  const [cleanedCsv, setCleanedCsv] = useState<CleaningOutput>(null);
  const [confirmingExecution, setConfirmingExecution] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");

  function ensureApiConfigured(): boolean {
    if (API_BASE) return true;
    setError("NUMPA API is not connected yet. The configured NUMPA API URL is unavailable.");
    setNotice("");
    return false;
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    event.target.value = "";
    setFile(nextFile);
    setMlDatasetVersion("source"); setMlComparison(null); setConfirmingMlComparison(false);
    setOverview(null);
    setReadiness(null);
    setCleaning(null);
    setComparison(null);
    setCleanedCsv(null);
    setConfirmingExecution(false);
    setNotice("");
    setError("");
    if (!nextFile) return;
    const validationError = validateUpload(nextFile.name, nextFile.size);
    if (validationError) setError(validationError);
  }

  function validateSelectedFile(): boolean {
    if (!file) {
      setError("Choose a dataset file before continuing.");
      return false;
    }
    const validationError = validateUpload(file.name, file.size);
    if (validationError) {
      setError(validationError);
      return false;
    }
    return true;
  }

  async function inspectDataset() {
    if (!validateSelectedFile() || !ensureApiConfigured() || !file) return;
    setBusy("inspect");
    setError("");
    setNotice("");
    try {
      const form = new FormData();
      form.append("file", file);
      const result = await readApiResponse(await fetch(`${API_BASE}/api/v1/datasets/inspect`, { method: "POST", body: form }));
      setOverview(result);
      setReadiness(null); setMlComparison(null); setMlDatasetVersion("source"); setConfirmingMlComparison(false);
      setCleaning(null);
      setComparison(null);
      setCleanedCsv(null);
      setConfirmingExecution(false);
      setNotice("Dataset inspection completed from the API response.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to inspect this dataset. The selected source remains available for retry.");
    } finally {
      setBusy("");
    }
  }

  function getAssessmentFile(): File | null {
    if (mlDatasetVersion === "cleaned") {
      if (!cleanedCsv) return null;
      return new File([cleanedCsv.blob], cleanedCsv.filename, { type: "text/csv" });
    }
    return file;
  }

  function validateReadinessBeforeRequest(): string {
    return validateReadinessSelection({ hasDataset: !!getAssessmentFile() && !!overview, task, target, columns: getMlColumns(overview) });
  }

  async function calculateReadiness() {
    const candidate = getAssessmentFile();
    const issue = validateReadinessBeforeRequest();
    if (issue) { setError(issue); return; }
    if (!candidate || !ensureApiConfigured()) return;
    setBusy("readiness"); setError(""); setNotice(""); setReadiness(null); setMlComparison(null); setConfirmingMlComparison(false);
    try {
      const form = new FormData(); form.append("file", candidate); form.append("task", task);
      if (task !== "clustering") form.append("target", target);
      const result = parseReadinessResponse(await readApiResponse(await fetch(`${API_BASE}/api/v1/ml-readiness/score`, { method: "POST", body: form })), task, task === "clustering" ? "" : target);
      setReadiness(result);
      setNotice(`Readiness assessment completed for the ${mlDatasetVersion === "cleaned" ? "cleaned CSV" : "source dataset"}. This score is a heuristic, not a guarantee of model performance.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to assess readiness. The active dataset remains available for retry."); }
    finally { setBusy(""); }
  }

  function currentDuplicateCount(): unknown {
    if (mlDatasetVersion === "cleaned" && cleanedCsv) {
      return (((cleaning?.report as ApiObject | undefined)?.after as ApiObject | undefined)?.duplicate_rows);
    }
    return (overview?.overview as ApiObject | undefined)?.duplicate_row_count;
  }

  function prepareMlComparison() {
    const issue = validateComparisonSelection({ hasDataset: !!getAssessmentFile() && !!overview, task, target, columns: getMlColumns(overview), duplicateCount: currentDuplicateCount() });
    if (issue) { setError(issue); return; }
    setError(""); setNotice(""); setMlComparison(null); setConfirmingMlComparison(true);
  }

  async function runMlComparison() {
    const candidate = getAssessmentFile();
    const issue = validateComparisonSelection({ hasDataset: !!candidate && !!overview, task, target, columns: getMlColumns(overview), duplicateCount: currentDuplicateCount() });
    if (issue) { setError(issue); setConfirmingMlComparison(false); return; }
    if (!candidate || !ensureApiConfigured()) return;
    setBusy("comparison"); setError(""); setNotice(""); setMlComparison(null); setConfirmingMlComparison(false);
    try {
      const form = new FormData(); form.append("file", candidate); form.append("task", task); form.append("target", target);
      const result = parseComparisonResponse(await readApiResponse(await fetch(`${API_BASE}/api/v1/ml-labs/compare`, { method: "POST", body: form })), task, target);
      setMlComparison(result);
      setNotice(`Baseline comparison completed for the ${mlDatasetVersion === "cleaned" ? "cleaned CSV" : "source dataset"}. Review the holdout limitations with the results.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to compare the supported baselines."); }
    finally { setBusy(""); }
  }

  function changeMlTask(value: string) { setTask(value); setReadiness(null); setMlComparison(null); setComparison(null); setConfirmingMlComparison(false); }
  function changeMlTarget(value: string) { setTarget(value); setReadiness(null); setMlComparison(null); setComparison(null); setConfirmingMlComparison(false); }
  function changeMlDatasetVersion(value: "source" | "cleaned") { setMlDatasetVersion(value); setReadiness(null); setMlComparison(null); setConfirmingMlComparison(false); setError(""); setNotice(""); }
  function changeCleaningOption(operation: "fillMissing" | "dropDuplicates" | "normalizeText", selected: boolean) {
    if (operation === "fillMissing") setFillMissing(selected);
    if (operation === "dropDuplicates") setDropDuplicates(selected);
    if (operation === "normalizeText") setNormalizeText(selected);
    setCleaning(null);
    setCleanedCsv(null); setMlDatasetVersion("source"); setMlComparison(null); setReadiness(null); setConfirmingMlComparison(false);
    setComparison(null);
    setConfirmingExecution(false);
    setError("");
    setNotice("");
  }

  async function previewCleaning() {
    if (!validateSelectedFile() || !overview || !file) {
      if (file && !overview) setError("Inspect this source dataset before requesting a cleaning preview.");
      return;
    }
    if (!ensureApiConfigured()) return;
    setBusy("preview");
    setError("");
    setNotice("");
    setCleaning(null);
    setCleanedCsv(null); setMlDatasetVersion("source"); setMlComparison(null); setReadiness(null); setConfirmingMlComparison(false);
    setConfirmingExecution(false);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("fill_missing", String(fillMissing));
      form.append("drop_exact_duplicates", String(dropDuplicates));
      form.append("normalize_text", String(normalizeText));
      const result = await readApiResponse(await fetch(`${API_BASE}/api/v1/cleaning/preview`, { method: "POST", body: form }));
      setCleaning(result);
      setNotice("Preview is ready. The original source file was not overwritten.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to preview cleaning. The source dataset remains available.");
    } finally {
      setBusy("");
    }
  }

  async function executeCleaning() {
    if (!file || !overview || !cleaning) {
      setError("Inspect the source and complete a cleaning preview before approving execution.");
      setConfirmingExecution(false);
      return;
    }
    if (!ensureApiConfigured()) return;
    setBusy("execute");
    setError("");
    setNotice("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("fill_missing", String(fillMissing));
      form.append("drop_exact_duplicates", String(dropDuplicates));
      form.append("normalize_text", String(normalizeText));
      const response = await fetch(`${API_BASE}/api/v1/cleaning/execute`, { method: "POST", body: form });
      if (!response.ok) await readApiResponse(response);
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.toLowerCase().includes("text/csv")) {
        throw new Error("The cleaning endpoint did not return the expected CSV format.");
      }
      const blob = await response.blob();
      const stem = file.name.replace(/\.[^.]+$/, "") || "dataset";
      const filename = `${stem}-cleaned.csv`;
      const cleanedFile = new File([blob], filename, { type: "text/csv" });
      setCleanedCsv({ blob, filename });
      setConfirmingExecution(false);
      setNotice("A separate cleaned CSV is ready. The original source file remains unchanged.");

      // Keep the prior before/after readiness comparison, but never let its failure hide a successful CSV export.
      if (task === "clustering" || target.trim()) {
        try {
          const scoreFile = async (candidate: File): Promise<ApiObject> => {
            const scoreForm = new FormData();
            scoreForm.append("file", candidate);
            scoreForm.append("task", task);
            if (target.trim()) scoreForm.append("target", target.trim());
            return readApiResponse(await fetch(`${API_BASE}/api/v1/ml-readiness/score`, { method: "POST", body: scoreForm }));
          };
          const [before, after] = await Promise.all([scoreFile(file), scoreFile(cleanedFile)]);
          setComparison({ before, after });
          setNotice("A separate cleaned CSV is ready. Before/after readiness results are shown for source and cleaned CSV; the source remains unchanged.");
        } catch (cause) {
          const detail = cause instanceof Error ? cause.message : "Readiness comparison could not be completed.";
          setNotice(`Cleaned CSV is ready; the separate readiness comparison failed: ${detail}`);
        }
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create a cleaned CSV. The source file remains unchanged.");
    } finally {
      setBusy("");
    }
  }

  function downloadCleanedCsv() {
    if (!cleanedCsv) {
      setError("Create and confirm a cleaned CSV before downloading.");
      return;
    }
    downloadBlob(cleanedCsv.blob, cleanedCsv.filename);
    setNotice("Cleaned CSV download started.");
  }

  const mlWorkspaceProps = {
    file, overview, cleaning, cleanedCsv, version: mlDatasetVersion, onVersionChange: changeMlDatasetVersion,
    task, target, onTaskChange: changeMlTask, onTargetChange: changeMlTarget,
    readiness, comparison, busy, error, notice, onReadiness: calculateReadiness,
    onStartComparison: prepareMlComparison, onCancelComparison: () => setConfirmingMlComparison(false),
    onConfirmComparison: runMlComparison, confirmingComparison: confirmingMlComparison,
  };
  return (
    <WorkspaceShell
      hasActiveDataset={!!(file && overview)}
      preprocessing={
        <DataPreprocessingWorkspace
          file={file} overview={overview} cleaning={cleaning} cleanedCsv={cleanedCsv}
          fillMissing={fillMissing} dropDuplicates={dropDuplicates} normalizeText={normalizeText}
          busy={busy} error={error} notice={notice} onToggle={changeCleaningOption}
          onPreview={previewCleaning} onExecute={executeCleaning} onDownload={downloadCleanedCsv}
          confirming={confirmingExecution} onBeginConfirmation={() => { setConfirmingExecution(true); setError(""); }}
          onCancelConfirmation={() => setConfirmingExecution(false)}
        />
      }
      visualization={<DataVisualizationWorkspace file={file} overview={overview} cleaning={cleaning} cleanedCsv={cleanedCsv} />}
      mlReadiness={<MlReadinessWorkspace {...mlWorkspaceProps} />}
      mlLab={<MlLabWorkspace {...mlWorkspaceProps} />}
    >
      <DataAnalysisWorkspace
        file={file} overview={overview} busy={busy} error={error} notice={notice}
        onFileChange={handleFileChange} onInspect={inspectDataset}
      />
    </WorkspaceShell>
  );
}
