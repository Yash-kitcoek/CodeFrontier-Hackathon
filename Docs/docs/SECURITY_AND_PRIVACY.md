# Security and Privacy

> Design requirements. Mark each control implemented only after verification. Policy summary: [../SECURITY.md](../SECURITY.md).

| Area | Requirement | Status |
|---|---|---|
| Data minimisation | Ingest only authorised sources; store only needed fields; allow deletion | VERIFY |
| Permission-aware retrieval | Filter by role/sensitivity in the query, before LLM and before response | VERIFY |
| Role-based sharing | Incoming member sees only approved, role-allowed items | VERIFY |
| Confidential protection | Salaries, client data, private chats excluded/redacted for unauthorised roles | VERIFY |
| Sensitive data redaction | Pattern + label-based redaction (emails, phone numbers, keys) | Planned |
| Secure file processing | Type/size checks, no execution, isolated parsing | VERIFY |
| Secret management | Env vars/secret manager, rotation, git-ignored `.env` | VERIFY |
| Audit logs | Who viewed/approved/changed what and when | VERIFY |
| Data retention | Defined period and deletion on request | Planned |
| Consent | Source connection records who authorised sharing | VERIFY |

## Limitations and Risks
- LLM extraction can be wrong or incomplete; evidence checks reduce but do not remove this.
- Redaction is best-effort; sensitivity labels depend on correct tagging.
- Prompt injection from source text is possible; mitigations reduce risk only.
- Sending data to an external LLM provider has privacy implications; review the provider's terms.
- Demo and test data must be synthetic, public or anonymised.
