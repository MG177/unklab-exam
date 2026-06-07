'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DEFAULT_FONT_SCALE_INDEX,
  FONT_SCALE_STEPS,
} from '@/lib/exam/fontScale';

const controlBtn =
  'flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-paper hover:text-brand disabled:pointer-events-none disabled:opacity-35';

export default function FontSizeControl({ index, onChange }) {
  const atMin = index <= 0;
  const atMax = index >= FONT_SCALE_STEPS.length - 1;
  const step = FONT_SCALE_STEPS[index];
  const isDefault = index === DEFAULT_FONT_SCALE_INDEX;

  return (
    <div
      className="fixed right-6 top-[3.75rem] z-10 flex items-center gap-0.5 rounded-pill border border-line bg-surface p-1 shadow-frame"
      role="group"
      aria-label="Text size"
    >
      <button
        type="button"
        className={controlBtn}
        onClick={() => onChange(index - 1)}
        disabled={atMin}
        aria-label="Decrease text size"
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </button>

      <button
        type="button"
        className={cn(
          'flex min-w-[4.25rem] flex-col items-center justify-center rounded-full px-2 py-1 text-center transition-colors',
          isDefault ? 'cursor-default' : 'hover:bg-paper'
        )}
        onClick={() => {
          if (!isDefault) onChange(DEFAULT_FONT_SCALE_INDEX);
        }}
        title={
          isDefault
            ? `Text size: ${step.label}`
            : `Reset to ${FONT_SCALE_STEPS[DEFAULT_FONT_SCALE_INDEX].label}`
        }
        aria-label={`Text size: ${step.label}${isDefault ? '' : '. Click to reset'}`}
      >
        <span className="text-sm font-extrabold leading-none text-ink">Aa</span>
        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-faint">
          {step.label}
        </span>
      </button>

      <button
        type="button"
        className={controlBtn}
        onClick={() => onChange(index + 1)}
        disabled={atMax}
        aria-label="Increase text size"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
