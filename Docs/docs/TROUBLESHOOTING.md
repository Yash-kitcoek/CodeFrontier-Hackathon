# Troubleshooting

> Solutions assume the proposed stack (React/Next.js, Python or Node API, PostgreSQL). Adjust after verification.

| Problem | Likely cause | Fix |
|---|---|---|
| Frontend build fails | Wrong Node version, missing install, TypeScript/lint errors | Use Node 18+, `rm -rf node_modules && npm ci`, read the first error |
| Frontend calls wrong URL | `NEXT_PUBLIC_API_URL` not set at build time | Set it and rebuild (it is baked in at build) |
| Backend will not start | Missing env var or dependency | Check logs, confirm `.env`, reinstall requirements |
| `connection refused` to DB | DB not running, wrong host/port | Start PostgreSQL, verify `DATABASE_URL` |
| `relation does not exist` | Migrations not applied | Run the migration command |
| CORS error in browser | Frontend origin not in `CORS_ORIGINS` | Add exact origin (no trailing slash), restart backend |
| 401 on every request | Missing/expired token or mismatched `JWT_SECRET` | Log in again; keep secret consistent across instances |
| 403 for legitimate user | Role not assigned on project | Check `project_members` role |
| AI call fails | Invalid key, quota, wrong model name, timeout | Check `LLM_API_KEY`, `LLM_MODEL`, provider status; add retry |
| Extraction returns malformed JSON | Model output off-schema | Validation should reject and retry; shorten input chunks |
| Upload fails | File too large or type blocked | Check `MAX_UPLOAD_MB` and allow-list; check proxy body limit |
| Files vanish after deploy | Ephemeral disk | Use persistent volume or object storage |
| Deployed app works locally only | Env vars missing on host, HTTP vs HTTPS mismatch | Re-check host env settings and URLs |
