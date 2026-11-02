"use client";

import { useState } from "react";
import type { AuthAccountState } from "./auth-nav";
import { INTEGRATION_CATALOG, getAccountMessage, getUsageMessage } from "./workspace-settings-model.mjs";

type Theme = "light" | "dark";
type Props = { account: AuthAccountState; theme: Theme; onThemeChange: (theme: Theme) => boolean };

export function SettingsWorkspace({ account, theme, onThemeChange }: Props) {
  const [subsection, setSubsection] = useState<"General" | "Integrations">("General");
  const [themeMessage, setThemeMessage] = useState("");
  function selectTheme(nextTheme: Theme) {
    const saved = onThemeChange(nextTheme);
    setThemeMessage(saved ? "Appearance changed to " + nextTheme + "; this browser preference was saved." : "Appearance changed to " + nextTheme + " for this session. Browser preference storage is unavailable.");
  }
  return (
    <div className="shell support-workspace settings-workspace">
      <section className="hero">
        <div className="eyebrow">NUMPA · SETTINGS</div>
        <h1>Workspace <span>settings.</span></h1>
        <p>Account and appearance information from the capabilities currently available in this workspace.</p>
      </section>
      <nav className="settings-subnav" aria-label="Settings sections">
        {(["General", "Integrations"] as const).map((item) => <button key={item} type="button" className={subsection === item ? "is-active" : ""} aria-current={subsection === item ? "page" : undefined} onClick={() => setSubsection(item)}>{item}</button>)}
      </nav>
      {subsection === "General" ? <div className="settings-grid">
        <section className="panel settings-card" aria-labelledby="settings-account-title">
          <div className="panel-head"><div className="panel-icon" aria-hidden="true">◎</div><div><h2 id="settings-account-title">Account</h2><p>Information returned by the existing authentication session.</p></div></div>
          <div className="panel-body"><p className="settings-account-value" aria-live="polite">{getAccountMessage(account)}</p>{account.status === "signed-out" && <a className="settings-link" href="/login">Sign in</a>}<p className="hint">Only the session email is shown. Profile editing, email changes, password changes and account deletion are not available here.</p></div>
        </section>
        <section className="panel settings-card" aria-labelledby="settings-appearance-title">
          <div className="panel-head"><div className="panel-icon" aria-hidden="true">◐</div><div><h2 id="settings-appearance-title">Appearance</h2><p>Choose the workspace theme.</p></div></div>
          <div className="panel-body">
            <fieldset className="settings-theme-options"><legend>Theme</legend>
              <label><input type="radio" name="workspace-theme" value="light" checked={theme === "light"} onChange={() => selectTheme("light")} /> Light</label>
              <label><input type="radio" name="workspace-theme" value="dark" checked={theme === "dark"} onChange={() => selectTheme("dark")} /> Dark</label>
            </fieldset>
            <p className="hint">Light is the default. Theme preference uses the existing numpa-theme browser setting and does not store dataset or account data.</p>
            {themeMessage && <p className="support-status" role="status">{themeMessage}</p>}
          </div>
        </section>
        <section className="panel settings-card" aria-labelledby="settings-usage-title">
          <div className="panel-head"><div className="panel-icon" aria-hidden="true">▤</div><div><h2 id="settings-usage-title">Usage and plan</h2><p>Usage and billing are not enabled in this workspace.</p></div></div>
          <div className="panel-body"><p className="support-notice" role="status">{getUsageMessage()}</p><p className="hint">No quotas, subscription state or billing details are being reported.</p></div>
        </section>
        <section className="panel settings-card" aria-labelledby="settings-privacy-title">
          <div className="panel-head"><div className="panel-icon" aria-hidden="true">◇</div><div><h2 id="settings-privacy-title">Privacy and data</h2><p>Current dataset lifecycle.</p></div></div>
          <div className="panel-body"><p>Uploaded datasets and derived results are held in browser memory for the active session and sent to the existing processing API when an operation needs it. They are not saved to a history store by this workspace.</p><p className="hint">This page does not offer cloud deletion or export controls because no corresponding operation is implemented here. Refreshing or closing the browser can discard active in-memory data.</p></div>
        </section>
        <section className="panel settings-card" aria-labelledby="settings-support-title">
          <div className="panel-head"><div className="panel-icon" aria-hidden="true">?</div><div><h2 id="settings-support-title">Help and support</h2><p>No verified support destination is configured.</p></div></div>
          <div className="panel-body"><p className="hint">This workspace does not display an unverified email address or documentation link.</p></div>
        </section>
      </div> : <section className="panel" aria-labelledby="settings-integrations-title">
        <div className="panel-head"><div className="panel-icon" aria-hidden="true">⛓</div><div><h2 id="settings-integrations-title">Integrations</h2><p>Roadmap catalogue. No external accounts are connected.</p></div></div>
        <div className="panel-body"><div className="integration-grid">
          {INTEGRATION_CATALOG.map((item) => <article className="integration-card" key={item.name}>
            <div className="integration-card-heading"><h3>{item.name}</h3><span className="planned-badge">Planned · not connected</span></div>
            <p>{item.value}</p><p className="hint">{item.stage}</p>
          </article>)}
        </div><p className="hint">No OAuth flow, API key, webhook or third-party connection can be started from this page.</p></div>
      </section>}
    </div>
  );
}

