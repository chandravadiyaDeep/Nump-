import assert from "node:assert/strict";
import test from "node:test";
import {
  filterAndSortProfiles,
  getColumnProfiles,
  getProfileSummary,
  getQualityObservations,
  selectionLabel,
  validateUpload,
} from "./workspace-data-model.mjs";

const profiles = [
  { name: "age", dtype: "int64", missing_count: 1, unique_count: 2, numeric_summary: { min: 18, median: 24, max: 30 } },
  { name: "city", dtype: "object", missing_count: 0, unique_count: 2, top_values: [{ value: "Pune", count: 2 }] },
];

test("column profiles are narrowed, searchable, and sorted from API values", () => {
  assert.equal(getColumnProfiles([...profiles, { name: 8 }]).length, 2);
  assert.deepEqual(filterAndSortProfiles(profiles, "obj", "name").map((item) => item.name), ["city"]);
  assert.deepEqual(filterAndSortProfiles(profiles, "", "missing").map((item) => item.name), ["age", "city"]);
});

test("numeric and categorical summaries use only returned fields", () => {
  assert.equal(getProfileSummary(profiles[0]), "Min 18 · Median 24 · Max 30");
  assert.equal(getProfileSummary(profiles[1]), "Top: Pune (2)");
  assert.equal(getProfileSummary({ name: "other" }), "Summary not returned");
});

test("quality observations report returned totals and mark absent values unavailable", () => {
  assert.deepEqual(getQualityObservations({ total_missing_cells: 1, duplicate_row_count: 0 }), [
    { id: "missing", tone: "warning", message: "1 missing cells reported across the dataset." },
    { id: "duplicates", tone: "ok", message: "No exact duplicate rows were reported." },
  ]);
  assert.equal(getQualityObservations({})[0].tone, "neutral");
  assert.match(getQualityObservations({})[0].message, /not returned/);
});

test("cleaning selections have explicit selected and skipped states", () => {
  assert.equal(selectionLabel(true), "Selected");
  assert.equal(selectionLabel(false), "Skipped");
});
test("upload validation reflects supported suffixes and the current size limit", () => {
  assert.equal(validateUpload("table.csv", 10), null);
  assert.equal(validateUpload("table.ipc", 10), "Unsupported file format. Choose CSV, JSON, XLSX, Parquet, Arrow, or Feather.");
  assert.equal(validateUpload("large.csv", 50 * 1024 * 1024 + 1), "This file exceeds the current 50 MB upload limit.");
});
