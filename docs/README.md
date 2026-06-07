# KEP Unklab Exam — Technical Documentation

Next.js full-stack app for the Universitas Klabat (Unklab) KEP English placement exam:
admin user management, exam sessions with token-based student login, question banks,
student submissions, scoring, and file import/export.

This folder is the **canonical home for technical documentation** for the application.
Managerial / governance notes (status, decisions, backlog, runbooks, risks) live in the
Obsidian vault under `Projects/lumendev-kep-unklab-exam/`.

## Start here

| Doc                                                    | What it covers                                                                                              |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| [Data flow audit](./data-flow.md)                      | Full pipeline: question bank → exam → start → student answers → scoring (architecture + sequence diagrams). |
| [End-to-end app flow & local run guide](./app-flow.md) | How to run locally, the full exam lifecycle (admin + student), API routes, scoring math, and known gotchas. |
| [Data model overview](./data-model/data-overview.md)   | MongoDB collections — verify against `src/lib/models/*.js`.                                                     |
| [Design system](./design-system.md)                    | **Canonical UI tokens + component recipes** for the admin dashboard. Visual spec: [`design-system.html`](./design-system.html). Follow for all frontend work. |
| [Vercel deployment](./VERCEL_DEPLOY.md)                | Preview/production deploy on Vercel.                                                                        |

## Quick reference

- **Stack:** Next.js 15 (App Router), React 18, MongoDB via Mongoose 9, JWT (`jose`), bcrypt, CSV/XLSX import.
- **Models:** `src/lib/models/` — `User`, `Exam`, `Question`, `Students`, `Files`.
- **API:** Route Handlers under `src/app/api/**` → `src/lib/services/*` → MongoDB (same-origin `/api`, not a separate backend).
- **Auth:** httpOnly cookie `kep_token` (JWT); middleware + `requireAuth` on routes.
- **Env:** `MONGO_URI`, `JWT_SECRET` (see `.env.example`).
- **Dev:** `npm run dev` (port 3000).
- **Deploy:** Vercel (primary); legacy Docker workflow on branch `Deploy` is CRA-era — see backlog Lane M.

## Related

| Location                                                                            | Role                                                          |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [`lumenelit/kep-unklab-exam`](https://github.com/lumenelit/kep-unklab-exam)         | This app (branch `nextjs-migration` → production cutover)     |
| [`lumenelit/kep-unklab-exam-api`](https://github.com/lumenelit/kep-unklab-exam-api) | **Retired** NestJS API — archived on branch `archive/retired` |

## Doc ownership

| Kind                                                           | Where                                                |
| -------------------------------------------------------------- | ---------------------------------------------------- |
| Architecture, data model, API reference, deploy notes          | **This repo's `docs/`**                              |
| Status, ADRs, backlog, runbooks, risks, commercial/ops context | Obsidian vault: `Projects/lumendev-kep-unklab-exam/` |
