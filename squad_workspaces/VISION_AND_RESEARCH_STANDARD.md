# NUMPA Vision, Logic, and Research Standard

**Status:** PROPOSED operating standard for product-owner review  
**Created:** 2026-11-05  
**Applies to:** P0 and S1–S7

## 1. Strategic ambition

NUMPA's proposed company-level ambition is to capture **10% of its defined target market by 2028**.

This is a strategic ambition, not yet a measurable or approved KPI. Before assigning targets, define:
- The market category and boundaries (what is included and excluded).
- Geography and customer segment.
- Measurement basis: revenue share, paying customers, active users, workloads, or another defensible metric.
- Market denominator, source, publication date, assumptions, and calculation.
- Whether the target means 10% of TAM, SAM, or a narrower serviceable/obtainable segment.

Do not use "10% of global Data & AI" as a denominator without a defensible market definition. Market reports often measure different categories and must not be combined without reconciling their methodologies.

Each squad's vision must explain its contribution to the company ambition. Do not assign every squad a 10% share target. Squad-level outcomes and metrics must be specific to its domain and linked to measurable user and business value.

## 2. Mandatory sequence before execution planning

For each squad, complete and review these two documents first:
1. `VISION.md` — why the squad exists, who it serves, what future outcome it creates, and how success is measured.
2. `LOGIC_AND_RESEARCH.md` — evidence about users, professional workflows, competitors, domain methods, algorithms, architecture options, limitations, and improvement opportunities.

Only after the product owner accepts both documents for that squad may contributors create detailed execution plans, implementation checklists, and development tasks for that squad. Cross-squad dependencies and global architecture approvals still apply. This gate does not authorize implementation by itself.

## 3. Research like a serious product and engineering organization

Use a repeatable evidence loop:

1. **Customer problem discovery:** identify target personas, jobs-to-be-done, pain, frequency, consequences, current workarounds, buying authority, and willingness to pay.
2. **Workflow discovery:** map the real end-to-end workflow, inputs, decisions, outputs, exceptions, collaboration, handoffs, and failure recovery.
3. **Competitor/product teardown:** inspect public product pages, documentation, demos, trials where legitimately available, pricing, changelogs, integrations, help centres, and public customer feedback.
4. **Technical research:** inspect primary papers, official documentation, source repositories, benchmarks, standards, and issue trackers.
5. **Evidence synthesis:** compare approaches, identify gaps and trade-offs, distinguish fact from inference, and record confidence.
6. **Logic design:** express domain rules, algorithms, assumptions, preconditions, outputs, error handling, reproducibility, and acceptance tests.
7. **Validation:** use interviews, prototype tests, benchmark experiments, public evidence, or user feedback to challenge assumptions.
8. **Decision:** recommend a direction with alternatives, costs, risks, confidence, and unresolved questions. Product owner approves strategic and cross-squad decisions.

Research is continuous. Revisit findings when user evidence, competitor capabilities, standards, security conditions, costs, or technology materially change.

## 4. Source hierarchy

Prefer sources in this order, depending on the claim being researched:

### Tier 1 — Primary evidence
- Official product documentation, API references, release notes, changelogs, pricing and security pages.
- Official standards, RFCs, specifications, and regulator publications.
- Original research papers, benchmark methodology, and datasets.
- Source code, tests, issues, pull requests, and maintainer discussions in official repositories.
- Direct customer interviews, support cases, product analytics, and observed usability tests (when legitimately available).

### Tier 2 — Independent expert evidence
- Peer-reviewed journals and conference papers.
- University research groups and recognized technical institutes.
- Independent benchmark studies with transparent methods.
- Reputable analyst research such as Gartner and IDC, including definitions and limitations.
- Engineering case studies and conference talks from practitioners.

### Tier 3 — Market and user signals
- G2, Capterra, TrustRadius and similar review platforms.
- Reddit, Hacker News, Stack Overflow, specialist forums, and professional communities.
- Job postings, public RFPs, customer case studies, public issue discussions, and product comparison articles.

Use Tier 3 to discover questions and patterns, not as sole proof of technical correctness or market size. Validate recurring claims against stronger evidence.

## 5. General research tools and sources

