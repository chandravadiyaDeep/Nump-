"use client";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  getApiChartSummary, getVisualizationCapabilities, inferColumnKinds, makeBarCounts,
  makeBoxSummary, makeCorrelationMatrix, makeHistogram, makeLineSeries, makeScatterPoints, normalizeRecords,
  selectVisualizationRows,
} from "./workspace-visualization-model.mjs";

type Row = Record<string, unknown>;
type Obj = Record<string, unknown>;
type Version = "source" | "cleaned";
type ChartType = "histogram" | "bar" | "line" | "scatter" | "box" | "heatmap";
type Props = { file: File | null; overview: Obj | null; cleaning: Obj | null; cleanedCsv: { blob: Blob; filename: string } | null };
type Bin = { start: number; end: number; count: number };
type Bar = { label: string; count: number };
type Point = { x: number; y: number; label?: string };
type Box = { min: number; q1: number; median: number; q3: number; max: number; lowerWhisker: number; upperWhisker: number; outliers: number[] };
type Heatmap = { columns: string[]; matrix: { value: number | null; count: number }[][] };
type Plot = { bins?: Bin[]; bars?: Bar[]; points?: Point[]; box?: Box; heatmap?: Heatmap };
type Choice = { type: ChartType; x: string; y: string };

const options: { value: ChartType; label: string }[] = [
  { value: "histogram", label: "Histogram" }, { value: "bar", label: "Bar chart" },
  { value: "line", label: "Line chart" }, { value: "scatter", label: "Scatter plot" },
  { value: "box", label: "Box plot" }, { value: "heatmap", label: "Correlation heatmap" },
];
const explanations: Record<ChartType, string> = {
  histogram: "Shows how numeric values are distributed across equal-width intervals.",
  bar: "Counts category values. High-cardinality columns show the most common categories and group the remainder.",
  line: "Sorts points by a numeric or ISO date/time x-axis. This is an ordered relationship, not a time-series forecast.",
  scatter: "Shows paired numeric values and may reveal association or outliers.",
  box: "Shows quartiles and Tukey whiskers; values beyond 1.5×IQR are marked as outliers.",
  heatmap: "Shows pairwise Pearson correlations. Constant or insufficient pairs are marked unavailable.",
};
function obj(value: unknown): Obj { return value && typeof value === "object" && !Array.isArray(value) ? value as Obj : {}; }
function number(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || !value.trim()) return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}
function fmt(value: number): string { return Number.isInteger(value) ? value.toLocaleString() : Number(value.toPrecision(5)).toLocaleString(); }
function short(value: string, limit = 12): string { return value.length > limit ? value.slice(0, limit - 1) + "…" : value; }
function typeLabel(type: ChartType): string { return options.find((item) => item.value === type)?.label ?? type; }
function colorFor(value: number | null): string {
  if (value === null) return "var(--chart-missing)";
  const opacity = 0.18 + Math.abs(value) * 0.72;
  return value >= 0 ? "hsl(217 82% 52% / " + opacity + ")" : "hsl(22 82% 54% / " + opacity + ")";
}
function summary(data: Plot, type: ChartType): string {
  if (type === "histogram" && data.bins) return data.bins.reduce((sum, bin) => sum + bin.count, 0).toLocaleString() + " numeric values across " + data.bins.length + " bins.";
  if (type === "bar" && data.bars) return data.bars.reduce((sum, bar) => sum + bar.count, 0).toLocaleString() + " records across " + data.bars.length + " displayed categories.";
  if ((type === "line" || type === "scatter") && data.points) return data.points.length.toLocaleString() + " valid paired points.";
  if (type === "box" && data.box) return "Min " + fmt(data.box.min) + ", Q1 " + fmt(data.box.q1) + ", median " + fmt(data.box.median) + ", Q3 " + fmt(data.box.q3) + ", max " + fmt(data.box.max) + ".";
  if (type === "heatmap" && data.heatmap) return "Pearson correlation matrix for " + data.heatmap.columns.length + " numeric columns.";
  return "No chart values are available for this selection.";
}

