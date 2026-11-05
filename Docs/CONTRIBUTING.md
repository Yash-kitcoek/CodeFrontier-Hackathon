# Contributing

## Workflow
1. Fork or branch from `main`.
2. Create a focused branch.
3. Make small, tested changes.
4. Open a pull request.

## Branch Naming
`feature/<short-name>` · `fix/<short-name>` · `docs/<short-name>` · `chore/<short-name>`

## Commit Convention (Conventional Commits)
```
feat: add contradiction ledger endpoint
fix: enforce role filter before retrieval
docs: update API documentation
test: add permission tests for handover view
```

## Pull Request Guidelines
- Describe what changed and why.
- Link the related issue.
- Include test evidence you actually ran.
- Update documentation if behaviour, routes or env vars change.
- Never include secrets, real chats or real personal data.

## Code Formatting
Use the project's configured formatters and linters (**VERIFY**: e.g. Prettier/ESLint for the frontend, Black/Ruff for Python). Run them before committing.

## Testing Requirements
New logic needs tests. Changes to permissions, evidence status or conflict detection must include tests. See [docs/TESTING.md](docs/TESTING.md).

## Issue Reporting
Include: expected behaviour, actual behaviour, steps to reproduce, environment, logs (with secrets removed). Security issues: follow [SECURITY.md](SECURITY.md), do not open public issues.
