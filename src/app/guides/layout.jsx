import './guides.css';

export const metadata = {
  title: 'Operation guides — KEP Unklab Exam',
  description:
    'Interactive walkthroughs for admins, students, and exam-day staff operating the KEP placement exam system.',
};

export default function GuidesLayout({ children }) {
  return (
    <div className="min-h-screen bg-paper text-ink antialiased">{children}</div>
  );
}
