// No approved metadata-only history schema or RLS is available in this repository.
export const HISTORY_PERSISTENCE_ENABLED = false;
export const INTEGRATION_CATALOG = [
  { name: "NUMPA API", value: "Programmatic access to supported analysis and cleaning workflows", stage: "Commercial API phase" },
  { name: "Webhooks", value: "Notify external systems when jobs complete", stage: "After async/job architecture" },
  { name: "Zapier", value: "No-code workflow automation", stage: "After stable public API" },
  { name: "Make.com", value: "Visual automation scenarios", stage: "After stable public API" },
  { name: "n8n", value: "Self-hosted workflow automation", stage: "After stable public API" },
  { name: "Google Drive", value: "Import or export selected files", stage: "Separate connector phase" },
  { name: "GitHub", value: "Import selected repository datasets or artifacts", stage: "Separate connector phase" },
];
export function getAccountMessage(account) {
  if (account?.status === "loading") return "Checking the current sign-in session…";
  if (account?.status === "signed-in" && typeof account.email === "string" && account.email.length > 0) return account.email;
  if (account?.status === "signed-out") return "Sign in to view the account email available to this session.";
  if (account?.status === "unconfigured") return "Account details are unavailable because authentication is not configured in this environment.";
  return "Account details are temporarily unavailable.";
}
export function getHistoryView({ enabled = HISTORY_PERSISTENCE_ENABLED, records = null } = {}) {
  if (!enabled) return { state: "unavailable", records: [] };
  if (!Array.isArray(records)) return { state: "unavailable", records: [] };
  return { state: records.length ? "records" : "empty", records };
}
export function getUsageMessage(hasUsageSource = false) {
  return hasUsageSource ? "Usage details are available from the configured account source." : "Usage and plan details are not available; no metering or billing source is configured.";
}

