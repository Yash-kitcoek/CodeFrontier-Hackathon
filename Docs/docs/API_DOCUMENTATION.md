# API Documentation

> **Every endpoint below is PLANNED (design target)** until verified against the actual routes. Move verified ones to "Implemented" and delete invented ones. Auto-generated docs (e.g. FastAPI `/docs`) should be linked if available.

Base URL: `http://localhost:8000` (local). Auth: `Authorization: Bearer <token>` unless stated.

## Error format
```json
{ "error": { "code": "FORBIDDEN", "message": "You do not have access to this resource." } }
```
Common codes: `400` validation, `401` unauthenticated, `403` forbidden, `404` not found, `422` schema error, `429` rate limited, `500` server.

## Health
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | No | Liveness. Returns `{"status":"ok"}` |

## Auth
| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/auth/register` | `{email,password,name}` | `201` user |
| POST | `/auth/login` | `{email,password}` | `{access_token,token_type}` |
| GET | `/auth/me` | | current user |

## Projects
| Method | Path | Purpose |
|---|---|---|
| POST | `/projects` | Create project `{name}` |
| GET | `/projects` | List member projects |
| GET | `/projects/{id}` | Project detail |
| POST | `/projects/{id}/members` | Add member `{user_id, role}` |

## Sources
| Method | Path | Purpose |
|---|---|---|
| POST | `/projects/{id}/sources/upload` | Multipart upload (notes/chat/task export) |
| POST | `/projects/{id}/sources/github` | Connect repo `{repo, token_ref}` |
| GET | `/projects/{id}/sources` | List sources |
| DELETE | `/sources/{sid}` | Remove source and derived data |

## Analysis
| Method | Path | Purpose |
|---|---|---|
| POST | `/projects/{id}/analyze` | Start extraction job |
| GET | `/projects/{id}/analysis/status` | Job state |

## Knowledge items and evidence
| Method | Path | Purpose |
|---|---|---|
| GET | `/projects/{id}/items?type=decision` | List items with evidence status |
| GET | `/items/{iid}` | Item + evidence + reason for status |
| PATCH | `/items/{iid}` | Reviewer edit / confirm / reject |

## Contradiction Ledger
| Method | Path | Purpose |
|---|---|---|
| GET | `/projects/{id}/contradictions` | List both sides, sources, timestamps, status |
| POST | `/contradictions/{cid}/resolve` | `{resolution, note}` (human only) |

## Handover
| Method | Path | Purpose |
|---|---|---|
| GET | `/projects/{id}/readiness` | Readiness breakdown |
| POST | `/projects/{id}/handovers` | Create draft `{to_user, role}` |
| POST | `/handovers/{hid}/approve` | Approve (reviewer role) |
| GET | `/handovers/{hid}` | Role-filtered view (server-side) |
| POST | `/handovers/{hid}/acknowledge` | Incoming member acknowledgement |
| POST | `/handovers/{hid}/feedback` | `{type, item_id?, message}` |
| GET | `/handovers/{hid}/versions` | Version history |

## Timeline
| Method | Path | Purpose |
|---|---|---|
| GET | `/projects/{id}/timeline` | Events with evidence links (**Planned**) |
