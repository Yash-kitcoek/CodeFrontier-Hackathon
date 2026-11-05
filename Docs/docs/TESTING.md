# Testing

> No test results are claimed here. Record real results only after running the commands. **VERIFY** commands against your scripts.

## Commands (proposed)
```bash
# Backend
pytest -q
pytest --cov=app

# Frontend
npm test
npm run lint
npm run build
```
Existing coverage: _not measured / record after running_.

## Test Types
| Type | What to cover |
|---|---|
| Unit | Chunking, status rules, readiness formula, redaction |
| Integration | Ingestion → extraction → evidence storage |
| API | Every route: success, validation error, 401, 403 |
| Frontend | Key screens render; ledger and evidence viewer |
| Authentication | Wrong password, expired token, no token |
| Permission | **Incoming user cannot fetch restricted items via direct API call**; role view excludes confidential records before LLM call |
| AI output validation | Malformed JSON rejected; missing fields rejected |
| Evidence verification | Quoted span absent from cited record → item downgraded |
| Conflict detection | Synthetic pair "payment completed" vs "payment testing pending" creates ledger entry and no silent winner |
| End-to-end | Full demo scenario in [DEMO_GUIDE.md](DEMO_GUIDE.md) |
| Smoke (post-deploy) | `/health`, login, upload, analyse |

## Suggested Fixtures
Synthetic files under `tests/fixtures/`: `meeting_notes.md`, `tasks.csv`, `commits.json`, one with a deliberate contradiction, one with a confidential line.
