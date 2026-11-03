"use client";

import { getHistoryView } from "./workspace-settings-model.mjs";

export function AnalysisHistoryWorkspace() {
  const history = getHistoryView();
  return (
    <div className="shell support-workspace">
      <section className="hero">
        <div className="eyebrow">NUMPA · ANALYSIS HISTORY</div>
        <h1>Review past <span>work.</span></h1>
        <p>History will show saved analysis metadata and report references only after an approved private history store is available.</p>
      </section>
      <section className="panel" aria-labelledby="history-unavailable-title">
        <div className="panel-head"><div className="panel-icon" aria-hidden="true">◷</div><div><h2 id="history-unavailable-title">History is not enabled</h2><p>No saved analysis records are available in this workspace.</p></div></div>
        <div className="panel-body">
          {history.state === "unavailable" ? <div className="support-notice" role="status">
            <strong>No approved metadata-only history store is configured in this app.</strong>
            <p>History saving is not enabled, so no records are collected or displayed here. Raw datasets and rows are not stored in history.</p>
          </div> : <div className="empty-state"><h3>No saved analyses yet</h3><p>Completed records will appear here only when an approved history store is enabled.</p></div>}
          <p className="hint">The active dataset and analysis results remain in browser memory for this session. They are not restored from this page after refresh or browser closure.</p>
        </div>
      </section>
    </div>
  );
}


