import test from "node:test";
import assert from "node:assert/strict";
import {
  LAB_ALGORITHMS, LAB_METRICS, READINESS_TASKS, getMlColumns, targetOptions,
  validateReadinessSelection, validateComparisonSelection, parseReadinessResponse, parseComparisonResponse,
} from "./workspace-ml-model.mjs";

const columns = [
  { name: "age", dtype: "int64", numeric_summary: { min: 18, max: 90 } },
  { name: "city", dtype: "object" },
  { name: "label", dtype: "object" },
];
const response = { columns, overview: { row_count: 60, column_count: 3, duplicate_row_count: 0 } };

test("readiness exposes only the four backend task families and actual inspected columns", () => {
  assert.deepEqual(READINESS_TASKS, ["classification", "regression", "forecasting", "clustering"]);
  assert.deepEqual(getMlColumns(response).map((column) => column.name), ["age", "city", "label"]);
  assert.deepEqual(targetOptions(getMlColumns(response), "regression").map((column) => column.name), ["age"]);
  assert.deepEqual(targetOptions(getMlColumns(response), "classification").map((column) => column.name), ["age", "city", "label"]);
});

test("readiness validates supervised targets and accepts clustering without a target", () => {
  const cols = getMlColumns(response);
  assert.equal(validateReadinessSelection({ hasDataset: true, task: "classification", target: "label", columns: cols }), "");
  assert.match(validateReadinessSelection({ hasDataset: true, task: "regression", target: "city", columns: cols }), /numeric target/);
  assert.match(validateReadinessSelection({ hasDataset: true, task: "forecasting", target: "missing", columns: cols }), /returned by dataset inspection/);
  assert.equal(validateReadinessSelection({ hasDataset: true, task: "clustering", target: "", columns: cols }), "");
  assert.match(validateReadinessSelection({ hasDataset: true, task: "unknown", target: "", columns: cols }), /not supported/);
});

test("ML Lab exposes only backend classification and regression algorithms and metrics", () => {
  assert.deepEqual(LAB_ALGORITHMS.classification, ["Logistic Regression", "Random Forest", "Extra Trees"]);
  assert.deepEqual(LAB_ALGORITHMS.regression, ["Linear Regression", "Ridge Regression", "Random Forest Regressor"]);
  assert.deepEqual(Object.keys(LAB_METRICS.classification), ["CA", "Precision", "Recall", "F1-Score", "AUC"]);
  assert.deepEqual(Object.keys(LAB_METRICS.regression), ["MSE", "RMSE", "MAE", "R2"]);
});

test("comparison validation requires a supported task, valid target and exact-duplicate report", () => {
  const cols = getMlColumns(response);
  const input = { hasDataset: true, task: "classification", target: "label", columns: cols, duplicateCount: 0 };
  assert.equal(validateComparisonSelection(input), "");
  assert.match(validateComparisonSelection({ ...input, task: "" }), /Choose a machine-learning task/);
  assert.match(validateComparisonSelection({ ...input, task: "forecasting" }), /classification and regression only/);
  assert.match(validateComparisonSelection({ ...input, task: "regression", target: "city" }), /numeric target/);
  assert.match(validateComparisonSelection({ ...input, duplicateCount: 2 }), /exact duplicate rows/);
  assert.match(validateComparisonSelection({ ...input, duplicateCount: undefined }), /did not report an exact duplicate/);
  assert.match(validateComparisonSelection({ ...input, hasDataset: false }), /Inspect a dataset/);
});

test("readiness response parser displays only matching finite API score and dimensions", () => {
  const result = parseReadinessResponse({
    task: "classification", target: "label", score: 74, status: "Needs preparation",
    dimensions: [{ name: "data_quality", score: 80, weight: 0.35, explanation: "Actual engine explanation." }],
    issues: ["Fewer than 30 rows."], caveat: "Heuristic only.",
  }, "classification", "label");
  assert.equal(result.score, 74);
  assert.throws(() => parseReadinessResponse({ task: "regression", target: "label", score: 101, dimensions: [], issues: [], caveat: "x" }, "classification", "label"), /did not match|invalid/);
});

test("comparison response retains actual supported metrics and null AUC, excludes unknown model names", () => {
  const result = parseComparisonResponse({
    task: "classification", target: "label", validation: { method: "80/20 holdout", random_state: 42 },
    models: [
      { algorithm: "Logistic Regression", status: "ok", metrics: { CA: 0.8, Precision: 0.79, Recall: 0.8, "F1-Score": 0.79, AUC: null, invented: 999 } },
      { algorithm: "Unlisted Algorithm", status: "ok", metrics: { CA: 1 } },
      { algorithm: "Extra Trees", status: "failed", metrics: {}, error: "fit failed" },
    ], warning: "Holdout estimate.",
  }, "classification", "label");
  const models = result.models;
  assert.ok(Array.isArray(models));
  assert.equal(models.length, 2);
  assert.deepEqual(models[0].metrics, { CA: 0.8, Precision: 0.79, Recall: 0.8, "F1-Score": 0.79, AUC: null });
  assert.equal(models[1].status, "failed");
  assert.throws(() => parseComparisonResponse({ task: "forecasting", target: "label", validation: {}, models: [] }, "forecasting", "label"), /unsupported comparison protocol|match/);
});