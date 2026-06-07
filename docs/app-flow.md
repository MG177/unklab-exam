# KEP Unklab Exam — End-to-End App Flow & Local Run Guide

> Single-repo Next.js app (`kep-unklab-exam`). The UI and API share one process:
> `app/api/**` Route Handlers call `lib/services/*` against MongoDB.
> The legacy NestJS API repo is retired (see `docs/README.md`).

---

## 1. Run locally

| Piece   | Where                   | Port     | Command                          |
| ------- | ----------------------- | -------- | -------------------------------- |
| MongoDB | local `mongod` or Atlas | 27017    | db name from `MONGO_URI`         |
| App     | `kep-unklab-exam/`      | **3000** | `npm install` then `npm run dev` |

**Env** (`.env.local`):

```
MONGO_URI=mongodb://localhost:27017/kep-unklab-exam
JWT_SECRET=<random-secret>
```

- API base URL: same-origin `/api` (`lib/api/client.js`, `withCredentials: true`).
- Auth cookie: `kep_token` (httpOnly JWT).
- Empty DB = no admin. Bootstrap via `POST /api/auth/register` (needs existing admin) or manual user insert — see §6.

---

## 2. Architecture

```
Browser → middleware.js (JWT + role) → app/api/**/route.js → lib/services/* → MongoDB
```

- **Admin JWT payload:** `{ username, id, role: ['admin'] }`.
- **Student JWT payload:** `{ studentName, studentId, examName, examId, isRandom, isShowAnswer, isShowScore, role: ['student'] }`.
- Student routes use `requireAuth(request, 'student')`; admin routes use `requireAuth(request, { role: 'admin' })`.

### Collections

See [data-model/data-overview.md](./data-model/data-overview.md). Summary:

| Collection  | Role                                                |
| ----------- | --------------------------------------------------- |
| `users`     | Admin accounts                                      |
| `questions` | Question banks (embedded `questions[]` items)       |
| `exams`     | Exam config + embedded roster + question-group refs |
| `students`  | Per-student submission (`questionList`, `score`)    |
| `files`     | Image/audio for questions                           |

`exams.questions` holds `{ _id, questionName, quantity, questionLength }` per bank.
On `POST /api/student/start`, the server samples `quantity` items per group into `students.questionList`.

---

## 3. Full lifecycle

Base URL: `http://localhost:3000/api`. Admin/student calls send the `kep_token` cookie (or `Authorization: Bearer`).

```
0. Bootstrap admin
   POST /api/auth/register  {id,name,username,password,role:["admin"]}  (first admin: insert user in Mongo or temporary public register)
   POST /api/auth/login/admin  {username,password}  → sets cookie

1. Question bank
   POST /api/questions            {questionName}
   PUT  /api/questions/update/:id {questions:[...]}  → verify(); sets isVerified

2. Create exam
   POST /api/exam/:examName       [{_id, questionName, quantity, questionLength}]

3. Student roster
   PATCH /api/exam/studentList/:id  multipart CSV/XLSX

4. Start exam
   PATCH /api/exam/start/:id?minute=65&token=123456
   → sets startTime, endTime, token. minute=0 stops early.

5. Toggles
   PATCH /api/exam/switch/:id  {isShowScore, isShowAnswer, isRandom}

— Student —

6. Login
   POST /api/auth/login/student  {studentId, token}
   → cookie; gated by exam.endTime and roster

7. Start paper
   POST /api/student/start
   → samples questions; true = go to /started, false = already scored → /score

8. T&C (client only)
   /started → sessionStorage.agree → /exam

9. Get paper
   GET /api/student/questions  (correctAnswer stripped)

10. Answer / bookmark
    PATCH /api/student/answer    {index, answer}
    PATCH /api/student/bookmark  {index, isBookmark}

11. Submit
    PATCH /api/student/submit  → isSubmitted=true

12. Score
    GET /api/student/score  (requires isShowScore; after exam time ends on /score page)

— Admin review —

13. Score table   GET /api/exam/score/:id
    One student   GET /api/student/score/:examId/:studentId
    Reset         DELETE /api/student/:examId/:studentId
    Refresh       PUT /api/exam/refresh/score/:examId
```

### Scoring

- Per group: `score = round(correct / total * 100)` (`lib/services/student.service.js`).
- Overall: `extractScore()` sums correct/total across groups.
- Computed lazily on `GET /student/score`, not on each answer.

---

## 4. Frontend routes → API map

| Route                               | File                                            | Key API calls                                   |
| ----------------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| `/`                                 | `app/page.jsx`                                  | login student/admin, `POST /student/start`      |
| `/started`                          | `app/started/page.jsx`                          | client T&C only                                 |
| `/exam`                             | `app/exam/page.jsx`                             | `GET student/questions`, answer/bookmark/submit |
| `/score`                            | `app/score/page.jsx`                            | `GET exam/time`, `GET /student/score`           |
| `/dashboard/exams`                  | `app/dashboard/exams/page.jsx`                  | exam CRUD                                       |
| `/dashboard/exams/[examId]`         | `app/dashboard/exams/[examId]/page.jsx`         | roster, start/stop, scores                      |
| `/dashboard/questions`              | `app/dashboard/questions/page.jsx`              | question banks                                  |
| `/dashboard/questions/[questionId]` | `app/dashboard/questions/[questionId]/page.jsx` | editor, import                                  |

Auth state: `contexts/AuthContext.jsx` + cookie. Question index: `sessionStorage.number`.

---

## 5. Gotchas

1. **Sampling at login:** `POST /student/start` runs on login, before T&C — question set is fixed before `/exam`.
2. **Re-login:** existing `students` doc is reused; no re-sample unless deleted by admin.
3. **`$sample`:** per-student draw is random even when `isRandom=false`; `isRandom` also shuffles order and options.
4. **Answer index:** PATCH uses 0-based array index, not display `id`.
5. **Time gates:** login blocked before start / after end; answers blocked after end; submit has 2-minute grace.
6. **Rate limit:** in-memory on login routes — weak across Vercel instances (`lib/rate-limit.js`).

---

## 6. Quick bootstrap (empty DB)

Insert first admin directly in MongoDB, or use register if you temporarily allow it:

```javascript
// mongosh — adjust username/password hash as needed
db.users.insertOne({
  id: 'admin1',
  name: 'Demo Admin',
  username: 'admin',
  password: '<bcrypt hash>',
  role: ['admin'],
});
```

Wipe student attempts: `db.students.deleteMany({})`.
