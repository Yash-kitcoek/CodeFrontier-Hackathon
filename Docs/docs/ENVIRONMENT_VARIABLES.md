# Environment Variables

> **Proposed list.** Replace with variables actually read in code (`grep -rn "process.env\|os.getenv\|os.environ"`). Use placeholders only. Never commit real values.

| Variable | Purpose | Required | Example |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://USER:PASSWORD@localhost:5432/knowledge_handover` |
| `JWT_SECRET` | Signs auth tokens | Yes | `<long-random-string>` |
| `JWT_EXPIRE_MINUTES` | Token lifetime | No | `60` |
| `LLM_API_KEY` | LLM provider key | Yes (for analysis) | `<your-llm-api-key>` |
| `LLM_MODEL` | Model identifier | Yes | `<model-name>` |
| `GITHUB_TOKEN` | Read-only token for GitHub connector | No | `<github-token>` |
| `CORS_ORIGINS` | Allowed frontend origins | Yes (prod) | `http://localhost:3000` |
| `UPLOAD_DIR` | Local upload path | No | `./uploads` |
| `MAX_UPLOAD_MB` | Upload size limit | No | `10` |
| `FRESHNESS_DAYS` | Stale-knowledge threshold | No | `90` |
| `NEXT_PUBLIC_API_URL` | Backend URL used by frontend | Yes | `http://localhost:8000` |
| `ENVIRONMENT` | `development` / `production` | No | `development` |

Matching `.env.example` should contain these keys with empty or placeholder values.
