# KEP Unklab Exam

Next.js full-stack app for the Unklab KEP English placement exam — student UI, admin dashboard, and API (Route Handlers + MongoDB).

## Documentation

- **Technical docs:** [`docs/README.md`](docs/README.md) — data model, app flow, design system, deploy
- **Managerial hub:** Obsidian vault `Projects/lumendev-kep-unklab-exam/`

## Getting started

```bash
npm install
cp .env.example .env.local   # MONGO_URI, JWT_SECRET
npm run dev                  # localhost:3000
```

## Scripts

| Script          | Purpose              |
| --------------- | -------------------- |
| `npm run dev`   | Dev server           |
| `npm run build` | Production build     |
| `npm start`     | Run production build |

## Environment

| Variable     | Purpose                   |
| ------------ | ------------------------- |
| `MONGO_URI`  | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret        |

## Repo

- **App (this repo):** [`lumenelit/kep-unklab-exam`](https://github.com/lumenelit/kep-unklab-exam) — branch `nextjs-migration` (production cutover pending)
- **NestJS API:** **retired** — [`lumenelit/kep-unklab-exam-api`](https://github.com/lumenelit/kep-unklab-exam-api) branch `archive/retired`

## Deploy

- **Primary:** Vercel — see [`docs/VERCEL_DEPLOY.md`](docs/VERCEL_DEPLOY.md)
- Legacy Docker workflow (CRA/nginx on branch `Deploy`) is not maintained for Next.js
