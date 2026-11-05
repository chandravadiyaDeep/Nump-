# NUMPA Project Log

Chronological record of the unified NUMPA planning effort.

## 2026-11-05 — Planning process agreed

### Objective
Organize NUMPA into specialist squads and design a coherent unified data and AI platform before implementation.

### Product-owner direction
- Follow the agreed nine-stage planning sequence: squad organization; squad boundaries; inter-squad contracts; professional workflow research; backend technology research; unified backend design; architecture review and approval; dependency roadmap; implementation task creation.
- Establish this `human_report/` Markdown documentation system before creating/activating squads.
- Use multiple LLM tools for squad work. ChatGPT is the main controller and also supports implementation. Claude and Google AI Studio may be assigned one or two squads each, based on the work.
- Keep reports detailed enough for the product owner to trace progress, decisions, and rationale.

### Working model
- ChatGPT: central coordinator, architecture facilitator, cross-squad reviewer, and implementation assistant.
- Claude / Google AI Studio: specialist research and implementation contributors when assigned.
- Codex: repository-aware engineering and implementation execution where appropriate.
- Product owner: final approval authority for product scope, architecture, and consequential changes.

### Initial squad organization
The previously proposed seven product squads plus one shared platform squad are the starting proposal, not yet a final approved map. See [Squad Map](SQUAD_MAP.md).

### Guardrails
- No implementation of the new unified architecture during planning stages.
- No unapproved production deployments, infrastructure changes, database migrations, or breaking API changes.
- Existing production systems and contracts must be protected.
- Research conclusions must distinguish verified facts from assumptions and recommendations.

### Current status
**Stage 0 — documentation foundation established.**
Next: finalize the squad organization (Stage 1). Squad boundaries are intentionally deferred until the squad map is approved.
