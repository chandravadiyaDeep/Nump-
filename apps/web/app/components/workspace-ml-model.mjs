export const READINESS_TASKS = ["classification", "regression", "forecasting", "clustering"];
export const LAB_ALGORITHMS = {
  classification: ["Logistic Regression", "Random Forest", "Extra Trees"],
  regression: ["Linear Regression", "Ridge Regression", "Random Forest Regressor"],
};
export const LAB_METRICS = {
  classification: {
    CA: { label: "Accuracy", direction: "Higher is better", units: "unitless fraction (0–1)", explanation: "Share of holdout predictions that match the observed class; can hide minority-class errors." },
    Precision: { label: "Weighted precision", direction: "Higher is better", units: "unitless fraction (0–1)", explanation: "Weighted average of class precision; reflects how often predicted classes are correct." },
    Recall: { label: "Weighted recall", direction: "Higher is better", units: "unitless fraction (0–1)", explanation: "Weighted average of class recall; reflects how many true class members are found." },
    "F1-Score": { label: "Weighted F1", direction: "Higher is better", units: "unitless fraction (0–1)", explanation: "Weighted harmonic mean of precision and recall." },
    AUC: { label: "ROC AUC", direction: "Higher is better", units: "unitless fraction (0–1)", explanation: "Ranking discrimination; unavailable when the holdout lacks the required class coverage." },
  },
  regression: {
    MSE: { label: "Mean squared error", direction: "Lower is better", units: "squared target units", explanation: "Average squared prediction error, in squared target units." },
    RMSE: { label: "Root mean squared error", direction: "Lower is better", units: "target units", explanation: "Square root of MSE, in target units; larger errors receive extra weight." },
    MAE: { label: "Mean absolute error", direction: "Lower is better", units: "target units", explanation: "Average absolute prediction error, in target units." },
    R2: { label: "R²", direction: "Higher is better", units: "unitless; may be negative", explanation: "Relative fit to the holdout mean baseline; may be negative." },
  },
};

const object = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
export function getMlColumns(overview) {
  const columns = object(overview).columns;
  if (!Array.isArray(columns)) return [];
  return columns.map(object).filter((column) => typeof column.name === "string" && column.name.length > 0);
}
export function isNumericColumn(column) {
  const dtype = String(object(column).dtype ?? "");
  return /^(u?int|float|decimal|number)/i.test(dtype) || Object.keys(object(object(column).numeric_summary)).length > 0;
}
export function targetOptions(columns, task) {
  return columns.filter((column) => task === "classification" || isNumericColumn(column));
}
export function validateReadinessSelection({ hasDataset, task, target, columns }) {
  if (!hasDataset) return "Inspect a dataset before calculating readiness.";
  if (!task) return "Choose a machine-learning task before calculating readiness.";
  if (!READINESS_TASKS.includes(task)) return "This readiness task is not supported by the current API.";
  if (task === "clustering") return "";
  if (!target) return "Choose a target column for this supervised assessment.";
  const column = columns.find((item) => item.name === target);
  if (!column) return "Choose a target column returned by dataset inspection.";
  if ((task === "regression" || task === "forecasting") && !isNumericColumn(column)) return "This task requires a numeric target column.";
  return "";
}
export function validateComparisonSelection({ hasDataset, task, target, columns, duplicateCount }) {
  if (!hasDataset) return "Inspect a dataset before comparing models.";
  if (!task) return "Choose a machine-learning task before comparing models.";
  if (!Object.prototype.hasOwnProperty.call(LAB_ALGORITHMS, task)) return "ML Lab comparisons currently support classification and regression only.";
  if (!target || !columns.some((column) => column.name === target)) return "Choose a target column returned by dataset inspection.";
  if (task === "regression" && !isNumericColumn(columns.find((column) => column.name === target))) return "Regression comparison requires a numeric target column.";
  if (!Number.isInteger(duplicateCount) || duplicateCount < 0) return "Comparison is unavailable because the API did not report an exact duplicate-row count.";
  if (duplicateCount > 0) return "Comparison is blocked because exact duplicate rows can land in both parts of this random holdout. Review cleaning and select the cleaned CSV if appropriate.";
  return "";
}
export function parseReadinessResponse(value, task, target) {
  const result = object(value);
  if (result.task !== task || (result.target ?? null) !== (task === "clustering" ? null : target)) throw new Error("The API response did not match the selected task and target.");
  if (typeof result.score !== "number" || !Number.isFinite(result.score) || result.score < 0 || result.score > 100) throw new Error("The API returned an invalid readiness score.");
  if (!Array.isArray(result.dimensions) || !result.dimensions.every((item) => typeof object(item).name === "string" && typeof object(item).score === "number" && Number.isFinite(object(item).score) && typeof object(item).weight === "number" && Number.isFinite(object(item).weight) && typeof object(item).explanation === "string")) throw new Error("The API returned an incomplete readiness explanation.");
  if (!Array.isArray(result.issues) || !result.issues.every((item) => typeof item === "string") || typeof result.caveat !== "string") throw new Error("The API returned incomplete readiness notes.");
  return result;
}
export function parseComparisonResponse(value, task, target) {
  const result = object(value);
  if (!Object.prototype.hasOwnProperty.call(LAB_ALGORITHMS, task) || result.task !== task || result.target !== target) throw new Error("The API response did not match the selected task and target.");
  if (object(result.validation).method !== "80/20 holdout" || !Array.isArray(result.models)) throw new Error("The API returned an unsupported comparison protocol.");
  const allowed = LAB_ALGORITHMS[task];
  const metricNames = Object.keys(LAB_METRICS[task]);
  const models = result.models.filter((model) => allowed.includes(object(model).algorithm)).map((model) => {
    const item = object(model);
    if (item.status === "failed") return { algorithm: item.algorithm, status: "failed", error: typeof item.error === "string" ? item.error : "The model did not complete." };
    if (item.status !== "ok") return { algorithm: item.algorithm, status: "failed", error: "The API returned an unknown model status." };
    const metrics = object(item.metrics);
    return { algorithm: item.algorithm, status: "ok", metrics: Object.fromEntries(metricNames.filter((name) => metrics[name] === null || (typeof metrics[name] === "number" && Number.isFinite(metrics[name]))).map((name) => [name, metrics[name]])) };
  });
  if (!models.length) throw new Error("The API returned no supported baseline model results.");
  return { ...result, models };
}