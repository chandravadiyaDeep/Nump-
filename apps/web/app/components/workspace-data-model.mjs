function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function displayNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value.toLocaleString() : "—";
}

function isProfile(value) {
  const profile = asObject(value);
  return typeof profile.name === "string" && typeof profile.dtype === "string";
}

export function getColumnProfiles(value) {
  return Array.isArray(value) ? value.filter(isProfile) : [];
}

export function filterAndSortProfiles(profiles, query, sort) {
  const search = query.trim().toLocaleLowerCase();
  const filtered = profiles.filter((profile) =>
    !search || `${String(profile.name)} ${String(profile.dtype)}`.toLocaleLowerCase().includes(search),
  );
  return filtered.sort((left, right) => {
    if (sort === "missing") return Number(right.missing_count ?? -1) - Number(left.missing_count ?? -1);
    if (sort === "distinct") return Number(right.unique_count ?? -1) - Number(left.unique_count ?? -1);
    return String(left.name).localeCompare(String(right.name));
  });
}

export function getProfileSummary(profile) {
  const numeric = asObject(profile.numeric_summary);
  if (Object.keys(numeric).length) {
    return `Min ${displayNumber(numeric.min)} · Median ${displayNumber(numeric.median)} · Max ${displayNumber(numeric.max)}`;
  }
  const topValues = Array.isArray(profile.top_values) ? profile.top_values : [];
  if (topValues.length) {
    const top = asObject(topValues[0]);
    if (typeof top.value === "string") return `Top: ${top.value} (${displayNumber(top.count)})`;
  }
  return "Summary not returned";
}

export function getQualityObservations(overview) {
  const missing = overview.total_missing_cells;
  const duplicates = overview.duplicate_row_count;
  return [
    typeof missing === "number"
      ? { id: "missing", tone: missing ? "warning" : "ok", message: missing ? `${displayNumber(missing)} missing cells reported across the dataset.` : "No missing cells were reported by inspection." }
      : { id: "missing", tone: "neutral", message: "Missing-cell total was not returned by inspection." },
    typeof duplicates === "number"
      ? { id: "duplicates", tone: duplicates ? "warning" : "ok", message: duplicates ? `${displayNumber(duplicates)} exact duplicate rows reported.` : "No exact duplicate rows were reported." }
      : { id: "duplicates", tone: "neutral", message: "Exact duplicate count was not returned by inspection." },
  ];
}

export function selectionLabel(selected) {
  return selected ? "Selected" : "Skipped";
}
export function validateUpload(name, size) {
  const suffix = String(name).split(".").pop()?.toLowerCase() ?? "";
  if (!["csv", "json", "xlsx", "parquet", "arrow", "feather"].includes(suffix)) {
    return "Unsupported file format. Choose CSV, JSON, XLSX, Parquet, Arrow, or Feather.";
  }
  if (size > 50 * 1024 * 1024) return "This file exceeds the current 50 MB upload limit.";
  return null;
}
