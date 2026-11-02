import assert from "node:assert/strict";
import test from "node:test";
import {
  chooseDefaultChart,
  getApiChartSummary,
  getVisualizationCapabilities,
  inferColumnKinds,
  makeBarCounts,
  makeBoxSummary,
  makeCorrelationMatrix,
  makeHistogram,
  makeLineSeries,
  makeScatterPoints,
  normalizeRecords,
  selectVisualizationRows,
} from "./workspace-visualization-model.mjs";

const profiles = [
  { name: "amount", dtype: "float64" },
  { name: "category", dtype: "object" },
  { name: "day", dtype: "object" },
];
const rows = [
  { amount: 1, category: "A", day: "2025-01-02" },
  { amount: 2, category: "A", day: "2025-01-01" },
  { amount: null, category: null, day: "bad-date" },
  { amount: 4, category: "B", day: "2025-01-03" },
];

test("normalization and type inference use validated API profile fields and actual values", () => {
  assert.equal(normalizeRecords([{}, null, 2, []]).length, 1);
  assert.deepEqual(inferColumnKinds(profiles, rows).map(({ name, kind }) => [name, kind]), [
    ["amount", "numeric"], ["category", "categorical"], ["day", "date"],
  ]);
});

test("histogram counts finite numbers and reports excluded values", () => {
  const result = makeHistogram([{ x: 0 }, { x: 1 }, { x: 2 }, { x: null }, { x: Infinity }], "x", 2);
  assert.equal(result.count, 3);
  assert.equal(result.dropped, 2);
  assert.deepEqual(result.bins.map((bin) => bin.count), [1, 2]);
  assert.equal(makeHistogram([{ x: 5 }, { x: 5 }], "x").constant, true);
  assert.equal(makeHistogram([{ x: "NaN" }], "x").empty, true);
});

test("bar aggregation is deterministic and groups high-cardinality tail", () => {
  const input = Array.from({ length: 15 }, (_, index) => ({ group: "g" + index }));
  input.push({ group: null });
  const result = makeBarCounts(input, "group", 3);
  assert.equal(result.categories, 16);
  assert.equal(result.values.length, 4);
  assert.equal(result.values[3].label, "Other categories");
  assert.equal(result.otherCount, 13);
  assert.equal(result.total, 16);
});

test("line values validate dates, discard malformed pairs, and order x ascending", () => {
  const result = makeLineSeries(rows, "day", "amount", "date");
  assert.deepEqual(result.points.map((point) => point.label), ["2025-01-01", "2025-01-02", "2025-01-03"]);
  assert.equal(result.dropped, 1);
  assert.equal(makeLineSeries(rows, "category", "amount", "categorical").count, 0);
});

test("scatter uses pairwise finite values and deterministic evenly spaced sampling", () => {
  const input = Array.from({ length: 10 }, (_, x) => ({ x, y: x * 2 }));
  input.push({ x: 11, y: NaN });
  const result = makeScatterPoints(input, "x", "y", 4);
  assert.equal(result.validCount, 10);
  assert.equal(result.dropped, 1);
  assert.equal(result.sampled, true);
  assert.deepEqual(result.points.map((point) => point.x), [0, 3, 6, 9]);
});

test("box plot uses linear quartiles and Tukey whiskers", () => {
  const result = makeBoxSummary([{ x: 1 }, { x: 2 }, { x: 3 }, { x: 4 }, { x: 100 }, { x: null }], "x");
  assert.deepEqual([result.q1, result.median, result.q3], [2, 3, 4]);
  assert.deepEqual([result.lowerWhisker, result.upperWhisker], [1, 4]);
  assert.deepEqual(result.outliers, [100]);
  assert.equal(result.dropped, 1);
  assert.equal(makeBoxSummary([{ x: 2 }, { x: 2 }], "x").constant, true);
});

test("correlation is pairwise Pearson and flags insufficient or constant pairs", () => {
  const result = makeCorrelationMatrix([
    { a: 1, b: 2, c: 7 },
    { a: 2, b: 4, c: 7 },
    { a: 3, b: null, c: 7 },
  ], ["a", "b", "c"]);
  assert.equal(result.matrix[0][1].value, 1);
  assert.equal(result.matrix[0][1].count, 2);
  assert.equal(result.matrix[0][2].value, null);
  assert.equal(result.matrix[0][2].count, 3);
  assert.equal(result.matrix[1][1].value, 1);
});

test("capabilities and API summaries keep unavailable chart inputs out of selectors", () => {
  const summaries = [{ type: "histogram", column: "amount", bins: [{ start: 0, end: 1, count: 4 }] }];
  const capabilities = getVisualizationCapabilities(inferColumnKinds(profiles, rows), rows, summaries);
  assert.deepEqual(capabilities.histogram, ["amount"]);
  assert.deepEqual(capabilities.lineX, ["amount", "day"]);
  assert.deepEqual(capabilities.bar, ["category"]);
  assert.deepEqual(chooseDefaultChart(capabilities), { type: "histogram", x: "amount", y: "" });
  assert.equal(getApiChartSummary(summaries, "histogram", "amount"), summaries[0]);
  assert.equal(getApiChartSummary(summaries, "bar", "category"), null);
});

test("dataset-version selection uses cleaned preview only when its output exists", () => {
  const source = [{ amount: 1 }];
  const cleaned = [{ amount: 0 }];
  assert.deepEqual(selectVisualizationRows("source", source, cleaned, true), { version: "source", rows: source });
  assert.equal(selectVisualizationRows("source", source, cleaned, true).rows, source);
  assert.deepEqual(selectVisualizationRows("cleaned", source, cleaned, true), { version: "cleaned", rows: cleaned });
  assert.deepEqual(selectVisualizationRows("cleaned", source, [], false), { version: "source", rows: source });
});
test("invalid ISO calendar dates and empty numeric columns are not chartable", () => {
  const badDates = inferColumnKinds([{ name: "day", dtype: "object" }], [
    { day: "2025-02-30" }, { day: "2025-02-31" }, { day: "not-a-date" }, { day: null },
  ]);
  assert.equal(badDates[0].kind, "categorical");
  const emptyKinds = inferColumnKinds([{ name: "blank", dtype: "float64" }], [{ blank: null }, { blank: "Infinity" }]);
  assert.deepEqual(getVisualizationCapabilities(emptyKinds, [{ blank: null }, { blank: "Infinity" }]).histogram, []);
});