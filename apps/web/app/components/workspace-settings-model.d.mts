export const HISTORY_PERSISTENCE_ENABLED: boolean;
export const INTEGRATION_CATALOG: Array<{ name: string; value: string; stage: string }>;
export function getAccountMessage(account: { status?: string; email?: string | null } | null): string;
export function getHistoryView(args?: { enabled?: boolean; records?: unknown[] | null }): { state: "unavailable" | "empty" | "records"; records: unknown[] };
export function getUsageMessage(hasUsageSource?: boolean): string;

