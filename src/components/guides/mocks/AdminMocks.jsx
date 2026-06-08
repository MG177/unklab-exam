import LoginPageMock from './LoginPageMock';

function Shell({ sidebar, children, topbar }) {
  return (
    <div className="mock-admin">
      <aside className="mock-admin__sidebar">
        <div className="mock-admin__logo">KEP</div>
        <nav>
          <span className={sidebar === 'exams' ? 'is-active' : ''}>Exams</span>
          <span className={sidebar === 'questions' ? 'is-active' : ''}>
            Question banks
          </span>
        </nav>
      </aside>
      <div className="mock-admin__main">
        {topbar && <header className="mock-admin__topbar">{topbar}</header>}
        <div className="mock-admin__content">{children}</div>
      </div>
    </div>
  );
}

function Login() {
  return <LoginPageMock variant="admin" />;
}

function QuestionBanks() {
  return (
    <Shell sidebar="questions" topbar={<span>Question banks</span>}>
      <div className="mock-toolbar">
        <span className="mock-btn mock-btn--primary mock-btn--sm">
          Create bank
        </span>
      </div>
      <table className="mock-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Questions</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Grammar A1</td>
            <td className="mock-mono">24</td>
            <td>
              <span className="mock-badge mock-badge--live">Verified</span>
            </td>
          </tr>
          <tr>
            <td>Reading B2</td>
            <td className="mock-mono">18</td>
            <td>
              <span className="mock-badge mock-badge--live">Verified</span>
            </td>
          </tr>
          <tr>
            <td>Listening draft</td>
            <td className="mock-mono">6</td>
            <td>
              <span className="mock-badge">Draft</span>
            </td>
          </tr>
        </tbody>
      </table>
    </Shell>
  );
}

function QuestionEditor() {
  return (
    <Shell
      sidebar="questions"
      topbar={
        <>
          <span>Grammar A1</span>
          <span className="mock-badge mock-badge--live">Verified</span>
        </>
      }
    >
      <div className="mock-q-card">
        <p className="mock-q-num">Q1</p>
        <p>Choose the correct form: She ___ to school every day.</p>
        <div className="mock-options">
          <span>go</span>
          <span className="is-selected">goes</span>
          <span>going</span>
          <span>gone</span>
        </div>
      </div>
      <div className="mock-q-card mock-q-card--faded">
        <p className="mock-q-num">Q2</p>
        <p>The meeting was postponed ___ the rain.</p>
      </div>
      <div className="mock-toolbar mock-toolbar--bottom">
        <span className="mock-btn mock-btn--ghost mock-btn--sm">
          Import CSV
        </span>
        <span className="mock-btn mock-btn--primary mock-btn--sm">
          Save now
        </span>
      </div>
    </Shell>
  );
}

function ExamCreate() {
  return (
    <Shell sidebar="exams" topbar={<span>Exams</span>}>
      <div className="mock-dialog">
        <h4>Create exam</h4>
        <div className="mock-field">
          <label>Exam name</label>
          <div className="mock-input">KEP Placement 2026</div>
        </div>
        <div className="mock-bank-row">
          <span>Grammar A1</span>
          <span className="mock-mono">qty 10</span>
          <input type="checkbox" readOnly checked className="mock-check" />
        </div>
        <div className="mock-bank-row">
          <span>Reading B2</span>
          <span className="mock-mono">qty 8</span>
          <input type="checkbox" readOnly checked className="mock-check" />
        </div>
        <div className="mock-toolbar">
          <span className="mock-btn mock-btn--primary mock-btn--sm">
            Create
          </span>
        </div>
      </div>
    </Shell>
  );
}

