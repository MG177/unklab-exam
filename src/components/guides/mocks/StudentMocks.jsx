import LoginPageMock from './LoginPageMock';

function BeforeStart() {
  return (
    <div className="mock-info-card">
      <h3>Before the exam</h3>
      <ul>
        <li>
          <strong>Student ID</strong> — your university ID (e.g. S2200001)
        </li>
        <li>
          <strong>Token</strong> — 6-digit code from your proctor
        </li>
        <li>
          Exam must be <strong>started</strong> by admin before you can log in
        </li>
        <li>Stay on one browser tab for the whole session</li>
      </ul>
    </div>
  );
}

function Login() {
  return <LoginPageMock variant="student" />;
}

function Terms() {
  return (
    <div className="mock-terms">
      <header className="mock-terms__head">
        <span className="mock-terms__exam">KEP Placement 2026</span>
        <h3>Terms &amp; Conditions</h3>
      </header>
      <div className="mock-terms__body">
        <section>
          <h4>1. Conduct</h4>
          <p>Work independently. No dictionaries or AI tools.</p>
        </section>
        <section>
          <h4>2. Timing</h4>
          <p>Timer starts when you press START. Submit before time ends.</p>
        </section>
      </div>
      <footer className="mock-terms__foot">
        <label className="mock-terms__agree">
          <input type="checkbox" readOnly checked className="mock-check" />I
          agree to the terms and conditions
        </label>
        <div className="mock-btn mock-btn--student">START EXAM</div>
      </footer>
    </div>
  );
}

function ExamTaking() {
  return (
    <div className="mock-exam">
      <header className="mock-exam__head">
        <span>KEP Placement 2026</span>
        <span className="mock-mono">Q 5 / 18</span>
      </header>
      <div className="mock-exam__body">
        <div className="mock-exam__question">
          <p>Which sentence is grammatically correct?</p>
          <div className="mock-options mock-options--student">
            <span>She don&apos;t like coffee.</span>
            <span className="is-selected">She doesn&apos;t like coffee.</span>
            <span>She not like coffee.</span>
          </div>
        </div>
        <aside className="mock-exam__nav">
          <span className="is-answered">1</span>
          <span className="is-answered">2</span>
          <span className="is-answered">3</span>
          <span className="is-answered">4</span>
          <span className="is-current">5</span>
          <span>6</span>
          <span>7</span>
        </aside>
      </div>
      <footer className="mock-exam__foot">
        <span>◀ Prev</span>
        <span className="mock-exam__bookmark">🔖</span>
        <span className="mock-timer mock-mono">45:12</span>
        <span>Next ▶</span>
      </footer>
    </div>
  );
}

function Submit() {
  return (
    <div className="mock-exam">
      <header className="mock-exam__head">
        <span>KEP Placement 2026</span>
        <span className="mock-mono">Q 18 / 18</span>
      </header>
      <div className="mock-exam__body mock-exam__body--center">
        <div className="mock-exam__question">
          <p>Final question — review your answer, then submit.</p>
          <div className="mock-options mock-options--student">
            <span>A</span>
            <span className="is-selected">B</span>
            <span>C</span>
          </div>
        </div>
      </div>
      <footer className="mock-exam__foot">
        <span>◀ Prev</span>
        <span className="mock-timer mock-mono">02:44</span>
        <span className="mock-btn mock-btn--student mock-btn--sm">Submit</span>
      </footer>
      <div className="mock-dialog mock-dialog--overlay">
        <p>Submit your exam?</p>
        <p className="mock-dialog__sub">
          You cannot change answers after submitting.
        </p>
        <div className="mock-toolbar">
          <span className="mock-btn mock-btn--ghost mock-btn--sm">Cancel</span>
          <span className="mock-btn mock-btn--student mock-btn--sm">
            Confirm
          </span>
        </div>
      </div>
    </div>
  );
}

function Waiting() {
  return (
    <div className="mock-post">
      <div className="mock-post__icon">⏳</div>
      <h3>Waiting for results</h3>
      <p>
        Your answers have been submitted. Results appear when the exam period
        ends.
      </p>
      <footer className="mock-exam__foot mock-exam__foot--solo">
        <span className="mock-timer mock-mono">12:05 until exam ends</span>
      </footer>
    </div>
  );
}

function Results() {
  return (
    <div className="mock-post">
      <div className="mock-score-card">
        <p className="mock-score-card__label">Your score</p>
        <p className="mock-score-card__value mock-mono">14 / 18</p>
        <p className="mock-score-card__pct mock-mono">77.8%</p>
      </div>
      <footer className="mock-exam__foot mock-exam__foot--solo">
        <span className="mock-btn mock-btn--student mock-btn--sm">
          Review answers
        </span>
        <span className="mock-btn mock-btn--ghost mock-btn--sm">Log out</span>
      </footer>
    </div>
  );
}

const StudentMocks = {
  BeforeStart,
  Login,
  Terms,
  ExamTaking,
  Submit,
  Waiting,
  Results,
};

export default StudentMocks;
