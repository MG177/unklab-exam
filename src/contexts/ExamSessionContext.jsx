'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/client';
import AuthContext from '@/contexts/AuthContext';
import { EXAM_PHASE, resolvePostExamPhase } from '@/lib/exam/sessionPhase';

const ExamSessionContext = createContext(null);

export function useExamSession() {
  const ctx = useContext(ExamSessionContext);
  if (!ctx) {
    throw new Error('useExamSession must be used within ExamSessionProvider');
  }
  return ctx;
}

/** Optional hook for components that may render outside the exam session tree. */
export function useExamSessionOptional() {
  return useContext(ExamSessionContext);
}

export function ExamSessionProvider({ children }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [phase, setPhase] = useState(EXAM_PHASE.LOADING);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timeError, setTimeError] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const [score, setScore] = useState(null);
  const [questionList, setQuestionList] = useState([]);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreError, setScoreError] = useState(false);
  const [isShowAnswer, setIsShowAnswer] = useState(() =>
    Boolean(user?.isShowAnswer)
  );

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const loadScore = useCallback(async () => {
    if (!user?.isShowScore) return;

    setScoreLoading(true);
    setScoreError(false);

    try {
      const response = await api.get('/student/score');
      setScore(response.data.score ?? null);
      setQuestionList(response.data.questionList ?? []);
      if (response.data.isShowAnswer !== undefined) {
        setIsShowAnswer(Boolean(response.data.isShowAnswer));
      }
      setPhase(EXAM_PHASE.RESULTS);
    } catch (error) {
      if (error.response?.data?.code === 'EXAM_NOT_ENDED') {
        setPhase(EXAM_PHASE.WAITING);
        try {
          const timeRes = await api.get(`exam/time/${user.examId}`);
          setTimeRemaining(timeRes.data);
          setTimeError(false);
        } catch {
          setTimeError(true);
        }
      } else {
        setScoreError(true);
      }
    } finally {
      setScoreLoading(false);
    }
  }, [user?.examId, user?.isShowScore]);

  const enterPostExam = useCallback(async () => {
    let remaining = timeRemaining;
    if (remaining === null && user?.examId) {
      try {
        const timeRes = await api.get(`exam/time/${user.examId}`);
        remaining = timeRes.data;
        setTimeRemaining(remaining);
        setTimeError(false);
      } catch {
        remaining = 0;
        setTimeError(true);
      }
    }

    const next = resolvePostExamPhase(remaining, user);
    setPhase(next);
    if (next === EXAM_PHASE.RESULTS) {
      await loadScore();
    }
  }, [timeRemaining, user, loadScore]);

  const bootstrap = useCallback(async () => {
    if (!user?.examId) return;

    setPhase(EXAM_PHASE.LOADING);
    setNetworkError(false);

    try {
      const timeRes = await api.get(`exam/time/${user.examId}`);
      const remaining = timeRes.data;
      setTimeRemaining(remaining);
      setTimeError(false);

      const startRes = await api.post('/student/start', {});
      const alreadyFinished = startRes.data === false;

      if (!user.isShowScore && (alreadyFinished || remaining <= 0)) {
        setPhase(EXAM_PHASE.WITHHELD);
        return;
      }

      if (alreadyFinished || remaining <= 0) {
        const next = resolvePostExamPhase(remaining, user);
        setPhase(next);
        if (next === EXAM_PHASE.RESULTS) {
          await loadScore();
        }
        return;
      }

      const qRes = await api.get('student/questions');
      setQuestions(qRes.data);
      setPhase(EXAM_PHASE.TAKING);
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        setNetworkError(true);
        setPhase(EXAM_PHASE.LOADING);
      } else if (error.response?.status === 403) {
        const next = resolvePostExamPhase(0, user);
        setPhase(next);
        if (next === EXAM_PHASE.RESULTS) {
          await loadScore();
        }
      } else {
        router.push('/');
      }
    }
  }, [user, loadScore, router]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    setIsShowAnswer(Boolean(user?.isShowAnswer));
  }, [user?.isShowAnswer]);

  useEffect(() => {
    if (!user?.examId) return;

    let cancelled = false;

    const syncTime = async () => {
      try {
        const response = await api.get(`exam/time/${user.examId}`);
        if (!cancelled) {
          setTimeRemaining(response.data);
          setTimeError(false);
        }
      } catch {
        if (!cancelled) {
          setTimeError(true);
        }
      }
    };

    syncTime();
    const intervalId = setInterval(syncTime, 30000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [user?.examId]);

  const countdownActive = timeRemaining !== null && timeRemaining > 0;

  useEffect(() => {
    if (!countdownActive) return;

    const intervalId = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdownActive]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining > 0) return;

    const current = phaseRef.current;
    if (current === EXAM_PHASE.TAKING) {
      const next = resolvePostExamPhase(0, user);
      setPhase(next);
      if (next === EXAM_PHASE.RESULTS) {
        loadScore();
      }
      return;
    }

    if (current === EXAM_PHASE.WAITING) {
      const next = resolvePostExamPhase(0, user);
      if (next === EXAM_PHASE.RESULTS) {
        loadScore();
      }
    }
  }, [timeRemaining, user, loadScore]);

  const retryTime = useCallback(() => {
    if (!user?.examId) return;
    setTimeError(false);
    api
      .get(`exam/time/${user.examId}`)
      .then((response) => setTimeRemaining(response.data))
      .catch(() => setTimeError(true));
  }, [user?.examId]);

  const retryScore = useCallback(() => {
    if (timeRemaining === null || timeRemaining > 0 || !user?.isShowScore)
      return;
    loadScore();
  }, [timeRemaining, user?.isShowScore, loadScore]);

  const updateQuestionAtIndex = useCallback((index, patch) => {
    setQuestions(
      (prev) =>
        prev?.map((question, i) =>
          i === index ? { ...question, ...patch } : question
        ) ?? prev
    );
  }, []);

  const value = {
    phase,
    timeRemaining,
    timeError,
    questions,
    setQuestions,
    networkError,
    score,
    questionList,
    scoreLoading,
    scoreError,
    enterPostExam,
    loadScore,
    bootstrap,
    retryTime,
    retryScore,
    updateQuestionAtIndex,
    isShowAnswer,
    user,
  };

  return (
    <ExamSessionContext.Provider value={value}>
      {children}
    </ExamSessionContext.Provider>
  );
}
