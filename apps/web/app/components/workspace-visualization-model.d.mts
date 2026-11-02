export type ChartKind = "numeric" | "categorical" | "date";
export type ChartType = "histogram" | "bar" | "line" | "scatter" | "box" | "heatmap";
export type ChartColumn = { name: string; kind: ChartKind; dtype: string };
export type ChartCapabilities = {
  histogram: string[]; bar: string[]; lineX: string[]; lineY: string[];
  scatter: string[]; box: string[]; heatmap: string[]; hasRows: boolean;
};
export function normalizeRecords(value: unknown): Record<string, unknown>[];
export function inferColumnKinds(profiles: unknown, rows: unknown): ChartColumn[];
export function makeHistogram(rows: unknown, column: string, requestedBins?: number): { bins: { start: number; end: number; count: number }[]; count: number; dropped: number; constant: boolean; empty: boolean };
export function makeBarCounts(rows: unknown, column: string, limit?: number): { values: { label: string; count: number }[]; categories: number; total: number; otherCount: number; empty: boolean };
export function makeLineSeries(rows: unknown, xColumn: string, yColumn: string, xKind: ChartKind): { points: { x: number; y: number; label: string; sourceIndex: number }[]; dropped: number; xKind: ChartKind; count: number; empty: boolean };
export function makeScatterPoints(rows: unknown, xColumn: string, yColumn: string, maxPoints?: number): { points: { x: number; y: number; sourceIndex: number }[]; validCount: number; dropped: number; sampled: boolean; empty: boolean };
export function makeBoxSummary(rows: unknown, column: string): { empty: boolean; count: number; dropped: number; min?: number; q1?: number; median?: number; q3?: number; max?: number; lowerWhisker?: number; upperWhisker?: number; outliers?: number[]; constant?: boolean };
export function makeCorrelationMatrix(rows: unknown, columns: string[]): { columns: string[]; matrix: { value: number | null; count: number }[][]; rows: number; truncatedColumns: number };
export function getApiChartSummary(summaries: unknown, type: string, column: string): Record<string, unknown> | null;
export function getVisualizationCapabilities(kinds: ChartColumn[], rows: unknown, summaries?: unknown): ChartCapabilities;
export function chooseDefaultChart(capabilities: ChartCapabilities): { type: ChartType; x: string; y: string };
export function selectVisualizationRows(version: "source" | "cleaned", sourceRows: unknown, cleanedRows: unknown, cleanedAvailable: boolean): { version: "source" | "cleaned"; rows: Record<string, unknown>[] };