function DataTable({ data, type, xKind }: { data: Plot; type: ChartType; xKind: "numeric" | "categorical" | "date" }) {
  let rows: { label: string; value: string; detail: string }[] = [];
  if (type === "histogram" && data.bins) rows = data.bins.map((bin, i) => ({ label: "Bin " + (i + 1), value: fmt(bin.start) + " to " + fmt(bin.end), detail: bin.count + " records" }));
  else if (type === "bar" && data.bars) rows = data.bars.map((bar) => ({ label: bar.label, value: String(bar.count), detail: "records" }));
  else if ((type === "line" || type === "scatter") && data.points) rows = data.points.slice(0, 100).map((point, i) => ({ label: point.label ?? "Point " + (i + 1), value: (type === "line" && xKind === "date" ? point.label ?? new Date(point.x).toISOString().slice(0, 10) : fmt(point.x)) + ", " + fmt(point.y), detail: "x, y" }));
  else if (type === "box" && data.box) rows = [
    { label: "Minimum", value: fmt(data.box.min), detail: "value" }, { label: "Q1", value: fmt(data.box.q1), detail: "value" },
    { label: "Median", value: fmt(data.box.median), detail: "value" }, { label: "Q3", value: fmt(data.box.q3), detail: "value" },
    { label: "Maximum", value: fmt(data.box.max), detail: "value" }, { label: "Outliers", value: String(data.box.outliers.length), detail: "beyond Tukey whiskers" },
  ];
  else if (type === "heatmap" && data.heatmap) rows = data.heatmap.columns.flatMap((name, r) => data.heatmap!.columns.map((column, c) => {
    const cell = data.heatmap!.matrix[r][c];
    return { label: name + " × " + column, value: cell.value === null ? "Unavailable" : fmt(cell.value), detail: "n=" + cell.count };
  }));
  return <details className="visualization-data-table"><summary>View chart values as a table</summary>{rows.length ?
    <div className="table-wrap"><table><thead><tr><th scope="col">Measure</th><th scope="col">Value</th><th scope="col">Details</th></tr></thead><tbody>{rows.map((row, i) => <tr key={row.label + i}><th scope="row">{row.label}</th><td>{row.value}</td><td>{row.detail}</td></tr>)}</tbody></table></div> :
    <p className="hint">No values to display.</p>}{(type === "line" || type === "scatter") && (data.points?.length ?? 0) > 100 && <p className="hint">Table lists the first 100 displayed points.</p>}</details>;
}

