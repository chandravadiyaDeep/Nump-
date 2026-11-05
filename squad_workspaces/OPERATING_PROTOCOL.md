# NUMPA — Universal Contributor Operating Protocol

This protocol applies to ChatGPT, Claude, Codex, Google AI Studio, other LLMs, and human contributors. Tools are interchangeable contributors; repository documentation is the shared memory.

## Before doing any work
1. Confirm repository, branch, and current commit. Never assume them.
2. Read `squad_workspaces/CURRENT_STATE.md`.
3. Read this protocol and the selected squad's README and session handoff.
4. Read the squad vision, plan, checklist, conversation log, and logic/research notes relevant to the task.
5. Inspect linked authoritative docs, current code, tests, and existing PRs as necessary.
6. Confirm whether the task is research, planning, documentation, implementation, review, or release work.
7. Check whether the product owner has authorized the requested class of change.

## During work
- Work only within the assigned scope; identify cross-squad dependencies before changing shared contracts or other squad internals.
- Use the canonical source-of-truth hierarchy in the workspace index.
- Do not invent progress, deadlines, approvals, test results, file contents, or external research.
- Keep changes small, reviewable, and reversible. Coordinate overlapping edits and use separate branches/worktrees for parallel work.
- For code: add useful comments where they clarify non-obvious behavior, preserve established patterns, and run relevant tests.
- For research: record sources, access dates, evidence, uncertainty, alternatives, and implications.
- For plans: include dependencies, acceptance criteria, owner, status, and a date only when agreed.
- If context is missing or conflicting, record it as a blocker; do not fill gaps with guesses.

## Mandatory session closeout / LLM handoff
Before ending or switching models, update:
1. `SESSION_HANDOFF.md` — current state, last completed action, exact next action, blockers, files changed, commands/tests, branch and commit SHA.
2. `IMPLEMENTATION_CHECKLIST.md` — mark only work actually completed and attach evidence.
3. `EXECUTION_PLAN.md` — update milestone status, actual dates, deviations, and next daily action.
4. `CONVERSATION_LOG.md` — concise summary of decisions, rationale, alternatives, and unresolved items.
5. `LOGIC_AND_RESEARCH.md` — add any new domain logic, research, assumptions, or source links.
6. Global `CURRENT_STATE.md` and `human_report/PROJECT_LOG.md` when project-wide status changes.

Never claim a task is complete without evidence. Record test command and result; if tests were not run, say so.

## Required handoff format
- Workstream and task ID
- Status: NOT STARTED / IN PROGRESS / BLOCKED / REVIEW REQUIRED / COMPLETE
- Last verified timestamp
- Repository, branch, current commit SHA
- Objective and scope
- Completed work with evidence
- Exact files changed
- Tests/commands run and outcomes
- Decisions made and their approval status
- Open questions, risks, and blockers
- Exact next action (one step another contributor can perform)
- Suggested context files to read next

## Safety and approval gates
- No PR merge, deployment, production environment change, database schema/migration, infrastructure change, or breaking API contract change without explicit product-owner authorization.
- A plan/checklist is not authorization to execute a production-impacting action.
- Never place credentials, tokens, customer data, or private datasets in Markdown logs.
- Do not overwrite another contributor's uncommitted work. Fetch latest state and reconcile edits.
- Preserve history; correct records transparently rather than deleting inconvenient facts.

## Model-switching rule
A new LLM must be able to resume from the repository alone. The previous LLM's private context is not required. If the handoff is incomplete, first reconstruct state from Git history, current files, branch/PR status, and tests; then update the handoff before proceeding.
