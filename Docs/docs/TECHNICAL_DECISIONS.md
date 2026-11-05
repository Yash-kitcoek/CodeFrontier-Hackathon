# Technical Decisions

> Proposed decisions. Edit to match what the team actually chose.

## 1. Evidence-first extraction
- **Context:** Plain summarisation hallucinates and cannot be checked.
- **Alternatives:** Free-text summary; RAG chatbot.
- **Reason:** Structured items with source citations make claims verifiable.
- **Trade-offs:** More engineering; some items end as "Insufficient evidence".
- **Status:** VERIFY

## 2. Rule-based evidence statuses instead of percentages
- **Context:** Arbitrary scores imply false precision.
- **Alternatives:** LLM self-reported confidence.
- **Reason:** Documented rules are explainable and testable.
- **Trade-offs:** Coarser than a score.
- **Status:** VERIFY

## 3. Relational database (PostgreSQL)
- **Context:** Data is relational: items, evidence, conflicts, versions.
- **Alternatives:** Firestore/MongoDB.
- **Reason:** Constraints, joins, transactions, version history; optional pgvector.
- **Trade-offs:** Schema migrations needed.
- **Status:** VERIFY

## 4. Server-side permission filtering
- **Context:** Frontend-only hiding leaks data.
- **Alternatives:** UI filtering.
- **Reason:** Filter before retrieval and LLM calls.
- **Trade-offs:** Every query needs role context.
- **Status:** VERIFY

## 5. Human approval gate
- **Context:** Nothing should reach the new person as truth unreviewed.
- **Alternatives:** Fully automatic handover.
- **Reason:** Trust and accountability.
- **Trade-offs:** Slower than automation.
- **Status:** VERIFY

## 6. Narrow scope
- **Context:** Judges reward focus.
- **Reason:** One setting (student/college teams) and 2-3 source types, done end to end.
- **Trade-offs:** Fewer integrations.
- **Status:** Planned