function Graphic({ type, data, xLabel, yLabel, xKind, title, description }: { type: ChartType; data: Plot; xLabel: string; yLabel: string; xKind: "numeric" | "categorical" | "date"; title: string; description: string }) {
  const width = 760;
  const height = type === "heatmap" ? Math.max(300, Math.min(680, 140 + (data.heatmap?.columns.length ?? 0) * 42)) : 390;
  const left = type === "heatmap" ? 150 : 64;
  const right = 22;
  const top = type === "heatmap" ? 74 : 26;
  const bottom = type === "heatmap" ? 20 : 70;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const axisX = (value: number) => type === "line" && xKind === "date" ? new Date(value).toISOString().slice(0, 10) : fmt(value);
  const axis = <g className="chart-axis"><line x1={left} y1={top} x2={left} y2={height - bottom} /><line x1={left} y1={height - bottom} x2={width - right} y2={height - bottom} /></g>;
  let content: ReactNode = null;

  if (type === "histogram" && data.bins?.length) {
    const max = Math.max(...data.bins.map((bin) => bin.count), 1);
    const bw = plotWidth / data.bins.length;
    content = <>{axis}{data.bins.map((bin, i) => {
      const h = bin.count / max * plotHeight; const x = left + i * bw + 1;
      return <g key={i}><rect className="chart-bar" x={x} y={top + plotHeight - h} width={Math.max(1, bw - 2)} height={h}><title>{fmt(bin.start) + " to " + fmt(bin.end) + ": " + bin.count}</title></rect>{(i === 0 || i === data.bins!.length - 1) && <text className="chart-tick" x={x + bw / 2} y={height - bottom + 20} textAnchor="middle">{fmt(i === 0 ? bin.start : bin.end)}</text>}</g>;
    })}<text className="chart-axis-label" x={left + plotWidth / 2} y={height - 16} textAnchor="middle">{xLabel}</text><text className="chart-axis-label" transform={"translate(17 " + (top + plotHeight / 2) + ") rotate(-90)"} textAnchor="middle">Count · {yLabel}</text></>;
  } else if (type === "bar" && data.bars?.length) {
    const max = Math.max(...data.bars.map((bar) => bar.count), 1); const bw = plotWidth / data.bars.length;
    content = <>{axis}{data.bars.map((bar, i) => {
      const h = bar.count / max * plotHeight; const x = left + i * bw + 4;
      return <g key={bar.label + i}><rect className="chart-bar" x={x} y={top + plotHeight - h} width={Math.max(1, bw - 8)} height={h}><title>{bar.label + ": " + bar.count}</title></rect><text className="chart-tick" transform={"translate(" + (x + bw / 2) + " " + (height - bottom + 16) + ") rotate(38)"} textAnchor="start"><title>{bar.label}</title>{short(bar.label, 16)}</text></g>;
    })}<text className="chart-axis-label" x={left + plotWidth / 2} y={height - 12} textAnchor="middle">{xLabel}</text><text className="chart-axis-label" transform={"translate(17 " + (top + plotHeight / 2) + ") rotate(-90)"} textAnchor="middle">Count · {yLabel}</text></>;
  } else if ((type === "line" || type === "scatter") && data.points?.length) {
    const xs = data.points.map((point) => point.x); const ys = data.points.map((point) => point.y);
    let minX = Math.min(...xs); let maxX = Math.max(...xs); let minY = Math.min(...ys); let maxY = Math.max(...ys);
    if (minX === maxX) { minX -= 1; maxX += 1; } if (minY === maxY) { const pad = Math.max(1, Math.abs(minY) * 0.05); minY -= pad; maxY += pad; }
    const sx = (value: number) => left + (value - minX) / (maxX - minX) * plotWidth;
    const sy = (value: number) => top + plotHeight - (value - minY) / (maxY - minY) * plotHeight;
    content = <>{axis}<text className="chart-tick" x={left} y={height - bottom + 20}>{axisX(minX)}</text><text className="chart-tick" x={left + plotWidth} y={height - bottom + 20} textAnchor="end">{axisX(maxX)}</text><text className="chart-tick" x={left - 8} y={top + 4} textAnchor="end">{fmt(maxY)}</text><text className="chart-tick" x={left - 8} y={top + plotHeight} textAnchor="end">{fmt(minY)}</text>{type === "line" && <polyline className="chart-line" points={data.points.map((point) => sx(point.x) + "," + sy(point.y)).join(" ")} />}{data.points.map((point, i) => <circle className="chart-point" key={i} cx={sx(point.x)} cy={sy(point.y)} r={type === "line" ? 3 : 4}><title>{(point.label ?? "Point " + (i + 1)) + ": " + (type === "line" && xKind === "date" ? point.label ?? axisX(point.x) : fmt(point.x)) + ", " + fmt(point.y)}</title></circle>)}<text className="chart-axis-label" x={left + plotWidth / 2} y={height - 14} textAnchor="middle">{xLabel}</text><text className="chart-axis-label" transform={"translate(17 " + (top + plotHeight / 2) + ") rotate(-90)"} textAnchor="middle">{yLabel}</text></>;
  } else if (type === "box" && data.box) {
    const values = [data.box.min, data.box.max, ...data.box.outliers]; let min = Math.min(...values); let max = Math.max(...values);
    if (min === max) { const pad = Math.max(1, Math.abs(min) * 0.05); min -= pad; max += pad; }
    const sx = (value: number) => left + (value - min) / (max - min) * plotWidth; const cy = top + plotHeight / 2;
    content = <>{axis}<line className="chart-whisker" x1={sx(data.box.lowerWhisker)} x2={sx(data.box.upperWhisker)} y1={cy} y2={cy} /><line className="chart-whisker" x1={sx(data.box.lowerWhisker)} x2={sx(data.box.lowerWhisker)} y1={cy - 18} y2={cy + 18} /><line className="chart-whisker" x1={sx(data.box.upperWhisker)} x2={sx(data.box.upperWhisker)} y1={cy - 18} y2={cy + 18} /><rect className="chart-box" x={sx(data.box.q1)} y={cy - 38} width={Math.max(2, sx(data.box.q3) - sx(data.box.q1))} height={76} /><line className="chart-median" x1={sx(data.box.median)} x2={sx(data.box.median)} y1={cy - 38} y2={cy + 38} />{data.box.outliers.map((value, i) => <circle className="chart-outlier" key={i} cx={sx(value)} cy={cy} r={5}><title>{"Outlier: " + fmt(value)}</title></circle>)}<text className="chart-tick" x={left} y={height - bottom + 20}>{fmt(min)}</text><text className="chart-tick" x={left + plotWidth} y={height - bottom + 20} textAnchor="end">{fmt(max)}</text><text className="chart-axis-label" x={left + plotWidth / 2} y={height - 14} textAnchor="middle">{xLabel}</text><text className="chart-axis-label" transform={"translate(17 " + (top + plotHeight / 2) + ") rotate(-90)"} textAnchor="middle">{yLabel}</text></>;
  } else if (type === "heatmap" && data.heatmap?.columns.length) {
    const m = data.heatmap; const cell = Math.min(42, (height - 108) / m.columns.length, (plotWidth - 10) / m.columns.length);
    content = <>{m.columns.map((name, i) => <g key={"label-" + name}><text className="chart-tick" x={left + i * cell + cell / 2} y={top - 14} textAnchor="middle" transform={"rotate(-45 " + (left + i * cell + cell / 2) + " " + (top - 14) + ")"}>{short(name, 12)}</text><text className="chart-tick" x={left - 10} y={top + i * cell + cell / 2 + 4} textAnchor="end">{short(name, 20)}</text></g>)}{m.matrix.flatMap((row, r) => row.map((entry, c) => <g key={r + "-" + c}><rect x={left + c * cell} y={top + r * cell} width={cell - 2} height={cell - 2} fill={colorFor(entry.value)} stroke="var(--chart-grid)" rx="3"><title>{m.columns[r] + " × " + m.columns[c] + ": " + (entry.value === null ? "unavailable" : fmt(entry.value)) + "; n=" + entry.count}</title></rect><text className="heatmap-value" x={left + c * cell + cell / 2} y={top + r * cell + cell / 2 + 4} textAnchor="middle">{entry.value === null ? "—" : entry.value.toFixed(2)}</text></g>))}</>;
  }

  return <div className="chart-visual-frame">{content ? <svg className="chart-visual" viewBox={"0 0 " + width + " " + height} role="img" aria-label={title + ". " + description}><title>{title}</title><desc>{description}</desc>{content}</svg> : <div className="chart-empty" role="status">No valid chart values are available. Choose compatible columns or another chart.</div>}</div>;
}

