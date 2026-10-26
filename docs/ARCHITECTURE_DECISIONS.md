# Architecture Decision Records

Record significant decisions with context, choice, alternatives, consequences and date. Supersede old decisions explicitly.

## ADR-0001 — Separate workflow engines from HTTP routes
Status: Accepted.
Decision: ingestion, profiling, cleaning, readiness and ML evaluation remain separate modules; HTTP routes orchestrate them.
Reason: easier testing and reuse from web, desktop, API or worker contexts.
Consequence: shared behaviour belongs in engine modules, not route handlers.

## ADR-0002 — Original uploads are immutable
Status: Accepted.
Decision: cleaning creates a new output and audit report.
Reason: reversibility, trust and reproducibility.
Consequence: UI distinguishes source and cleaned output.

## ADR-0003 — Readiness scoring is deterministic
Status: Accepted.
Decision: code computes scores from documented rules; AI may explain or suggest but cannot silently change weights or values.
Reason: scores must be auditable.
Consequence: formulas and configurations need versioning.

## ADR-0004 — Support claims require tested adapters
Status: Accepted.
Decision: a format is supported only after loader, validation, error handling and fixtures pass.
Reason: formats have different semantics and resource risks.
Consequence: UI and docs must expose exact current support.

## ADR-0005 — Scale against measured needs
Status: Accepted.
Decision: queues, persistent dataset storage and distributed workers require measured justification.
Reason: avoid premature cost and operational complexity.
Consequence: benchmark before raising workload limits.
