'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';
import { logout } from '@/lib/auth/logout';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

function ExamTermsContent() {
  return (
    <div className="space-y-3 text-sm font-medium leading-relaxed text-ink-muted">
      <section>
        <h3 className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink-faint">
          1. Purpose
        </h3>
        <p>
          This placement exam assesses English proficiency for course placement
          at Universitas Klabat.
        </p>
      </section>
      <section>
        <h3 className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink-faint">
          2. Conduct
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Work independently. No dictionaries, translators, or AI tools.
          </li>
          <li>Do not photograph, copy, or share exam content.</li>
          <li>Remain on this browser tab for the duration of the test.</li>
        </ul>
      </section>
      <section>
        <h3 className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink-faint">
          3. Timing
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>The timer starts when you press START and cannot be paused.</li>
          <li>The countdown turns red when less than one minute remains.</li>
          <li>Submit before time expires — unanswered items score zero.</li>
        </ul>
      </section>
      <section>
        <h3 className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink-faint">
          4. Submission
        </h3>
        <p>
          Click Submit on the final question or when time ends. Scores are
          reviewed by administrators.
        </p>
      </section>
    </div>
  );
}

export default function GetstartedPage() {
  const [isShaking, setIsShaking] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  function shakeitBaby() {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1000);
  }

  useEffect(() => {
    if (sessionStorage.getItem('agree')) {
      router.push('/exam');
    }
  }, [router]);

  const handleStart = () => {
    if (isChecked) {
      sessionStorage.setItem('agree', true);
      router.push('/exam');
    } else {
      shakeitBaby();
    }
  };

  return (
    <div className="flex h-screen w-full select-none items-center justify-center bg-[url('/image/Background.svg')] bg-cover bg-no-repeat px-4">
      <button
        type="button"
        className="absolute left-390 top-0 h-2 w-2 rounded-full bg-[#ff032d] py-4 text-lg font-semibold text-white opacity-10 md:text-[24px]"
        onClick={() => logout()}
        aria-label="Log out"
      />

      <div className="grid w-full max-w-[900px] overflow-hidden rounded-3xl border border-line bg-surface shadow-frame max-md:grid-cols-1 md:h-[520px] md:grid-cols-[280px_1fr]">
        <div className="flex flex-col justify-between gap-6 bg-brand px-6 py-8 text-white max-md:flex-row max-md:flex-wrap max-md:items-center max-md:px-6 max-md:py-6 md:h-full md:gap-6">
          <p className="font-Nunito text-xl font-extrabold leading-none">
            <span className="opacity-85">Unklab</span> KEP
          </p>
          <div className="max-md:w-full">
            <h1 className="font-Nunito text-2xl font-extrabold leading-tight md:text-[1.5rem]">
              Ready when you are.
            </h1>
            <p className="mt-2.5 text-xs leading-relaxed opacity-85">
              Review the exam rules on the right, then confirm to begin.
            </p>
          </div>
          {user?.studentId ? (
            <p className="inline-flex w-fit items-center rounded-pill bg-white/15 px-3 py-1.5 font-plexMono text-xs font-semibold tabular-nums">
              {user.studentId}
            </p>
          ) : null}
        </div>

        <div className="flex min-h-[480px] flex-col gap-4 px-7 pb-6 pt-7 md:h-full md:min-h-0">
          <p className="shrink-0 text-[10px] font-extrabold uppercase tracking-widest text-ink-faint">
            Software Exam Test — terms &amp; conditions
          </p>

          <div className="min-h-[280px] min-w-0 flex-1 overflow-y-auto rounded-lg border border-line bg-paper p-4">
            <ExamTermsContent />
          </div>

          <div className="mt-auto flex shrink-0 flex-col gap-3 border-t border-line pt-3">
            <div
              className={cn(
                'flex items-start gap-2.5',
                isShaking && 'animate-horizontal-shaking'
              )}
            >
              <Checkbox
                id="agree"
                checked={isChecked}
                onCheckedChange={(value) => setIsChecked(value === true)}
                className="mt-0.5"
              />
              <label
                htmlFor="agree"
                className="cursor-pointer text-[13px] font-semibold leading-snug text-ink"
              >
                I have read and agree to the terms and conditions.
              </label>
            </div>

            <button
              type="button"
              onClick={handleStart}
              className={cn(
                'w-full rounded-pill py-3.5 font-Nunito text-base font-extrabold tracking-wide transition-colors',
                isChecked
                  ? 'bg-brand text-white hover:bg-brand-hover'
                  : 'cursor-not-allowed bg-[#e0e0e0] text-ink'
              )}
            >
              START EXAM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
