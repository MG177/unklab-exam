'use client';

import React from 'react';
import {
  ExamSessionProvider,
  useExamSession,
} from '@/contexts/ExamSessionContext';
import { EXAM_PHASE, isPostExamPhase } from '@/lib/exam/sessionPhase';
import ExamTakingView from '@/components/exam/ExamTakingView';
import ExamPostView from '@/components/exam/ExamPostView';

function ExamSessionContent() {
  const { phase } = useExamSession();

  if (phase === EXAM_PHASE.LOADING) {
    return null;
  }

  if (phase === EXAM_PHASE.TAKING) {
    return <ExamTakingView />;
  }

  if (isPostExamPhase(phase)) {
    return <ExamPostView />;
  }

  return null;
}

export default function ExamSession() {
  return (
    <ExamSessionProvider>
      <ExamSessionContent />
    </ExamSessionProvider>
  );
}
