'use client';

import React from 'react';
import { Bookmark, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { questionStemPreview } from '@/lib/exam/questionStem';

export default function QuestionNavigator({
  questions,
  currentIndex,
  onSelect,
  onClose,
}) {
  const answeredCount = questions.filter(
    (question) => question.answer != null
  ).length;

  return (
    <div className="flex h-full w-full min-h-0 min-w-0 flex-col">
      <div className="flex w-full shrink-0 items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-faint">
            Questions
          </p>
          <p className="mt-1 font-plexMono text-xs font-semibold tabular-nums text-live">
            {answeredCount} / {questions.length} answered
          </p>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-paper hover:text-ink"
          onClick={onClose}
          aria-label="Close question list"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      <nav
        className="min-h-0 w-full flex-1 overflow-y-auto"
        aria-label="Question list"
      >
        <ul className="flex w-full flex-col">
          {questions.map((question, index) => {
            const isActive = index === currentIndex;
            const isAnswered = question.answer != null;

            return (
              <li
                key={`${index}_${question.isBookmark}_${isAnswered}`}
                className="w-full"
              >
                <button
                  type="button"
                  className={cn(
                    'flex w-full min-w-0 items-center gap-2 border-b border-line px-4 py-2.5 text-left transition-colors',
                    isActive
                      ? 'bg-brand-tint text-brand-ink'
                      : 'bg-surface text-ink-muted hover:bg-paper'
                  )}
                  onClick={() => onSelect(index)}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      isAnswered ? 'bg-brand' : 'bg-line-strong'
                    )}
                    aria-hidden
                  />
                  <span className="w-7 shrink-0 font-plexMono text-[10px] font-semibold tabular-nums text-ink-faint">
                    #{index + 1}
                  </span>
                  <span
                    className={cn(
                      'block min-w-0 flex-1 truncate text-sm font-medium',
                      isActive
                        ? 'font-semibold text-brand-ink'
                        : 'text-ink-muted'
                    )}
                    title={questionStemPreview(question.text, 200)}
                  >
                    {questionStemPreview(question.text)}
                  </span>
                  {question.isBookmark ? (
                    <Bookmark
                      className="h-3.5 w-3.5 shrink-0 fill-warn-ink text-warn-ink"
                      strokeWidth={2}
                      aria-label="Bookmarked"
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
