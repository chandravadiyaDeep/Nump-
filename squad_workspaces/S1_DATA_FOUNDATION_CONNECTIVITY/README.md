# S1 — Data Foundation & Connectivity

**Workspace status:** INITIALIZED — planning only  
**Squad charter:** [S1 — Data Foundation & Connectivity](../../human_report/squads/S1_DATA_FOUNDATION_CONNECTIVITY.md)  
**Global status:** [Current state](../CURRENT_STATE.md)

## Squad purpose
Connect user data sources safely and make data available to NUMPA projects.

## Scope
File ingestion; databases; cloud storage; APIs; credentials integration; schema discovery; import configuration; connection health.

## Expected outcome
Deliver secure, repeatable source connectivity and ingestion with traceable source metadata.

## Cross-squad boundary
Consumes P0 identity, authorization, job and artifact primitives. Publishes dataset/source references to S2 and S3; does not own downstream analysis or transformation semantics.

## Read and update
1. [Vision](VISION.md)
2. [Execution plan](EXECUTION_PLAN.md)
3. [Implementation checklist](IMPLEMENTATION_CHECKLIST.md)
4. [Session handoff](SESSION_HANDOFF.md)
5. [Conversation log](CONVERSATION_LOG.md)
6. [Logic and research](LOGIC_AND_RESEARCH.md)

Use the [universal operating protocol](../OPERATING_PROTOCOL.md). The charter is proposed/under review; this workspace does not make it approved.
