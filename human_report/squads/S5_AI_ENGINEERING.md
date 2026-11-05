# S5 — AI Engineering

**Status:** PROPOSED — UNDER REVIEW  
**Primary workspaces:** AI Studio, Forecasting & Advanced AI

## Mission
Enable users to design, evaluate, and run AI-powered applications and advanced AI workflows using replaceable model providers and reproducible configurations.

## Owns
- AI application/project configuration and lifecycle within NUMPA.
- Prompt templates, model/task configuration, provider adapters at the AI application layer, and model selection UX.
- Retrieval-augmented generation (RAG): knowledge-source configuration, chunking/indexing policy, retrieval strategy, grounding/citation behavior, and retrieval evaluation.
- AI agents and tool-use workflows: agent definitions, tool permissions at the product level, state/step semantics, guardrails, and execution traces.
- AI application evaluation: task-specific test sets, quality/grounding/safety evaluations, regression suites, and comparison of model/prompt configurations.
- Forecasting and advanced analytical AI capabilities, including forecasting workflow configuration, NLP, computer vision, anomaly detection, and other approved advanced-AI use cases.
- AI-specific cost/latency/quality trade-off views and provider portability at the application boundary.

## Does not own
- Global user identity, secrets vault, shared job substrate, or common observability primitives (P0).
- General-purpose data ingestion/connectors (S1).
- General EDA and charting system (S2).
- General-purpose cleaning pipelines (S3).
- Classical ML readiness, feature engineering, and general experiment/model comparison lifecycle (S4).
- Production lifecycle for deployed models, model serving operations, drift monitoring, and rollback (S6).
- Cross-domain automation schedules, enterprise governance/report distribution (S7).

## Frontend responsibilities
AI Studio project builder; prompt/model configuration; RAG knowledge-source setup; agent workflow editor; tool permission configuration; evaluation dataset/results; model/provider comparison; forecasting and advanced-AI workspaces.

## Backend and data responsibilities
Provider-neutral AI orchestration interfaces; provider adapters; prompt and agent execution; retrieval/indexing pipeline coordination; AI evaluation; advanced-AI workflow execution; versioned AI configuration and run traces.

## Owned concepts and records
AI application, prompt version, provider/model configuration reference, knowledge source, retrieval/index configuration, agent definition, tool policy, AI evaluation set/run, forecast configuration/run, advanced-AI workflow, AI execution trace.

## Interfaces and dependencies
- Uses P0 identity, secret-management, project, job, artifact, policy, and observability primitives.
- Uses S1 for source connectivity and S3 for approved data preparation where required.
- Uses S2 for visual presentation of analytical outputs when appropriate.
- May consume S4 model candidates through published interfaces; ownership of classical ML experiment records remains S4.
- Hands production model lifecycle needs to S6 where the artifact is a deployable model.
- S7 may schedule or govern AI workflows through published operations.
- NUMPA's core product must not require one proprietary LLM provider. Provider-specific adapters must be replaceable and provider failure must not corrupt canonical project data.

## Decision rights
Owns AI application behavior, prompt/agent/RAG semantics, AI evaluation methodology, and advanced-AI workflow semantics. Provider-specific choices are replaceable configuration decisions, not core architectural commitments. Sensitive tool permissions and data access policies require P0/security review.

## Deliverables
Provider-neutral AI integration layer; prompt and agent versioning; RAG workflow; AI evaluation suite; advanced-AI/forecasting workflows; execution traces; cost/latency/quality observability requirements.

## Quality gates
Provider isolation; secret redaction; prompt-injection and data-exfiltration defenses; least-privilege tool access; grounding and citation tests; evaluation regression tests; model failure/fallback behavior; cost and latency controls; dataset/version provenance.

## Success measures
AI workflow reliability; evaluation quality; grounded response rate where applicable; provider portability; cost/latency visibility; low security incidents; reproducibility of prompt/agent configurations.

## Boundary test
S5 owns AI application and advanced-AI workflow behavior. P0 supplies shared infrastructure, S4 owns classical ML experimentation, and S6 owns operational deployment of accepted models.
