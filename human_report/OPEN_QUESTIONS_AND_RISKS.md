# NUMPA Open Questions and Risks

## Open questions

### Organization
- Is the proposed seven-product-squad plus one shared-platform-squad map the right initial structure?
- Should Data Science and ML remain together initially?
- Should Data Analysis and Visualization remain together?
- Should AI Studio and Forecasting & Advanced AI remain together?

### Multi-LLM allocation
- Which one or two squads should be assigned to Claude?
- Which one or two squads should be assigned to Google AI Studio?
- Which squads should ChatGPT coordinate or contribute to directly?
- What review and handoff format should every LLM use?
- Which tasks should Codex execute against the repository?

### Governance
- Should squads research independently while a central architecture council approves shared contracts and architectural decisions?
- What decisions can squad leads make independently?
- What requires product-owner approval?

## Initial risks to manage

| Risk | Why it matters | Mitigation |
|---|---|---|
| Overlapping squad ownership | Conflicting implementations and unclear accountability | Define explicit charters and ownership boundaries before implementation |
| LLM output inconsistency | Different tools may produce incompatible designs | Shared templates, source references, decision register, central review |
| Premature technology selection | Tools may be selected before workflows and constraints are understood | Research workflows first, then benchmark and compare technologies |
| Monolithic scope expansion | Attempting to build every workspace at once increases delivery risk | Dependency-based phases and thin vertical slices |
| Data duplication and lineage gaps | Workspaces could operate on inconsistent dataset versions | Design shared dataset/artifact identity and lineage contracts |
| Production regression | Planning work could accidentally affect live services | Documentation-only branch during this stage; explicit approval for production-impacting changes |
| Unverified claims | Research may repeat marketing claims or outdated library information | Record sources, dates, evidence quality, limitations, and validation status |

## Status
These are planning questions and risks, not approved architecture decisions. Update as evidence is collected.
