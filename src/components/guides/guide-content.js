export const GUIDE_VARIANTS = {
  admin: 'admin',
  student: 'student',
  examDay: 'exam-day',
};

export const adminSteps = [
  {
    id: 'sign-in',
    title: 'Sign in',
    mock: 'admin-login',
    tryItHref: '/',
    whatToDo: [
      'Open the login page and click the nearly invisible red dot in the top-right corner.',
      'Enter your admin username and password, then click Login as admin.',
    ],
    whatHappens: [
      'The server validates your credentials and sets a secure session cookie.',
      'You are redirected to the Exams dashboard at /dashboard/exams.',
    ],
    hotspots: [
      {
        anchor: 'toggle',
        label: 'Hidden admin toggle — faint red dot at top-right of the page',
      },
      { anchor: 'username', label: 'Username field' },
      { anchor: 'password', label: 'Password field' },
      { anchor: 'submit', label: 'Login as admin' },
    ],
  },
  {
    id: 'question-banks',
    title: 'Question banks',
    mock: 'question-banks',
    tryItHref: '/dashboard/questions',
    whatToDo: [
      'Go to Question banks in the sidebar.',
      'Click Create bank, give it a name, and open it to add questions.',
      'Rename or delete banks from the list when needed.',
    ],
    whatHappens: [
      'Each bank is a reusable pool of questions for future exams.',
      'Only verified banks can be selected when creating an exam.',
    ],
    hotspots: [
      { top: '18%', left: '8%', label: 'Sidebar — Question banks' },
      { top: '28%', left: '72%', label: 'Create bank button' },
    ],
  },
  {
    id: 'edit-verify',
    title: 'Edit & verify',
    mock: 'question-editor',
    tryItHref: '/dashboard/questions',
    whatToDo: [
      'Add questions manually or import a CSV file.',
      'Upload images or audio per question if needed.',
      'Save — the bank must show a Verified badge before use in exams.',
    ],
    whatHappens: [
      'Auto-save runs every 5 seconds; you can also click Save now.',
      'The server runs verify() and sets isVerified on the bank.',
    ],
    hotspots: [
      { top: '12%', left: '78%', label: 'Verified badge — required for exams' },
      { top: '42%', left: '50%', label: 'Question cards — edit options here' },
      { top: '88%', left: '85%', label: 'Import CSV' },
    ],
  },
  {
    id: 'create-exam',
    title: 'Create exam',
    mock: 'exam-create',
    tryItHref: '/dashboard/exams',
    whatToDo: [
      'On the Exams page, click Create exam.',
      'Enter an exam name and select verified question banks.',
      'Set how many questions to draw from each bank.',
    ],
    whatHappens: [
      'A new exam is created in draft state.',
      'You are taken to the exam detail page to add participants.',
    ],
    hotspots: [
      { top: '22%', left: '80%', label: 'Create exam' },
      { top: '55%', left: '50%', label: 'Pick banks and quantities' },
    ],
  },
  {
    id: 'participants',
    title: 'Participants',
    mock: 'participants',
    tryItHref: '/dashboard/exams',
    whatToDo: [
      'On the exam detail page, import a CSV with columns No, Id, Name.',
      'Or use Add participant to enter students one at a time.',
    ],
    whatHappens: [
      'Student records are embedded on the exam document.',
      'Only registered students can log in with the exam token.',
    ],
    hotspots: [
      { top: '35%', left: '68%', label: 'Import CSV' },
      { top: '35%', left: '82%', label: 'Add participant' },
    ],
  },
  {
    id: 'exam-settings',
    title: 'Exam settings',
    mock: 'exam-settings',
    tryItHref: '/dashboard/exams',
    whatToDo: [
      'Open the settings menu on the exam detail page.',
      'Toggle Show score, Show answers, and Randomize question order as needed.',
    ],
    whatHappens: [
      'Flags are saved immediately and included in the student session.',
      'Students see withheld results if Show score is off.',
    ],
    hotspots: [
      { top: '18%', left: '88%', label: 'Settings dropdown' },
      { top: '48%', left: '50%', label: 'Toggle switches' },
    ],
  },
  {
    id: 'start-session',
    title: 'Start session',
    mock: 'start-session',
    tryItHref: '/dashboard/exams',
    whatToDo: [
      'Set the exam duration (default 90 minutes in the UI).',
      'Click Start exam — a 6-digit token appears in the top bar.',
      'Share the token with students so they can log in at /.',
    ],
    whatHappens: [
      'startTime and endTime are set on the exam.',
      'Students cannot log in before the exam is started.',
    ],
    hotspots: [
      { top: '28%', left: '50%', label: 'Duration input + Start exam' },
      { top: '8%', left: '72%', label: 'Exam token — share with room' },
    ],
  },
  {
    id: 'monitor',
    title: 'Monitor',
    mock: 'monitor',
    tryItHref: '/dashboard/exams',
    whatToDo: [
      'Watch the live timer and participant table on the exam detail page.',
      'Click a student row to open their answer sheet and score.',
      'The table auto-refreshes every 5 minutes.',
    ],
    whatHappens: [
      'Submissions update as students answer and submit.',
      'Per-group scores appear in the table columns.',
    ],
    hotspots: [
      { top: '8%', left: '55%', label: 'Live countdown timer' },
      {
        top: '52%',
        left: '50%',
        label: 'Score table — click a row for detail',
      },
    ],
  },
  {
    id: 'wrap-up',
    title: 'Wrap up',
    mock: 'wrap-up',
    tryItHref: '/dashboard/exams',
    whatToDo: [
      'Export scores to XLSX from the exam detail page.',
      'Stop the exam early with Stop exam if needed.',
      'Reset a student attempt from their detail sheet to allow a retake.',
    ],
    whatHappens: [
      'Stopping sets endTime immediately — students enter post-exam state.',
      'Reset clears their submission so they can start again.',
    ],
    hotspots: [
      { top: '22%', left: '75%', label: 'Export scores' },
      { top: '28%', left: '58%', label: 'Stop exam' },
      { top: '65%', left: '82%', label: 'Reset student (in detail sheet)' },
    ],
  },
];

