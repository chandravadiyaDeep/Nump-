const DEFAULT_LIMIT = 12;

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function finiteNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function strictDate(value) {
  if (typeof value !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)?$/.exec(value.trim());
  if (!match) return null;
  const [, year, month, day, hour = "0", minute = "0", second = "0"] = match;
  const calendar = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (calendar.getUTCFullYear() !== Number(year) || calendar.getUTCMonth() + 1 !== Number(month) || calendar.getUTCDate() !== Number(day)) return null;
  if (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeRecords(value) {
  return Array.isArray(value) ? value.filter(isObject) : [];
}

export function inferColumnKinds(profiles, rows) {
  const records = normalizeRecords(rows);
  return (Array.isArray(profiles) ? profiles : []).flatMap((item) => {
    if (!isObject(item) || typeof item.name !== "string") return [];
    const dtype = typeof item.dtype === "string" ? item.dtype.toLowerCase() : "";
    const numeric = /int|float|double|decimal|number/.test(dtype);
    const samples = records.map((row) => row[item.name]).filter((value) => value !== null && value !== undefined && value !== "");
    const dateRatio = samples.length ? samples.filter((value) => strictDate(value) !== null).length / samples.length : 0;
    const kind = numeric ? "numeric" : (/datetime|date|timestamp/.test(dtype) || dateRatio >= 0.75 ? "date" : "categorical");
    return [{ name: item.name, kind, dtype: typeof item.dtype === "string" ? item.dtype : "unknown" }];
  });
}

export function makeHistogram(rows, column, requestedBins = 10) {
  const records = normalizeRecords(rows);
  const values = records.map((row) => finiteNumber(row[column])).filter((value) => value !== null);
  const dropped = records.length - values.length;
  if (!values.length) return { bins: [], count: 0, dropped, constant: false, empty: true };
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return { bins: [{ start: min, end: max, count: values.length }], count: values.length, dropped, constant: true, empty: false };
  const binsCount = Math.max(1, Math.min(30, Math.floor(requestedBins)));
  const width = (max - min) / binsCount;
  const bins = Array.from({ length: binsCount }, (_, index) => ({ start: min + index * width, end: index === binsCount - 1 ? max : min + (index + 1) * width, count: 0 }));
  for (const value of values) bins[Math.min(binsCount - 1, Math.floor((value - min) / width))].count += 1;
  return { bins, count: values.length, dropped, constant: false, empty: false };
}

export function makeBarCounts(rows, column, limit = DEFAULT_LIMIT) {
  const records = normalizeRecords(rows);
  const counts = new Map();
  for (const row of records) {
    const raw = row[column];
    const label = raw === null || raw === undefined || raw === "" ? "(missing)" : String(raw);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const ordered = [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
  const topLimit = Math.max(1, Math.min(50, Math.floor(limit)));
  const visible = ordered.slice(0, topLimit).map(([label, count]) => ({ label, count }));
  const otherCount = ordered.slice(topLimit).reduce((sum, [, count]) => sum + count, 0);
  if (otherCount) visible.push({ label: "Other categories", count: otherCount });
  return { values: visible, categories: counts.size, total: records.length, otherCount, empty: records.length === 0 };
}

export function makeLineSeries(rows, xColumn, yColumn, xKind) {
  const records = normalizeRecords(rows);
  const valid = [];
  for (let index = 0; index < records.length; index += 1) {
    const xRaw = records[index][xColumn];
    const x = xKind === "date" ? strictDate(xRaw) : finiteNumber(xRaw);
    const y = finiteNumber(records[index][yColumn]);
    if (x !== null && y !== null) valid.push({ x, y, label: String(xRaw), sourceIndex: index });
  }
  valid.sort((left, right) => left.x - right.x || left.sourceIndex - right.sourceIndex);
  return { points: valid, dropped: records.length - valid.length, xKind, count: valid.length, empty: valid.length === 0 };
}

export function makeScatterPoints(rows, xColumn, yColumn, maxPoints = 1500) {
  const records = normalizeRecords(rows);
  const valid = records.flatMap((row, index) => {
    const x = finiteNumber(row[xColumn]);
    const y = finiteNumber(row[yColumn]);
    return x === null || y === null ? [] : [{ x, y, sourceIndex: index }];
  });
  const limit = Math.max(2, Math.floor(maxPoints));
  if (valid.length <= limit) return { points: valid, validCount: valid.length, dropped: records.length - valid.length, sampled: false, empty: valid.length === 0 };
  // Evenly spaced indices make the preview deterministic and preserve coverage across row order.
  const points = Array.from({ length: limit }, (_, index) => valid[Math.floor(index * (valid.length - 1) / (limit - 1))]);
  return { points, validCount: valid.length, dropped: records.length - valid.length, sampled: true, empty: false };
}

function quantile(sorted, fraction) {
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  const blend = position - lower;
  return sorted[lower] * (1 - blend) + sorted[upper] * blend;
}

export function makeBoxSummary(rows, column) {
  const records = normalizeRecords(rows);
  const values = records.map((row) => finiteNumber(row[column])).filter((value) => value !== null).sort((left, right) => left - right);
  if (!values.length) return { empty: true, count: 0, dropped: records.length };
  const q1 = quantile(values, 0.25);
  const median = quantile(values, 0.5);
  const q3 = quantile(values, 0.75);
  const iqr = q3 - q1;
  const lowFence = q1 - 1.5 * iqr;
  const highFence = q3 + 1.5 * iqr;
  const inliers = values.filter((value) => value >= lowFence && value <= highFence);
  const outliers = values.filter((value) => value < lowFence || value > highFence);
  return { empty: false, count: values.length, dropped: records.length - values.length, min: values[0], q1, median, q3, max: values[values.length - 1], lowerWhisker: inliers[0], upperWhisker: inliers[inliers.length - 1], outliers, constant: values[0] === values.at(-1) };
}

function pearson(pairs) {
  if (pairs.length < 2) return null;
  const meanX = pairs.reduce((sum, pair) => sum + pair.x, 0) / pairs.length;
  const meanY = pairs.reduce((sum, pair) => sum + pair.y, 0) / pairs.length;
  let covariance = 0;
  let varianceX = 0;
  let varianceY = 0;
  for (const pair of pairs) {
    const dx = pair.x - meanX;
    const dy = pair.y - meanY;
    covariance += dx * dy;
    varianceX += dx * dx;
    varianceY += dy * dy;
  }
  if (varianceX === 0 || varianceY === 0) return null;
  return covariance / Math.sqrt(varianceX * varianceY);
}

export function makeCorrelationMatrix(rows, columns) {
  const records = normalizeRecords(rows);
  const names = Array.isArray(columns) ? columns.slice(0, 12) : [];
  const matrix = names.map((xColumn) => names.map((yColumn) => {
    const pairs = records.flatMap((row) => {
      const x = finiteNumber(row[xColumn]);
      const y = finiteNumber(row[yColumn]);
      return x === null || y === null ? [] : [{ x, y }];
    });
    return { value: pearson(pairs), count: pairs.length };
  }));
  return { columns: names, matrix, rows: records.length, truncatedColumns: Array.isArray(columns) && columns.length > 12 ? columns.length - 12 : 0 };
}

export function getApiChartSummary(summaries, type, column) {
  if (!Array.isArray(summaries)) return null;
  return summaries.find((summary) => isObject(summary) && summary.type === type && summary.column === column) ?? null;
}

export function getVisualizationCapabilities(kinds, rows, summaries = []) {
  const records = normalizeRecords(rows);
  const numeric = kinds.filter((item) => item.kind === "numeric" && records.some((row) => finiteNumber(row[item.name]) !== null)).map((item) => item.name);
  const categorical = kinds.filter((item) => item.kind === "categorical").map((item) => item.name);
  const ordered = kinds.filter((item) => (item.kind === "numeric" && records.some((row) => finiteNumber(row[item.name]) !== null)) || (item.kind === "date" && records.some((row) => strictDate(row[item.name]) !== null))).map((item) => item.name);
  const hasNumericRows = (column) => records.some((row) => finiteNumber(row[column]) !== null) || getApiChartSummary(summaries, "histogram", column) !== null;
  return {
    histogram: kinds.filter((item) => item.kind === "numeric" && hasNumericRows(item.name)).map((item) => item.name),
    bar: categorical.filter((column) => records.length > 0 || getApiChartSummary(summaries, "bar", column) !== null),
    lineX: ordered,
    lineY: numeric,
    scatter: numeric,
    box: numeric,
    heatmap: numeric,
    hasRows: records.length > 0,
  };
}

export function chooseDefaultChart(capabilities) {
  if (capabilities.histogram.length) return { type: "histogram", x: capabilities.histogram[0], y: "" };
  if (capabilities.bar.length) return { type: "bar", x: capabilities.bar[0], y: "" };
  return { type: "histogram", x: "", y: "" };
}

function keepRecordArray(value) {
  if (Array.isArray(value) && value.every(isObject)) return value;
  return normalizeRecords(value);
}

export function selectVisualizationRows(version, sourceRows, cleanedRows, cleanedAvailable) {
  if (version === "cleaned" && cleanedAvailable && Array.isArray(cleanedRows) && cleanedRows.length > 0) {
    return { version: "cleaned", rows: keepRecordArray(cleanedRows) };
  }
  return { version: "source", rows: keepRecordArray(sourceRows) };
}