export function DataVisualizationWorkspace({ file, overview, cleaning, cleanedCsv }: Props) {
  const dataset = obj(overview?.dataset); const sourceRows = useMemo(() => normalizeRecords(overview?.preview), [overview]); const cleanRows = useMemo(() => normalizeRecords(cleaning?.preview), [cleaning]);
  const canSelectCleaned = !!cleanedCsv && !!cleaning && cleanRows.length > 0;
  const [version, setVersion] = useState<Version>("source");
  const [choice, setChoice] = useState<Choice>({ type: "histogram", x: "", y: "" });
  const [binCount, setBinCount] = useState(10); const [heatColumns, setHeatColumns] = useState<string[]>([]);
  useEffect(() => { if (!canSelectCleaned && version === "cleaned") setVersion("source"); }, [canSelectCleaned, version]);
  const selection = selectVisualizationRows(version, sourceRows, cleanRows, canSelectCleaned);
  const rows = selection.rows;
  const profiles = Array.isArray(overview?.columns) ? overview.columns : [];
  const kinds = useMemo(() => inferColumnKinds(profiles, rows), [profiles, rows]);
  const summaries = version === "source" && Array.isArray(overview?.visualization_summaries) ? overview.visualization_summaries : [];
  const capabilities = useMemo(() => getVisualizationCapabilities(kinds, rows, summaries), [kinds, rows, summaries]);
  const numeric = capabilities.heatmap;
  const kindFor = (name: string): "numeric" | "categorical" | "date" => kinds.find((item) => item.name === name)?.kind ?? "categorical";
  useEffect(() => {
    const isReady: Record<ChartType, boolean> = {
      histogram: capabilities.histogram.length > 0, bar: capabilities.bar.length > 0,
      line: capabilities.lineX.some((x) => capabilities.lineY.some((y) => y !== x)),
      scatter: capabilities.scatter.length > 1, box: capabilities.box.length > 0,
      heatmap: numeric.length > 1,
    };
    const fallback: ChartType = capabilities.histogram.length ? "histogram" :
      capabilities.bar.length ? "bar" :
      isReady.line ? "line" : isReady.scatter ? "scatter" :
      capabilities.box.length ? "box" : "heatmap";
    setChoice((old) => {
      const type = isReady[old.type] ? old.type : fallback;
      const xOptions = type === "histogram" ? capabilities.histogram :
        type === "bar" ? capabilities.bar : type === "box" ? capabilities.box :
        type === "heatmap" ? numeric : type === "line" ? capabilities.lineX : capabilities.scatter;
      const yOptions = type === "line" ? capabilities.lineY.filter((name) => name !== (xOptions.includes(old.x) ? old.x : xOptions[0])) :
        type === "scatter" ? capabilities.scatter.filter((name) => name !== (xOptions.includes(old.x) ? old.x : xOptions[0])) : [];
      const x = xOptions.includes(old.x) ? old.x : xOptions[0] ?? "";
      const y = yOptions.includes(old.y) ? old.y : yOptions[0] ?? "";
      return { type, x, y };
    });
    setHeatColumns((old) => {
      const kept = old.filter((name) => numeric.includes(name));
      return kept.length >= 2 ? kept : numeric.slice(0, Math.min(5, numeric.length));
    });
  }, [capabilities, numeric]);

  const summaryValue = version === "source" ? getApiChartSummary(summaries, choice.type, choice.x) : null;
  const plot = useMemo<Plot>(() => {
    const records = rows as Row[];
    if (choice.type === "histogram" && summaryValue) {
      const bins = Array.isArray(summaryValue.bins) ? summaryValue.bins.flatMap((item) => {
        const bin = obj(item); const start = number(bin.start); const end = number(bin.end); const count = number(bin.count);
        return start === null || end === null || count === null || count < 0 ? [] : [{ start, end, count }];
      }) : [];
      if (bins.length) return { bins };
    }
    if (choice.type === "bar" && summaryValue) {
      const vals = Array.isArray(summaryValue.values) ? summaryValue.values.flatMap((item) => {
        const entry = obj(item); const count = number(entry.count);
        return typeof entry.label === "string" && count !== null && count >= 0 ? [{ label: entry.label, count }] : [];
      }) : [];
      const total = number(obj(overview?.overview).row_count) ?? vals.reduce((sum, item) => sum + item.count, 0);
      const rest = Math.max(0, total - vals.reduce((sum, item) => sum + item.count, 0));
      return { bars: rest ? [...vals, { label: "Other categories", count: rest }] : vals };
    }
    if (choice.type === "histogram") return { bins: makeHistogram(records, choice.x, binCount).bins };
    if (choice.type === "bar") return { bars: makeBarCounts(records, choice.x).values };
    if (choice.type === "line") return { points: makeLineSeries(records, choice.x, choice.y, kindFor(choice.x)).points.map((p) => ({ x: p.x, y: p.y, label: p.label })) };
    if (choice.type === "scatter") return { points: makeScatterPoints(records, choice.x, choice.y).points };
    if (choice.type === "box") {
      const b = makeBoxSummary(records, choice.x);
      return b.empty ? {} : { box: { min: b.min!, q1: b.q1!, median: b.median!, q3: b.q3!, max: b.max!, lowerWhisker: b.lowerWhisker!, upperWhisker: b.upperWhisker!, outliers: b.outliers ?? [] } };
    }
    if (choice.type === "heatmap") { const h = makeCorrelationMatrix(records, heatColumns); return { heatmap: { columns: h.columns, matrix: h.matrix } }; }
    return {};
  }, [rows, choice, summaryValue, overview, binCount, heatColumns, kinds]);

  const hasDataset = !!file && !!overview;
  const fileName = version === "cleaned" ? (cleanedCsv?.filename ?? "Cleaned CSV") : String(dataset.filename ?? file?.name ?? "Source dataset");
  const totalRows = version === "source" ? number(obj(overview?.overview).row_count) : number(obj(obj(cleaning?.report).after).rows);
  const fullPreview = totalRows !== null && rows.length >= totalRows;
  const coverage = fullPreview ? "All " + rows.length.toLocaleString() + " rows returned in the inspection preview" : "First " + rows.length.toLocaleString() + " of " + (totalRows?.toLocaleString() ?? "unknown") + " rows returned by the API";
  const title = typeLabel(choice.type) + (choice.x ? " · " + choice.x : "") + ((choice.type === "line" || choice.type === "scatter") && choice.y ? " vs " + choice.y : "");
  const desc = explanations[choice.type] + " " + summary(plot, choice.type);
  const chartReady: Record<ChartType, boolean> = {
    histogram: capabilities.histogram.length > 0, bar: capabilities.bar.length > 0,
    line: capabilities.lineX.some((x) => capabilities.lineY.some((y) => y !== x)),
    scatter: capabilities.scatter.length > 1 && capabilities.hasRows,
    box: capabilities.box.length > 0 && capabilities.hasRows,
    heatmap: numeric.length >= 2 && capabilities.hasRows,
  };
  const availableSummary = choice.type === "histogram" ? !!plot.bins?.length && !!summaryValue : choice.type === "bar" ? !!plot.bars?.length && !!summaryValue : false;
  const rowCount = rows.length;
  const isColumnConstant = (name: string) => {
    const profile = profiles.find((item) => obj(item).name === name);
    const numeric = obj(obj(profile).numeric_summary);
    const profileMin = number(numeric.min);
    const profileMax = number(numeric.max);
    if (version === "source" && profileMin !== null && profileMax !== null) return profileMin === profileMax;
    const values = rows.map((row) => number(obj(row)[name])).filter((value): value is number => value !== null);
    return values.length > 0 && values.every((value) => value === values[0]);
  };
  const constantNames = (choice.type === "scatter" ? [choice.x, choice.y] : [choice.x])
    .filter((name) => name && kindFor(name) === "numeric" && isColumnConstant(name));
  const excluded = choice.type === "line" ? makeLineSeries(rows, choice.x, choice.y, kindFor(choice.x)).dropped :
    choice.type === "scatter" ? makeScatterPoints(rows, choice.x, choice.y).dropped :
    choice.type === "histogram" && !availableSummary ? makeHistogram(rows, choice.x, binCount).dropped :
    choice.type === "box" ? makeBoxSummary(rows, choice.x).dropped : 0;
  const selector = (label: string, value: string, values: string[], update: (next: string) => void) => <label className="visualization-field">{label}<select value={value} onChange={(event) => update(event.target.value)} disabled={!values.length}>{values.length ? values.map((name) => <option value={name} key={name}>{name}</option>) : <option value="">No compatible columns</option>}</select></label>;
  const setType = (type: ChartType) => {
    const x = type === "histogram" ? capabilities.histogram[0] ?? "" : type === "bar" ? capabilities.bar[0] ?? "" :
      type === "box" ? capabilities.box[0] ?? "" : type === "heatmap" ? numeric[0] ?? "" :
      type === "line" ? capabilities.lineX[0] ?? "" : capabilities.scatter[0] ?? "";
    const y = type === "line" ? capabilities.lineY.find((name) => name !== x) ?? "" : type === "scatter" ? capabilities.scatter.find((name) => name !== x) ?? "" : "";
    setChoice({ type, x, y });
  };
  const toggleHeat = (name: string) => setHeatColumns((old) => old.includes(name) ? old.filter((v) => v !== name) : old.length < 12 ? [...old, name] : old);

  return <div className="shell visualization-workspace">
    <section className="hero"><div className="eyebrow">NUMPA · DATA VISUALIZATION</div><h1>Explore your <span>data.</span></h1><p>Build charts from the active dataset. Charts identify when they use limited API previews.</p></section>
    {!hasDataset ? <section className="panel"><div className="empty-state"><div className="empty-graphic" aria-hidden="true">▥</div><h2>No active inspected dataset</h2><p>Return to Data Analysis and inspect a dataset first. This workspace uses the existing in-memory context.</p></div></section> : <>
      <section className="panel visualization-context"><div><p className="eyebrow">DATASET VERSION</p><h2>{fileName}</h2><p>{version === "cleaned" ? "Separate cleaned CSV output · source remains unchanged" : String(dataset.format ?? "dataset").toUpperCase() + " · source upload"}</p></div>{canSelectCleaned && <label className="visualization-field version-select">Visualize<select value={version} onChange={(event) => setVersion(event.target.value as Version)}><option value="source">{String(dataset.filename ?? file?.name ?? "Source dataset")} · source</option><option value="cleaned">{cleanedCsv?.filename} · cleaned CSV</option></select></label>}</section>
      <div className="visualization-layout">
        <section className="panel visualization-controls" aria-labelledby="visual-controls-title"><div className="panel-head"><div className="panel-icon" aria-hidden="true">☷</div><div><h2 id="visual-controls-title">Chart setup</h2><p>Choose a chart supported by the current column types.</p></div></div><div className="panel-body">
          <label className="visualization-field">Chart type<select value={choice.type} onChange={(event) => setType(event.target.value as ChartType)}>{options.map((item) => <option key={item.value} value={item.value} disabled={!chartReady[item.value]}>{item.label + (chartReady[item.value] ? "" : " · unavailable for these data")}</option>)}</select></label>
          {choice.type === "histogram" && <>{selector("Numeric column", choice.x, capabilities.histogram, (x) => setChoice((old) => ({ ...old, x })))}<label className="visualization-field">Bins for preview values<select value={binCount} onChange={(event) => setBinCount(Number(event.target.value))}><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option></select></label></>}
          {choice.type === "bar" && selector("Category column", choice.x, capabilities.bar, (x) => setChoice((old) => ({ ...old, x })))}
          {choice.type === "line" && <>{selector("Ordered x column", choice.x, capabilities.lineX, (x) => setChoice((old) => ({ ...old, x, y: old.y !== x ? old.y : capabilities.lineY.find((name) => name !== x) ?? "" })))}{selector("Numeric y column", choice.y, capabilities.lineY.filter((name) => name !== choice.x), (y) => setChoice((old) => ({ ...old, y })))}</>}
          {choice.type === "scatter" && <>{selector("Numeric x column", choice.x, capabilities.scatter, (x) => setChoice((old) => ({ ...old, x, y: old.y !== x ? old.y : capabilities.scatter.find((name) => name !== x) ?? "" })))}{selector("Numeric y column", choice.y, capabilities.scatter.filter((name) => name !== choice.x), (y) => setChoice((old) => ({ ...old, y })))}</>}
          {choice.type === "box" && selector("Numeric column", choice.x, capabilities.box, (x) => setChoice((old) => ({ ...old, x })))}
          {choice.type === "heatmap" && <fieldset className="heatmap-columns"><legend>Numeric columns · choose 2–12</legend>{numeric.length ? numeric.slice(0, 12).map((name) => <label key={name}><input type="checkbox" checked={heatColumns.includes(name)} onChange={() => toggleHeat(name)} />{name}</label>) : <p>No numeric columns with valid preview values.</p>}{heatColumns.length < 2 && <small>Select at least two numeric columns.</small>}</fieldset>}
          <p className="visualization-explanation">{explanations[choice.type]}</p>
        </div></section>
        <section className="panel visualization-result" aria-labelledby="visual-result-title"><div className="panel-head"><div className="panel-icon" aria-hidden="true">▥</div><div><h2 id="visual-result-title">Chart canvas</h2><p>{title}</p></div></div><div className="panel-body">
          {!rowCount && !plot.bins?.length && !plot.bars?.length ? <div className="chart-empty" role="status">The API returned no usable rows or chart summary for this dataset version.</div> :
          choice.type === "heatmap" && heatColumns.length < 2 ? <div className="chart-empty" role="status">Select at least two numeric columns to calculate pairwise correlations.</div> : <>
            <Graphic type={choice.type} data={plot} xLabel={choice.x} yLabel={choice.type === "histogram" || choice.type === "bar" ? "Records" : choice.type === "box" ? "" : choice.y || "Correlation"} xKind={kindFor(choice.x)} title={title} description={desc} />
            <p className="chart-summary" role="status">{desc}</p>
            <div className="visualization-disclosure"><strong>Data coverage:</strong> {availableSummary ? "Full-dataset summary returned by NUMPA API. " + summary(plot, choice.type) : coverage + "; preview-based charts do not represent unseen rows."}{excluded > 0 ? " " + excluded + " rows with missing or non-finite chart values were excluded." : ""}{choice.type === "bar" && plot.bars?.some((bar) => bar.label === "Other categories") ? " Category values outside the displayed groups are aggregated as Other categories." : ""}{choice.type === "bar" && plot.bars?.some((bar) => bar.label === "(missing)") ? " Missing category values are shown as (missing)." : ""}{constantNames.length ? " Constant numeric column(s) have no variation in available values: " + constantNames.join(", ") + "." : ""}{choice.type === "line" ? " Points are ordered ascending by " + (kindFor(choice.x) === "date" ? "ISO date/time" : "numeric x") + "." : ""}{choice.type === "heatmap" ? " Pearson correlation uses pairwise-complete numeric values; fewer than two pairs and zero-variance pairs are unavailable." : ""}</div>
            <DataTable data={plot} type={choice.type} xKind={kindFor(choice.x)} />
          </>}
        </div></section>
      </div>
    </>}
    <footer className="footer"><span><strong>NUMPA</strong> · Data Visualization</span><span>Charts use actual preview rows or verified API summaries; no demo values.</span></footer>
  </div>;
}
