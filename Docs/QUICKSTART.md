# Quickstart

Get the project running locally. **VERIFY** each command against `package.json` / `requirements.txt` / `pyproject.toml` in your repo; adjust if your stack differs.

## Prerequisites
- Git
- Node.js 18+ and npm (frontend)
- Python 3.10+ and pip (backend), if the backend is Python
- PostgreSQL 14+ (local install or Docker)
- An API key for your chosen LLM provider
- Optional: a GitHub personal access token (read-only scopes) for the GitHub connector

## 1. Clone
```bash
git clone <your-repo-url>
cd <repo-folder>
```

## 2. Environment
```bash
cp .env.example .env
```
Fill in values using [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md). Never commit `.env`.

## 3. Database
```bash
createdb knowledge_handover
# run migrations using your project's tool, for example:
# alembic upgrade head      (SQLAlchemy/Alembic)
# npx prisma migrate dev    (Prisma)
```
See [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md).

## 4. Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 5. Frontend
```bash
cd frontend
npm install
npm run dev
```

## 6. Verify
| Check | Expected |
|---|---|
| `curl http://localhost:8000/health` | `{"status":"ok"}` |
| Open `http://localhost:3000` | Login page loads |
| Frontend network calls | Hit the backend URL set in `NEXT_PUBLIC_API_URL` with no CORS errors |

## Common Startup Problems
See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).
