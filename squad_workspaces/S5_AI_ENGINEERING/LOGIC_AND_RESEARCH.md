# S5 — AI Engineering — Domain Logic, Research, and Improvement Journal

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
LLM applications; prompt/model workflows; RAG; agents; AI evaluation; NLP; computer vision; anomaly detection; advanced AI workflow composition; advanced forecasting experiences.

## Current boundary assumptions (not yet approved)
Consumes P0 shared secrets/security/execution primitives and domain data/artifacts; integrates with S7 automation and reports. No LLM provider is a permanent architecture dependency.

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


## Research completion standard

Follow the mandatory [NUMPA Vision and Research Standard](../VISION_AND_RESEARCH_STANDARD.md). This journal is not considered complete merely because a list of features or technologies exists. It must contain evidence-backed user workflows, competitor analysis, logic, alternatives, risks, and recommendations.

## Squad-specific research agenda

Research LLM application workflows, model/provider abstraction, prompt management, RAG, agents, tool permissions, evaluation, safety, latency/cost trade-offs, NLP, computer vision, anomaly detection, and advanced forecasting experiences. Prioritize original model papers, official provider API/model docs, Hugging Face, LangGraph/LlamaIndex docs, public evaluation benchmarks, OWASP LLM guidance, model cards, and maintained GitHub repositories.

## Required research outputs

- Persona and jobs-to-be-done evidence, including current tools and workarounds.
- End-to-end professional workflow maps, decision points, exceptions, and failure recovery.
- Competitor comparison based on observed capabilities and dated sources.
- Domain logic catalogue with assumptions, preconditions, rules, edge cases, and testable acceptance criteria.
- Technical alternatives with licensing, maintenance, security, performance, scalability, cost, and integration trade-offs.
- Differentiated opportunities for NUMPA supported by evidence.
- Open questions, confidence levels, and a validation plan.

## Research status

**NOT STARTED — agenda scaffold only.** No source review, competitor teardown, algorithm evaluation, or recommendation is claimed complete by this template.