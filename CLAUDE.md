# KEP Unklab Exam (Frontend)

React SPA for the Unklab KEP English placement exam — student exam UI and admin dashboard.

## Stack

- **Framework:** Create React App (React 18)
- **Styling:** Tailwind CSS 3, PrimeReact 9 (component library), PrimeIcons
- **Routing:** React Router DOM 6
- **HTTP:** axios (configured in `src/config/index.js`)
- **PDF/export:** jspdf, jspdf-autotable, file-saver, xlsx
- **UI extras:** react-spinners, @trendmicro/react-sidenav

## Getting started

```bash
npm install
npm start   # CRA dev server (localhost:3000)
```

> **Known issue:** `src/config/index.js` hardcodes the prod API URL. To point at a local API, temporarily change `baseURL` to `http://localhost:8080`. A proper `BACKEND_URI` env var wiring is tracked in the vault backlog.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `BACKEND_URI` | API base URL — intended but not yet wired; see `src/config/index.js` |

## Scripts

| Script | Purpose |
| --- | --- |
| `npm start` | Dev server |
| `npm run build` | Production build to `build/` |
| `npm test` | Unit tests |

## App structure

```
src/
  App.js                     # Route definitions
  config/index.js            # Axios instance (API base URL hardcoded here)
  contexts/
    AuthContext.jsx           # Auth state (student + admin JWT, user info)
    AuthContextLayout.jsx     # Outlet wrapper providing auth context
  utils/
    ProtectedRoute.jsx        # Redirects unauthenticated users to /
  page/
    login/
      Login.jsx               # Student login (studentId + exam token)
      Getstarted.jsx          # Pre-exam instructions / consent
      ErrorCheck.jsx          # Login error display
    Exam.jsx                  # Exam-taking page (questions, timer, submit)
    score/
      Score.jsx               # Score / waiting-for-results page
      Answer.jsx              # Answer review
    dashboard/
      Dashboard.jsx           # Admin shell with sidebar
      DashboardHome.jsx       # Exam list
      DashboardQuestion.jsx   # Question bank list
      ExamPage.jsx            # Single exam management (students, start, score)
      QuestionEditor.jsx      # Question CRUD editor
  components/
    Header.jsx / Footer.jsx
    Question.jsx / Option.jsx  # Exam question + answer option rendering
    Timer.jsx                  # Countdown timer
    Media.jsx                  # Image / audio media display
    Warning.jsx
    dashboard/
      Card.jsx
      CSVDownload.jsx
      EditableOptions.jsx
      ExamModal.jsx
      QuestionEditorItem.jsx
      SelectableDropdown.jsx
      Sidebar.jsx
  styles/
    audio.css
```

## Routes

| Path | Component | Auth |
| --- | --- | --- |
| `/` | `Login` | Public |
| `/started` | `Getstarted` | Protected |
| `/exam` | `Exam` | Protected |
| `/waiting` | `Score` | Protected |
| `/score` | `Score` | Protected |
| `/dashboard/exams` | `DashboardHome` | Protected (admin) |
| `/dashboard/questions` | `DashboardQuestion` | Protected (admin) |
| `/dashboard/exams/:examId` | `ExamPage` | Protected (admin) |
| `/dashboard/questions/:questionId` | `QuestionEditor` | Protected (admin) |

## Auth flow

1. Student enters `studentId` + exam `token` → `POST /auth/student` → JWT stored in context.
2. Admin enters username + password → `POST /auth/login` → JWT with `role: admin`.
3. `ProtectedRoute` checks auth context; unauthenticated users redirected to `/`.

## Deploy

- Branch `Deploy` → GitHub Actions → Docker image `filkomunklab/kep-unklab-exam` pushed to Docker Hub.
- Served via nginx (see `nginx.conf`).

## Related

- API repo: `lumenelit/kep-unklab-exam-api` (branch `main`)
- Managerial hub: Obsidian vault `Projects/lumendev-kep-unklab-exam/`
