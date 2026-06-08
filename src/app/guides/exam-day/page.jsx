import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ExamDayChecklist from '@/components/guides/ExamDayChecklist';

export default function ExamDayGuidePage() {
  return (
    <div className="guide-shell guide-shell--exam-day">
      <header className="guide-shell__header">
        <Link href="/guides" className="guide-shell__back">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All guides
        </Link>
        <div className="guide-shell__masthead">
          <p className="guide-shell__eyebrow">Operation guide</p>
          <h1>Exam day checklist</h1>
          <p className="guide-shell__subtitle">
            Proctor checklist and troubleshooting for the day of the exam.
            Progress is saved in your browser.
          </p>
        </div>
      </header>

      <ExamDayChecklist />
    </div>
  );
}
