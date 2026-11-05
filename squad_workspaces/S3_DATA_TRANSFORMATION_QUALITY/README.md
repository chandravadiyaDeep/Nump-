# S3 — Data Transformation & Quality

**Workspace status:** INITIALIZED — planning only  
**Squad charter:** [S3 — Data Transformation & Quality](../../human_report/squads/S3_DATA_TRANSFORMATION_QUALITY.md)  
**Global status:** [Current state](../CURRENT_STATE.md)

## Squad purpose
Turn source data into validated, reproducible, trustworthy dataset versions.

## Scope
Quality checks; missing values; duplicates; outliers; type correction; encoding; scaling; transformations; validation; pipelines; preview/execute; transformation history.

## Expected outcome
Create transparent transformations with preview, validation, lineage, and immutable output versions.

## Cross-squad boundary
Consumes S1 datasets and S2 findings; publishes prepared dataset versions to S2/S4 and reports to S7. S4 owns ML-specific feature engineering and leakage controls.

## Read and update
1. [Vision](VISION.md)
2. [Execution plan](EXECUTION_PLAN.md)
3. [Implementation checklist](IMPLEMENTATION_CHECKLIST.md)
4. [Session handoff](SESSION_HANDOFF.md)
5. [Conversation log](CONVERSATION_LOG.md)
6. [Logic and research](LOGIC_AND_RESEARCH.md)

Use the [universal operating protocol](../OPERATING_PROTOCOL.md). The charter is proposed/under review; this workspace does not make it approved.
