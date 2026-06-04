# KEP Unklab Exam (Frontend)

React SPA for the Unklab KEP English placement exam — student exam UI, admin dashboard
(question editor, exam management, scoring), built with Create React App, Tailwind CSS,
PrimeReact, and axios.

## Documentation

- **Backend / data model:** [`kep-unklab-exam-api/docs/README.md`](https://github.com/lumenelit/kep-unklab-exam-api/blob/main/docs/README.md)
- **Managerial hub:** Obsidian vault `Projects/lumendev-kep-unklab-exam/`

## Getting started

```bash
npm install
# Set BACKEND_URI in .env (see .env.example pattern — config currently hardcodes prod URL; see vault backlog)
npm start
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm start` | Dev server (CRA) |
| `npm run build` | Production build |
| `npm test` | Unit tests |

## Environment

| Variable | Purpose |
| --- | --- |
| `BACKEND_URI` | API base URL (intended; `src/config/index.js` currently hardcodes prod — see vault backlog) |

## Repos

- **Frontend (this repo):** [`lumenelit/kep-unklab-exam`](https://github.com/lumenelit/kep-unklab-exam) — branch `Deploy`
- **API:** [`lumenelit/kep-unklab-exam-api`](https://github.com/lumenelit/kep-unklab-exam-api) — branch `main`

## Deploy

Docker image `filkomunklab/kep-unklab-exam` built on push to `Deploy` via GitHub Actions.
Confirm production hosting (Cloud Run or other) in the vault deploy runbook.
