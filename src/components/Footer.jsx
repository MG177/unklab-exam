'use client';

import React, { useContext, useEffect, useState, useRef } from 'react';
import Timer, { TimerBig } from './Timer';
import { useRouter } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';
import api from '@/lib/api/client';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { logout } from '@/lib/auth/logout';
import { useExamSessionOptional } from '@/contexts/ExamSessionContext';
import { redirectAfterExamEnd } from '@/lib/auth/finishExam';
import { cn } from '@/lib/utils';

const actionBtn =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-pill border border-line-strong bg-surface px-3 text-sm font-bold text-brand-ink transition-colors hover:border-brand hover:text-brand';

export default function Footer({
  questions,
  number,
  setNumber,
  onQuestionUpdate,
}) {
  const { user } = useContext(AuthContext);
  const examSession = useExamSessionOptional();
  const router = useRouter();
  const question = questions[number];
  const [isBookmark, setIsBookmark] = useState(question.isBookmark || false);
  const confirmSubmitRef = useRef(null);
  const [confirmSubmitPopup, setConfirmSubmitPopup] = useState(false);

  useEffect(() => {
    setIsBookmark(question.isBookmark);
  }, [number, question.isBookmark]);

  const handleTimeOut = () => {
    console.log('time out');
  };

  const handleNextQuestion = () => {
    if (number === questions.length - 1) {
      return;
    } else {
      setNumber((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (number === 0) {
      return;
    } else {
      setNumber((prev) => prev - 1);
    }
  };

  const handleBookmark = async () => {
    const nextBookmark = !isBookmark;
    setIsBookmark(nextBookmark);
    onQuestionUpdate?.(number, { isBookmark: nextBookmark });

    try {
      await api.patch('student/bookmark', {
        index: number,
        isBookmark: nextBookmark,
      });
    } catch (error) {
      setIsBookmark(!nextBookmark);
      onQuestionUpdate?.(number, { isBookmark: !nextBookmark });
      console.log(error);
    }
  };

  const handleSubmitQuestion = async () => {
    try {
      await api.patch('student/submit');
      if (examSession) {
        examSession.enterPostExam();
      } else {
        redirectAfterExamEnd(user, router);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed bottom-0 z-50 flex h-[60px] w-full select-none flex-row items-center justify-between border-t border-line bg-surface px-6 lg:px-8">
      <div className="w-[30%] min-w-0">
        <p className="truncate text-[10px] font-extrabold uppercase tracking-wider text-ink-faint">
          {user?.examName || 'Exam name'}
        </p>
        <p className="font-plexMono text-xs font-semibold tabular-nums text-ink">
          {`Q ${number + 1} / ${questions.length}`}
        </p>
      </div>
      <div className="flex w-[30%] justify-center self-center">
        <Timer onTimeUp={handleTimeOut} />
      </div>

      <div className="flex w-[30%] flex-row justify-end gap-2">
        <ConfirmPopup
          target={confirmSubmitRef.current}
          visible={confirmSubmitPopup}
          onHide={() => setConfirmSubmitPopup(false)}
          message="Are you sure you want to submit now?"
          icon="pi pi-exclamation-triangle"
          accept={handleSubmitQuestion}
          reject={() => setConfirmSubmitPopup(false)}
          className="w-[300px] rounded-2xl"
          rejectClassName="rounded-xl border border-line bg-surface text-brand hover:bg-brand-tint"
          acceptClassName="rounded-xl border border-brand bg-brand text-white hover:bg-brand-hover"
        />
        {number === 0 ? null : (
          <button
            type="button"
            className={cn(actionBtn, 'pi pi-arrow-left text-base')}
            onClick={handlePrevQuestion}
            aria-label="Previous question"
          />
        )}
        {number === questions.length - 1 ? (
          <button
            type="button"
            className={cn(
              actionBtn,
              'min-w-[5.5rem] bg-brand px-4 text-white hover:border-brand hover:bg-brand-hover hover:text-white'
            )}
            ref={confirmSubmitRef}
            onClick={() => setConfirmSubmitPopup(true)}
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            className={cn(actionBtn, 'pi pi-arrow-right text-base')}
            onClick={handleNextQuestion}
            aria-label="Next question"
          />
        )}

        <button
          type="button"
          className={cn(
            actionBtn,
            'pi text-base text-warn-ink',
            isBookmark ? 'pi-bookmark-fill bg-warn-tint' : 'pi-bookmark'
          )}
          onClick={handleBookmark}
          aria-label={isBookmark ? 'Remove bookmark' : 'Bookmark question'}
        />
      </div>
    </div>
  );
}

export function FooterCountdown({ time, setVisibleBottom }) {
  const { user } = useContext(AuthContext);
  const examSession = useExamSessionOptional();
  const canReviewAnswers =
    examSession?.isShowAnswer ?? Boolean(user?.isShowAnswer);
  const confirmLogoutRef = useRef(null);
  const [confirmLogoutPopup, setConfirmLogoutPopup] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed bottom-0 z-50 flex h-[60px] w-full select-none flex-row items-center justify-between border-t border-line bg-surface px-6 lg:px-8">
      <div className="w-[30%] min-w-0">
        <p className="truncate text-[10px] font-extrabold uppercase tracking-wider text-ink-faint">
          {user?.examName || 'Exam name'}
        </p>
        <p className="text-sm font-medium text-ink-muted">
          Completed all questions
        </p>
      </div>
      <div className="flex w-[30%] justify-center self-center">
        {time !== null && time > 0 ? (
          <TimerBig timeRemaining={time} />
        ) : (
          time !== null &&
          time <= 0 &&
          canReviewAnswers && (
            <button
              type="button"
              className={cn(actionBtn, 'min-w-[8.5rem] whitespace-nowrap px-4')}
              onClick={() => setVisibleBottom(true)}
            >
              Review answers
            </button>
          )
        )}
      </div>

      <div className="flex w-[30%] flex-row justify-end gap-2">
        <ConfirmPopup
          target={confirmLogoutRef.current}
          visible={confirmLogoutPopup}
          onHide={() => setConfirmLogoutPopup(false)}
          message="Are you sure you want to logout?"
          icon="pi pi-exclamation-triangle"
          accept={handleLogout}
          reject={() => setConfirmLogoutPopup(false)}
          className="w-[300px] rounded-2xl"
          rejectClassName="rounded-xl border border-line bg-surface text-brand hover:bg-brand-tint"
          acceptClassName="rounded-xl border border-danger bg-danger text-white hover:bg-danger/90"
        />
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-pill border border-danger bg-danger px-4 text-sm font-bold text-white transition-colors hover:bg-danger/90"
          ref={confirmLogoutRef}
          onClick={() => setConfirmLogoutPopup(true)}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
