# Data Model

> Source of truth: `lib/models/*.js`. This doc is kept in sync with those
> Mongoose schemas. All collections use `{ timestamps: true }` (Mongoose adds
> `createdAt` / `updatedAt`).

The system has four primary collections plus a `files` collection. Note the
shape differs from a classic relational model: the **exam roster is embedded**
on the `Exam` document, while each student's **submission is a separate
`students` document** keyed by `(studentId, examId)`.

---

## `users` — admin accounts (`lib/models/User.js`)

| Field      | Type     | Notes                           |
| ---------- | -------- | ------------------------------- |
| `id`       | string   | required, **unique**            |
| `name`     | string   | required                        |
| `username` | string   | required, **unique** (login id) |
| `password` | string   | required, bcrypt hash           |
| `role`     | string[] | required, e.g. `["admin"]`      |
| `exams`    | any[]    | optional, currently unused      |

Bootstrap the first admin via `POST /api/auth/register` (requires an existing admin)
or a one-off MongoDB insert / seed script. Further admins use `POST /api/auth/register`.

---

## `exams` — exam sessions + roster (`lib/models/Exam.js`)

| Field          | Type              | Notes                                                          |
| -------------- | ----------------- | -------------------------------------------------------------- |
| `examName`     | string            | required                                                       |
| `token`        | string            | **unique** index; 6-digit login token, (re)issued by `start()` |
| `questions`    | QuestionInfoDto[] | required; question-group config (see below)                    |
| `students`     | StudentList[]     | embedded roster (default `null`)                               |
| `isRandom`     | boolean           | default `false` — shuffle question/option order                |
| `isShowScore`  | boolean           | default `true` — student may view their score                  |
| `isShowAnswer` | boolean           | default `false` — student may review answers                   |
| `startTime`    | Date              | set by `start()`                                               |
| `endTime`      | Date              | set by `start()` (= startTime + minutes); gates student login  |

`QuestionInfoDto` (per question group): `{ _id, questionName, quantity, questionLength }`
— `_id` references a `questions` document; `quantity` is how many to sample.

`StudentList` (roster entry): `{ number, studentId, studentName }`.

Indexes: `token` (unique), `createdAt: -1`.

---

## `questions` — question banks (`lib/models/Question.js`)

| Field          | Type       | Notes                                                    |
| -------------- | ---------- | -------------------------------------------------------- |
| `questionName` | string     | required (bank name, e.g. "Reading")                     |
| `isVerified`   | boolean    | default `false`; set true once questions pass validation |
| `questions`    | question[] | default `null`; the actual items (see below)             |

Embedded `question`: `{ text, answer, correctAnswer, options: [{ id, text }], image?, audio? }`
— `correctAnswer` is the `id` of the correct option.

Index: `createdAt: -1`.

---

## `students` — per-student submissions (`lib/models/Students.js`)

One document per `(studentId, examId)`, created when the student calls `POST /api/student/start`.

| Field          | Type                      | Notes                                 |
| -------------- | ------------------------- | ------------------------------------- |
| `studentName`  | string                    | required                              |
| `studentId`    | string                    | required                              |
| `examName`     | string                    | required                              |
| `examId`       | string                    | required (references an `exams` doc)  |
| `isSubmitted`  | boolean                   | default `false`                       |
| `questionList` | StudentQuestionsListDto[] | required; sampled questions + answers |
| `score`        | ScoreDto[]                | per-group score breakdown (see below) |

`StudentQuestionsListDto` extends the question shape with
`questionOrigin: { questionId, questionName }` so a score can be grouped back to
its source bank. Each entry also carries the student's chosen `answer`.

`ScoreDto` (one per question group): `{ questionName, total, correct, score }`
where `score` is a rounded percentage. The overall score is computed by
`extractScore()` in `lib/services/student.service.js`.

Indexes: `{ studentId: 1, examId: 1 }` (hot path: answer save / question fetch),
`{ examId: 1 }` (score table).

---

## `files` — uploaded media (`lib/models/Files.js` or inline in file service)

| Field    | Type   | Notes               |
| -------- | ------ | ------------------- |
| `name`   | string | required            |
| `base64` | string | optional            |
| `path`   | string | required            |
| `type`   | string | required, MIME type |

Used for question image/audio assets uploaded via `POST /api/file`.
