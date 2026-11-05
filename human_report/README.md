# NUMPA Human Report

## Purpose
This directory is the human-readable record of NUMPA's product, squad, architecture, research, and implementation-planning work. It exists so the product owner can trace what was discussed, what evidence was gathered, what was decided, who owns each action, and what remains unresolved.

## Documentation rules
1. Record meaningful planning sessions and decisions in Markdown.
2. Separate **proposals**, **research findings**, **approved decisions**, and **implementation status**. Never present a proposal as approved.
3. Every decision must include its status, rationale, consequences, owner, and date.
4. Link related reports rather than duplicating long explanations.
5. Record disagreements, assumptions, risks, and open questions.
6. Update the relevant report when a decision changes; preserve the history rather than silently rewriting it.
7. No production change, schema migration, deployment, or existing API contract change is authorized by a planning note alone.
8. Squad work begins with research and specifications. Implementation starts only after the architecture and roadmap are approved.

## Current phase
**Stage 2 — Squad boundaries and charters (proposed; under review).**

The agreed sequence is:
0. Create and maintain this reporting system.
1. Finalize squad organization.
2. Define squad boundaries and charters.
3. Define inter-squad contracts.
4. Research professional workflows in each domain.
5. Research backend techniques, engines, libraries, and trade-offs.
6. Design the unified backend.
7. Review and approve architecture; record Architecture Decision Records (ADRs).
8. Plan implementation dependencies and phases.
9. Create implementation-ready tasks.

## Operational workspaces
- [Squad workspaces](../squad_workspaces/README.md) — live squad vision, execution plans, checklists, session handoffs, conversation summaries, and domain logic/research. This is the cross-LLM continuity layer.

## Index
- [Project log](PROJECT_LOG.md) — chronological record of work.
- [Squad map](SQUAD_MAP.md) — proposed and approved squad organization.
- [Decision register](DECISION_REGISTER.md) — decisions and their approval status.
- [Open questions and risks](OPEN_QUESTIONS_AND_RISKS.md) — unresolved questions, assumptions, and risks.
- [Research index](RESEARCH_INDEX.md) — research topics, sources, and findings.
- [Squad charters](squads/README.md) — proposed scope, ownership boundaries, interfaces, deliverables, and quality gates for all eight squads.
- [Inter-squad contracts](contracts/README.md) — proposed contract principles, ownership, handoffs, API/event/artifact/job standards, and change governance.

## Status vocabulary
- **PROPOSED** — suggested, not approved.
- **UNDER REVIEW** — actively being evaluated.
- **APPROVED** — explicitly approved by the product owner.
- **REJECTED** — considered and not selected.
- **SUPERSEDED** — replaced by a later decision.
- **BLOCKED** — cannot proceed until a dependency is resolved.

## Reporting cadence
After each meaningful work session, update the project log and any affected decision, squad, research, or risk document. Keep entries concise but sufficiently detailed to reconstruct the reasoning.