- Papers: Google Scholar (https://scholar.google.com/), arXiv (https://arxiv.org/), Papers with Code (https://paperswithcode.com/).
- Code and implementation: GitHub (https://github.com/), official package registries, maintainers' documentation and changelogs.
- Standards: IETF (https://www.ietf.org/), W3C (https://www.w3.org/), ISO (https://www.iso.org/), NIST (https://www.nist.gov/).
- Market research: Gartner (https://www.gartner.com/), IDC (https://www.idc.com/), Grand View Research (https://www.grandviewresearch.com/). Check category definitions, date, geography, methodology, and whether figures are estimates or audited vendor revenue.
- Customer and competitor signals: G2 (https://www.g2.com/), Capterra (https://www.capterra.com/), TrustRadius (https://www.trustradius.com/), Reddit (https://www.reddit.com/), Hacker News (https://news.ycombinator.com/).
- Product discovery methods: Amazon Working Backwards (public AWS overview: https://aws.amazon.com/executive-insights/content/product-management-at-amazon/), Google Design Sprint Kit (https://designsprintkit.withgoogle.com/methodology), Atlassian product discovery (https://www.atlassian.com/agile/product-management/discovery).

## 6. Squad-specific research source map

| Squad | Primary research areas and source types |
|---|---|
| P0 Core Platform | NIST, OWASP, IETF RFCs, cloud provider architecture/security docs, PostgreSQL docs, OpenTelemetry, CNCF, SRE publications, GitHub engineering practices |
| S1 Data Foundation & Connectivity | Official database/cloud/storage/API docs, connector docs, Apache Arrow, Parquet, CSV/JSON specifications, authentication standards, ingestion product docs |
| S2 Data Intelligence | Statistics textbooks and papers, pandas/Polars/DuckDB docs, SQL references, visualization research, Plotly/ECharts docs, BI/analytics product docs |
| S3 Data Transformation & Quality | Data quality research, Great Expectations/Pandera/Soda docs, dbt docs, data contracts, schema evolution, data validation and profiling papers |
| S4 Data Science & ML | Scikit-learn, XGBoost, LightGBM, PyTorch docs; ML conferences; benchmark papers; leakage and validation research; Optuna and MLflow docs |
| S5 AI Engineering | Original model papers, model cards, provider API docs, Hugging Face, LangGraph/LlamaIndex docs, RAG and agent evaluation papers, OWASP LLM guidance |
| S6 ML Platform & Operations | MLflow, KServe, Kubeflow, BentoML, cloud MLOps docs, model monitoring/drift papers, SRE and deployment safety practices |
| S7 Workflow Automation & Governance | Temporal, Prefect, Dagster, Airflow docs; event-driven architecture patterns; OpenLineage; audit/security standards; workflow automation product docs |

This is a discovery map, not a technology selection or endorsement. Evaluate alternatives, licensing, maintenance, performance, security, cost, and fit before recommending a dependency.

## 7. Competitor reverse-engineering protocol

Study the top relevant products in each domain using public and authorized access only.

For every competitor, record:
- Target customer and positioning.
- Main user journeys and workflow stages.
- Inputs, outputs, supported formats, integrations, and limits.
- Core features and advanced features.
- Interaction design, defaults, customization, and collaboration.
- Pricing, packaging, usage limits, and enterprise controls.
- APIs, extensibility, deployment options, and data handling claims.
- Documentation quality, onboarding, support, and ecosystem.
- Recent releases, changelog direction, and roadmap signals.
- Repeated user praise, complaints, workarounds, and missing capabilities.
- Evidence links, capture date, confidence, and unknowns.

Do not infer private internals from a UI. Label black-box observations as observed behavior, not fact about implementation. Do not bypass access controls, violate terms, or copy proprietary assets/code. Reproduce the user problem and independently design a better solution.

## 8. Logic quality standard

Every important domain rule or algorithm should specify:
- Problem and user decision it supports.
- Inputs, output, assumptions, preconditions, and invariants.
- Algorithm or rule, with source or derivation.
- Alternatives and why they were not selected.
- Edge cases, failure modes, uncertainty, and recovery.
- Correctness criteria and test cases, including adversarial or boundary cases.
- Performance expectations and scale assumptions.
- Privacy, security, licensing, and data leakage considerations.
- Explainability, provenance, determinism, and reproducibility where applicable.
- Monitoring signals and conditions that should trigger reevaluation.

For AI/ML, separately document data splits, leakage risks, baseline models, metrics, calibration, uncertainty, fairness where relevant, and reproducibility. Never let an LLM silently invent or alter deterministic business rules.

## 9. Evidence record format

For each source, record:
- Title and publisher/author.
- Exact URL or repository path.
- Source type and tier.
- Publication/release date and access date.
- Relevant section, page, commit, issue, or version.
- Claim supported and a concise evidence note.
- Limitations, possible bias, and confidence.
- Related squad, workflow, logic rule, and decision.

For every conclusion, link the supporting evidence. Keep conflicting evidence visible.

## 10. Recommended research report structure inside LOGIC_AND_RESEARCH.md

1. Executive synthesis and confidence.
2. Target users, personas, and jobs-to-be-done.
3. End-to-end professional workflows and exceptions.
4. Competitor landscape and feature/workflow comparison.
5. Customer pain points and evidence frequency.
6. Domain concepts, rules, algorithms, and methods.
7. Technical options and comparative evaluation.
8. Architecture/data-flow implications and cross-squad contracts.
9. Failure modes, security, privacy, compliance, and operational needs.
10. Performance, scale, reliability, and cost considerations.
11. Gaps and differentiated opportunities for NUMPA.
12. Recommended logic and validation plan.
13. Risks, assumptions, unresolved questions, and confidence.
14. Dated source register.

## 11. Evidence and recommendation quality gates

A squad research package is not ready for review until:
- Important claims have traceable sources.
- Competitor coverage is broad enough for the defined niche and explains selection criteria.
- Real user workflows, not just feature lists, are mapped.
- At least two credible alternatives are considered for important technical choices where alternatives exist.
- Recommendations include trade-offs and limitations.
- Unknowns and low-confidence claims are explicit.
- Proposed logic has testable rules and validation methods.
- Cross-squad dependencies and ownership conflicts are identified.
- The squad vision explains its contribution to NUMPA's company ambition.
- The product owner can distinguish evidence, interpretation, hypothesis, and decision.

## 12. What this process does not do

- It does not guarantee market leadership or 10% share.
- It does not make every competitor feature a requirement.
- It does not authorize implementation, production changes, deployments, or database migrations.
- It does not turn an LLM-generated claim into evidence.
- It does not make a proposed vision or logic rule approved until the product owner records approval.

## 13. Public examples of company practices

- Amazon Working Backwards: start with the customer experience and work backwards; PR/FAQ helps expose customer, market, feasibility, and dependency questions.
- Google Design Sprint: understand, define, sketch, decide, prototype, and validate.
- Atlassian continuous discovery: connect customer insights, prioritization, collaboration, and delivery continuously.
- Iterative product engineering: refine designs through repeated validation and maintain traceability of evolving decisions.

These are public descriptions of practices, not a claim that every internal team at those companies follows one identical process.
