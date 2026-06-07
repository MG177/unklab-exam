'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

function getOptionText(question, optionId) {
  if (optionId == null) return null;
  const option = question.options?.find((o) => o.id === optionId);
  return option?.text ?? null;
}

function AnswerRow({ label, text, variant }) {
  return (
    <div className="mt-3 first:mt-0">
      <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border px-3 py-2.5',
          variant === 'correct' && 'border-live/30 bg-live-tint text-ink',
          variant === 'incorrect' && 'border-danger/30 bg-red-50 text-ink',
          variant === 'neutral' && 'border-line bg-paper text-ink-muted'
        )}
      >
        {variant === 'correct' ? (
          <Check className="h-4 w-4 shrink-0 text-live" strokeWidth={2.5} />
        ) : null}
        {variant === 'incorrect' ? (
          <X className="h-4 w-4 shrink-0 text-danger" strokeWidth={2.5} />
        ) : null}
        <p className="min-w-0 flex-1 text-left text-sm font-medium leading-snug">
          {text || '— No answer —'}
        </p>
      </div>
    </div>
  );
}

export default function Answer({ question, index, showOrigin }) {
  const canGrade = question.correctAnswer != null;
  const isCorrect = canGrade && question.correctAnswer === question.answer;
  const yourAnswerText = getOptionText(question, question.answer);
  const correctAnswerText = canGrade
    ? getOptionText(question, question.correctAnswer)
    : null;
  const showCorrectBlock = canGrade && !isCorrect && correctAnswerText != null;

  return (
    <article
      className={cn(
        'overflow-hidden rounded-lg border bg-surface',
        !canGrade && 'border-line',
        canGrade && isCorrect && 'border-live/40',
        canGrade && !isCorrect && 'border-danger/40'
      )}
    >
      <div
        className={cn(
          'border-b px-4 py-2',
          !canGrade && 'border-line bg-paper',
          canGrade && isCorrect && 'border-live/20 bg-live-tint',
          canGrade && !isCorrect && 'border-danger/20 bg-red-50'
        )}
      >
        <p
          className="truncate font-sans text-sm font-extrabold text-ink"
          title={
            showOrigin ? question.questionOrigin?.questionName : undefined
          }
        >
          Question #{index + 1}
          {showOrigin && question.questionOrigin?.questionName
            ? ` · ${question.questionOrigin.questionName}`
            : ''}
        </p>
        {canGrade ? (
          <p
            className={cn(
              'mt-0.5 text-[10px] font-bold uppercase tracking-wide',
              isCorrect ? 'text-live' : 'text-danger'
            )}
          >
            {isCorrect ? 'Correct' : 'Incorrect'}
          </p>
        ) : null}
      </div>

      <div className="px-4 py-3">
        <p className="mb-3 text-sm font-medium leading-relaxed text-ink-muted">
          {question.text}
        </p>

        <AnswerRow
          label="Your answer"
          text={yourAnswerText}
          variant={
            !canGrade ? 'neutral' : isCorrect ? 'correct' : 'incorrect'
          }
        />

        {showCorrectBlock ? (
          <AnswerRow
            label="Correct answer"
            text={correctAnswerText}
            variant="correct"
          />
        ) : null}
      </div>
    </article>
  );
}
