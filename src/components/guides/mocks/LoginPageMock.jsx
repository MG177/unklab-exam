/**
 * Shared login page mock — matches src/app/page.jsx layout (Background.svg + centered card).
 * variant: "student" | "admin"
 */
export default function LoginPageMock({ variant = 'student' }) {
  const isAdmin = variant === 'admin';

  return (
    <div className="mock-login-page">
      <span
        className="mock-login-page__toggle"
        data-guide-hotspot="toggle"
        title="Admin toggle"
        aria-hidden="true"
      />
      <div className="mock-login-page__card">
        {isAdmin ? (
          <>
            <h3 className="mock-login-page__title mock-login-page__title--admin">
              Welcome Admin!
            </h3>
            <div className="mock-field" data-guide-hotspot="username">
              <label>Username</label>
              <div className="mock-input">admin</div>
            </div>
            <div className="mock-field" data-guide-hotspot="password">
              <label>Password</label>
              <div className="mock-input">••••••••</div>
            </div>
            <div
              className="mock-btn mock-btn--login"
              data-guide-hotspot="submit"
            >
              Login as admin
            </div>
          </>
        ) : (
          <>
            <h3 className="mock-login-page__title">Welcome!</h3>
            <p className="mock-login-page__lede">
              Enter your login details and token to access your Exam.
            </p>
            <div className="mock-field" data-guide-hotspot="student-id">
              <label>Student ID</label>
              <div className="mock-input mock-mono">S2200001</div>
            </div>
            <div className="mock-field" data-guide-hotspot="token">
              <label>Token</label>
              <div className="mock-input mock-mono">482916</div>
            </div>
            <div
              className="mock-btn mock-btn--login"
              data-guide-hotspot="submit"
            >
              Login
            </div>
          </>
        )}
      </div>
    </div>
  );
}