export const studentSteps = [
  {
    id: 'before-start',
    title: 'Before you start',
    mock: 'before-start',
    tryItHref: '/',
    whatToDo: [
      'Get your Student ID and the 6-digit exam token from your proctor.',
      'Make sure the exam session has been started — you cannot log in early.',
      'Use a stable browser on one device; stay on the exam tab.',
    ],
    whatHappens: [
      'The proctor starts the exam from the admin dashboard.',
      'The token is displayed in the admin top bar for the room.',
    ],
    hotspots: [
      { top: '40%', left: '50%', label: 'You need both Student ID and token' },
    ],
  },
  {
    id: 'log-in',
    title: 'Log in',
    mock: 'student-login',
    tryItHref: '/',
    whatToDo: [
      'Open the exam login page and enter your Student ID and token.',
      'Click Login.',
    ],
    whatHappens: [
      'If registered and the exam is live, you are signed in.',
      'New attempts go to Terms & Conditions; finished attempts go straight to results.',
    ],
    hotspots: [
      { anchor: 'student-id', label: 'Student ID field' },
      { anchor: 'token', label: 'Token from proctor' },
      { anchor: 'submit', label: 'Login button' },
    ],
  },
  {
    id: 'rules',
    title: 'Rules',
    mock: 'terms',
    tryItHref: '/started',
    whatToDo: [
      'Read the exam rules and conduct guidelines.',
      'Check I agree, then click START EXAM.',
    ],
    whatHappens: [
      'Your agreement is stored for this browser session.',
      'You are taken to the exam questions — the timer is active.',
    ],
    hotspots: [
      { top: '72%', left: '12%', label: 'Check I agree' },
      { top: '82%', left: '50%', label: 'START EXAM' },
    ],
  },
  {
    id: 'during-exam',
    title: 'During exam',
    mock: 'exam-taking',
    tryItHref: '/exam',
    whatToDo: [
      'Select an answer for each question.',
      'Use Prev/Next or the question navigator on the right.',
      'Bookmark tricky questions; adjust font size if needed.',
      'Watch the timer — it turns red under one minute.',
    ],
    whatHappens: [
      'Each answer is saved immediately to the server.',
      'Your current question is remembered if you refresh.',
    ],
    hotspots: [
      { top: '38%', left: '50%', label: 'Tap an option to answer' },
      { top: '88%', left: '18%', label: 'Bookmark' },
      { top: '88%', left: '50%', label: 'Timer' },
      { top: '50%', left: '92%', label: 'Question navigator' },
    ],
  },
  {
    id: 'submit',
    title: 'Submit',
    mock: 'submit',
    tryItHref: '/exam',
    whatToDo: [
      'On the last question, click Submit instead of Next.',
      'Confirm in the popup that you want to finish.',
    ],
    whatHappens: [
      'Your attempt is marked submitted.',
      'You see a waiting screen until the exam period ends.',
    ],
    hotspots: [{ top: '88%', left: '78%', label: 'Submit on final question' }],
  },
  {
    id: 'after-submit',
    title: 'After submit',
    mock: 'waiting',
    tryItHref: '/exam',
    whatToDo: [
      'Wait on the waiting screen until the official exam end time.',
      'If scores are withheld, you will see a message instead of your score.',
    ],
    whatHappens: [
      'Results unlock when the exam timer reaches zero.',
      'Whether you see scores depends on admin Show score setting.',
    ],
    hotspots: [
      { top: '45%', left: '50%', label: 'Waiting for results' },
      { top: '88%', left: '50%', label: 'Countdown to exam end' },
    ],
  },
  {
    id: 'results',
    title: 'Results',
    mock: 'results',
    tryItHref: '/exam',
    whatToDo: [
      'View your score on the results screen.',
      'If enabled, click Review answers to see correct answers.',
      'Log out when finished.',
    ],
    whatHappens: [
      'Your placement score is calculated from your answers.',
      'Answer review is only available if the admin enabled Show answers.',
    ],
    hotspots: [
      { top: '35%', left: '50%', label: 'Score card' },
      { top: '88%', left: '72%', label: 'Review answers (if enabled)' },
    ],
  },
];

