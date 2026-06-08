'use client';

import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import GuideStep from './GuideStep';

export default function GuideShell({
  title,
  subtitle,
  variant,
  steps,
  currentStep,
  onStepChange,
  backHref = '/guides',
  backLabel = 'All guides',
}) {
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const goPrev = useCallback(() => {
    if (!isFirst) onStepChange(currentStep - 1);
  }, [currentStep, isFirst, onStepChange]);

  const goNext = useCallback(() => {
    if (!isLast) onStepChange(currentStep + 1);
  }, [currentStep, isLast, onStepChange]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext]);

  return (
    <div className={`guide-shell guide-shell--${variant}`}>
      <header className="guide-shell__header">
        <Link href={backHref} className="guide-shell__back">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {backLabel}
        </Link>
        <div className="guide-shell__masthead">
          <p className="guide-shell__eyebrow">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            Operation guide
          </p>
          <h1>{title}</h1>
          {subtitle && <p className="guide-shell__subtitle">{subtitle}</p>}
        </div>
      </header>

      <div className="guide-shell__body">
        <nav className="guide-shell__rail" aria-label="Guide steps">
          <ol>
            {steps.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`guide-shell__rail-btn${i === currentStep ? ' is-active' : ''}${i < currentStep ? ' is-done' : ''}`}
                  onClick={() => onStepChange(i)}
                  aria-current={i === currentStep ? 'step' : undefined}
                >
                  <span className="guide-shell__rail-num">{i + 1}</span>
                  <span className="guide-shell__rail-label">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <main className="guide-shell__main">
          <div className="guide-shell__step-head">
            <p className="guide-shell__progress">
              Step {currentStep + 1} of {steps.length}
            </p>
            <h2>{step.title}</h2>
          </div>

          <GuideStep step={step} variant={variant} />

          <div className="guide-shell__nav">
            <button
              type="button"
              className="guide-shell__nav-btn guide-shell__nav-btn--ghost"
              onClick={goPrev}
              disabled={isFirst}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
            <button
              type="button"
              className="guide-shell__nav-btn guide-shell__nav-btn--primary"
              onClick={goNext}
              disabled={isLast}
            >
              Next
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
