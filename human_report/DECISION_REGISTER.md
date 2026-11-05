# NUMPA Decision Register

This register tracks decisions separately from proposals and research recommendations.

| ID | Topic | Status | Decision / current position | Owner | Date |
|---|---|---|---|---|---|
| D-001 | Planning sequence | APPROVED | Complete squad organization, boundaries, contracts, workflow research, technology research, backend architecture, architecture approval, dependency roadmap, then implementation tasks. | Product owner | 2026-11-05 |
| D-002 | Human reporting system | APPROVED | Establish a `human_report/` directory with Markdown records before squad creation/activation. | Product owner | 2026-11-05 |
| D-003 | Multi-LLM working approach | APPROVED IN PRINCIPLE | Multiple LLMs/tools may contribute directly at repository level. No LLM has permanent squad, workspace, or layer ownership; the project must remain independent of any one LLM/provider. Task allocation is based on capability, availability, and task fit. | Product owner | 2026-11-05 |
| D-004 | Starting squad organization | READY FOR APPROVAL | Recommend one shared platform squad plus seven product squads, grouping all 12 workspaces by related professional workflows. See [Squad Map](SQUAD_MAP.md). | Product owner | 2026-11-05 |
| D-005 | Fixed LLM/tool allocation | SUPERSEDED | Fixed LLM-to-squad assignments are not part of NUMPA's operating model. See D-003 and the LLM-independent collaboration model in the Squad Map. | Product owner | 2026-11-05 |
| D-006 | Squad boundaries and charters | UNDER REVIEW | Eight proposed charters have been drafted in [human_report/squads](squads/README.md). Boundaries remain proposals pending product-owner review; no implementation is authorized. | Product owner | 2026-11-05 |
| D-007 | Inter-squad governance and contracts | UNDER REVIEW | Technology-neutral contract architecture, producer-consumer handoffs, and API/event/artifact/job standards drafted in human_report/contracts/. Pending product-owner review. | Product owner | 2026-11-05 |
| D-008 | Unified backend architecture | NOT STARTED | Evaluate only after domain workflow and technology research. | TBD | TBD |

## Decision record template

For each material decision, capture:
- ID and title
- Status
- Date and decision owner
- Context / problem
- Options considered
- Evidence and trade-offs
- Decision
- Consequences and risks
- Dependencies
- Revisit trigger
