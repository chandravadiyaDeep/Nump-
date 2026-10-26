# NUMPA Research Backlog

Track each question with status, evidence, owner and decision. Do not convert assumptions into product claims without validation.

## P0 — Trustworthy MVP
- [ ] Verify latest CI run is green; record URL and commit SHA.
- [ ] Run end-to-end workflow on synthetic CSV and JSON.
- [ ] Confirm actual file-processing and retention behaviour in deployment.
- [ ] Test upload limits, malformed inputs and memory use.
- [ ] Validate cleaning edge cases, especially all-null columns.
- [ ] Validate score interpretation with curated examples; label it heuristic until calibrated.
- [ ] Define the first web UI and API contract.

## P1 — Before public launch
- [ ] Benchmark representative file sizes and concurrency.
- [ ] Define exact accepted JSON, Parquet, Arrow and Feather variants.
- [ ] Define PDF report acceptance criteria.
- [ ] Select deployment target and production configuration.
- [ ] Review authorization, CORS, secrets and dependencies.
- [ ] Define feedback and privacy disclosures.
- [ ] Test accessibility and error states.

## P2 — Scale and integrations
- [ ] Research safe folder/archive and multimodal ingestion.
- [ ] Decide if a typed dataset interface beyond DataFrames is needed.
- [ ] Define async job and cancellation thresholds.
- [ ] Specify API keys, rate limits, metering and webhooks.
- [ ] Define company-specific readiness profiles and versioning.
- [ ] Evaluate Zapier, Make and n8n against user demand.
- [ ] Specify billing lifecycle before payments.
- [ ] Build a competitor baseline from dated official evidence.

## Decision template
Question; why it matters; evidence and sources; options; recommendation; risks; validation test; decision date; revisit trigger.
