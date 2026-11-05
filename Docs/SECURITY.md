# Security Policy

> Controls below are the **design requirements**. Mark each as implemented only after verifying in code. Detail: [docs/SECURITY_AND_PRIVACY.md](docs/SECURITY_AND_PRIVACY.md).

## Authentication and Authorisation
- Token-based authentication (e.g. JWT) with expiry. **VERIFY**
- Passwords stored only as salted hashes (bcrypt/argon2). **VERIFY**
- Every API route checks identity and permission on the server.

## Role-Based Access Control
Roles: `owner/admin`, `reviewer` (outgoing member or team lead), `incoming member`. Handover views are additionally filtered by item sensitivity and the incoming member's project role. Filtering happens **before** retrieval, LLM processing and response, never only in the frontend.

## Sensitive Data Handling
- Each ingested item carries a sensitivity label and permission scope.
- Confidential items (salaries, client data, private chats) are excluded or redacted for roles without access.
- Do not send restricted items to the LLM for a role that cannot see them.
- Use synthetic, public or anonymised data for demos.

## Environment Secrets
Secrets live in environment variables or a secret manager. `.env` is git-ignored. Rotate any key that was ever committed.

## File Upload Security
- Allow-list of types (`.md`, `.txt`, `.csv`, `.json`, `.pdf` as applicable) and a size limit.
- Validate content type server-side, randomise stored filenames, never execute uploads.
- Treat uploaded text as untrusted input (prompt-injection risk).

## API Security
HTTPS only in production, restrictive CORS, rate limiting, input validation, generic error messages, no secrets in logs.

## Data Retention and Deletion
Project owners can delete a project and its sources, evidence and handovers. Retention period: _<decide>_. **Planned**

## Reporting Vulnerabilities
Email _<security contact>_ with details and reproduction steps. Please do not disclose publicly until fixed. Expected acknowledgement: _<timeframe>_.
