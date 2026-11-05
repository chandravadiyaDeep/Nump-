# NUMPA Squad Map

**Status: PROPOSED — awaiting product-owner confirmation.**

The organization below is the starting proposal for Stage 1. It is not yet an approved organizational structure, and no squad should begin implementation work from this document.

## Shared platform squad

### Core Platform & Developer Experience
Cross-cutting capabilities used by all product squads:
- Identity and access integration
- Shared project and artifact context foundations
- Execution infrastructure and job standards
- API, event, and schema conventions
- Security, observability, testing infrastructure, CI/CD, and developer experience

## Product squads

| # | Proposed squad | Initial domain ownership |
|---|---|---|
| 1 | Data Foundation & Connectivity | Data Connect |
| 2 | Data Intelligence | Data Analysis and Data Visualization |
| 3 | Data Transformation & Quality | Data Cleaning, validation, transformation, and pipelines |
| 4 | Data Science & ML | Data Science, ML Readiness, and ML Lab |
| 5 | AI Engineering | AI Studio and Forecasting & Advanced AI |
| 6 | ML Platform & Operations | MLOps and model lifecycle operations |
| 7 | Workflow Automation & Governance | Automation Studio, Reports & Governance |

## Supporting destinations
Analysis History, Settings, and Account are supporting product destinations, not additional domain squads at this stage.

## Organization principles to validate
1. Squads should own coherent end-to-end product domains, not only frontend or backend layers.
2. Squads should own their domain workflows, domain logic, APIs, tests, documentation, and operational quality.
3. Shared platform capabilities should be built once and exposed through stable contracts.
4. Cross-squad dependencies should be explicit and tracked.
5. Avoid multiple agents editing the same files or making conflicting changes; use isolated branches/worktrees and integration review.
6. Split a squad only when domain complexity, workload, or ownership conflicts justify it.

## Decisions still required
- Confirm whether seven product squads plus one shared platform squad is the right starting organization.
- Confirm whether the proposed domain groupings are appropriate.
- Confirm the LLM allocation and human-review model.
- Confirm central architecture governance and approval boundaries.

The next revision should record the product owner's explicit approval or changes.
