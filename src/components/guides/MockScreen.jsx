import AdminMocks from './mocks/AdminMocks';
import StudentMocks from './mocks/StudentMocks';

const MOCK_MAP = {
  'admin-login': AdminMocks.Login,
  'question-banks': AdminMocks.QuestionBanks,
  'question-editor': AdminMocks.QuestionEditor,
  'exam-create': AdminMocks.ExamCreate,
  participants: AdminMocks.Participants,
  'exam-settings': AdminMocks.ExamSettings,
  'start-session': AdminMocks.StartSession,
  monitor: AdminMocks.Monitor,
  'wrap-up': AdminMocks.WrapUp,
  'before-start': StudentMocks.BeforeStart,
  'student-login': StudentMocks.Login,
  terms: StudentMocks.Terms,
  'exam-taking': StudentMocks.ExamTaking,
  submit: StudentMocks.Submit,
  waiting: StudentMocks.Waiting,
  results: StudentMocks.Results,
};

export default function MockScreen({ mock, variant }) {
  const Component = MOCK_MAP[mock];
  if (!Component) {
    return (
      <div className="mock-screen mock-screen--empty">
        <p>Preview not available</p>
      </div>
    );
  }
  return (
    <div className={`mock-screen mock-screen--${variant}`}>
      <Component />
    </div>
  );
}
