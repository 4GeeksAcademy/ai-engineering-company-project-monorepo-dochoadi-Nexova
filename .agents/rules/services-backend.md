---
description: Conventions for the centralised FastAPI backend under services/.
globs: ["services/**"]
---

Scope: files matching services/**

1. Put all backend code in `services/`. No API code under `uis/`, `agents/` or the repo root.
2. Build one centralised FastAPI app with one router per domain: `support`, `selection`, `training`, `sales`, `hr`, `executive`.
3. Do not create microservices. Extract a separate worker only when it must run apart from the API (e.g. a scheduled SLA-at-risk check for tickets approaching the 24 h limit), and document why in its README.
4. Make every endpoint tenant-aware: resolve the `tenant_id` of the client company from the request and filter by it in the data layer, never only in a prompt.
5. Serve the API on port 8000.