function Participants() {
  return (
    <Shell
      sidebar="exams"
      topbar={
        <>
          <span>KEP Placement 2026</span>
          <span className="mock-badge mock-badge--brand">Draft</span>
        </>
      }
    >
      <div className="mock-toolbar">
        <span className="mock-btn mock-btn--ghost mock-btn--sm">
          Import CSV
        </span>
        <span className="mock-btn mock-btn--primary mock-btn--sm">
          Add participant
        </span>
      </div>
      <table className="mock-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Id</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="mock-mono">1</td>
            <td className="mock-mono">S2200001</td>
            <td>Ana Smith</td>
          </tr>
          <tr>
            <td className="mock-mono">2</td>
            <td className="mock-mono">S2200002</td>
            <td>Budi Tan</td>
          </tr>
          <tr>
            <td className="mock-mono">3</td>
            <td className="mock-mono">S2200003</td>
            <td>Citra Lee</td>
          </tr>
        </tbody>
      </table>
    </Shell>
  );
}

function ExamSettings() {
  return (
    <Shell
      sidebar="exams"
      topbar={
        <>
          <span>KEP Placement 2026</span>
          <span className="mock-btn mock-btn--ghost mock-btn--sm">
            Settings ▾
          </span>
        </>
      }
    >
      <div className="mock-settings">
        <div className="mock-toggle-row">
          <span>Show score to students</span>
          <span className="mock-switch is-on" />
        </div>
        <div className="mock-toggle-row">
          <span>Show correct answers</span>
          <span className="mock-switch is-on" />
        </div>
        <div className="mock-toggle-row">
          <span>Randomize question order</span>
          <span className="mock-switch" />
        </div>
      </div>
    </Shell>
  );
}

function StartSession() {
  return (
    <Shell
      sidebar="exams"
      topbar={
        <>
          <span>KEP Placement 2026</span>
          <span className="mock-token">
            Token: <strong className="mock-mono">482916</strong>
          </span>
          <span className="mock-badge mock-badge--live">Live</span>
        </>
      }
    >
      <div className="mock-start-panel">
        <label>Duration (minutes)</label>
        <div className="mock-input mock-mono">90</div>
        <span className="mock-btn mock-btn--primary">Start exam</span>
      </div>
    </Shell>
  );
}

function Monitor() {
  return (
    <Shell
      sidebar="exams"
      topbar={
        <>
          <span>KEP Placement 2026</span>
          <span className="mock-timer mock-mono">01:24:33</span>
          <span className="mock-badge mock-badge--live">Live</span>
        </>
      }
    >
      <table className="mock-table mock-table--scores">
        <thead>
          <tr>
            <th>Student</th>
            <th>Status</th>
            <th>Grammar</th>
            <th>Reading</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr className="is-highlight">
            <td>S2200001</td>
            <td>
              <span className="mock-badge mock-badge--live">Submitted</span>
            </td>
            <td className="mock-mono">8/10</td>
            <td className="mock-mono">6/8</td>
            <td className="mock-mono">14/18</td>
          </tr>
          <tr>
            <td>S2200002</td>
            <td>
              <span className="mock-badge mock-badge--brand">In progress</span>
            </td>
            <td className="mock-mono">—</td>
            <td className="mock-mono">—</td>
            <td className="mock-mono">—</td>
          </tr>
        </tbody>
      </table>
    </Shell>
  );
}

function WrapUp() {
  return (
    <Shell sidebar="exams" topbar={<span>KEP Placement 2026</span>}>
      <div className="mock-toolbar">
        <span className="mock-btn mock-btn--ghost mock-btn--sm">
          Export scores
        </span>
        <span className="mock-btn mock-btn--danger mock-btn--sm">
          Stop exam
        </span>
      </div>
      <div className="mock-sheet">
        <h4>Student detail — S2200001</h4>
        <p className="mock-mono">Score: 14 / 18</p>
        <span className="mock-btn mock-btn--ghost mock-btn--sm">
          Reset student
        </span>
      </div>
    </Shell>
  );
}

const AdminMocks = {
  Login,
  QuestionBanks,
  QuestionEditor,
  ExamCreate,
  Participants,
  ExamSettings,
  StartSession,
  Monitor,
  WrapUp,
};

export default AdminMocks;
