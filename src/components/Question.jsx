'use client';

import React, { useEffect, useState, useContext } from 'react';
import '@/styles/audio.css';
import Media from './Media';
import Option from './Option';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/client';
import AuthContext from '@/contexts/AuthContext';
import { useExamSessionOptional } from '@/contexts/ExamSessionContext';
import { redirectAfterExamEnd } from '@/lib/auth/finishExam';

export default function Questions({
  questions,
  number,
  fontScale,
  onQuestionUpdate,
}) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const examSession = useExamSessionOptional();
  const question = questions[number];
  const [answer, setAnswer] = useState(question.answer);

  useEffect(() => {
    setAnswer(question.answer);
  }, [number, question.answer]);

  const hasContent = () => {
    if (question.image) {
      return question.image;
    } else if (question.audio) {
      return question.audio;
    } else {
      return null;
    }
  };

  const handleAnswer = async (optionId) => {
    if (answer === optionId) return;

    const previousAnswer = answer;
    setAnswer(optionId);
    onQuestionUpdate?.(number, { answer: optionId });

    try {
      await api.patch('student/answer', {
        index: number,
        answer: optionId,
      });
    } catch (error) {
      setAnswer(previousAnswer);
      onQuestionUpdate?.(number, { answer: previousAnswer });
      if (error.response?.status === 403) {
        if (examSession) {
          examSession.enterPostExam();
        } else {
          redirectAfterExamEnd(user, router);
        }
        return;
      }
      console.log(error);
      alert('Error, please check your internet connection');
    }
  };

  const handleActive = (index) => {
    return answer === index;
  };

  return (
    <div className="flex w-fit min-w-[550px] max-w-[600px] flex-col gap-3 font-sans">
      <div className="mb-1 flex w-full cursor-default select-none flex-col gap-2 rounded-lg border border-line bg-surface p-5">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-faint">
          Question {number + 1} of {questions.length}
        </p>
        <h1
          className="font-extrabold text-ink"
          style={{ fontSize: `${fontScale.titleRem}rem` }}
        >
          Question #{number + 1}
        </h1>

        {hasContent() && <Media id={hasContent()} />}
        <p
          className="leading-relaxed text-ink-muted"
          style={{ fontSize: `${fontScale.bodyRem}rem` }}
          dangerouslySetInnerHTML={{
            __html: question.text.replace(/\n/g, '<br>'),
          }}
        />
      </div>
      {question.options.map((option) => (
        <Option
          key={option.id}
          answerId={option.id}
          option={option.text}
          active={handleActive(option.id)}
          handleAnswer={handleAnswer}
          fontScale={fontScale}
        />
      ))}
    </div>
  );
}
