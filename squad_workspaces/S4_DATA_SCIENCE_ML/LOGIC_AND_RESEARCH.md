# S4 — Data Science & ML — Domain Logic, Research, and Improvement Journal

**Purpose:** A living knowledge base for the reasoning behind this squad's domain: workflows, algorithms, business rules, design trade-offs, research, and improvements prompted by new evidence or industry changes.

## Rules
1. Separate verified facts, hypotheses, proposals, and approved decisions.
2. Cite source URLs, document paths, page/section, publication date, and access date where possible.
3. Search relevant `resources/` folders before repeating research; verify time-sensitive claims.
4. Record alternatives and why they were rejected.
5. Explain the problem, expected benefit, risks, and migration/compatibility impact for every proposed logic change.
6. Do not silently change approved behavior because a trend is popular. Evaluate evidence and seek approval.
7. Keep domain rules here; shared contract decisions belong in `human_report/contracts/` and approved ADRs.
8. Link implementation and tests when a rule is implemented.

## Domain scope
Feature engineering; task definitions; ML readiness; leakage prevention; experiment design; training; algorithm comparison; validation; metrics; tuning; evaluation.

## Current boundary assumptions (not yet approved)
Consumes S3 dataset versions; hands evaluated candidates to S6; may use S5 capabilities. Proposed boundary: supervised forecasting experiments belong here; advanced AI product workflows belong to S5.

## Logic catalogue
| ID | Rule / concept | Status | Rationale | Evidence / source | Related tests |
|---|---|---|---|---|---|
| — | No domain rules have been validated yet | OPEN | Awaiting workflow research | — | — |

## Research notes
### Research question template
- Question:
- User/workflow affected:
- Current behavior or industry practice:
- Evidence and source dates:
- Alternatives:
- Trade-offs (correctness, performance, security, cost, maintainability, UX):
- Recommendation and confidence:
- Open questions:
- Approval status:

## Algorithm / technique register
| Technique | Problem fit | Preconditions | Failure modes | Alternatives | Evaluation metric | Status |
|---|---|---|---|---|---|---|
| To be populated after research | | | | | | NOT STARTED |

## Trend and continuous-improvement watch
Record only trends that materially affect user value, correctness, security, cost, or competitive position.
| Date observed | Trend / change | Source | Impact hypothesis | Validation needed | Decision |
|---|---|---|---|---|---|
| — | No trend assessment recorded yet | — | — | Research required | OPEN |

## Change proposal template
- Proposal ID:
- Current logic and limitation:
- Proposed change:
- Evidence and source dates:
- Expected user/business benefit:
- Correctness and regression risks:
- Performance/cost/security impact:
- Compatibility/migration plan:
- Required tests:
- Decision owner and status:
