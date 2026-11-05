# NUMPA Open Questions and Risks

## Open questions

### Stage 1 — product-owner sign-off
- Approve or modify the proposed one-platform-plus-seven-product-squad organization in [Squad Map](SQUAD_MAP.md).
- Confirm whether any workspace should move to a different squad before Stage 2.

### Stage 2 — squad charter review
- Review and approve or revise the eight proposed squad charters in [human_report/squads](squads/README.md).
- Confirm whether P0's canonical resource/artifact metadata boundary is sufficiently distinct from product-owned domain metadata.
- Confirm the handoff between S4's candidate models and S6's production model registry.
- Confirm the boundary between S5's forecasting workflows and S4's time-series ML experiments.
- Confirm whether S7's governance/reporting scope is appropriately separated from P0's shared audit-event/security primitives.
- Confirm whether any squad should be split, merged, or renamed.

### Stage 3 — contracts and governance
- Which contracts require central architecture review?
- What decisions may squads make independently?
- What requires product-owner approval?
- How should API, event, schema, and artifact contract changes be versioned?

## Initial risks to manage

| Risk | Why it matters | Mitigation |
|---|---|---|
| Overlapping squad ownership | Conflicting implementations and unclear accountability | Define explicit charters and ownership boundaries in Stage 2 |
| LLM output inconsistency | Different tools may produce incompatible designs | Shared templates, source references, decision register, central review |
| Premature technology selection | Tools may be selected before workflows and constraints are understood | Research workflows first, then benchmark and compare technologies |
| Monolithic scope expansion | Attempting to build every workspace at once increases delivery risk | Dependency-based phases and thin vertical slices |
| Data duplication and lineage gaps | Workspaces could operate on inconsistent dataset versions | Design shared dataset/artifact identity and lineage contracts in Stage 3/6 |
| Production regression | Planning work could accidentally affect live services | Documentation-only planning branch; explicit approval for production-impacting changes |
| Unverified claims | Research may repeat marketing claims or outdated library information | Record sources, dates, evidence quality, limitations, and validation status |
| Premature squad splitting | Too many squads increase coordination and contract overhead | Start with seven product squads; split only when evidence justifies it |

## Status
Stage 1 organization design is complete. The LLM collaboration model has been corrected to be provider-independent and task-based. Product-owner sign-off on the squad organization itself is still required before the squad map is treated as approved and Stage 2 charters are finalized.
