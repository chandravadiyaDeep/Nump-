export type ApiRecord = Record<string, unknown>;
export type ProfileSort = "name" | "missing" | "distinct";
export type QualityObservation = { id: string; tone: "warning" | "ok" | "neutral"; message: string };
export function getColumnProfiles(value: unknown): ApiRecord[];
export function filterAndSortProfiles(profiles: ApiRecord[], query: string, sort: ProfileSort): ApiRecord[];
export function getProfileSummary(profile: ApiRecord): string;
export function getQualityObservations(overview: ApiRecord): QualityObservation[];
export function selectionLabel(selected: boolean): "Selected" | "Skipped";
export function validateUpload(name: string, size: number): string | null;
