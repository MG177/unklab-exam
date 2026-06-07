'use client';

import React, { useState, useEffect, useContext, useCallback } from 'react';
import AuthContext from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/client';
import { redirectAfterExamEnd } from '@/lib/auth/finishExam';
import { useExamSessionOptional } from '@/contexts/ExamSessionContext';
import { cn } from '@/lib/utils';

function formatCountdown(timeRemaining) {
  if (timeRemaining <= 0) return 'Time out';

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = Math.floor(timeRemaining % 60);

  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  }

  return `${minutesStr}:${secondsStr}`;
}

function TimerDisplay({ timeRemaining }) {
  const isUrgent =
    timeRemaining !== null &&
    timeRemaining !== undefined &&
    timeRemaining > 0 &&
    timeRemaining < 60;

  if (timeRemaining === null || timeRemaining === undefined) {
    return (
      <div className="inline-flex items-center rounded-pill border border-line bg-paper px-4 py-2 font-plexMono text-base font-semibold tabular-nums text-ink">
        Loading…
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-pill border px-4 py-2 font-plexMono text-base font-semibold tabular-nums',
        isUrgent
          ? 'border-danger/30 bg-red-50 text-danger'
          : 'border-line bg-paper text-ink'
      )}
    >
      {formatCountdown(timeRemaining)}
    </div>
  );
}

export default function TimerSmall() {
  const { user } = useContext(AuthContext);
  const examSession = useExamSessionOptional();
  const [timeRemaining, setTimeRemaining] = useState(null);
  const router = useRouter();

  const handleExamEnd = useCallback(() => {
    if (examSession) {
      examSession.enterPostExam();
      return;
    }
    redirectAfterExamEnd(user, router);
  }, [examSession, user, router]);

  useEffect(() => {
    if (examSession) return undefined;

    if (!user?.examId) return undefined;

    let cancelled = false;

    const fetchTime = async () => {
      try {
        const response = await api.get(`exam/time/${user.examId}`);
        return response.data;
      } catch (error) {
        if (error.response?.status === 403) {
          handleExamEnd();
        }
        console.log(error);
        return null;
      }
    };

    const syncTime = async () => {
      const fetchedTime = await fetchTime();
      if (cancelled || fetchedTime === null) return;

      setTimeRemaining(fetchedTime);
      if (fetchedTime <= 0) {
        handleExamEnd();
      }
    };

    syncTime();
    const intervalId = setInterval(syncTime, 30000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [examSession, handleExamEnd, user?.examId]);

  const countdownActive =
    !examSession && timeRemaining !== null && timeRemaining > 0;

  useEffect(() => {
    if (!countdownActive) return undefined;

    const intervalId = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleExamEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdownActive, handleExamEnd]);

  if (examSession) {
    return <TimerDisplay timeRemaining={examSession.timeRemaining} />;
  }

  return <TimerDisplay timeRemaining={timeRemaining} />;
}

export function TimerBig({ timeRemaining }) {
  return <TimerDisplay timeRemaining={timeRemaining} />;
}
