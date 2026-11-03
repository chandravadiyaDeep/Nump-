# NUMPA Search Intelligence Agent — Specification

**Status:** Documented for future implementation; deliberately deferred.  
**Priority:** Backward of current NUMPA implementation and discovery rollout.  
**Execution rule:** Do not start this agent until the current service implementation and agreed platform expansion work are stable enough that the agent will not distract or delay them.

## 1. Purpose

The future agent will research how people discover and seek help with data analysis, data cleaning, machine learning readiness, AI/ML learning and related topics across search engines, AI answer platforms and relevant public communities.

Its purpose is to identify evidence-backed opportunities that improve NUMPA's service discovery, content usefulness and SEO/AEO/GEO strategy.

It is a research and recommendation system first. It is not an autonomous publishing or product-modification agent.

## 2. Research areas

The future system may coordinate specialist research tasks:

- Search demand and keyword research.
- Search intent and question discovery.
- AI answer-platform question and citation pattern research.
- Public community discussions and recurring user problems.
- Competitor service, content and positioning analysis.
- Emerging topics and trend monitoring.
- SEO, AEO and GEO opportunity analysis.
- Content gap and internal-link recommendations.

Use only permitted sources and methods. Respect provider terms, robots rules, rate limits, privacy and copyright. Do not scrape private communities or collect personal/sensitive data.

## 3. Inputs and scope

The agent should receive:

- NUMPA's approved product/service descriptions.
- Target audience and priority geographies/languages when decided.
- Current public pages and content inventory.
- Competitor list approved for research.
- Research period and freshness requirements.
- Approved data-source integrations and usage limits.

Do not assume a specific paid data provider, API entitlement or platform access. The implementation phase must verify available sources and costs.

## 4. Research workflow

1. Clarify the research question and target audience.
2. Gather source evidence from approved sources.
3. Record source URL, publisher/platform, retrieval date and relevant date range.
4. Normalize topics, questions, keywords and intent categories.
5. Cluster related opportunities without discarding original phrases.
6. Compare demand signals, competition, relevance to NUMPA and evidence quality.
7. Identify gaps and uncertainty.
8. Produce a ranked recommendation with rationale and confidence.
9. Generate a human-reviewable content brief or service-page recommendation.
10. Track whether the recommendation was accepted, rejected or deferred.

## 5. Required output

Each research report should include:

- Executive summary.
- Research question, geography, language and date range.
- Methodology and source limitations.
- Topic/keyword/question clusters.
- Search intent and audience problem.
- Evidence table with source links and dates.
- Competitor observations with citations.
- Content gaps and opportunities.
- Relevance to existing NUMPA services.
- Suggested content format and outline.
- Internal-link/service conversion opportunity.
- Priority, confidence and reasons.
- Uncertainties and next research action.

Never fabricate search volume, ranking, traffic, competitor metrics, AI citations or user demand. Label estimates and proxies explicitly.

## 6. Ranking model

The future agent may score opportunities using transparent, configurable factors such as:

- Relevance to current NUMPA services.
- Evidence strength and freshness.
- User problem clarity.
- Search/answer intent.
- Competitive gap.
- Content effort and maintenance cost.
- Ability to provide a genuinely better answer.

Weights must be visible and adjustable. A score is a prioritization aid, not a claim of guaranteed traffic.

## 7. Human approval and action boundaries

The agent may independently research and draft reports within approved source access.

It must not autonomously:

- Publish or edit production pages.
- Change service functionality, pricing or product claims.
- Contact people or send outreach.
- Create accounts, purchase data or incur costs.
- Modify production configuration or secrets.
- Copy copyrighted articles or reproduce substantial protected material.
- Use private personal data or infer sensitive attributes.

Publishing, outreach, spending and product changes require a separate authorized workflow and explicit human approval.

## 8. Architecture expectations for future implementation

When scheduled, implement as a separate module/application behind clear interfaces:

- Source adapters.
- Research job orchestration.
- Evidence and provenance records.
- Topic/question normalization.
- Opportunity scoring and ranking.
- Report generation.
- Human review queue.
- Audit trail and cost/rate controls.

Keep it isolated from NUMPA's core dataset processing and ML readiness engines. Failure of this agent must never interrupt the primary NUMPA product.

## 9. Evaluation

Evaluate with:

- Source traceability and citation accuracy.
- Freshness and coverage of evidence.
- Precision of topic clustering.
- Relevance of recommendations to actual services.
- Human acceptance/usefulness ratings.
- Cost per useful report.
- Rate of unsupported claims (target: zero).
- No unauthorized publishing or production changes.

## 10. Deferred implementation gate

Do not begin implementation until:

1. Current NUMPA service workflows are stable and regression-tested.
2. Footer/discovery navigation is implemented and reviewed.
3. The first useful public service and content destinations exist.
4. Source access, budget and permitted collection methods are confirmed.
5. The owner explicitly schedules this phase.

This specification preserves the idea without making the agent a dependency for current delivery.
