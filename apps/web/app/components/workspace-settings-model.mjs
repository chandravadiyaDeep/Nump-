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

export const API_ACCESS_CONFIG = {
  status: "requires-approval",
  badge: "Planned · Approval-gated",
  baseUrl: "https://numpa-api.onrender.com",
  documentation: "docs/commercial-v1/PUBLIC_API_REFERENCE.md",
  authScheme: "Authorization: Bearer <token>",
  rateLimit: "10–60 req/min depending on approved tier",
};

export const COMMERCIAL_PLAN_TIERS = [
  {
    name: "Free (Evaluation)",
    status: "Current (Evaluation)",
    price: "$0",
    description: "Full in-memory workspace access for exploratory data analysis.",
    limits: "50 MB file upload limit; unmetered in-memory session processing.",
  },
  {
    name: "Starter",
    status: "Planned",
    price: "$19/mo",
    description: "Designed for independent analysts and data science students.",
    limits: "25 MB file limit, 1 API key, 250 inspections/mo, email support.",
  },
  {
    name: "Professional",
    status: "Planned",
    price: "$79/mo",
    description: "For professional practitioners and engineering teams.",
    limits: "50 MB file limit, 5 API keys, 500 model benchmarks/mo, priority support.",
  },
  {
    name: "Enterprise",
    status: "Planned",
    price: "Custom",
    description: "For organizations requiring custom limits, SLAs, and dedicated compute.",
    limits: "250 MB+ file limit, custom rate limits, audit log retention, dedicated SLA.",
  },
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

export function getApiAccessDetails() {
  return {
    hasActiveKeys: false,
    message: "Programmatic API keys require server-side cryptographic key storage and database approval. No keys are created or stored in the browser.",
    statusBadge: API_ACCESS_CONFIG.badge,
    baseUrl: API_ACCESS_CONFIG.baseUrl,
    authScheme: API_ACCESS_CONFIG.authScheme,
  };
}

export function getPlanDetails(hasBillingSource = false) {
  return {
    currentTier: "Free (Evaluation)",
    isMetered: false,
    message: hasBillingSource ? "Plan status synchronized from billing provider." : "Billing and usage metering are not active. The application operates in unmetered evaluation mode.",
  };
}
