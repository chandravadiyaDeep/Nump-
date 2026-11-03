"use client";

import { useState } from "react";
import type { AuthAccountState } from "./auth-nav";
import {
  API_ACCESS_CONFIG,
  COMMERCIAL_PLAN_TIERS,
  INTEGRATION_CATALOG,
  getAccountMessage,
  getApiAccessDetails,
  getPlanDetails,
  getUsageMessage,
} from "./workspace-settings-model.mjs";

type Theme = "light" | "dark";
type SettingsSection = "General" | "Integrations" | "API Access" | "Usage & Plan";
type Props = { account: AuthAccountState; theme: Theme; onThemeChange: (theme: Theme) => boolean };

export function SettingsWorkspace({ account, theme, onThemeChange }: Props) {
  const [subsection, setSubsection] = useState<SettingsSection>("General");
  const [themeMessage, setThemeMessage] = useState("");

  const apiDetails = getApiAccessDetails();
  const planDetails = getPlanDetails();

  function selectTheme(nextTheme: Theme) {
    const saved = onThemeChange(nextTheme);
    setThemeMessage(
      saved
        ? "Appearance changed to " + nextTheme + "; this browser preference was saved."
        : "Appearance changed to " + nextTheme + " for this session. Browser preference storage is unavailable."
    );
  }

  return (
    <div className="shell support-workspace settings-workspace">
      <section className="hero">
        <div className="eyebrow">NUMPA · SETTINGS</div>
        <h1>Workspace <span>settings.</span></h1>
        <p>Account, appearance, API access, and commercial plan configurations available in this workspace.</p>
      </section>

      <nav className="settings-subnav" aria-label="Settings sections">
        {(["General", "Integrations", "API Access", "Usage & Plan"] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={subsection === item ? "is-active" : ""}
            aria-current={subsection === item ? "page" : undefined}
            onClick={() => setSubsection(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      {subsection === "General" && (
        <div className="settings-grid">
          <section className="panel settings-card" aria-labelledby="settings-account-title">
            <div className="panel-head">
              <div className="panel-icon" aria-hidden="true">◎</div>
              <div>
                <h2 id="settings-account-title">Account</h2>
                <p>Information returned by the existing authentication session.</p>
              </div>
            </div>
            <div className="panel-body">
              <p className="settings-account-value" aria-live="polite">{getAccountMessage(account)}</p>
              {account.status === "signed-out" && <a className="settings-link" href="/login">Sign in</a>}
              <p className="hint">Only the session email is shown. Profile editing, password changes, and account deletion are managed through Supabase.</p>
            </div>
          </section>

          <section className="panel settings-card" aria-labelledby="settings-appearance-title">
            <div className="panel-head">
              <div className="panel-icon" aria-hidden="true">◐</div>
              <div>
                <h2 id="settings-appearance-title">Appearance</h2>
                <p>Choose the workspace theme.</p>
              </div>
            </div>
            <div className="panel-body">
              <fieldset className="settings-theme-options">
                <legend>Theme</legend>
                <label>
                  <input type="radio" name="workspace-theme" value="light" checked={theme === "light"} onChange={() => selectTheme("light")} /> Light
                </label>
                <label>
                  <input type="radio" name="workspace-theme" value="dark" checked={theme === "dark"} onChange={() => selectTheme("dark")} /> Dark
                </label>
              </fieldset>
              <p className="hint">Light is the default. Theme preference uses the existing numpa-theme browser setting and does not store dataset or account data.</p>
              {themeMessage && <p className="support-status" role="status">{themeMessage}</p>}
            </div>
          </section>

          <section className="panel settings-card" aria-labelledby="settings-privacy-title">
            <div className="panel-head">
              <div className="panel-icon" aria-hidden="true">◇</div>
              <div>
                <h2 id="settings-privacy-title">Privacy and data lifecycle</h2>
                <p>Current dataset lifecycle guarantees.</p>
              </div>
            </div>
            <div className="panel-body">
              <p>Uploaded datasets and derived results are held strictly in browser memory for the active session and streamed to the processing API when required. They are not stored on disk or written to a database.</p>
              <p className="hint">Refreshing or closing the browser cleanly discards all in-memory data.</p>
            </div>
          </section>

          <section className="panel settings-card" aria-labelledby="settings-support-title">
            <div className="panel-head">
              <div className="panel-icon" aria-hidden="true">?</div>
              <div>
                <h2 id="settings-support-title">Help and documentation</h2>
                <p>Operational guides and technical references.</p>
              </div>
            </div>
            <div className="panel-body">
              <p>Documentation for data profiling, smart cleaning, ML readiness, and API integrations is available in the repository documentation directory.</p>
              <p className="hint">Official support channels and SLAs will activate with commercial plans.</p>
            </div>
          </section>
        </div>
      )}

      {subsection === "Integrations" && (
        <section className="panel" aria-labelledby="settings-integrations-title">
          <div className="panel-head">
            <div className="panel-icon" aria-hidden="true">⛓</div>
            <div>
              <h2 id="settings-integrations-title">Integrations Catalogue</h2>
              <p>Roadmap catalogue of planned third-party connectors and API integrations.</p>
            </div>
          </div>
          <div className="panel-body">
            <div className="integration-grid">
              {INTEGRATION_CATALOG.map((item) => (
                <article className="integration-card" key={item.name}>
                  <div className="integration-card-heading">
                    <h3>{item.name}</h3>
                    <span className="planned-badge">Planned · not connected</span>
                  </div>
                  <p>{item.value}</p>
                  <p className="hint">{item.stage}</p>
                </article>
              ))}
            </div>
            <p className="hint" style={{ marginTop: "16px" }}>
              No OAuth flows or external credentials are connected in this workspace. All connectors remain planned until external verification is completed.
            </p>
          </div>
        </section>
      )}

      {subsection === "API Access" && (
        <div className="settings-grid">
          <section className="panel settings-card" aria-labelledby="settings-api-status-title">
            <div className="panel-head">
              <div className="panel-icon" aria-hidden="true">λ</div>
              <div>
                <h2 id="settings-api-status-title">Developer API Access</h2>
                <p>Programmatic access to NUMPA dataset operations.</p>
              </div>
            </div>
            <div className="panel-body">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <strong>Status:</strong>
                <span className="planned-badge">{apiDetails.statusBadge}</span>
              </div>
              <p className="support-notice">{apiDetails.message}</p>
              <div style={{ marginTop: "14px", display: "grid", gap: "8px" }}>
                <div><strong>Base URL:</strong> <code>{apiDetails.baseUrl}</code></div>
                <div><strong>Authentication:</strong> <code>{apiDetails.authScheme}</code></div>
                <div><strong>Specification:</strong> <code>{API_ACCESS_CONFIG.documentation}</code></div>
              </div>
              <p className="hint" style={{ marginTop: "14px" }}>
                To maintain production security, API keys are not generated on the client. Keys will be provisioned once the server-side API key management migration is reviewed and approved.
              </p>
            </div>
          </section>

          <section className="panel settings-card" aria-labelledby="settings-api-endpoints-title">
            <div className="panel-head">
              <div className="panel-icon" aria-hidden="true">⌥</div>
              <div>
                <h2 id="settings-api-endpoints-title">Supported Public Endpoints</h2>
                <p>Available tabular processing endpoints.</p>
              </div>
            </div>
            <div className="panel-body">
              <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: "1.7", fontSize: "0.85rem" }}>
                <li><code>GET /api/v1/health</code> — Service health check</li>
                <li><code>POST /api/v1/datasets/inspect</code> — In-memory tabular profiling</li>
                <li><code>POST /api/v1/cleaning/preview</code> — Heuristic cleaning preview & report</li>
                <li><code>POST /api/v1/cleaning/execute</code> — Execute cleaning and export CSV</li>
                <li><code>POST /api/v1/ml-readiness/score</code> — Calculate 4-dimension ML readiness</li>
                <li><code>POST /api/v1/ml-labs/compare</code> — Scikit-learn estimator benchmarking</li>
              </ul>
              <p className="hint" style={{ marginTop: "14px" }}>
                All endpoints operate statelessly with a 50 MB maximum payload constraint and zero raw-data persistence.
              </p>
            </div>
          </section>
        </div>
      )}

      {subsection === "Usage & Plan" && (
        <div style={{ display: "grid", gap: "16px" }}>
          <section className="panel settings-card" aria-labelledby="settings-current-plan-title">
            <div className="panel-head">
              <div className="panel-icon" aria-hidden="true">▤</div>
              <div>
                <h2 id="settings-current-plan-title">Current Plan & Usage</h2>
                <p>Status of commercial metering and plan entitlements.</p>
              </div>
            </div>
            <div className="panel-body">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <strong>Active Tier:</strong>
                <span className="operation-state is-selected">{planDetails.currentTier}</span>
              </div>
              <p className="support-notice">{planDetails.message}</p>
              <p className="hint" style={{ marginTop: "12px" }}>
                {getUsageMessage(false)}
              </p>
            </div>
          </section>

          <section className="panel" aria-labelledby="settings-tiers-title">
            <div className="panel-head">
              <div className="panel-icon" aria-hidden="true">✦</div>
              <div>
                <h2 id="settings-tiers-title">Commercial Plan Tiers</h2>
                <p>Commercial plan catalogue (awaiting merchant payment gateway activation).</p>
              </div>
            </div>
            <div className="panel-body">
              <div className="integration-grid">
                {COMMERCIAL_PLAN_TIERS.map((tier) => (
                  <article className="integration-card" key={tier.name}>
                    <div className="integration-card-heading">
                      <h3>{tier.name}</h3>
                      <span className={tier.status.startsWith("Current") ? "operation-state is-selected" : "planned-badge"}>
                        {tier.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, margin: "6px 0", color: "var(--ws-text)" }}>
                      {tier.price}
                    </div>
                    <p>{tier.description}</p>
                    <p className="hint" style={{ marginTop: "6px" }}>{tier.limits}</p>
                  </article>
                ))}
              </div>
              <p className="hint" style={{ marginTop: "16px" }}>
                No payment processor (Stripe or Razorpay) is currently connected. Subscriptions and checkout actions are not enabled.
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
