# Migration smoke checklist (Lane P)

Manual and scripted checks after the Next.js + Vercel migration. Run against **local** (`npm run dev`) or a **Vercel preview/production** URL.

## Quick API smoke (script)

```bash
# From repo root — defaults to http://localhost:3000
./scripts/smoke-api.sh

# Or against a deployed URL
BASE_URL=https://your-preview.vercel.app ./scripts/smoke-api.sh
```

## Preconditions

- `MONGO_URI` and `JWT_SECRET` configured for the target environment.
- At least one admin user in MongoDB (for admin flow).
- Optional: seeded exam + question bank for full student flow.

## Automated checks (`scripts/smoke-api.sh`)

| Check | Expected |
| ----- | -------- |
| `GET /api/health` | `200`, `{ "status": "ok" }` |
| `GET /dashboard` (no cookie) | redirect to `/` |
| `POST /api/auth/login/admin` (bad creds) | `401` |
| Cookie auth | No `access_token` in JSON body on success (token in httpOnly cookie only) |

## Manual matrix

### Auth

- [ ] Admin login → lands on `/dashboard/exams`
- [ ] Student login with valid token + ID → exam flow
- [ ] Logout clears session; `/dashboard` redirects to `/`
- [ ] DevTools → Application → no JWT in `sessionStorage` / `localStorage`

### Admin

- [ ] Create exam with question banks
- [ ] Import participant CSV (≤ 4 MB)
- [ ] Upload image on question editor (compresses to ≤ 500 KB)
- [ ] Upload audio (≤ 4 MB)
- [ ] Start exam → token displayed
- [ ] Refresh score table after submissions

### Student

- [ ] Terms → exam → answer → bookmark → submit
- [ ] Score or waiting view after submit
- [ ] Page refresh mid-exam keeps session (cookie)
- [ ] Listening audio play limit (3 plays)
- [ ] Timer poll (~30s) and auto-end behavior

### Upload limits (Lane N + O)

- [ ] Image > 500 KB after compression shows clear error
- [ ] Audio > 4 MB rejected client-side before upload
- [ ] CSV > 4 MB rejected client-side

## Legacy stack (should NOT be used)

- NestJS Cloud Run API URL
- CRA branch `Deploy` + nginx Docker path for new deployments
- `REACT_APP_BACKEND_URI` / external API proxy

## Related

- Deploy: [VERCEL_DEPLOY.md](../VERCEL_DEPLOY.md)
- Vault runbook: `Projects/lumendev-kep-unklab-exam/runbooks/runbook-deploy.md`
