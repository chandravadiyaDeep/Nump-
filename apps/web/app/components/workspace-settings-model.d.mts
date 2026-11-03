export const HISTORY_PERSISTENCE_ENABLED: boolean;
export const INTEGRATION_CATALOG: Array<{ name: string; value: string; stage: string }>;
export const API_ACCESS_CONFIG: {
  status: string;
  badge: string;
  baseUrl: string;
  documentation: string;
  authScheme: string;
  rateLimit: string;
};
export const COMMERCIAL_PLAN_TIERS: Array<{
  name: string;
  status: string;
  price: string;
  description: string;
  limits: string;
}>;

export function getAccountMessage(account: { status?: string; email?: string | null } | null): string;
export function getHistoryView(args?: { enabled?: boolean; records?: unknown[] | null }): { state: "unavailable" | "empty" | "records"; records: unknown[] };
export function getUsageMessage(hasUsageSource?: boolean): string;
export function getApiAccessDetails(): {
  hasActiveKeys: boolean;
  message: string;
  statusBadge: string;
  baseUrl: string;
  authScheme: string;
};
export function getPlanDetails(hasBillingSource?: boolean): {
  currentTier: string;
  isMetered: boolean;
  message: string;
};
