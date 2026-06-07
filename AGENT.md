# KEP Unklab Exam

Next.js full-stack app for the Unklab KEP English placement exam — student UI, admin dashboard, and API (Route Handlers + MongoDB).

## Stack

- **Framework:** Next.js 15 (App Router), React 18
- **Styling:** Tailwind CSS 3, PrimeReact 9
- **Data:** MongoDB via Mongoose (`src/lib/models/`, `src/lib/services/`)
- **Auth:** JWT in httpOnly cookie `kep_token` (`src/middleware.js`, `src/lib/auth/`)
- **HTTP client:** axios → same-origin `/api` (`src/lib/api/client.js`)

## Design system (REQUIRED for all UI work)

Every admin dashboard / frontend change **must** follow the KEP design system. Before building or
editing any screen, component, or style:

- Read **[`docs/design-system.md`](docs/design-system.md)** — canonical tokens (color, type, radius,
  motion) + component recipes (agent-readable).
- Open **[`docs/design-system.html`](docs/design-system.html)** — the rendered visual spec sheet.

Match the tokens exactly — **do not invent new colors, fonts, radii, or shadows.** Non-negotiable:
status→color mapping, mono (IBM Plex Mono) for all numbers, borders-over-shadows for cards, and
brand purple reserved for primary/active/focus only. Source prototype: `temp/admin-dashboard-mockups/`.

## Getting started

```bash
npm install
cp .env.example .env.local   # MONGO_URI, JWT_SECRET
npm run dev                  # localhost:3000
```

## Environment variables

| Variable     | Purpose                   |
| ------------ | ------------------------- |
| `MONGO_URI`  | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret        |

## Scripts

| Script          | Purpose              |
| --------------- | -------------------- |
| `npm run dev`   | Dev server           |
| `npm run build` | Production build     |
| `npm start`     | Run production build |

## App structure

```
src/
  app/            # Pages + app/api/** Route Handlers
  components/     # UI (student exam, admin dashboard)
  contexts/       # AuthContext
  lib/
    api/client.js # Axios → /api
    auth/         # JWT, cookies, sign-in
    services/     # Business logic (exam, questions, student)
    models/       # Mongoose schemas
  middleware.js   # Route protection by role
docs/             # Technical documentation (canonical)
public/           # Static assets (/image, /media)
```

## Deploy

- **Primary:** Vercel — see `docs/VERCEL_DEPLOY.md`
- Legacy Docker workflow (CRA/nginx on branch `Deploy`) is not maintained for Next.js

## Related

- Technical docs: `docs/README.md`
- NestJS API: **retired** — GitHub `lumenelit/kep-unklab-exam-api` branch `archive/retired`
- Vault hub: `Projects/lumendev-kep-unklab-exam/`
