# Vercel deployment (Phase 1)

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

- Connect GitHub repo; set **Production Branch** to `Deploy` until cutover.
- Use branch `nextjs-migration` for preview deployments during migration UAT.

## Commands

```bash
npx vercel          # preview deploy
npx vercel --prod   # production (after Lane M cutover)
```

Do not commit `.env.local` or production secrets.