export const examDayChecklistItems = [
  {
    id: 'mongo',
    phase: 'before',
    label: 'MongoDB is running and MONGO_URI is configured',
  },
  {
    id: 'admin-account',
    phase: 'before',
    label: 'At least one admin account exists',
  },
  {
    id: 'banks-verified',
    phase: 'before',
    label: 'Question banks are created and verified',
  },
  {
    id: 'exam-created',
    phase: 'before',
    label: 'Exam is created with the right question groups',
  },
  {
    id: 'participants',
    phase: 'before',
    label: 'Participant list is imported (No, Id, Name)',
  },
  {
    id: 'toggles',
    phase: 'before',
    label: 'Show score / Show answers / Randomize toggles are set',
  },
  {
    id: 'start-exam',
    phase: 'start',
    label: 'Admin started the exam and copied the 6-digit token',
  },
  {
    id: 'announce-token',
    phase: 'start',
    label: 'Token announced to the room (board or verbally)',
  },
  {
    id: 'students-login',
    phase: 'during',
    label: 'Students logging in at / with ID + token',
  },
  {
    id: 'proctor-errors',
    phase: 'during',
    label: 'Proctor ready to help with login errors (see table below)',
  },
  {
    id: 'wait-timer',
    phase: 'after',
    label: 'Wait for exam timer to reach zero before releasing scores',
  },
  {
    id: 'export-scores',
    phase: 'after',
    label: 'Export scores to XLSX from exam detail',
  },
];

export const examDayErrors = [
  {
    symptom: 'Login failed / invalid token',
    cause: 'Wrong token or typo in Student ID',
    action:
      'Confirm the token from admin top bar; check ID matches import list',
  },
  {
    symptom: 'Student not registered',
    cause: 'ID not on participant list',
    action:
      'Admin adds student via CSV or Add participant, then student retries',
  },
  {
    symptom: 'Exam not started',
    cause: 'Admin has not clicked Start exam',
    action: 'Admin starts session from exam detail page',
  },
  {
    symptom: 'Exam ended',
    cause: 'Session timer expired or admin stopped early',
    action: 'No new logins; submitted students see results or waiting state',
  },
  {
    symptom: 'Too many login attempts',
    cause: 'Rate limit (10/min per IP)',
    action: 'Wait one minute, then retry',
  },
];

export const guideHubCards = [
  {
    href: '/guides/admin',
    title: 'Admin guide',
    description:
      'Set up question banks, create exams, start sessions, and review scores.',
    variant: 'admin',
    steps: 9,
  },
  {
    href: '/guides/student',
    title: 'Student guide',
    description: 'Log in, accept rules, take the exam, and view your results.',
    variant: 'student',
    steps: 7,
  },
  {
    href: '/guides/exam-day',
    title: 'Exam day checklist',
    description:
      'Proctor checklist and troubleshooting for the day of the exam.',
    variant: 'exam-day',
    steps: null,
  },
];
