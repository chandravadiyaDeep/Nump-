# NUMPA Squad Workspaces

This is the operational control centre for squad-level work. Every squad has the same canonical Markdown structure so any authorized LLM or human contributor can resume work without relying on a previous model's chat memory.

## Start here — mandatory reading order
1. [Global current state](CURRENT_STATE.md) — exact project status and next action.
2. [Operating protocol](OPERATING_PROTOCOL.md) — how every contributor must work and hand off.
3. [Squad index](SQUAD_INDEX.md) — squad ownership and workspace links.
4. Open the selected squad's `README.md`.
5. Read that squad's `VISION.md`, `EXECUTION_PLAN.md`, `IMPLEMENTATION_CHECKLIST.md`, `SESSION_HANDOFF.md`, `CONVERSATION_LOG.md`, and `LOGIC_AND_RESEARCH.md` as relevant.
6. Read linked authoritative material under `human_report/`, `resources/`, and `docs/`.

## Standard files in every squad
- `VISION.md` — long-term outcomes, user value, principles, success measures, and non-goals.
- `EXECUTION_PLAN.md` — phases, dependencies, milestones, deadlines, daily plans, and progress. Dates must be real and explicitly agreed; never invent deadlines.
- `IMPLEMENTATION_CHECKLIST.md` — actionable, testable tasks with status and evidence.
- `SESSION_HANDOFF.md` — live checkpoint: where work stopped, what is done, exact next action, blockers, changed files, commands/tests, and how another LLM resumes.
- `CONVERSATION_LOG.md` — durable summaries of important discussions, decisions, rejected options, and unresolved questions. Do not dump unfiltered chat transcripts.
- `LOGIC_AND_RESEARCH.md` — domain logic, assumptions, algorithms, architecture reasoning, research links, trade-offs, trend updates, and proposed improvements.

## Source-of-truth hierarchy
1. Explicit product-owner approvals and current approved decisions in `human_report/DECISION_REGISTER.md`.
2. Approved architecture/contracts and safety policies.
3. Squad workspace plans and handoffs (operational status, not authority to override approved architecture).
4. Research/resource material and conversation summaries.
5. A model's unstored recollection or inference (never authoritative).

If sources conflict, stop the affected work, document the conflict, and request product-owner resolution. Never silently choose.

## Important current status
As of 2026-11-05, planning is still in the pre-implementation sequence. Stage 3 inter-squad contract architecture is drafted and under review. Stage 1 organization and Stage 2 charters have not been recorded as explicitly approved. No squad implementation is authorized by this workspace creation.
