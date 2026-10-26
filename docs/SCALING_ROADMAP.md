# NUMPA Scaling Roadmap

## Product north star
Help analysts turn a raw dataset into an explainable, auditable cleaned dataset and task-specific ML-readiness assessment.

Core loop: Upload → Inspect → Assess → Review cleaning plan → Preview → Apply approved actions → Validate → Reassess → Export.

## Stage 0 — Reliable MVP
- [ ] Keep ingestion, profiling, cleaning, readiness and model evaluation modular.
- [ ] Add tests for every format the product claims to support.
- [ ] Make CI a quality gate and verify the latest run.
- [ ] Validate upload limits, error messages and memory use.
- [ ] Build the web UI after stabilizing the API contract.
Exit: reproducible local setup, passing tests and one end-to-end sample workflow.

## Stage 1 — Complete core workflow
- [ ] Overview and column-level diagnostics.
- [ ] Explainable cleaning recommendations and user approval.
- [ ] Preview, before/after comparison and audit report.
- [ ] Download cleaned dataset and PDF reports.
- [ ] Task-aware readiness score with dimension explanations.
- [ ] Accessible loading, empty, success and error states.
Exit: new users can finish the workflow without developer help.

## Stage 2 — Reliability and format coverage
- [ ] Add format-specific loaders and fixtures.
- [ ] Benchmark large files; set memory, time and concurrency limits.
- [ ] Add cancellation and background jobs only when needed.
- [ ] Add structured, non-sensitive operational metrics.
- [ ] Test cleaning regressions and score changes.
Exit: documented limits and repeatable performance results.

## Stage 3 — Accounts and commercial foundations
- [ ] Add Supabase Auth when account flows are ready.
- [ ] Store only necessary account, feedback, configuration and usage metadata.
- [ ] Keep raw customer datasets out of account tables by default.
- [ ] Apply server-side authorization and Row Level Security.
- [ ] Specify entitlements and webhook lifecycle before payments.
- [ ] Meter usage server-side, never from client-reported totals.

## Stage 4 — Integration platform
- [ ] Versioned public API, API keys, rotation and revocation.
- [ ] Rate limits, quotas, usage metering and idempotency.
- [ ] Async jobs and signed webhooks where needed.
- [ ] Add Zapier, Make or n8n only after stable API contracts.
- [ ] Prove tenant isolation before team, enterprise or white-label features.

## Stage 5 — Advanced ML assessment
- [ ] Classification and regression evaluation with leakage-safe pipelines.
- [ ] Forecasting with chronological splits and suitable metrics.
- [ ] Clustering with suitable unsupervised metrics and caveats.
- [ ] Versioned company assessment configurations and editable weights.
- [ ] AI may suggest or explain; deterministic code owns scores.

## Non-negotiables
1. Never overwrite original data.
2. Never claim untested format support.
3. Never fit preprocessing on validation/test data.
4. Never present readiness as guaranteed model performance.
5. Never log raw datasets or credentials.
6. Scale against measured bottlenecks, not guesses.
