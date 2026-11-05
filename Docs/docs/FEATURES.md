# Feature Catalogue

**Status legend:** Implemented · Partially implemented · Planned · Not implemented.
All statuses below are **"Unverified (default Planned)"**. Update after repository inspection. Complexity: Low / Medium / High.

## Core Features
| Feature | What / why | How | Status | Module / API |
|---|---|---|---|---|
| Authentication & roles | Who can do what | JWT + role check | VERIFY | `/auth/*` |
| Project management | Container for sources and handovers | CRUD + members | VERIFY | `/projects` |
| Source ingestion | Bring scattered knowledge together | Upload / GitHub | VERIFY | `/projects/{id}/sources` |
| Knowledge extraction | Decisions, tasks, owners, blockers, risks, dependencies | LLM + schema | VERIFY | `/analyze` |
| Review and approval | Human stays in control | Edit/confirm/reject, versions | VERIFY | `/items`, `/handovers/{id}/approve` |
| Acknowledgement | Proof of handover | Logged action | VERIFY | `/handovers/{id}/acknowledge` |

## Differentiators
| # | Feature | Benefit | How it would work | Complexity | Status |
|---|---|---|---|---|---|
| 1 | Evidence Confidence Engine | Reader knows what to trust | Rule-based status + reason + citation (see [AI_PIPELINE.md](AI_PIPELINE.md)) | Medium | VERIFY |
| 2 | Contradiction Ledger | Disagreements visible | Compare items per subject; store both sides, timestamps, resolution | Medium | VERIFY |
| 3 | Decision Archaeology | Understand "why" | Decision item with when/who/why/sources/superseded_by fields | Medium | VERIFY |
| 4 | Role-Specific Views | Least-privilege handover | Server-side filter by role + sensitivity before retrieval | Medium | VERIFY |
| 5 | Handover Readiness Assessment | Shows gaps | Formula below | Low | VERIFY |
| 6 | Knowledge Freshness Indicator | Spot stale info | Rule: flag if source older than N days with no newer verification, or newer conflicting evidence | Low | Planned |
| 7 | Dependency Impact Explorer | See blast radius | Graph of items with `depends_on` edges | High | Planned |
| 8 | Interactive Timeline | See history | Time-ordered events linking to evidence | Medium | Planned |
| 9 | Smart Next-Action Planner | Where to start | Rank open tasks by blockers/dependencies; label "AI suggestion" vs "assigned" | Medium | Planned |
| 10 | Feedback Loop | Improves handover | Feedback types + versioned corrections | Low | VERIFY |

## Handover Readiness Assessment (transparent formula)
Start at 100 and subtract (weights are **heuristic, not validated**; show breakdown in UI and never present as a measure of project quality):

| Factor | Penalty |
|---|---|
| Each unresolved contradiction | -10 (max -30) |
| Each item without an owner | -5 (max -20) |
| Each unverified decision | -5 (max -20) |
| Evidence coverage below 100% | -(100 - coverage%) × 0.2 |
| Stale items | -2 each (max -10) |

Label as "Readiness checklist score", not "quality".
