# Vercel deployment

## Link project

```bash
cd kep-unklab-exam
npx vercel link
# Select lumenelit/kep-unklab-exam (or your fork)
# Root directory: . (repo root)
# Framework: Next.js (auto-detected)
```

## Environment variables (Vercel dashboard → Settings → Environment Variables)

| Variable     | Preview + Production                       |
| ------------ | ------------------------------------------ |
| `MONGO_URI`  | MongoDB connection string (Atlas or other) |
| `JWT_SECRET` | Random secret for signing session JWTs     |

## Branch deploys

- Connect GitHub repo; set **Production Branch** to **`main`**.
- Preview deployments: any branch/PR (use for Maam Resti UAT before prod promotion).
- Legacy branch `Deploy` — CRA/nginx Docker CI only; **do not use for Next.js**.

## Production cutover checklist (Lane M)

Code cutover is complete (`/api` same-origin; no Cloud Run URL in app). Ops steps to finish migration:

1. **Vercel:** Set production branch to `main`; promote latest deployment or `vercel --prod`.
2. **Env:** Confirm `MONGO_URI` + `JWT_SECRET` on Production (and Preview if used for UAT).
3. **Atlas:** Allow Vercel serverless egress (IP allowlist `0.0.0.0/0` or Vercel static IPs if restricted).
4. **Smoke:** Run [`docs/testing/migration-smoke.md`](./testing/migration-smoke.md) against production URL.
5. **DNS:** Point custom domain to Vercel if applicable.
6. **Retire legacy:**
   - Cloud Run service `kep-unklab-exam-api` — scale to zero or delete after sign-off.
   - Docker Hub images `filkomunklab/kep-unklab-exam*` — archive; rotate credentials ([vault backlog](https://github.com/lumenelit/kep-unklab-exam)).
7. **Notify:** Maam Resti / Sir George of new canonical URL.

## Commands

```bash
npx vercel          # preview deploy
npx vercel --prod   # production (after Lane M cutover)
```

Do not commit `.env.local` or production secrets.
