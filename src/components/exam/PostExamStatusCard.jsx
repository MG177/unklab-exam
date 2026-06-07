'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export default function PostExamStatusCard({
  eyebrow,
  title,
  description,
  children,
  className,
}) {
  return (
    <article
      className={cn(
        'w-full max-w-lg rounded-lg border border-line bg-surface px-8 py-8 text-center shadow-frame',
        className
      )}
    >
      {eyebrow ? (
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-faint">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h1 className="mt-2 font-sans text-xl font-extrabold leading-snug text-ink md:text-2xl">
          {title}
        </h1>
      ) : null}
      {description ? (
        <p className="mt-3 text-sm font-medium leading-relaxed text-ink-muted">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-6 flex flex-col items-center gap-3">{children}</div> : null}
    </article>
  );
}
