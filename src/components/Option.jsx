'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export default function Option({
  active,
  option,
  handleAnswer,
  answerId,
  fontScale,
}) {
  return (
    <button
      type="button"
      onClick={() => handleAnswer(answerId)}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors duration-150',
        active
          ? 'cursor-default border-brand bg-brand-tint text-brand-ink'
          : 'cursor-pointer border-line bg-surface text-ink hover:border-line-strong'
      )}
    >
      <span
        className={cn(
          'h-4 w-4 shrink-0 self-center rounded-full border-2',
          active
            ? 'border-brand bg-brand shadow-[inset_0_0_0_3px_#fff]'
            : 'border-line-strong'
        )}
        aria-hidden
      />
      <span
        onCopy={(event) => {
          event.preventDefault();
        }}
        className="min-w-0 flex-1 leading-snug [&_br]:hidden"
        style={{
          userSelect: 'none',
          fontSize: `${fontScale.bodyRem}rem`,
        }}
        dangerouslySetInnerHTML={{ __html: option.replace(/\n/g, '<br>') }}
      />
    </button>
  );
}
