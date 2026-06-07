'use client';

import React from 'react';

function convertName(fullName) {
  if (
    typeof fullName !== 'string' ||
    fullName.trim().length === 0 ||
    !fullName.includes(',')
  ) {
    const nameParts = fullName.split(' ');
    if (nameParts.length === 1) {
      return fullName;
    }
    return nameParts[0] + ' ' + nameParts[nameParts.length - 1];
  }

  const nameParts = fullName.split(', ');
  let lastName = nameParts[0];
  let givenNames = nameParts[1];

  if (!lastName) {
    const nameWords = givenNames.split(' ');
    if (nameWords.length === 1) {
      return nameWords[0];
    } else if (nameWords.length >= 2) {
      givenNames = nameWords.slice(-2).join(' ');
    } else {
      return '';
    }
    return givenNames;
  }

  const givenNameWords = givenNames.split(' ');
  if (givenNameWords.length === 1) {
    return fullName;
  } else if (givenNameWords.length >= 2) {
    givenNames = givenNameWords.slice(0, 2).join(' ');
  } else {
    return lastName;
  }

  return lastName + ', ' + givenNames;
}

function parseScore(value) {
  const number = Math.round(parseFloat(value));
  return Number.isNaN(number) ? 0 : Math.min(100, Math.max(0, number));
}

function parseCount(value) {
  const number = parseInt(value, 10);
  return Number.isNaN(number) ? 0 : number;
}

export default function ScoreCard({ user, score }) {
  if (!score || !user) {
    return <div />;
  }

  const points = parseScore(score.score);
  const correct = parseCount(score.correct);
  const total = parseCount(score.total);
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : points;
  const displayName = convertName(user.studentName) || 'Your Name';

  return (
    <article
      className="w-full max-w-md rounded-lg border border-line bg-surface px-7 py-6 text-center"
      aria-label={`Exam result for ${displayName}: ${points} out of 100 points`}
    >
      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-faint">
        Your result
      </p>
      <p className="mt-1.5 text-base font-bold text-ink-muted">{displayName}</p>

      <p
        className="mt-5 font-plexMono text-[3.25rem] font-bold leading-none tabular-nums text-brand"
        aria-hidden="true"
      >
        {points}
      </p>
      <p className="mt-1 text-[13px] text-ink-faint">out of 100 points</p>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-ink-muted">
          <span>Score</span>
          <span className="font-plexMono tabular-nums">{points}%</span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-pill bg-paper"
          role="progressbar"
          aria-valuenow={points}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Score percentage"
        >
          <div
            className="h-full rounded-pill bg-live transition-[width] duration-300 ease-kep"
            style={{ width: `${points}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <div className="rounded-lg bg-paper px-3 py-2.5 text-left">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-ink-faint">
            Correct
          </p>
          <p className="mt-0.5 font-plexMono text-xl font-bold tabular-nums text-ink">
            {correct}/{total}
          </p>
        </div>
        <div className="rounded-lg bg-paper px-3 py-2.5 text-left">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-ink-faint">
            Accuracy
          </p>
          <p className="mt-0.5 font-plexMono text-xl font-bold tabular-nums text-ink">
            {accuracy}%
          </p>
        </div>
      </div>
    </article>
  );
}
