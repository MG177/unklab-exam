'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { FooterCountdown } from '@/components/Footer';
import Answer from '@/components/score/Answer';
import ScoreCard from '@/components/score/ScoreCard';
import PostExamStatusCard from '@/components/exam/PostExamStatusCard';
import { Sidebar } from 'primereact/sidebar';
import { logout } from '@/lib/auth/logout';
import { useExamSession } from '@/contexts/ExamSessionContext';
import { EXAM_PHASE } from '@/lib/exam/sessionPhase';
import { X } from 'lucide-react';

const primaryBtn =
  'inline-flex h-10 items-center justify-center rounded-pill bg-brand px-6 text-sm font-bold text-white transition-colors hover:bg-brand-hover';

const dangerBtn =
  'inline-flex h-10 items-center justify-center rounded-pill border border-danger bg-danger px-6 text-sm font-bold text-white transition-colors hover:bg-danger/90';

export default function ExamPostView() {
  const {
    phase,
    timeRemaining,
    timeError,
    score,
    questionList,
    scoreLoading,
    scoreError,
    retryTime,
    retryScore,
    isShowAnswer,
    user,
  } = useExamSession();
  const [answersOpen, setAnswersOpen] = useState(false);

  const waiting =
    phase === EXAM_PHASE.WAITING ||
    (timeRemaining !== null &&
      timeRemaining > 0 &&
      phase !== EXAM_PHASE.WITHHELD);
  const resultsReady =
    phase === EXAM_PHASE.RESULTS && !scoreLoading && !scoreError;

  let mainContent;

  if (timeRemaining === null && !timeError) {
    mainContent = (
      <PostExamStatusCard eyebrow="Status" title="Loading exam status…" />
    );
  } else if (timeError) {
    mainContent = (
      <PostExamStatusCard
        eyebrow="Connection"
        title="Could not load exam time"
        description="Check your connection and try again."
      >
        <button type="button" className={primaryBtn} onClick={retryTime}>
          Retry
        </button>
      </PostExamStatusCard>
    );
  } else if (phase === EXAM_PHASE.WITHHELD) {
    mainContent = (
      <PostExamStatusCard
        eyebrow="Exam complete"
        title="Scores are not being released"
        description="You have completed this exam. Scores are withheld for this session."
      >
        <button type="button" className={dangerBtn} onClick={() => logout()}>
          Logout
        </button>
      </PostExamStatusCard>
    );
  } else if (waiting) {
    mainContent = (
      <PostExamStatusCard
        eyebrow="Exam submitted"
        title="Waiting for results"
        description="Your score will appear when the exam period ends. You can stay on this page or log out below."
      />
    );
  } else if (scoreLoading) {
    mainContent = (
      <PostExamStatusCard eyebrow="Results" title="Loading your score…" />
    );
  } else if (scoreError) {
    mainContent = (
      <PostExamStatusCard
        eyebrow="Results"
        title="Could not load your score"
        description="Try again in a moment."
      >
        <button type="button" className={primaryBtn} onClick={retryScore}>
          Retry
        </button>
      </PostExamStatusCard>
    );
  } else if (resultsReady) {
    mainContent = <ScoreCard user={user} score={score} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper select-none">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        {mainContent}
      </main>

      {resultsReady && isShowAnswer && (
        <Sidebar
          visible={answersOpen}
          position="right"
          onHide={() => setAnswersOpen(false)}
          showCloseIcon={false}
          className="question-nav-sidebar post-exam-answers-sidebar"
          maskClassName="question-nav-mask"
          contentStyle={{ padding: 0, width: '100%', height: '100%' }}
        >
          <div className="flex h-full w-full min-h-0 flex-col">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-4 py-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-faint">
                  Answer review
                </p>
                <p className="mt-1 font-plexMono text-xs font-semibold tabular-nums text-ink-muted">
                  {questionList.length} questions
                </p>
              </div>
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-paper hover:text-ink"
                onClick={() => setAnswersOpen(false)}
                aria-label="Close answer review"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="mx-auto flex max-w-lg flex-col gap-4">
                {questionList.map((question, index) => (
                  <Answer key={question.id} question={question} index={index} />
                ))}
              </div>
            </div>
          </div>
        </Sidebar>
      )}

      <FooterCountdown time={timeRemaining} setVisibleBottom={setAnswersOpen} />
    </div>
  );
}
